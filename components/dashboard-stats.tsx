'use client';

import React from 'react';
import { DashboardStats } from '../lib/types';
import { formatCurrency } from '../lib/utils/dates';
import { Clock, AlertTriangle, ShieldCheck, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DashboardStatsProps {
  stats: DashboardStats;
  currency?: string;
  onFilterUrgent?: () => void;
}

export function DashboardStatsView({ stats, currency = 'USD', onFilterUrgent }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Return Windows */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Active Returns
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-white tracking-tight">
            {stats.activeReturnWindows}
          </span>
          <span className="text-xs text-zinc-400">items open</span>
        </div>
        <div className="mt-2 text-xs text-indigo-300 font-medium">
          {formatCurrency(stats.totalActiveValue, currency)} at stake
        </div>
      </div>

      {/* 2. Expiring Soon (Urgent) */}
      <div 
        onClick={onFilterUrgent}
        className={`relative overflow-hidden rounded-2xl bg-zinc-900/80 border p-5 shadow-lg transition-all cursor-pointer group ${
          stats.expiringSoonCount > 0
            ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70 hover:shadow-amber-500/10'
            : 'border-zinc-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            {stats.expiringSoonCount > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            Expiring &le; 7 Days
          </span>
          <div className={`p-2 rounded-xl border ${
            stats.expiringSoonCount > 0 
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono tracking-tight ${
            stats.expiringSoonCount > 0 ? 'text-amber-400' : 'text-zinc-400'
          }`}>
            {stats.expiringSoonCount}
          </span>
          <span className="text-xs text-zinc-400">urgent action required</span>
        </div>
        <div className="mt-2 text-xs text-zinc-400 group-hover:text-amber-300 transition-colors">
          {stats.expiringSoonCount > 0 ? 'Click to filter urgent items →' : 'No imminent deadlines'}
        </div>
      </div>

      {/* 3. Total Protected Value */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Total Monitored Value
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
            {formatCurrency(stats.totalProtectedValue, currency)}
          </span>
        </div>
        <div className="mt-2 text-xs text-zinc-400">
          Across {stats.totalTrackedProducts} total purchases
        </div>
      </div>

      {/* 4. Active Warranties */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Active Warranties
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono text-white tracking-tight">
            {stats.activeWarrantiesCount}
          </span>
          <span className="text-xs text-zinc-400">covered products</span>
        </div>
        <div className="mt-2 text-xs text-blue-300 font-medium">
          Manufacturer & extended coverage
        </div>
      </div>
    </div>
  );
}
