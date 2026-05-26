import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const MaterialIcons: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  style,
}) => {
  // Simple mapping of material icon names to clean SVGs
  const getIconSvg = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
        );
      case 'receipt-long':
      case 'receipt':
        return (
          <path
            d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM6 19v-1h5v1H6zm12 1H6c-.55 0-1-.45-1-1v-1h13v2zm3-3H5V5h16v12z M9 8h6v2H9zm0 4h6v2H9z"
            fill="currentColor"
          />
        );
      case 'analytics':
      case 'bar-chart':
        return (
          <path
            d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
            fill="currentColor"
          />
        );
      case 'account-balance-wallet':
      case 'account-balance':
        return (
          <path
            d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill="currentColor"
          />
        );
      case 'track-changes':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
            fill="currentColor"
          />
        );
      case 'person':
        return (
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="currentColor"
          />
        );
      case 'notifications':
        return (
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            fill="currentColor"
          />
        );
      case 'add':
        return (
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
        );
      case 'priority-high':
        return (
          <path
            d="M12 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V5h2v10z"
            fill="currentColor"
          />
        );
      case 'coffee':
        return (
          <path
            d="M4 19h16v2H4zM20 3H4v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5h12v8zm4-5h-2V5h2v3z"
            fill="currentColor"
          />
        );
      case 'directions-bus':
      case 'directions-transit':
        return (
          <path
            d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"
            fill="currentColor"
          />
        );
      case 'restaurant':
      case 'dining':
        return (
          <path
            d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-8.03C11.34 12.84 13 11.12 13 9V2h-2v7zm4-3v8h3v8h2V2c-2.76 0-5 2.24-5 4z"
            fill="currentColor"
          />
        );
      case 'shopping-bag':
      case 'retail':
        return (
          <path
            d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v10z"
            fill="currentColor"
          />
        );
      case 'flash-on':
      case 'utility':
        return <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="currentColor" />;
      case 'local-gas-station':
      case 'fuel':
        return (
          <path
            d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.87-1.61 2.06-1.61 3.58 0 2.76 2.24 5 5 5 1.09 0 2.1-.35 2.93-.95l-3.66-3.66 1.41-1.41 3.66 3.66c.6-.83.95-1.84.95-2.93 0-2.96-2.58-4.9-5.63-4.23zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM12 10V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v16h10v-6h2v6h2V10h-4zm-4 1H4V5h4v6z"
            fill="currentColor"
          />
        );
      case 'circle':
        return <circle cx="12" cy="12" r="8" fill="currentColor" />;
      case 'arrow-forward':
        return (
          <path
            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
            fill="currentColor"
          />
        );
      case 'check-circle':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill="currentColor"
          />
        );
      case 'description':
      case 'statement':
        return (
          <path
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
            fill="currentColor"
          />
        );
      case 'swap-horiz':
      case 'transfer':
        return (
          <path
            d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"
            fill="currentColor"
          />
        );
      case 'edit':
        return (
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill="currentColor"
          />
        );
      case 'info':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            fill="currentColor"
          />
        );
      default:
        return <circle cx="12" cy="12" r="6" fill="currentColor" />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
      color={color}
    >
      {getIconSvg(name)}
    </svg>
  );
};

export default MaterialIcons;
