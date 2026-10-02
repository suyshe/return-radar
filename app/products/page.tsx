'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../lib/context/app-context';
import { AppLayoutWrapper } from '../../components/app-layout-wrapper';
import { ProductCard } from '../../components/product-card';
import { ProductTable } from '../../components/product-table';
import { ProductModal } from '../../components/product-modal';
import { Product, ProductCategory, ProductStatus } from '../../lib/types';
import { STORE_PRESETS, CATEGORIES } from '../../lib/presets/stores';
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  ArrowUpDown, 
  RotateCcw, 
  Package, 
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive
} from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { 
    filteredProducts, 
    filterOptions, 
    setFilterOptions, 
    products, 
    deleteProduct, 
    markAsReturned, 
    markAsKept, 
    updateProduct,
    addProduct,
    userProfile
  } = useApp();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync url param if ?status=expiring_soon passed
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['active', 'expiring_soon', 'expired', 'returned'].includes(statusParam)) {
      setFilterOptions({ status: statusParam as ProductStatus });
    }
  }, [searchParams, setFilterOptions]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
    }
  };

  const statusTabs: Array<{ id: 'all' | ProductStatus; label: string; count?: number }> = [
    { id: 'all', label: 'All Products', count: products.length },
    { 
      id: 'expiring_soon', 
      label: 'Expiring Soon', 
      count: products.filter(p => p.status === 'expiring_soon').length 
    },
    { 
      id: 'active', 
      label: 'Active', 
      count: products.filter(p => p.status === 'active').length 
    },
    { 
      id: 'expired', 
      label: 'Window Closed', 
      count: products.filter(p => p.status === 'expired').length 
    },
    { 
      id: 'returned', 
      label: 'Returned', 
      count: products.filter(p => p.status === 'returned').length 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tracked Products
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage and filter your purchases, return deadlines, and warranty timelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800/80">
        {statusTabs.map((tab) => {
          const isActive = filterOptions.status === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterOptions({ status: tab.id })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-zinc-800/80 text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search, Dropdown Filters & View Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, retailer, notes..."
            value={filterOptions.searchQuery}
            onChange={(e) => setFilterOptions({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {filterOptions.searchQuery && (
            <button
              type="button"
              onClick={() => setFilterOptions({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Store filter */}
          <select
            value={filterOptions.store}
            onChange={(e) => setFilterOptions({ store: e.target.value })}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Stores</option>
            {STORE_PRESETS.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={filterOptions.category}
            onChange={(e) => setFilterOptions({ category: e.target.value as any })}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort by */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={filterOptions.sortBy}
              onChange={(e) => setFilterOptions({ sortBy: e.target.value as any })}
              className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="urgency" className="bg-zinc-900 text-white">Urgency (Deadline)</option>
              <option value="purchase_date_desc" className="bg-zinc-900 text-white">Newest Purchase</option>
              <option value="purchase_date_asc" className="bg-zinc-900 text-white">Oldest Purchase</option>
              <option value="price_desc" className="bg-zinc-900 text-white">Price: High to Low</option>
              <option value="price_asc" className="bg-zinc-900 text-white">Price: Low to High</option>
              <option value="name_asc" className="bg-zinc-900 text-white">Name: A to Z</option>
            </select>
          </div>

          {/* View Switcher (Grid vs Table) */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setFilterOptions({ viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filterOptions.viewMode === 'grid'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFilterOptions({ viewMode: 'table' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filterOptions.viewMode === 'table'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Counter & Active Filter Pills */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
          Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} products
        </span>

        {(filterOptions.searchQuery || filterOptions.status !== 'all' || filterOptions.category !== 'all' || filterOptions.store !== 'all') && (
          <button
            type="button"
            onClick={() => setFilterOptions({ searchQuery: '', status: 'all', category: 'all', store: 'all' })}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Products Display (Grid or Table) */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-16 text-center">
          <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No products found</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            No products match your current filters. Try changing or clearing your search criteria.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setFilterOptions({ searchQuery: '', status: 'all', category: 'all', store: 'all' })}
              className="px-3.5 py-2 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              + Track New Product
            </button>
          </div>
        </div>
      ) : filterOptions.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
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
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={deleteProduct}
          onMarkReturned={markAsReturned}
        />
      )}

      {/* Add Modal */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={async (data) => {
          await addProduct(data);
        }}
        defaultCurrency={userProfile.preferredCurrency}
      />

      {/* Edit Modal */}
      <ProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveEdit}
        productToEdit={editingProduct}
        defaultCurrency={userProfile.preferredCurrency}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <AppLayoutWrapper>
      <Suspense fallback={
        <div className="p-12 text-center text-xs text-zinc-500">
          Loading products...
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </AppLayoutWrapper>
  );
}
