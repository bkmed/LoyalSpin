import React from 'react';
import { ServiceIconName, serviceIconPaths } from './serviceIconAssets';

interface ServiceIconProps {
  name: ServiceIconName;
  className?: string;
  title?: string;
}

export const ServiceIcon = ({
  name,
  className = 'w-6 h-6',
  title,
}: ServiceIconProps) => {
  const paths = serviceIconPaths[name] || serviceIconPaths.plumbing;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths.map(path => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
};

export type { ServiceIconName };
