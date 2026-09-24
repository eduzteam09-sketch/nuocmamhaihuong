import { StaffMember } from './index';

export type NavTab = 
  | 'dashboard' 
  | 'ai_business_center' 
  | 'customers' 
  | 'chain' 
  | 'leads' 
  | 'orders' 
  | 'products' 
  | 'batches'
  | 'staff';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'Sales B2B' 
  | 'Sales Thị Trường Chuỗi' 
  | 'Quản Lý Kho Vận' 
  | 'Chuyên Viên R&D / QC' 
  | 'Chăm Sóc Khách Hàng';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  roleTitle: string;
  isSuperAdmin: boolean;
  allowedTabs: NavTab[];
  staffProfile?: StaffMember;
  avatar?: string;
  phone?: string;
}

// Strict Role-Based Access Control mapping
export const ROLE_TAB_PERMISSIONS: Record<UserRole, NavTab[]> = {
  SUPER_ADMIN: [
    'dashboard',
    'ai_business_center',
    'customers',
    'chain',
    'leads',
    'orders',
    'products',
    'batches',
    'staff'
  ],
  'Sales B2B': [
    'leads',
    'orders',
    'customers',
    'products'
  ],
  'Sales Thị Trường Chuỗi': [
    'chain',
    'orders',
    'customers',
    'products'
  ],
  'Quản Lý Kho Vận': [
    'orders',
    'batches',
    'chain',
    'products'
  ],
  'Chuyên Viên R&D / QC': [
    'batches',
    'products',
    'customers'
  ],
  'Chăm Sóc Khách Hàng': [
    'customers',
    'orders',
    'ai_business_center',
    'products'
  ]
};

export const SUPER_ADMIN_EMAIL = 'admin@haihuong.vn';
