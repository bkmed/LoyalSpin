// ============================================================
// LoyalSpin — Database Schema (Firebase Firestore model)
// Architecture: SuperAdmin → Project → Admin → Users
// ============================================================

// ---------- ROLES ----------
export type Role = 'super-admin' | 'admin' | 'user' | 'anonyme';

// ---------- PAYMENT ----------
export type PaymentStatus = 'paid' | 'pending' | 'expired';

export interface Payment {
  id: string;
  projectId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  startDate: string;   // ISO
  expirationDate: string; // ISO
  renewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- PROJECT ----------
export interface Project {
  id: string;
  name: string;
  slug: string;          // URL-friendly unique identifier
  logoUri?: string;
  bannerUri?: string;
  description?: string;
  address?: string;
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
  businessHours?: BusinessHours[];
  adminId?: string;      // The single Admin for this project
  isActive: boolean;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  industry?: string;
  expirationDate?: string; // ISO
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string;  // "09:00"
  closeTime?: string; // "18:00"
}

// ---------- USER ACCOUNT ----------
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  projectId?: string;    // Which project they belong to
  avatarUri?: string;
  phone?: string;
  city?: string;
  addresses?: string[];
  preferredLanguage?: string;
  status: 'active' | 'blocked' | 'pending';
  lastLogin?: string;
  emailVerified?: boolean;
  authProvider?: 'email' | 'google' | 'facebook' | 'apple' | 'tiktok';
  createdAt: string;
  updatedAt: string;
}

// ---------- SUPER ADMIN ----------
export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  avatarUri?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- ROULETTE CONFIG ----------
export interface RouletteSegment {
  id: string;
  label: string;
  description?: string;
  color: string;
  iconUri?: string;
  iconEmoji?: string;
  probability: number;  // 0–100, all segments must sum to 100
  isGift: boolean;
  giftValue?: string;
  couponId?: string;    // Link to a Coupon
}

export type SpinLimitType = 'per_day' | 'per_user_total' | 'per_user_per_day';

export interface RouletteConfig {
  id: string;
  projectId: string;
  wheelName: string;
  segments: RouletteSegment[];
  isActive: boolean;
  spinLimitType: SpinLimitType;
  spinLimitValue: number;  // e.g. 1 spin per day
  animationSpeed?: 'slow' | 'normal' | 'fast';
  soundEnabled?: boolean;
  soundUri?: string;
  centerImageUri?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundImageUrl?: string;
  updatedAt: string;
  createdAt: string;
}

// ---------- STICKER CONFIG ----------
export type StickerShape = 'round' | 'square' | 'rectangle' | 'a4';
export type StickerSize = 'small' | 'medium' | 'large' | 'custom';

export interface StickerConfig {
  id: string;
  projectId: string;
  isActive: boolean;
  shape: StickerShape;
  size: StickerSize;
  customSizeCm?: number;
  primaryColor: string;
  secondaryColor?: string;
  textColor?: string;
  title: string;
  subtitle?: string;
  logoUri?: string;
  backgroundImageUri?: string;
  qrCodeUrl: string;   // The URL encoded in the QR
  qrCodeColor?: string;
  expirationDate?: string; // ISO — when sticker becomes invalid
  createdAt: string;
  updatedAt: string;
}

// ---------- COUPON ----------
export type CouponType = 'percentage' | 'fixed_amount' | 'free_item' | 'custom';

export interface Coupon {
  id: string;
  projectId: string;
  code: string;
  title: string;
  description?: string;
  type: CouponType;
  value?: number;        // percentage or amount
  currency?: string;
  freeItemDescription?: string;
  isActive: boolean;
  startDate?: string;    // ISO
  endDate?: string;      // ISO
  totalQuantity?: number; // null = unlimited
  usedQuantity: number;
  limitPerUser?: number;  // null = unlimited
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- SPIN HISTORY ----------
export type SpinOutcome = 'win' | 'lose' | 'no_prize';

export interface SpinHistory {
  id: string;
  projectId: string;
  userId?: string;       // null if anonymous
  segmentId: string;
  segmentLabel: string;
  outcome: SpinOutcome;
  couponId?: string;
  rewardDescription?: string;
  spinDate: string;       // ISO
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ---------- REWARD ----------
export type RewardStatus = 'pending' | 'claimed' | 'expired' | 'cancelled';

export interface Reward {
  id: string;
  projectId: string;
  userId: string;
  spinHistoryId?: string;
  couponId?: string;
  couponCode?: string;
  description: string;
  status: RewardStatus;
  claimedAt?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- CLIENT DASHBOARD CONFIG ----------
export type SpinMode = 'anonymous' | 'authenticated';

export type PostSpinAction =
  | 'show_message'
  | 'open_google_review'
  | 'open_facebook'
  | 'open_instagram'
  | 'open_tiktok'
  | 'open_website'
  | 'show_coupon'
  | 'download_coupon'
  | 'send_email';

export interface PostSpinActionConfig {
  action: PostSpinAction;
  label?: string;
  url?: string;
  message?: string;
  emailTemplate?: string;
}

export interface ClientDashboardConfig {
  id: string;
  projectId: string;
  isActive: boolean;
  logoUri?: string;
  bannerImageUri?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor?: string;
  title: string;
  description?: string;
  spinMode: SpinMode;
  allowedAuthProviders?: Array<'google' | 'facebook' | 'apple' | 'tiktok' | 'instagram'>;
  postSpinActions: PostSpinActionConfig[];
  showHistory: boolean;
  showRewards: boolean;
  customCss?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- GLOBAL SETTINGS ----------
export interface GlobalSettings {
  id: string;
  maxProjectsPerSuperAdmin?: number;
  maxUsersPerProject?: number;
  maxSpinsPerDay: number;         // replaces hardcoded 200
  couponValidityDays: number;
  sessionDurationMinutes: number;
  defaultCurrency: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  supportEmail?: string;
  supportPhone?: string;
  termsUrl?: string;
  privacyUrl?: string;
  updatedAt: string;
  createdAt: string;
}

// ---------- NOTIFICATION ----------
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
