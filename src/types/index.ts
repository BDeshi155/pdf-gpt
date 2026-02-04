// User Roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  PRO_USER = 'pro_user',
  FREE_USER = 'free_user',
}

// Role Permissions
export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageAdmins: true,
    canManagePDFShop: true,
    canUploadToPDFShop: true,
    canCreatePromotions: true,
    canRunMarketing: true,
    canAccessAIFeatures: true,
    canAccessPremiumFeatures: true,
    pdfLimit: Infinity,
    monthlyUploads: Infinity,
  },
  [UserRole.ADMIN]: {
    canManageUsers: false,
    canManageAdmins: false,
    canManagePDFShop: false,
    canUploadToPDFShop: true,
    canCreatePromotions: true,
    canRunMarketing: true,
    canAccessAIFeatures: true,
    canAccessPremiumFeatures: true,
    pdfLimit: Infinity,
    monthlyUploads: Infinity,
  },
  [UserRole.PRO_USER]: {
    canManageUsers: false,
    canManageAdmins: false,
    canManagePDFShop: false,
    canUploadToPDFShop: false,
    canCreatePromotions: false,
    canRunMarketing: false,
    canAccessAIFeatures: true,
    canAccessPremiumFeatures: true,
    pdfLimit: 1000,
    monthlyUploads: Infinity,
  },
  [UserRole.FREE_USER]: {
    canManageUsers: false,
    canManageAdmins: false,
    canManagePDFShop: false,
    canUploadToPDFShop: false,
    canCreatePromotions: false,
    canRunMarketing: false,
    canAccessAIFeatures: false,
    canAccessPremiumFeatures: false,
    pdfLimit: 10,
    monthlyUploads: 10,
  },
} as const;

// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_admin: boolean; // Pro users can also be admins
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  subscription_status: SubscriptionStatus;
  subscription_ends_at: string | null;
  pdf_count: number;
  monthly_uploads_used: number;
  monthly_uploads_reset_at: string;
}

// Subscription Types
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  NONE = 'none',
}

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan: 'free' | 'pro_monthly' | 'pro_annual';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// PDF Types
export interface PDF {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  file_size: number;
  page_count: number;
  storage_path: string;
  thumbnail_url: string | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface PDFWithMetadata extends PDF {
  summary: string | null;
  tags: string[];
  embeddings_generated: boolean;
}

// Shop PDF (PDFs in the PDF Shop managed by admins)
export interface ShopPDF {
  id: string;
  title: string;
  description: string;
  filename: string;
  file_size: number;
  page_count: number;
  storage_path: string;
  thumbnail_url: string | null;
  category: string;
  tags: string[];
  is_featured: boolean;
  is_pro_only: boolean;
  download_count: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// Promotion Types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  code: string;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalPDFs: number;
  pdfLimit: number;
  monthlyUploadsUsed: number;
  monthlyUploadsLimit: number;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
}

// Feature Flags for UI
export interface UserFeatures {
  canUpload: boolean;
  canSearch: boolean;
  canSemanticSearch: boolean;
  canAskQuestions: boolean;
  canSummarize: boolean;
  canAccessShop: boolean;
  showUpgradeBanner: boolean;
  nearLimit: boolean;
}
