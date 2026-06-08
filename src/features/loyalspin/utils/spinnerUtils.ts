export const pickRandomIndex = (length: number, rng = Math.random) => {
  if (length <= 0) return 0;
  return Math.floor(rng() * length);
};

export const normalizeAngle = (angle: number) => {
  const a = angle % 360;
  return a < 0 ? a + 360 : a;
};
