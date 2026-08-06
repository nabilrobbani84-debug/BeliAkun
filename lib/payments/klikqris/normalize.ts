/**
 * Menormalisasi status transaksi dari KlikQRIS ke status internal sistem.
 */
export function normalizeKlikQrisStatus(status: string): 'pending' | 'paid' | 'expired' | 'failed' | 'unknown' {
  if (!status) return 'unknown';
  
  const upperStatus = status.trim().toUpperCase();
  
  switch (upperStatus) {
    case 'PENDING':
      return 'pending';
    case 'SUCCESS':
    case 'PAID':
      return 'paid';
    case 'EXPIRED':
      return 'expired';
    case 'FAILED':
      return 'failed';
    default:
      return 'unknown';
  }
}
