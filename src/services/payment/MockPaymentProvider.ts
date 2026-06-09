import { PaymentProvider } from './PaymentProvider';
import { CheckoutSession, PaymentResult } from './types';

export class MockPaymentProvider implements PaymentProvider {
  providerName = 'mock';

  async createCheckoutSession(amount: number, currency: string, metadata?: any): Promise<CheckoutSession> {
    // Return a fake session id
    return {
      sessionId: `mock_${Date.now()}`,
      provider: this.providerName,
      amount,
      currency,
    } as CheckoutSession;
  }

  async verifyPayment(sessionId: string): Promise<PaymentResult> {
    // Simulate verification: succeed for even timestamps
    const ok = Date.now() % 2 === 0;
    if (ok) {
      return {
        status: 'success',
        transactionId: `${sessionId}_tx`,
        provider: this.providerName,
      };
    }
    return {
      status: 'failed',
      errorCode: 'MOCK_FAIL',
      errorMessage: 'Mocked failure',
    };
  }

  async cancelPayment(sessionId: string): Promise<void> {
    // No-op for mock
    return;
  }
}

export default MockPaymentProvider;
