export type WheelSegment = {
  id: string;
  title: string;
  description: string;
  color: string;
};

export type Coupon = {
  id: string;
  title: string;
  code: string;
  expiresAt: string;
  status: 'active' | 'used' | 'expired';
  details: string;
};

export type Reward = {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
};

export type SpinResult = {
  segment: WheelSegment;
  coupon: Coupon;
  earnedAt: string;
  message: string;
};

export type SpinHistoryItem = {
  id: string;
  prize: string;
  earnedAt: string;
  color: string;
};
