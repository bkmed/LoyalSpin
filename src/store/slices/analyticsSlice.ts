import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatQuery {
  id: string;
  text: string;
  timestamp: string;
  role: 'user' | 'bot';
}

interface AnalyticsState {
  chatQueries: ChatQuery[];
  pageViews: Record<string, number>;
  shares: Record<string, number>;
  callClicks: number;
}

const initialState: AnalyticsState = {
  chatQueries: [],
  pageViews: {},
  shares: {},
  callClicks: 0,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    trackQuery: (state, action: PayloadAction<ChatQuery>) => {
      state.chatQueries.unshift(action.payload);
      if (state.chatQueries.length > 50) {
        state.chatQueries.pop();
      }
    },
    clearQueries: state => {
      state.chatQueries = [];
    },
    trackPageView: (state, action: PayloadAction<string>) => {
      const pageName = action.payload;
      if (!state.pageViews) state.pageViews = {};
      state.pageViews[pageName] = (state.pageViews[pageName] || 0) + 1;
    },
    trackShare: (
      state,
      action: PayloadAction<{ platform: string; item: string }>,
    ) => {
      if (!state.shares) state.shares = {};
      const key = `${action.payload.platform}_${action.payload.item}`;
      state.shares[key] = (state.shares[key] || 0) + 1;
    },
    trackCallClick: state => {
      state.callClicks += 1;
    },
  },
});

export const {
  trackQuery,
  clearQueries,
  trackPageView,
  trackShare,
  trackCallClick,
} = analyticsSlice.actions;

export const selectChatQueries = (state: { analytics: AnalyticsState }) =>
  state.analytics?.chatQueries || [];

export const selectTopQueries = (state: { analytics: AnalyticsState }) => {
  return (state.analytics?.chatQueries || []).slice(0, 5);
};

export const selectQuestionOccurrences = (state: {
  analytics: AnalyticsState;
}) => {
  const counts: { [key: string]: number } = {};
  (state.analytics?.chatQueries || []).forEach(query => {
    if (query.role === 'user') {
      const normalized = query.text.trim().toLowerCase();
      counts[normalized] = (counts[normalized] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);
};

export const selectTotalPageViews = (state: { analytics: AnalyticsState }) => {
  return Object.values(state.analytics?.pageViews || {}).reduce(
    (a, b) => a + b,
    0,
  );
};

export const selectPageViews = (state: { analytics: AnalyticsState }) =>
  state.analytics?.pageViews || {};

export const selectTotalShares = (state: { analytics: AnalyticsState }) => {
  return Object.values(state.analytics?.shares || {}).reduce(
    (a, b) => a + b,
    0,
  );
};

export const selectCallClicks = (state: { analytics: AnalyticsState }) =>
  state.analytics?.callClicks || 0;

export default analyticsSlice.reducer;
