import { env } from '@/lib/env';
import { CreatePaymentInput, CreatePaymentResult, PaymentStatusResult, ParsedWebhookEvent, PaymentProvider } from '../types';
import { PaymentError, PaymentTimeoutError, PaymentValidationError } from '../errors';
import { DRIVER_CONFIGS } from './config';
import { normalizeKlikQrisStatus } from './normalize';

export class KlikQrisClient implements PaymentProvider {
  private apiKey: string;
  private merchantId: string;
  private driver: 'sandbox' | 'inhouse' | 'my_pg';
  private timeoutMs: number;

  constructor() {
    this.apiKey = env.KLIKQRIS_API_KEY || '';
    this.merchantId = env.KLIKQRIS_MERCHANT_ID || '';
    this.driver = env.KLIKQRIS_DRIVER;
    this.timeoutMs = env.KLIKQRIS_REQUEST_TIMEOUT_MS || 10000;
  }

  private get config() {
    return DRIVER_CONFIGS[this.driver];
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'id_merchant': this.merchantId,
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        let errBody = '';
        try {
          errBody = await response.text();
        } catch (_) {}
        throw new PaymentError(
          `KlikQRIS HTTP Error: ${response.status} ${response.statusText}. Response: ${errBody}`,
          `HTTP_${response.status}`
        );
      }

      const body = await response.json();
      return body;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new PaymentTimeoutError();
      }
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(error.message || 'Koneksi KlikQRIS gagal', 'CONNECTION_ERROR');
    }
  }

  async createTransaction(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Input mapping
    const payload = {
      id_merchant: this.merchantId,
      order_id: input.orderNumber, // Use Beliakun order number
      amount: input.amount,
      keterangan: input.keterangan,
    };

    const path = this.config.createPath;

    try {
      const res = await this.request(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Simple JSON Schema validation
      // Ensure basic structure exists
      if (!res || typeof res !== 'object') {
        throw new PaymentValidationError('Respon dari penyedia pembayaran tidak valid.');
      }

      // KlikQRIS status can be string 'success', 'pending', boolean true, etc.
      // Usually it's: { status: 'success', data: { ... } } or { status: true, data: { ... } }
      const isOk = res.status === 'success' || res.status === 'pending' || res.status === true;
      if (!isOk || !res.data) {
        throw new PaymentError(
          res.message || 'KlikQRIS menolak pembuatan transaksi.',
          'PROVIDER_REJECTED'
        );
      }

      const data = res.data;

      // Validate data fields
      if (!data.order_id || !data.qris_url) {
        throw new PaymentValidationError('Respon pembuatan transaksi kekurangan field wajib (order_id/qris_url).');
      }

      // Validasi nominal
      const amountRequested = input.amount;
      const amountPayable = typeof data.total_amount === 'string'
        ? parseInt(data.total_amount.split('.')[0], 10)
        : Math.round(data.total_amount);

      if (isNaN(amountPayable) || amountPayable < amountRequested) {
        throw new PaymentValidationError('Nominal yang harus dibayar tidak valid.');
      }

      const uniqueAmount = amountPayable - amountRequested;

      // Validasi QRIS URL
      if (!data.qris_url.startsWith('https://')) {
        throw new PaymentValidationError('QRIS URL wajib menggunakan HTTPS.');
      }

      return {
        success: true,
        providerOrderId: data.order_id,
        amountPayable,
        uniqueAmount,
        qrisUrl: data.qris_url,
        directUrl: data.direct_url || undefined,
        expiresAt: data.expired_at || undefined,
        signature: data.signature || '',
      };
    } catch (error: any) {
      if (error instanceof PaymentError) throw error;
      throw new PaymentError(error.message || 'Gagal membuat transaksi KlikQRIS', 'CREATE_TRANSACTION_FAILED');
    }
  }

  async getTransactionStatus(providerOrderId: string): Promise<PaymentStatusResult> {
    const path = this.config.statusPath(providerOrderId, this.merchantId);

    try {
      const res = await this.request(path, {
        method: 'GET',
      });

      if (!res || !res.data) {
        throw new PaymentValidationError('Respon status KlikQRIS kosong.');
      }

      const data = res.data;
      const normalized = normalizeKlikQrisStatus(data.status);

      let amountPaid = undefined;
      if (data.amount_paid) {
        amountPaid = typeof data.amount_paid === 'string'
          ? parseInt(data.amount_paid.split('.')[0], 10)
          : Math.round(data.amount_paid);
      } else if (data.total_amount && normalized === 'paid') {
        amountPaid = typeof data.total_amount === 'string'
          ? parseInt(data.total_amount.split('.')[0], 10)
          : Math.round(data.total_amount);
      }

      return {
        success: true,
        status: normalized,
        amountPaid,
        paidAt: data.payment_date || undefined,
        rawResponse: res,
      };
    } catch (error: any) {
      if (error instanceof PaymentError) throw error;
      throw new PaymentError(error.message || 'Gagal mengambil status transaksi', 'STATUS_CHECK_FAILED');
    }
  }

  parseWebhook(payload: any): ParsedWebhookEvent {
    // Parse depending on payload wrapper
    if (!payload || typeof payload !== 'object') {
      throw new PaymentValidationError('Payload webhook KlikQRIS kosong.');
    }

    let orderId: string = '';
    let status: string = '';
    let amountPaid: number = 0;
    let signature: string = '';
    let merchantId: string | undefined = undefined;

    // MY PG driver uses wrapper: { status, message, data: { order_id, status, signature... } }
    // In-House or direct callbacks have direct fields or data field.
    if (payload.data && typeof payload.data === 'object') {
      const data = payload.data;
      orderId = data.order_id || '';
      status = data.status || '';
      signature = data.signature || '';
      merchantId = data.merchant_id || payload.merchant_id || undefined;
      
      const rawAmount = data.amount_paid || data.total_amount || data.amount || 0;
      amountPaid = typeof rawAmount === 'string'
        ? parseInt(rawAmount.split('.')[0], 10)
        : Math.round(rawAmount);
    } else {
      // In-house structure direct
      orderId = payload.order_id || '';
      status = payload.status || '';
      signature = payload.signature || '';
      merchantId = payload.merchant_id || payload.id_merchant || undefined;

      const rawAmount = payload.amount_paid || payload.total_amount || payload.amount || 0;
      amountPaid = typeof rawAmount === 'string'
        ? parseInt(rawAmount.split('.')[0], 10)
        : Math.round(rawAmount);
    }

    if (!orderId) {
      throw new PaymentValidationError('Webhook order_id tidak ditemukan.');
    }

    if (!signature) {
      throw new PaymentValidationError('Webhook signature tidak ditemukan.');
    }

    return {
      providerOrderId: orderId,
      status: normalizeKlikQrisStatus(status),
      amountPaid,
      signature,
      merchantId,
      rawPayload: payload,
    };
  }
}
