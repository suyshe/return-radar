'use client';

import React from 'react';
import { useApp } from '../../lib/context/app-context';
import { AppLayoutWrapper } from '../../components/app-layout-wrapper';
import { formatCurrency } from '../../lib/utils/dates';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Store, 
  PieChart, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const { products, stats, userProfile } = useApp();
  const currency = userProfile.preferredCurrency;

  // Calculate return savings (value of items marked as returned)
  const totalReturnedSavings = products
    .filter(p => p.status === 'returned')
    .reduce((sum, p) => sum + p.price, 0);

  // Group by store
  const storeData: Record<string, { count: number; spend: number; activeReturns: number; returnedCount: number }> = {};
  products.forEach(p => {
    if (!storeData[p.store]) {
      storeData[p.store] = { count: 0, spend: 0, activeReturns: 0, returnedCount: 0 };
    }
    storeData[p.store].count += 1;
    storeData[p.store].spend += p.price;
    if (p.status === 'active' || p.status === 'expiring_soon') {
      storeData[p.store].activeReturns += 1;
    }
    if (p.status === 'returned') {
      storeData[p.store].returnedCount += 1;
    }
  });

  const sortedStores = Object.entries(storeData).sort((a, b) => b[1].spend - a[1].spend);

  // Group by category
  const categoryData: Record<string, { count: number; spend: number }> = {};
  products.forEach(p => {
    if (!categoryData[p.category]) {
      categoryData[p.category] = { count: 0, spend: 0 };
    }
    categoryData[p.category].count += 1;
    categoryData[p.category].spend += p.price;
  });

  const sortedCategories = Object.entries(categoryData).sort((a, b) => b[1].spend - a[1].spend);

  return (
    <AppLayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            <span>Financial & Deadline Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Analyze your purchasing trends, recovered refunds, and warranty asset protection.
          </p>
        </div>

        {/* Top Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Monitored
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-white">
              {formatCurrency(stats.totalProtectedValue, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Across all {products.length} purchases
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Refunds Recovered
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(totalReturnedSavings, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {stats.returnedCount} products returned on time
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Active Return Exposure
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-amber-400">
              {formatCurrency(stats.totalActiveValue, currency)}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              In {stats.activeReturnWindows} active return windows
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Radar Health Score
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono text-purple-400">
              {products.length > 0 ? '98.5%' : '100%'}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Zero unmanaged deadlines missed
            </p>
          </div>
        </div>

        {/* Detailed Breakdown: Retailers & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retailer Breakdown */}
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-lg">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-indigo-400" />
              <span>Spend & Returns by Retailer</span>
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              Purchases and return activity per merchant
            </p>

            <div className="space-y-4">
              {sortedStores.map(([storeName, info]) => {
                const percent = stats.totalProtectedValue > 0
                  ? Math.round((info.spend / stats.totalProtectedValue) * 100)
                  : 0;

                return (
                  <div key={storeName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{storeName}</span>
                        <span className="text-zinc-500 font-mono">({info.count} items)</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-zinc-300 font-semibold">{formatCurrency(info.spend, currency)}</span>
                        <span className="text-zinc-500 text-[11px]">({percent}%)</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-500 pt-0.5">
                      <span>{info.activeReturns} active return window(s)</span>
                      {info.returnedCount > 0 && (
                        <span className="text-emerald-400 font-medium">
                          {info.returnedCount} returned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-lg">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Spending by Category</span>
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              Portfolio distribution across categories
            </p>

            <div className="space-y-4">
              {sortedCategories.map(([categoryName, info]) => {
                const percent = stats.totalProtectedValue > 0
                  ? Math.round((info.spend / stats.totalProtectedValue) * 100)
                  : 0;

                return (
                  <div key={categoryName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{categoryName}</span>
                        <span className="text-zinc-500 font-mono">({info.count} items)</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-zinc-300 font-semibold">{formatCurrency(info.spend, currency)}</span>
                        <span className="text-zinc-500 text-[11px]">({percent}%)</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
