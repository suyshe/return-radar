'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, 
  NotificationItem, 
  UserProfile, 
  DashboardStats, 
  FilterOptions, 
  ProductStatus 
} from '../types';
import { 
  calculateReturnDeadline, 
  calculateWarrantyDeadline, 
  getDeadlineStatus, 
  getDaysRemaining 
} from '../utils/dates';
import { getInitialMockProducts, getInitialMockNotifications } from '../storage/mock-data';
import { isSupabaseConfigured, createClient } from '../supabase/client';

interface AppContextType {
  products: Product[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
  isDemoMode: boolean;
  isSupabaseActive: boolean;
  filterOptions: FilterOptions;
  filteredProducts: Product[];
  stats: DashboardStats;
  isLoading: boolean;
  
  // Actions
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  addProduct: (productData: {
    name: string;
    store: string;
    category: any;
    price: number;
    currency: string;
    purchaseDate: string;
    returnPeriodDays: number;
    warrantyPeriodMonths: number;
    orderNumber?: string;
    serialNumber?: string;
    receiptUrl?: string;
    notes?: string;
  }) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  markAsReturned: (id: string) => Promise<void>;
  markAsKept: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'returnradar_products_v1',
  NOTIFICATIONS: 'returnradar_notifs_v1',
  PROFILE: 'returnradar_profile_v1',
  AUTH_MODE: 'returnradar_auth_mode'
};

const initialFilters: FilterOptions = {
  searchQuery: '',
  status: 'all',
  category: 'all',
  store: 'all',
  sortBy: 'urgency',
  viewMode: 'grid'
};

const defaultProfile: UserProfile = {
  id: 'demo-user',
  email: 'alex.morgan@example.com',
  fullName: 'Alex Morgan',
  preferredCurrency: 'USD',
  notifyDaysBefore: [7, 3, 1],
  emailNotificationsEnabled: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [filterOptions, setFilterOptionsState] = useState<FilterOptions>(initialFilters);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data on mount
  useEffect(() => {
    const hasSupabase = isSupabaseConfigured();
    setIsSupabaseActive(hasSupabase);

    try {
      // Check local storage for existing session / mock data
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

      if (savedProducts) {
        // Recompute dynamic status based on current date
        const parsed: Product[] = JSON.parse(savedProducts);
        const refreshed = parsed.map(p => ({
          ...p,
          status: getDeadlineStatus(p.returnDeadline, p.status)
        }));
        setProducts(refreshed);
      } else {
        const initial = getInitialMockProducts();
        setProducts(initial);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initial));
      }

      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        const initialNotifs = getInitialMockNotifications();
        setNotifications(initialNotifs);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
      }

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.warn('LocalStorage error, falling back to in-memory state', e);
      setProducts(getInitialMockProducts());
      setNotifications(getInitialMockNotifications());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save products to local storage whenever they change
  const persistProducts = (updated: Product[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const persistNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  };

  const setFilterOptions = (options: Partial<FilterOptions>) => {
    setFilterOptionsState(prev => ({ ...prev, ...options }));
  };

  // Add Product
  const addProduct = async (data: {
    name: string;
    store: string;
    category: any;
    price: number;
    currency: string;
    purchaseDate: string;
    returnPeriodDays: number;
    warrantyPeriodMonths: number;
    orderNumber?: string;
    serialNumber?: string;
    receiptUrl?: string;
    notes?: string;
  }): Promise<Product> => {
    const returnDeadline = calculateReturnDeadline(data.purchaseDate, data.returnPeriodDays);
    const warrantyDeadline = calculateWarrantyDeadline(data.purchaseDate, data.warrantyPeriodMonths);
    const status = getDeadlineStatus(returnDeadline);

    const newProduct: Product = {
      id: 'prod_' + Math.random().toString(36).substring(2, 10),
      userId: userProfile.id,
      name: data.name,
      store: data.store,
      category: data.category,
      price: Number(data.price || 0),
      currency: data.currency || userProfile.preferredCurrency,
      purchaseDate: data.purchaseDate,
      returnPeriodDays: Number(data.returnPeriodDays),
      returnDeadline,
      warrantyPeriodMonths: Number(data.warrantyPeriodMonths),
      warrantyDeadline,
      status,
      orderNumber: data.orderNumber,
      serialNumber: data.serialNumber,
      receiptUrl: data.receiptUrl,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newProduct, ...products];
    persistProducts(updated);

    // Create proactive notification if expiring within 7 days
    const daysLeft = getDaysRemaining(returnDeadline);
    if (daysLeft <= 7 && daysLeft >= 0) {
      const urgentNotif: NotificationItem = {
        id: 'notif_' + Math.random().toString(36).substring(2, 10),
        userId: userProfile.id,
        productId: newProduct.id,
        productName: newProduct.name,
        title: `Return Deadline Alert: ${newProduct.name}`,
        message: `Only ${daysLeft === 0 ? 'today' : `${daysLeft} days`} left to return to ${newProduct.store}!`,
        type: 'return_deadline',
        isRead: false,
        daysLeft,
        createdAt: new Date().toISOString()
      };
      persistNotifications([urgentNotif, ...notifications]);
    }

    return newProduct;
  };

  // Update Product
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = products.map(item => {
      if (item.id !== id) return item;

      const merged = { ...item, ...updates, updatedAt: new Date().toISOString() };
      
      // Recalculate deadlines if purchase date or period changed
      if (updates.purchaseDate || updates.returnPeriodDays !== undefined) {
        merged.returnDeadline = calculateReturnDeadline(
          merged.purchaseDate, 
          merged.returnPeriodDays
        );
      }
      if (updates.purchaseDate || updates.warrantyPeriodMonths !== undefined) {
        merged.warrantyDeadline = calculateWarrantyDeadline(
          merged.purchaseDate, 
          merged.warrantyPeriodMonths
        );
      }

      // Recalculate status unless explicitly marked as returned/kept
      if (merged.status !== 'returned' && merged.status !== 'kept') {
        merged.status = getDeadlineStatus(merged.returnDeadline);
      }

      return merged;
    });

    persistProducts(updated);
  };

  // Delete Product
  const deleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    persistProducts(updated);
    // Remove product specific notifications
    persistNotifications(notifications.filter(n => n.productId !== id));
  };

