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
      <circle cx="50" cy="50" r="48" fill="#1E3A5F" />
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke="#1E3A5F"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="12"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="88"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="12"
        y2="50"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="88"
        y2="50"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="23"
        y2="23"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="77"
        y2="23"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="23"
        y2="77"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="50"
        x2="77"
        y2="77"
        stroke="#F97316"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="50"
        r="8"
        stroke="#F97316"
        strokeWidth="4"
        fill="#1E3A5F"
      />
    </svg>
  );
};
