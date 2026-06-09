import { CheckoutSession, PaymentResult } from './types';

export interface PaymentProvider {
  providerName: string;
  createCheckoutSession(amount: number, currency: string, metadata?: any): Promise<CheckoutSession>;
  verifyPayment(sessionId: string): Promise<PaymentResult>;
  cancelPayment?(sessionId: string): Promise<void>;
}

export default PaymentProvider;