  // Mark as Returned
  const markAsReturned = async (id: string) => {
    await updateProduct(id, { status: 'returned' });
  };

  // Mark as Kept (no longer tracking return)
  const markAsKept = async (id: string) => {
    await updateProduct(id, { status: 'kept' });
  };

  // Notification management
  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    persistNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    persistNotifications(updated);
  };

  // Reset demo data
  const resetDemoData = () => {
    const initialProducts = getInitialMockProducts();
    const initialNotifs = getInitialMockNotifications();
    persistProducts(initialProducts);
    persistNotifications(initialNotifs);
    setUserProfile(defaultProfile);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    } catch {}
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profileUpdates };
    setUserProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch {}
  };

  // Compute Dashboard Statistics
  const stats: DashboardStats = useMemo(() => {
    let activeReturnWindows = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let returnedCount = 0;
    let totalActiveValue = 0;
    let totalProtectedValue = 0;
    let activeWarrantiesCount = 0;

    products.forEach(p => {
      totalProtectedValue += p.price;

      if (p.status === 'returned') {
        returnedCount++;
      } else if (p.status === 'kept') {
        // kept item
      } else if (p.status === 'expired') {
        expiredCount++;
      } else if (p.status === 'expiring_soon') {
        expiringSoonCount++;
        activeReturnWindows++;
        totalActiveValue += p.price;
      } else if (p.status === 'active') {
        activeReturnWindows++;
        totalActiveValue += p.price;
      }

      // Check warranty status
      if (p.warrantyDeadline) {
        const warrantyDays = getDaysRemaining(p.warrantyDeadline);
        if (warrantyDays >= 0) {
          activeWarrantiesCount++;
        }
      }
    });

    return {
      totalTrackedProducts: products.length,
      activeReturnWindows,
      expiringSoonCount,
      expiredCount,
      returnedCount,
      totalActiveValue,
      totalProtectedValue,
      activeWarrantiesCount
    };
  }, [products]);

  // Compute Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search query
        if (filterOptions.searchQuery.trim()) {
          const q = filterOptions.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchStore = p.store.toLowerCase().includes(q);
          const matchNotes = (p.notes || '').toLowerCase().includes(q);
          const matchOrder = (p.orderNumber || '').toLowerCase().includes(q);
          if (!matchName && !matchStore && !matchNotes && !matchOrder) return false;
        }

        // Status filter
        if (filterOptions.status !== 'all') {
          if (p.status !== filterOptions.status) return false;
        }

        // Category filter
        if (filterOptions.category !== 'all') {
          if (p.category !== filterOptions.category) return false;
        }

        // Store filter
        if (filterOptions.store !== 'all') {
          if (p.store.toLowerCase() !== filterOptions.store.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'urgency': {
            // Sort active / expiring items by days remaining ascending (urgent first), then expired, then returned
            const aDays = getDaysRemaining(a.returnDeadline);
            const bDays = getDaysRemaining(b.returnDeadline);
            
            // Prioritize active & expiring soon
            const aIsActive = a.status === 'active' || a.status === 'expiring_soon';
            const bIsActive = b.status === 'active' || b.status === 'expiring_soon';

            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;

            if (aIsActive && bIsActive) {
              return aDays - bDays;
            }
            return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          }
          case 'purchase_date_desc':
            return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          case 'purchase_date_asc':
            return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
          case 'price_desc':
            return b.price - a.price;
          case 'price_asc':
            return a.price - b.price;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, filterOptions]);

  return (
    <AppContext.Provider
      value={{
        products,
        notifications,
        userProfile,
        isDemoMode,
        isSupabaseActive,
        filterOptions,
        filteredProducts,
        stats,
        isLoading,
        setFilterOptions,
        addProduct,
        updateProduct,
        deleteProduct,
        markAsReturned,
        markAsKept,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
