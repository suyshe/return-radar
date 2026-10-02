'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radar, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  DollarSign, 
  Store, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { STORE_PRESETS } from '../lib/presets/stores';
import { calculateReturnDeadline, formatDate, getDaysRemaining, formatDaysRemaining } from '../lib/utils/dates';

export default function LandingPage() {
  // Interactive mini calculator on landing page
  const [calcStore, setCalcStore] = useState('Apple');
  const [calcDays, setCalcDays] = useState(14);
  const [calcDate, setCalcDate] = useState(
    new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0] // 10 days ago
  );

  const handleCalcStoreChange = (storeName: string) => {
    setCalcStore(storeName);
    const preset = STORE_PRESETS.find(s => s.name.toLowerCase() === storeName.toLowerCase());
    if (preset) {
      setCalcDays(preset.defaultReturnDays);
    }
  };

  const calcDeadline = calculateReturnDeadline(calcDate, calcDays);
  const calcDaysLeft = getDaysRemaining(calcDeadline);
  const countdown = formatDaysRemaining(calcDaysLeft);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30">
              <Radar className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Return<span className="text-indigo-400">Radar</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#calculator" className="hover:text-white transition-colors">Return Calculator</a>
            <a href="#free" className="hover:text-white transition-colors">100% Free</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
            <Radar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Never miss a return window or warranty deadline again</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Stop losing money on <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">expired return windows.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ReturnRadar automatically tracks product return periods and warranty deadlines across Amazon, Apple, Best Buy, Costco, and hundreds of retailers. Get intelligent reminders before your money is locked.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant 1-click test drive
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Calendar sync ready
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Return Calculator Demo */}
      <section id="calculator" className="py-16 bg-zinc-900/40 border-y border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Try the Return Deadline Calculator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select a retailer and your purchase date to see ReturnRadar in action
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Store
                </label>
                <select
                  value={calcStore}
                  onChange={(e) => handleCalcStoreChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  {STORE_PRESETS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.defaultReturnDays}d)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={calcDate}
                  onChange={(e) => setCalcDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Return Window (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcDays}
                  onChange={(e) => setCalcDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Calculated Result Display */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs text-zinc-400">Calculated Return Expiration:</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {formatDate(calcDeadline)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                  countdown.isUrgent
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse'
                    : countdown.isWarning
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : countdown.isExpired
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}>
                  {countdown.isUrgent && <AlertTriangle className="w-4 h-4" />}
                  <span>{countdown.text}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
                >
                  Track in Radar →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Engineered to protect your hard-earned money
          </h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
            Everything you need to effortlessly manage receipts, return policies, and product warranties in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Retailer Policy Presets</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Preset return windows for Amazon (30d), Apple (14d), Best Buy (15d), Costco (90d), Walmart, and more. No manual policy searching needed.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Urgency Radar & Progress</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dynamic status badges and countdown bars show exact remaining days. Highlight items closing in 7 days and 48 hours.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1-Click Calendar Sync</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Export deadlines directly into Google Calendar or download standard .ics files for Apple Calendar and Outlook with automated 1-day advance alarms.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Warranty Timeline Vault</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Monitor 1-year, 2-year, and extended warranty coverages. Know exactly when warranty repairs and claims expire.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Financial Savings Tracker</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Keep an exact tally of dollars recovered through timely returns. Track spending by merchant and product category.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated Notifications</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              In-app notification center and email alerts at 7, 3, and 1 day prior to deadline so you never get caught off guard.
            </p>
          </div>
        </div>
      </section>

      {/* 100% Free Forever Section */}
      <section id="free" className="py-20 bg-zinc-900/30 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Forever</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              All features included. Zero price criteria.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
              ReturnRadar is completely free for everyone. No credit cards, no hidden fees, no subscriptions, and no paywalls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 text-left">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Purchases</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Track as many items as you want with no item limits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Retailer Presets</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Amazon, Apple, Best Buy, Costco, and custom store policies.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Calendar Sync</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Direct Google Calendar export and .ics download.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Warranty Vault</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Keep tabs on 1-year and multi-year warranties.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Urgency Notifications</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Automated countdown warnings at 7, 3, and 1 day left.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Financial ROI Analytics</span>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6">
                  Monitor refunds saved and total active return value.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Dashboard Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-white">ReturnRadar</span>
            <span className="text-xs text-zinc-500">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/analytics" className="hover:text-white">Analytics</Link>
            <Link href="/settings" className="hover:text-white">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
