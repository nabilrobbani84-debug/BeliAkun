import { PaymentProvider } from './types';
import { KlikQrisClient } from './klikqris/client';

let providerInstance: PaymentProvider | null = null;

/**
 * Factory untuk mendapatkan instansi PaymentProvider.
 * Membantu jika di masa depan ingin menambahkan provider lain selain klikqris.
 */
export function getPaymentProvider(providerName: string = 'klikqris'): PaymentProvider {
  if (providerName === 'klikqris') {
    if (!providerInstance) {
      providerInstance = new KlikQrisClient();
    }
    return providerInstance;
  }
  throw new Error(`Provider ${providerName} tidak didukung.`);
}
