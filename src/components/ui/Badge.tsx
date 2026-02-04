import React from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export type BadgeVariant = 'default' | 'free' | 'pro' | 'admin' | 'super' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  role?: UserRole;
  size?: BadgeSize;
}

const roleToVariant: Record<UserRole, BadgeVariant> = {
  [UserRole.SUPER_ADMIN]: 'super',
  [UserRole.ADMIN]: 'admin',
  [UserRole.PRO_USER]: 'pro',
  [UserRole.FREE_USER]: 'free',
};

export function Badge({ children, variant = 'default', role, size = 'md', className, ...props }: BadgeProps) {
  const actualVariant = role ? roleToVariant[role] : variant;

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-dark-600 text-dark-200',
    free: 'badge-free',
    pro: 'badge-pro',
    admin: 'badge-admin',
    super: 'badge-super',
    success: 'bg-green-600/20 text-green-400 border border-green-600/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
    error: 'bg-red-600/20 text-red-400 border border-red-600/30',
    info: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={cn('badge', variantStyles[actualVariant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
