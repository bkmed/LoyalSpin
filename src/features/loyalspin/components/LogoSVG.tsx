import React from 'react';

export const LogoSVG = ({
  size = 44,
  className = '',
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="6"
      />
      <path d="M50 8 A42 42 0 0 1 92 50 L50 50 Z" fill="#3B82F6" />
      <path d="M50 50 L92 50 A42 42 0 0 1 50 92 Z" fill="#F59E0B" />
      <path d="M50 8 A42 42 0 0 0 8 50 L50 50 Z" fill="#F59E0B" />
      <path d="M50 50 L8 50 A42 42 0 0 0 50 92 Z" fill="#3B82F6" />
      <rect x="34" y="34" width="32" height="32" rx="8" fill="#FFFFFF" />
      <circle cx="42" cy="42" r="4" fill="#0F172A" />
      <circle cx="58" cy="42" r="4" fill="#0F172A" />
      <circle cx="50" cy="50" r="4" fill="#0F172A" />
      <circle cx="42" cy="58" r="4" fill="#0F172A" />
      <circle cx="58" cy="58" r="4" fill="#0F172A" />
    </svg>
  );
};
