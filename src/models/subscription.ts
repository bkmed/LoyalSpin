export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'pending'
  | 'cancelled'
  | 'expired'
  | 'suspended';

export interface Plan {
  id: string;
  name: string;
  duration: 'monthly' | 'quarterly' | 'annual' | 'trial';
  price: number;
  currency: string;
  features: string[];
}

export interface Subscription {
  id: string;
  establishmentId?: string;
  planId: string;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
  amount?: number;
  currency?: string;
}

export interface Subscription {
  id: string;
  establishmentId?: string;
  userId?: string;
  planId: string;
  status: SubscriptionStatus;
  trialLimit?: number;
  trialUsed?: number;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  subscriptionId?: string;
  provider?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: 'pending' | 'success' | 'failed' | 'cancelled';
  createdAt?: string;
}

export interface Invoice {
  id: string;
  paymentId?: string;
  invoiceNumber?: string;
  amount?: number;
  pdfUrl?: string;
}

export default {} as any;
