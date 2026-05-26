import React from 'react';

export const FaucetSVG = ({
  className = 'w-16 h-16',
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M25 80 h50" strokeWidth="4" stroke="#475569" />
    <path
      d="M40 80 V42 c0 -12 8 -22 22 -22 h8"
      strokeWidth="6"
      stroke="#64748B"
    />
    <path d="M70 20 v8" strokeWidth="5" stroke="#94A3B8" />
    <path d="M66 28 h8" strokeWidth="2" stroke="#475569" />
    <path d="M32 50 h12" strokeWidth="4.5" stroke="#334155" />
    <circle cx="32" cy="50" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="44" cy="50" r="3.5" fill="#3B82F6" stroke="none" />
    <path
      d="M43 35 c0 -5 5 -10 10 -10"
      stroke="white"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

export const BoilerSVG = ({
  className = 'w-16 h-16',
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="25"
      y="15"
      width="50"
      height="66"
      rx="6"
      fill="#F8FAFC"
      stroke="#334155"
      strokeWidth="3"
    />
    <rect
      x="42"
      y="24"
      width="16"
      height="4"
      rx="1"
      fill="#1E3A5F"
      stroke="none"
    />
    <rect
      x="38"
      y="55"
      width="24"
      height="12"
      rx="2"
      fill="#0F172A"
      stroke="#475569"
      strokeWidth="1.5"
    />
    <circle cx="44" cy="72" r="2.5" fill="#64748B" />
    <circle cx="56" cy="72" r="2.5" fill="#64748B" />
    <path d="M35 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <path d="M50 81 v10" stroke="#CBD5E1" strokeWidth="4" />
    <path d="M65 81 v10" stroke="#B45309" strokeWidth="4.5" />
    <circle cx="35" cy="86" r="3.5" fill="#EF4444" stroke="none" />
    <circle cx="65" cy="86" r="3.5" fill="#06B6D4" stroke="none" />
  </svg>
);

export const CopperFittingsSVG = ({
  className = 'w-16 h-16',
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M22 28 h32 v32"
      stroke="#EA580C"
      strokeWidth="8"
      strokeLinecap="square"
    />
    <circle cx="22" cy="28" r="5" fill="#C2410C" stroke="none" />
    <circle cx="54" cy="60" r="5" fill="#C2410C" stroke="none" />
    <path d="M52 35 h32 M68 35 v30" stroke="#EA580C" strokeWidth="7" />
    <circle cx="52" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="84" cy="35" r="4.5" fill="#C2410C" stroke="none" />
    <circle cx="68" cy="65" r="4.5" fill="#C2410C" stroke="none" />
    <rect
      x="30"
      y="72"
      width="28"
      height="10"
      rx="1.5"
      fill="#EA580C"
      stroke="#C2410C"
      strokeWidth="1.5"
    />
  </svg>
);

export const ProductVisual = ({
  image,
  className = 'w-16 h-16',
}: {
  image: string;
  className?: string;
}) => {
  if (image === 'faucet') return <FaucetSVG className={className} />;
  if (image === 'boiler') return <BoilerSVG className={className} />;
  return <CopperFittingsSVG className={className} />;
};
