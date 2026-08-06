export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class PaymentTimeoutError extends PaymentError {
  constructor(message: string = 'Koneksi ke penyedia pembayaran terputus.') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'PaymentTimeoutError';
  }
}

export class PaymentValidationError extends PaymentError {
  constructor(message: string, public fields?: any) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'PaymentValidationError';
  }
}

export class PaymentSignatureError extends PaymentError {
  constructor(message: string = 'Tanda tangan pembayaran tidak valid.') {
    super(message, 'SIGNATURE_ERROR');
    this.name = 'PaymentSignatureError';
  }
}
