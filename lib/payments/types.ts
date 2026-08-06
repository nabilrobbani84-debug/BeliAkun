export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number; // in IDR
  keterangan: string;
}

export interface CreatePaymentResult {
  success: boolean;
  providerOrderId: string;
  amountPayable: number;
  uniqueAmount: number;
  qrisUrl: string;
  directUrl?: string;
  expiresAt?: string;
  signature: string; // signature returned from create (raw)
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status: 'pending' | 'paid' | 'expired' | 'failed' | 'unknown';
  amountPaid?: number;
  paidAt?: string;
  rawResponse?: any;
  error?: string;
}

export interface ParsedWebhookEvent {
  providerOrderId: string;
  status: 'pending' | 'paid' | 'expired' | 'failed' | 'unknown';
  amountPaid: number;
  signature: string; // raw signature for verification
  merchantId?: string;
  rawPayload: any;
}

export interface PaymentProvider {
  createTransaction(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getTransactionStatus(providerOrderId: string): Promise<PaymentStatusResult>;
  parseWebhook(payload: unknown): ParsedWebhookEvent;
}
