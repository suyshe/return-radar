import { Product, NotificationItem } from '../types';
import { calculateReturnDeadline, calculateWarrantyDeadline, getDeadlineStatus } from '../utils/dates';

// Helper to create date N days before today
function getDateDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function getInitialMockProducts(): Product[] {
  const items: Array<{
    id: string;
    name: string;
    store: string;
    category: any;
    price: number;
    currency: string;
    daysAgo: number;
    returnPeriodDays: number;
    warrantyPeriodMonths: number;
    forceStatus?: any;
    orderNumber?: string;
    notes?: string;
  }> = [
    {
      id: 'demo-1',
      name: 'Sony WH-1000XM5 Noise Canceling Headphones',
      store: 'Amazon',
      category: 'Electronics',
      price: 398.00,
      currency: 'USD',
      daysAgo: 27, // 30 - 27 = 3 days left -> EXPIRING SOON!
      returnPeriodDays: 30,
      warrantyPeriodMonths: 12,
      orderNumber: '114-8924018-91823',
      notes: 'Testing ANC performance during daily commute. Box and cables kept intact in cabinet.'
    },
    {
      id: 'demo-2',
      name: 'Apple MacBook Pro 16" (M3 Pro, 36GB)',
      store: 'Apple',
      category: 'Computers & Office',
      price: 2499.00,
      currency: 'USD',
      daysAgo: 10, // 14 - 10 = 4 days left -> EXPIRING SOON!
      returnPeriodDays: 14,
      warrantyPeriodMonths: 12,
      orderNumber: 'W819230491',
      notes: 'Purchased at Apple Fifth Avenue. Test battery life and compile speeds against old M1.'
    },
    {
      id: 'demo-3',
      name: 'Breville Barista Touch Espresso Machine',
      store: 'Best Buy',
      category: 'Appliances',
      price: 999.95,
      currency: 'USD',
      daysAgo: 7, // 15 - 7 = 8 days left -> ACTIVE
      returnPeriodDays: 15,
      warrantyPeriodMonths: 24,
      orderNumber: 'BBY01-83920193',
      notes: 'Dialing in espresso beans. Registered on Breville portal for extended warranty.'
    },
    {
      id: 'demo-4',
      name: 'Nike Air Zoom Pegasus 40 Running Shoes',
      store: 'Target',
      category: 'Clothing & Apparel',
      price: 130.00,
      currency: 'USD',
      daysAgo: 15, // 90 - 15 = 75 days left -> ACTIVE
      returnPeriodDays: 90,
      warrantyPeriodMonths: 0,
      orderNumber: 'TGT-99210-A',
      notes: 'Fit feels slightly snug in the toe box, may exchange for a half size up.'
    },
    {
      id: 'demo-5',
      name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor (U3223QE)',
      store: 'Costco',
      category: 'Electronics',
      price: 789.99,
      currency: 'USD',
      daysAgo: 22, // 90 - 22 = 68 days left -> ACTIVE
      returnPeriodDays: 90,
      warrantyPeriodMonths: 36,
      orderNumber: 'CST-4820192',
      notes: 'Included Costco Concierge 2-year warranty extension.'
    },
    {
      id: 'demo-6',
      name: 'Dyson V15 Detect Cordless Vacuum Cleaner',
      store: 'Walmart',
      category: 'Home & Kitchen',
      price: 749.99,
      currency: 'USD',
      daysAgo: 110, // 90 - 110 = -20 days -> EXPIRED return, active warranty
      returnPeriodDays: 90,
      warrantyPeriodMonths: 24,
      orderNumber: 'WM-3920192',
      notes: 'Decided to keep! Return window closed, but 2-year manufacturer warranty active until 2028.'
    },
    {
      id: 'demo-7',
      name: 'Zara Tailored Wool Blazer (Navy)',
      store: 'Other',
      category: 'Clothing & Apparel',
      price: 189.00,
      currency: 'USD',
      daysAgo: 20,
      returnPeriodDays: 30,
      warrantyPeriodMonths: 0,
      forceStatus: 'returned',
      orderNumber: 'ZR-88201',
      notes: 'Returned at downtown store on Day 18. Refund processed back to card.'
    }
  ];

  return items.map((item) => {
    const purchaseDate = getDateDaysAgo(item.daysAgo);
    const returnDeadline = calculateReturnDeadline(purchaseDate, item.returnPeriodDays);
    const warrantyDeadline = calculateWarrantyDeadline(purchaseDate, item.warrantyPeriodMonths);
    const status = item.forceStatus || getDeadlineStatus(returnDeadline);

    return {
      id: item.id,
      userId: 'demo-user',
      name: item.name,
      store: item.store,
      category: item.category,
      price: item.price,
      currency: item.currency,
      purchaseDate,
      returnPeriodDays: item.returnPeriodDays,
      returnDeadline,
      warrantyPeriodMonths: item.warrantyPeriodMonths,
      warrantyDeadline,
      status,
      orderNumber: item.orderNumber,
      notes: item.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

export function getInitialMockNotifications(): NotificationItem[] {
  return [
    {
      id: 'notif-1',
      userId: 'demo-user',
      productId: 'demo-1',
      productName: 'Sony WH-1000XM5 Noise Canceling Headphones',
      title: 'Return Window Closing in 3 Days!',
      message: 'Your 30-day Amazon return window for Sony WH-1000XM5 expires soon. Make a decision before $398 is locked.',
      type: 'return_deadline',
      isRead: false,
      daysLeft: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-2',
      userId: 'demo-user',
      productId: 'demo-2',
      productName: 'Apple MacBook Pro 16"',
      title: 'Apple 14-Day Return Deadline: 4 Days Left',
      message: 'MacBook Pro ($2,499.00) return window closes in 4 days. Keep all original packaging and accessories.',
      type: 'return_deadline',
      isRead: false,
      daysLeft: 4,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'notif-3',
      userId: 'demo-user',
      title: 'Welcome to ReturnRadar Pro',
      message: 'You have 7 items tracked. We will automatically alert you before any return window or warranty expires.',
      type: 'system',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];
}
