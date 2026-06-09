import { PaymentProvider } from './PaymentProvider';
import { CheckoutSession, PaymentResult } from './types';

export class PaymentService {
  private provider: PaymentProvider;

  constructor(provider: PaymentProvider) {
    this.provider = provider;
  }

  createCheckoutSession(
    amount: number,
    currency = 'EUR',
    metadata?: any,
  ): Promise<CheckoutSession> {
    return this.provider.createCheckoutSession(amount, currency, metadata);
  }

  verifyPayment(sessionId: string): Promise<PaymentResult> {
    return this.provider.verifyPayment(sessionId);
  }

  cancelPayment(sessionId: string): Promise<void> | undefined {
    if (this.provider.cancelPayment)
      return this.provider.cancelPayment(sessionId);
    return undefined;
  }
}

export default PaymentService;
