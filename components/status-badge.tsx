'use client';

import React from 'react';
import { ProductStatus } from '../lib/types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ProductStatus;
  daysRemaining?: number;
  className?: string;
}

export function StatusBadge({ status, daysRemaining, className = '' }: StatusBadgeProps) {
  switch (status) {
    case 'expiring_soon':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <AlertTriangle className="w-3.5 h-3.5" />
          Expiring Soon
        </span>
      );

    case 'active':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active
        </span>
      );

    case 'expired':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Window Closed
        </span>
      );

    case 'returned':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Returned
        </span>
      );

    case 'kept':
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}
        >
          <Archive className="w-3.5 h-3.5" />
          Kept Past Window
        </span>
      );

    default:
      return null;
  }
}
