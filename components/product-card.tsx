'use client';

import React, { useState } from 'react';
import { Product } from '../lib/types';
import { STORE_PRESETS } from '../lib/presets/stores';
import { StatusBadge } from './status-badge';
import { UrgencyMeter } from './urgency-meter';
import { CalendarExportButton } from './calendar-export-button';
import { formatDate, formatCurrency, getDaysRemaining } from '../lib/utils/dates';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Receipt, 
  Package, 
  AlertTriangle 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onMarkReturned: (id: string) => void;
  onMarkKept: (id: string) => void;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onMarkReturned,
  onMarkKept
}: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const storePreset = STORE_PRESETS.find(
    s => s.name.toLowerCase() === product.store.toLowerCase()
  ) || STORE_PRESETS.find(s => s.id === 'other')!;

  const daysLeft = getDaysRemaining(product.returnDeadline);
  const isExpiringSoon = product.status === 'expiring_soon';
  const isReturned = product.status === 'returned';

  return (
    <div 
      className={`relative rounded-2xl bg-zinc-900/90 border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 ${
        isExpiringSoon 
          ? 'border-amber-500/50 shadow-md shadow-amber-500/10' 
          : isReturned 
            ? 'border-indigo-500/30 opacity-80' 
            : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Top Banner accent for urgent cards */}
      {isExpiringSoon && (
        <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 w-full animate-pulse" />
      )}

      <div className="p-5">
        {/* Header: Store Badge & Status Pill */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${storePreset.badgeBg}`}>
              {product.store}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <StatusBadge status={product.status} daysRemaining={daysLeft} />
            
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  className="absolute right-0 mt-1 w-44 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xl py-1 z-20 text-xs"
                  onClick={() => setShowMenu(false)}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit Details</span>
                  </button>

                  {!isReturned && (
                    <button
                      type="button"
                      onClick={() => onMarkReturned(product.id)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-indigo-400 hover:bg-zinc-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mark as Returned</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Title & Price */}
        <div className="mb-4">
          <h3 className="font-semibold text-base text-white tracking-tight line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-white tracking-tight font-mono">
              {formatCurrency(product.price, product.currency)}
            </span>
            <span className="text-xs text-zinc-400">
              Purchased {formatDate(product.purchaseDate)}
            </span>
          </div>
        </div>

        {/* Return Deadline Section */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 mb-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Return Deadline
            </span>
            <span className="font-semibold text-white font-mono">
              {formatDate(product.returnDeadline)}
            </span>
          </div>

          <UrgencyMeter
            purchaseDate={product.purchaseDate}
            deadlineDate={product.returnDeadline}
            status={product.status}
          />
        </div>

        {/* Warranty Section if applicable */}
        {product.warrantyDeadline && (
          <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Warranty until
            </span>
            <span className="font-medium text-zinc-300 font-mono">
              {formatDate(product.warrantyDeadline)}
            </span>
          </div>
        )}

        {/* Notes preview if available */}
        {product.notes && (
          <div className="mt-2.5 pt-2.5 border-t border-zinc-800/60 text-[11px] text-zinc-400 line-clamp-1 italic">
            "{product.notes}"
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center justify-between gap-2">
        <CalendarExportButton product={product} type="return" />

        <div className="flex items-center gap-1.5">
          {!isReturned && (
            <button
              type="button"
              onClick={() => onMarkReturned(product.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
              title="Mark item as successfully returned"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Returned</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Edit product"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center z-30">
          <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
          <p className="text-sm font-semibold text-white">Delete this item?</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-[220px]">
            This will permanently remove {product.name} and all deadline alerts.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
