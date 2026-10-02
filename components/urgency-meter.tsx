'use client';

import React from 'react';
import { calculateReturnProgress, getDaysRemaining, formatDaysRemaining } from '../lib/utils/dates';
import { Clock, AlertCircle } from 'lucide-react';

interface UrgencyMeterProps {
  purchaseDate: string;
  deadlineDate: string;
  status: string;
  className?: string;
}

export function UrgencyMeter({ purchaseDate, deadlineDate, status, className = '' }: UrgencyMeterProps) {
  if (status === 'returned') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex justify-between text-xs text-indigo-400 font-medium">
          <span>Return Complete</span>
          <span>100% Refunded</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full w-full" />
        </div>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(deadlineDate);
  const progress = calculateReturnProgress(purchaseDate, deadlineDate);
  const { text, isUrgent, isExpired } = formatDaysRemaining(daysLeft);

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';

  if (isExpired) {
    barColor = 'bg-zinc-600';
    textColor = 'text-zinc-500';
  } else if (daysLeft <= 3) {
    barColor = 'bg-rose-500';
    textColor = 'text-rose-400 font-semibold';
  } else if (daysLeft <= 7) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400 font-medium';
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className={`flex items-center gap-1 ${textColor}`}>
          {isUrgent ? (
            <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>{text}</span>
        </div>
        <span className="text-zinc-500 font-mono text-[11px]">
          {isExpired ? '100% elapsed' : `${100 - progress}% window left`}
        </span>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
        />
      </div>
    </div>
  );
}
