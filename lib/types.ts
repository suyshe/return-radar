export type ProductStatus = 'active' | 'expiring_soon' | 'expired' | 'returned' | 'kept';

export type ProductCategory = 
  | 'Electronics'
  | 'Clothing & Apparel'
  | 'Home & Kitchen'
  | 'Computers & Office'
  | 'Furniture'
  | 'Appliances'
  | 'Sports & Outdoors'
  | 'Toys & Games'
  | 'Beauty & Health'
  | 'Other';

export interface Product {
  id: string;
  userId: string;
  name: string;
  store: string;
  category: ProductCategory;
  price: number;
  currency: string;
  purchaseDate: string; // ISO date string YYYY-MM-DD
  returnPeriodDays: number;
  returnDeadline: string; // ISO date string YYYY-MM-DD
  warrantyPeriodMonths: number;
  warrantyDeadline: string | null; // ISO date string YYYY-MM-DD
  status: ProductStatus;
  orderNumber?: string;
  serialNumber?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorePreset {
  id: string;
  name: string;
  defaultReturnDays: number;
  defaultWarrantyMonths: number;
  badgeBg: string;
  badgeText: string;
  returnPolicySummary: string;
  policyUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  productId?: string;
  productName?: string;
  title: string;
  message: string;
  type: 'return_deadline' | 'warranty_deadline' | 'system';
  isRead: boolean;
  daysLeft?: number;
  deadlineDate?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTrackedProducts: number;
  activeReturnWindows: number;
  expiringSoonCount: number;
  expiredCount: number;
  returnedCount: number;
  totalActiveValue: number;
  totalProtectedValue: number;
  activeWarrantiesCount: number;
}

export interface FilterOptions {
  searchQuery: string;
  status: 'all' | ProductStatus;
  category: 'all' | ProductCategory;
  store: 'all' | string;
  sortBy: 'urgency' | 'purchase_date_desc' | 'purchase_date_asc' | 'price_desc' | 'price_asc' | 'name_asc';
  viewMode: 'grid' | 'table';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  preferredCurrency: string;
  notifyDaysBefore: number[];
  emailNotificationsEnabled: boolean;
}
