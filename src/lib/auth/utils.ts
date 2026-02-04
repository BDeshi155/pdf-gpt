import { getServerSession } from 'next-auth';
import { authOptions } from './config';
import { UserRole, ROLE_PERMISSIONS, UserFeatures } from '@/types';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export function hasPermission(
  role: UserRole,
  permission: keyof typeof ROLE_PERMISSIONS[UserRole]
): boolean {
  const value = ROLE_PERMISSIONS[role]?.[permission];
  return typeof value === 'boolean' ? value : false;
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN;
}

export function isAdmin(role: UserRole, isAdminFlag: boolean): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || isAdminFlag;
}

export function isPro(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.PRO_USER;
}

export function getUserFeatures(role: UserRole, stats?: { pdfCount: number; monthlyUploads: number }): UserFeatures {
  const permissions = ROLE_PERMISSIONS[role];
  const pdfCount = stats?.pdfCount ?? 0;
  const monthlyUploads = stats?.monthlyUploads ?? 0;
  
  const nearLimit = role === UserRole.FREE_USER && 
    (pdfCount >= permissions.pdfLimit * 0.8 || monthlyUploads >= permissions.monthlyUploads * 0.8);

  return {
    canUpload: monthlyUploads < permissions.monthlyUploads && pdfCount < permissions.pdfLimit,
    canSearch: true,
    canSemanticSearch: permissions.canAccessAIFeatures,
    canAskQuestions: permissions.canAccessAIFeatures,
    canSummarize: permissions.canAccessAIFeatures,
    canAccessShop: true,
    showUpgradeBanner: role === UserRole.FREE_USER,
    nearLimit,
  };
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-red-500',
    [UserRole.ADMIN]: 'bg-purple-500',
    [UserRole.PRO_USER]: 'bg-blue-500',
    [UserRole.FREE_USER]: 'bg-gray-500',
  };
  return colors[role];
}

export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.PRO_USER]: 'Pro',
    [UserRole.FREE_USER]: 'Free',
  };
  return names[role];
}
