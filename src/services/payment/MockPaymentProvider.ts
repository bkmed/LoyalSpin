import { PaymentProvider } from './PaymentProvider';
import { CheckoutSession, PaymentResult } from './types';

export class MockPaymentProvider implements PaymentProvider {
  providerName = 'mock';
  private cancelledSessions = new Set<string>();

  async createCheckoutSession(
    amount: number,
    currency: string,
    // metadata?: any,
  ): Promise<CheckoutSession> {
    // Return a fake session id
    return {
      sessionId: `mock_${Date.now()}`,
      provider: this.providerName,
      amount,
      currency,
    } as CheckoutSession;
  }

  async verifyPayment(sessionId: string): Promise<PaymentResult> {
    // If the session was cancelled, return cancelled
    if (this.cancelledSessions.has(sessionId)) {
      return {
        status: 'cancelled',
        provider: this.providerName,
      };
    }

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
    // Mark session as cancelled in-memory so future verifications reflect it
    this.cancelledSessions.add(sessionId);
    return;
  }
}

export default MockPaymentProvider;
