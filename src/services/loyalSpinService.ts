import { storageService } from './storage';
import type { Coupon, Reward, SpinHistoryItem, WheelSegment } from '../features/loyalspin/types';

const WHEEL_HISTORY_KEY = 'loyalspin-wheel-history';
const WHEEL_COUPON_KEY = 'loyalspin-coupons';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const submitPrizeClaim = async (payload: {
  prize: string;
  userId?: string;
}) => {
  await delay(400);
  return { ok: true, data: { claimedPrize: payload.prize } };
};

const formatExpiry = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry.toLocaleDateString();
};

const loadHistoryFromStorage = (): SpinHistoryItem[] => {
  const raw = storageService.getString(WHEEL_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SpinHistoryItem[];
  } catch {
    return [];
  }
};

const saveHistoryToStorage = (history: SpinHistoryItem[]) => {
  storageService.setString(WHEEL_HISTORY_KEY, JSON.stringify(history));
};

const buildCoupon = (segment: WheelSegment): Coupon => ({
  id: `${segment.id}-${Date.now()}`,
  title: segment.title,
  code: `LOYAL-${segment.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
  expiresAt: formatExpiry(),
  status: 'active',
  details: `Utilisez ce coupon pour ${segment.description.toLowerCase()}.`,
});

export const spinWheel = async (segments: WheelSegment[]): Promise<{ segment: WheelSegment; coupon: Coupon }> => {
  await delay(420);
  const targetIndex = Math.floor(Math.random() * segments.length);
  const chosenSegment = segments[targetIndex];
  const coupon = buildCoupon(chosenSegment);
  return { segment: chosenSegment, coupon };
};

export const getRewards = async (): Promise<Reward[]> => {
  await delay(280);
  return [
    {
      id: 'reward-coffee',
      title: 'Café offert',
      subtitle: 'Remportez un expresso gratuit',
      points: 250,
      tier: 'bronze',
      icon: '☕',
    },
    {
      id: 'reward-croissant',
      title: 'Croissant offert',
      subtitle: 'Une viennoiserie gratuite',
      points: 150,
      tier: 'silver',
      icon: '🥐',
    },
    {
      id: 'reward-discount',
      title: 'Réduction 20%',
      subtitle: 'Économisez instantanément',
      points: 500,
      tier: 'gold',
      icon: '🏷️',
    },
  ];
};

export const getHistory = async (): Promise<SpinHistoryItem[]> => {
  await delay(180);
  return loadHistoryFromStorage();
};

export const claimReward = async (segment: WheelSegment): Promise<{ coupon: Coupon }> => {
  await delay(520);
  const coupon = buildCoupon(segment);
  const history = loadHistoryFromStorage();
  const nextHistory = [
    {
      id: `${segment.id}-${Date.now()}`,
      prize: segment.title,
      earnedAt: new Date().toLocaleDateString(),
      color: segment.color,
    },
    ...history,
  ].slice(0, 10);
  saveHistoryToStorage(nextHistory);
  storageService.setString(WHEEL_COUPON_KEY, JSON.stringify(coupon));
  return { coupon };
};
