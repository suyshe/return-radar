'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../lib/context/app-context';
import { AppLayoutWrapper } from '../../components/app-layout-wrapper';
import { DashboardStatsView } from '../../components/dashboard-stats';
import { ProductCard } from '../../components/product-card';
import { ProductModal } from '../../components/product-modal';
import { Product } from '../../lib/types';
import { formatDate, getDaysRemaining, formatCurrency } from '../../lib/utils/dates';
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    products, 
    stats, 
    userProfile, 
    deleteProduct, 
    markAsReturned, 
    markAsKept, 
    updateProduct,
    setFilterOptions
  } = useApp();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Urgent items: status = 'expiring_soon' or (active & daysLeft <= 7)
  const urgentProducts = products.filter(
    p => (p.status === 'expiring_soon' || (p.status === 'active' && getDaysRemaining(p.returnDeadline) <= 7)) && getDaysRemaining(p.returnDeadline) >= 0
  );

  // Active items
  const activeProducts = products.filter(p => p.status === 'active' || p.status === 'expiring_soon');

  // Recent items
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 4);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Welcome back! Here's an overview of your active return windows and warranties.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Urgent Expiration Banner (if any) */}
        {urgentProducts.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-500/40 p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    Action Required: {urgentProducts.length} {urgentProducts.length === 1 ? 'item return window' : 'items return windows'} closing soon!
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                    You have <span className="font-semibold text-amber-300">{urgentProducts.map(p => p.name).join(', ')}</span> closing within 7 days. Make a return decision before refund windows expire.
                  </p>
                </div>
              </div>

              <Link
                href="/products?status=expiring_soon"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md transition-colors"
              >
                <span>Review Urgent Items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Metric Cards */}
        <DashboardStatsView 
          stats={stats} 
          currency={userProfile.preferredCurrency} 
          onFilterUrgent={() => setFilterOptions({ status: 'expiring_soon' })}
        />

        {/* Urgent Action Section */}
        {urgentProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Expiring Soon (Next 7 Days)
                </h2>
              </div>
              <span className="text-xs text-zinc-400">
                {urgentProducts.length} items urgent
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={deleteProduct}
                  onMarkReturned={markAsReturned}
                  onMarkKept={markAsKept}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Tracked Purchases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Recent Tracked Purchases
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Quick glance at your latest monitored items
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>See all ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
              <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No products tracked yet</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Add your first purchase to automatically monitor return deadlines and warranty expirations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={deleteProduct}
                  onMarkReturned={markAsReturned}
                  onMarkKept={markAsKept}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <ProductModal
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
          productToEdit={editingProduct}
          defaultCurrency={userProfile.preferredCurrency}
        />
      </div>
    </AppLayoutWrapper>
  );
}
