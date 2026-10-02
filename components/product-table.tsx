'use client';

import React from 'react';
import { Product } from '../lib/types';
import { StatusBadge } from './status-badge';
import { CalendarExportButton } from './calendar-export-button';
import { formatDate, formatCurrency, getDaysRemaining, formatDaysRemaining } from '../lib/utils/dates';
import { Edit3, Trash2, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onMarkReturned: (id: string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onMarkReturned
}: ProductTableProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-lg">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Product</th>
            <th className="py-3.5 px-3">Retailer</th>
            <th className="py-3.5 px-3">Price</th>
            <th className="py-3.5 px-3">Return Deadline</th>
            <th className="py-3.5 px-3">Time Left</th>
            <th className="py-3.5 px-3">Status</th>
            <th className="py-3.5 px-3">Warranty</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {products.map((product) => {
            const daysLeft = getDaysRemaining(product.returnDeadline);
            const countdown = formatDaysRemaining(daysLeft);
            const isExpiring = product.status === 'expiring_soon';
            const isReturned = product.status === 'returned';

            return (
              <tr 
                key={product.id}
                className={`hover:bg-zinc-800/40 transition-colors ${
                  isExpiring ? 'bg-amber-500/5' : ''
                }`}
              >
                {/* Product Name & Category */}
                <td className="py-3.5 px-4 font-medium text-white max-w-[240px]">
                  <div className="font-semibold text-zinc-100 truncate" title={product.name}>
                    {product.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    Purchased {formatDate(product.purchaseDate)} • {product.category}
                  </div>
                </td>

                {/* Retailer */}
                <td className="py-3.5 px-3 text-zinc-300">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium text-[11px] border border-zinc-700/50">
                    {product.store}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-3 font-mono font-semibold text-white">
                  {formatCurrency(product.price, product.currency)}
                </td>

                {/* Return Deadline */}
                <td className="py-3.5 px-3 font-mono text-zinc-300">
                  {formatDate(product.returnDeadline)}
                </td>

                {/* Time Left */}
                <td className="py-3.5 px-3">
                  {isReturned ? (
                    <span className="text-indigo-400 font-medium">Returned</span>
                  ) : (
                    <span 
                      className={`font-medium ${
                        countdown.isUrgent 
                          ? 'text-rose-400 font-semibold' 
                          : countdown.isWarning 
                            ? 'text-amber-400' 
                            : countdown.isExpired 
                              ? 'text-zinc-500' 
                              : 'text-emerald-400'
                      }`}
                    >
                      {countdown.text}
                    </span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-3">
                  <StatusBadge status={product.status} daysRemaining={daysLeft} />
                </td>

                {/* Warranty */}
                <td className="py-3.5 px-3 text-zinc-400">
                  {product.warrantyDeadline ? (
                    <div className="flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{formatDate(product.warrantyDeadline)}</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CalendarExportButton product={product} type="return" variant="icon" />

                    {!isReturned && (
                      <button
                        type="button"
                        onClick={() => onMarkReturned(product.id)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 transition-colors"
                        title="Mark as Returned"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
