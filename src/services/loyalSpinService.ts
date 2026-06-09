// Minimal service placeholder for LoyaltySpin features
export const submitPrizeClaim = async (payload: {
  prize: string;
  userId?: string;
}) => {
  // In a real app this would call an API. Here we simulate a delay and return success.
  await new Promise(resolve => setTimeout(resolve, 400));
  return { ok: true, data: { claimedPrize: payload.prize } };
};
