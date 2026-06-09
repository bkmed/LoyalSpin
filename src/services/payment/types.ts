export type Currency = 'EUR' | 'USD' | 'TND' | string;

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export interface CheckoutSession {
  sessionId: string;
  provider: string;
  amount: number;
  currency: Currency;
}

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  provider?: string;
  errorCode?: string;
  errorMessage?: string;
}
