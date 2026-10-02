import { Product, ProductStatus } from '../types';

/**
 * Calculates return deadline date (YYYY-MM-DD) from purchase date and return days
 */
export function calculateReturnDeadline(purchaseDateStr: string, returnPeriodDays: number): string {
  if (!purchaseDateStr) return '';
  const date = new Date(purchaseDateStr + 'T00:00:00');
  date.setDate(date.getDate() + Number(returnPeriodDays));
  return date.toISOString().split('T')[0];
}

/**
 * Calculates warranty deadline date (YYYY-MM-DD) from purchase date and warranty months
 */
export function calculateWarrantyDeadline(purchaseDateStr: string, warrantyPeriodMonths: number): string | null {
  if (!purchaseDateStr || warrantyPeriodMonths <= 0) return null;
  const date = new Date(purchaseDateStr + 'T00:00:00');
  date.setMonth(date.getMonth() + Number(warrantyPeriodMonths));
  return date.toISOString().split('T')[0];
}

/**
 * Returns difference in calendar days between today and deadline
 * Positive = days left in future
 * 0 = due today
 * Negative = overdue / past
 */
export function getDaysRemaining(deadlineDateStr: string | null): number {
  if (!deadlineDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineDateStr + 'T00:00:00');
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Derives dynamic status based on deadline and status flags
 */
export function getDeadlineStatus(
  returnDeadlineStr: string,
  currentStatus?: ProductStatus
): ProductStatus {
  if (currentStatus === 'returned') return 'returned';
  if (currentStatus === 'kept') return 'kept';

  const days = getDaysRemaining(returnDeadlineStr);
  if (days < 0) return 'expired';
  if (days <= 7) return 'expiring_soon';
  return 'active';
}

/**
 * Calculates percentage of the return window period that has already passed (0% to 100%)
 */
export function calculateReturnProgress(purchaseDateStr: string, deadlineDateStr: string): number {
  if (!purchaseDateStr || !deadlineDateStr) return 0;
  const start = new Date(purchaseDateStr + 'T00:00:00').getTime();
  const end = new Date(deadlineDateStr + 'T00:00:00').getTime();
  const now = new Date().getTime();

  if (end <= start) return 100;
  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

/**
 * Formats a date string (YYYY-MM-DD) into readable format: "Oct 15, 2026"
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats countdown text and urgency flag
 */
export function formatDaysRemaining(days: number): {
  text: string;
  badgeText: string;
  isUrgent: boolean;
  isWarning: boolean;
  isExpired: boolean;
} {
  if (days < 0) {
    const past = Math.abs(days);
    return {
      text: `Expired ${past} ${past === 1 ? 'day' : 'days'} ago`,
      badgeText: 'Expired',
      isUrgent: false,
      isWarning: false,
      isExpired: true
    };
  }
  if (days === 0) {
    return {
      text: 'Expires Today!',
      badgeText: 'Today',
      isUrgent: true,
      isWarning: true,
      isExpired: false
    };
  }
  if (days === 1) {
    return {
      text: '1 day left',
      badgeText: '1 day left',
      isUrgent: true,
      isWarning: true,
      isExpired: false
    };
  }
  if (days <= 7) {
    return {
      text: `${days} days left`,
      badgeText: `${days}d left`,
      isUrgent: days <= 3,
      isWarning: true,
      isExpired: false
    };
  }
  return {
    text: `${days} days left`,
    badgeText: `${days}d left`,
    isUrgent: false,
    isWarning: false,
    isExpired: false
  };
}

/**
 * Formats price with currency symbol
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };
  const sym = symbols[currency] || '$';
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Builds a direct Google Calendar Web link with title, description, and reminder date
 */
export function generateGoogleCalendarUrl(product: Product, type: 'return' | 'warranty' = 'return'): string {
  const isReturn = type === 'return';
  const targetDateStr = isReturn ? product.returnDeadline : product.warrantyDeadline;
  if (!targetDateStr) return '#';

  const title = encodeURIComponent(
    isReturn 
      ? `🚨 Return Window Closes: ${product.name} (${product.store})`
      : `🛡️ Warranty Expiration: ${product.name}`
  );
  
  const desc = encodeURIComponent(
    `Product: ${product.name}\n` +
    `Store: ${product.store}\n` +
    `Price: ${formatCurrency(product.price, product.currency)}\n` +
    `Purchase Date: ${product.purchaseDate}\n` +
    (product.orderNumber ? `Order #: ${product.orderNumber}\n` : '') +
    (product.notes ? `Notes: ${product.notes}\n` : '') +
    `Tracked with ReturnRadar (https://returnradar.app)`
  );

  // Format YYYYMMDD
  const rawDate = targetDateStr.replace(/-/g, '');
  const datesParam = `${rawDate}/${rawDate}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${desc}&dates=${datesParam}`;
}

/**
 * Generates an iCalendar (.ics) string for downloading to Apple Calendar, Outlook, etc.
 */
export function generateICalendarBlob(product: Product, type: 'return' | 'warranty' = 'return'): Blob {
  const isReturn = type === 'return';
  const targetDateStr = isReturn ? product.returnDeadline : product.warrantyDeadline;
  const rawDate = (targetDateStr || '').replace(/-/g, '');

  const summary = isReturn
    ? `Return Window Closes: ${product.name}`
    : `Warranty Expiration: ${product.name}`;

  const description = [
    `Product: ${product.name}`,
    `Retailer: ${product.store}`,
    `Price: ${formatCurrency(product.price, product.currency)}`,
    `Purchase Date: ${product.purchaseDate}`,
    product.orderNumber ? `Order #: ${product.orderNumber}` : '',
    product.notes ? `Notes: ${product.notes}` : '',
    'Tracked via ReturnRadar'
  ].filter(Boolean).join('\\n');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ReturnRadar//Product Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${product.id}-${type}@returnradar.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${rawDate}`,
    `DTEND;VALUE=DATE:${rawDate}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Deadline is tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Triggers a browser download of the .ics file
 */
export function downloadICalendarFile(product: Product, type: 'return' | 'warranty' = 'return'): void {
  const blob = generateICalendarBlob(product, type);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  anchor.download = `${slug}-${type}-deadline.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
