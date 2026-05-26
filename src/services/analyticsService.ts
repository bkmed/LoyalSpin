import { Platform } from 'react-native';
import analytics from '@react-native-firebase/analytics';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  weeklySales: { day: string; amount: number }[];
}

export const trackWalletScreen = (screen: string) => {
  if (Platform.OS !== 'web') {
    analytics().logScreenView({ screen_name: `wallet_${screen}` });
  }
};

export const trackTransactionAdded = (
  type: string,
  amount: number,
  category: string,
) => {
  if (Platform.OS !== 'web') {
    analytics().logEvent('wallet_transaction', { type, amount, category });
  }
};

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => ({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    weeklySales: [],
  }),

  getSalesChartData: async (): Promise<{
    labels: string[];
    data: number[];
  }> => ({
    labels: [],
    data: [],
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPersonalAnalytics: async (_userId: string): Promise<any> => ({
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: 'N/A',
  }),
};
