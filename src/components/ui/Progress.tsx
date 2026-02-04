import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Progress({ value, max = 100, showLabel = false, size = 'md', className }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getVariant = () => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return '';
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-dark-400 mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={cn('progress-bar', sizeStyles[size])}>
        <div
          className={cn('progress-fill', getVariant())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
