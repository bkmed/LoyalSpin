import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { ServiceIcon } from './ServiceIcon';

describe('ServiceIcon', () => {
  it('renders a named service icon', () => {
    const element = ServiceIcon({
      name: 'plumbing',
      className: 'w-8 h-8',
      title: 'Plumbing',
    });

    expect(element.type).toBe('svg');
    expect(element.props.className).toBe('w-8 h-8');
    expect(element.props.role).toBe('img');
    expect(React.Children.count(element.props.children)).toBeGreaterThan(1);
  });

  it('falls back to the plumbing icon for unknown names', () => {
    const element = ServiceIcon({ name: 'unknown' as any });

    expect(element.type).toBe('svg');
    expect(element.props['aria-hidden']).toBe(true);
    expect(React.Children.count(element.props.children)).toBeGreaterThan(0);
  });
});
