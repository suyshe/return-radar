# ReturnRadar 📡

> **Intelligent Product Return Window & Warranty Deadline Tracker SaaS**  
> Never lose money on expired return windows again. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase / PostgreSQL. Vercel-ready.

---

## ✨ Features

- **🎯 Return Window & Warranty Radar**: Automatically calculates return deadlines and warranty expiration dates based on purchase date and retailer policies.
- **⚡ Retailer Policy Presets**: Pre-configured return policies for major merchants:
  - **Amazon** (30 days)
  - **Apple** (14 days)
  - **Best Buy** (15 days)
  - **Costco** (90 days)
  - **Target** (90 days)
  - **Walmart** (90 days)
  - **Nordstrom** (365 days)
  - **IKEA** (365 days)
  - Custom retailer support
- **🚦 Urgency Meters & Status Badges**:
  - `Active`: Window safe (> 7 days remaining)
  - `Expiring Soon`: Urgent warning (≤ 7 days, pulsing alert for ≤ 2 days)
  - `Window Closed`: Expired return window
  - `Returned`: Refund processed & logged
  - `Kept`: Intentionally kept past window
- **📅 1-Click Calendar Sync**: Export deadlines directly to **Google Calendar** or download standard `.ics` files for **Apple Calendar** and **Outlook** with 1-day advance alarms.
- **🔔 Notification Center**: Interactive in-app alert drawer showing urgent deadlines and expiration reminders.
- **🔍 Multi-Faceted Search & Filters**:
  - Full-text search across product name, retailer, notes, and order IDs.
  - Filter by status tabs (All, Expiring Soon, Active, Window Closed, Returned).
  - Filter by store and product category.
  - Sort by deadline urgency, purchase date, price, or name.
  - Toggle between **Visual Grid Cards** and **Compact Data Table**.
- **📈 ROI & Financial Analytics**:
  - Track total dollars recovered via timely returns.
  - Total active return exposure (\$ at risk).
  - Spending breakdown by retailer and category.
- **⚡ Dual-Engine Architecture (Instant Demo Mode + Live Supabase)**:
  - Instant zero-configuration demo mode with realistic preloaded products and persistent browser state.
  - Full Supabase PostgreSQL integration with Row Level Security (RLS) when environment variables are supplied.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Deployment**: Vercel-ready

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd returnradar
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
You can immediately click **"Try Demo"** to explore all features with zero initial setup!

---

## 🗄️ Supabase Setup (Optional for Live Production)

To connect your own live Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute the script in [`supabase/schema.sql`](supabase/schema.sql).
3. Copy your project credentials and add them to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   The service-role key is server-only and is required for account deletion. Never expose it with a `NEXT_PUBLIC_` variable.
4. Restart your dev server. Signed-in users see their Supabase account details in the account menu and settings; account deletion permanently removes the user's Supabase account and related rows with cascading foreign keys.

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com/new).
3. (Optional) Set the following Environment Variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; required for account deletion)
   - `NEXT_PUBLIC_APP_URL`
4. Click **Deploy**. Vercel will build and host ReturnRadar on its global edge network.

---

## 📁 Project Structure

```
returnradar/
├── app/
│   ├── analytics/page.tsx      # Spending & return ROI analytics
│   ├── dashboard/page.tsx      # Main dashboard with KPI cards & urgent radar
│   ├── login/page.tsx          # Login & instant demo entry
│   ├── products/page.tsx       # Search, filter, and manage products (grid & table)
│   ├── settings/page.tsx       # User profile, currency, notifications & DB status
│   ├── signup/page.tsx         # Account signup
│   ├── globals.css             # Dark theme styling & animations
│   ├── layout.tsx              # Root layout with AppProvider
│   └── page.tsx                # Marketing landing page with interactive calculator
├── components/
│   ├── app-layout-wrapper.tsx  # Shell layout connecting Navbar, Sidebar & Modals
│   ├── calendar-export-button.tsx # 1-click Google Calendar & .ics download
│   ├── dashboard-stats.tsx     # KPI summary cards
│   ├── navbar.tsx              # Top navigation, global search, notifications
│   ├── notification-center.tsx # Bell popover with urgent deadline alerts
│   ├── product-card.tsx        # Visual product card with urgency progress meter
│   ├── product-modal.tsx       # Add / Edit product dialog with policy auto-fill
│   ├── product-table.tsx       # Detailed table view with inline actions
│   ├── sidebar.tsx             # Collapsible app navigation
│   ├── status-badge.tsx        # Animated status badges
│   └── urgency-meter.tsx       # Progress bar indicating window % elapsed
├── lib/
│   ├── context/app-context.tsx # Central state management & dual-engine data
│   ├── presets/stores.ts       # Merchant return policies & categories catalog
│   ├── storage/mock-data.ts    # Rich demo dataset generator
│   ├── supabase/               # Supabase browser, server & middleware clients
│   ├── types.ts                # TypeScript interfaces
│   └── utils/dates.ts          # Deadline math & iCal generator
├── supabase/
│   └── schema.sql              # PostgreSQL schema, RLS policies & triggers
└── .env.example                # Environment variables template
```

---

## 📜 License

MIT License. Built with ❤️ for smart consumer finance.
