'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../lib/types';
import { STORE_PRESETS, CATEGORIES, CURRENCIES } from '../lib/presets/stores';
import { calculateReturnDeadline, calculateWarrantyDeadline, formatDate } from '../lib/utils/dates';
import { X, Sparkles, AlertCircle, Calendar, DollarSign, Store, Tag, FileText } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  productToEdit?: Product | null;
  defaultCurrency?: string;
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  defaultCurrency = 'USD'
}: ProductModalProps) {
  const [name, setName] = useState('');
  const [store, setStore] = useState('Amazon');
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [price, setPrice] = useState('0.00');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnPeriodDays, setReturnPeriodDays] = useState(30);
  const [warrantyPeriodMonths, setWarrantyPeriodMonths] = useState(12);
  const [orderNumber, setOrderNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setStore(productToEdit.store);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setCurrency(productToEdit.currency);
      setPurchaseDate(productToEdit.purchaseDate);
      setReturnPeriodDays(productToEdit.returnPeriodDays);
      setWarrantyPeriodMonths(productToEdit.warrantyPeriodMonths || 0);
      setOrderNumber(productToEdit.orderNumber || '');
      setSerialNumber(productToEdit.serialNumber || '');
      setNotes(productToEdit.notes || '');
    } else {
      // Reset for new item
      setName('');
      setStore('Amazon');
      setCategory('Electronics');
      setPrice('');
      setCurrency(defaultCurrency);
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setReturnPeriodDays(30);
      setWarrantyPeriodMonths(12);
      setOrderNumber('');
      setSerialNumber('');
      setNotes('');
    }
    setError(null);
  }, [productToEdit, isOpen, defaultCurrency]);

  if (!isOpen) return null;

  // Handle store change and auto-populate return policy defaults
  const handleStoreChange = (selectedStoreName: string) => {
    setStore(selectedStoreName);
    const matchedPreset = STORE_PRESETS.find(
      s => s.name.toLowerCase() === selectedStoreName.toLowerCase()
    );
    if (matchedPreset) {
      setReturnPeriodDays(matchedPreset.defaultReturnDays);
      setWarrantyPeriodMonths(matchedPreset.defaultWarrantyMonths);
    }
  };

  // Live computed deadlines
  const previewReturnDeadline = calculateReturnDeadline(purchaseDate, returnPeriodDays);
  const previewWarrantyDeadline = calculateWarrantyDeadline(purchaseDate, warrantyPeriodMonths);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }
    const numPrice = price.trim() === '' ? 0 : parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please enter a valid price (or leave blank for 0)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        name: name.trim(),
        store,
        category,
        price: numPrice,
        currency,
        purchaseDate,
        returnPeriodDays: Number(returnPeriodDays),
        warrantyPeriodMonths: Number(warrantyPeriodMonths),
        orderNumber: orderNumber.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-400" />
              {productToEdit ? 'Edit Tracked Product' : 'Track New Product'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter purchase details to automatically monitor return deadlines and warranties.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Retailer / Store Preset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>Store / Retailer *</span>
                <span className="text-[10px] text-indigo-400 font-normal">(Auto-fills policy)</span>
              </label>
              <select
                value={store}
                onChange={(e) => handleStoreChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {STORE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.name}>
                    {preset.name} ({preset.defaultReturnDays}d return)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Purchase Price</span>
                <span className="text-[10px] text-zinc-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <DollarSign className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Date & Return Window Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Purchase Date *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Return Period (Days) *
              </label>
              <input
                type="number"
                min="0"
                max="730"
                required
                value={returnPeriodDays}
                onChange={(e) => setReturnPeriodDays(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Warranty Period */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Warranty Coverage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 12, 24, 36].map((months) => (
                <button
                  type="button"
                  key={months}
                  onClick={() => setWarrantyPeriodMonths(months)}
                  className={`py-2 px-3 text-xs rounded-xl border text-center transition-all ${
                    warrantyPeriodMonths === months
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-zinc-800/50 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {months === 0 ? 'None' : `${months / 12} ${months === 12 ? 'Year' : 'Years'}`}
                </button>
              ))}
            </div>
          </div>

          {/* Live Deadline Preview Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calculated Deadlines</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-400">Return Deadline:</span>
              <span className="font-medium text-white">{formatDate(previewReturnDeadline)}</span>
            </div>
            {warrantyPeriodMonths > 0 && previewWarrantyDeadline && (
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">Warranty Expiration:</span>
                <span className="font-medium text-emerald-400">{formatDate(previewWarrantyDeadline)}</span>
              </div>
            )}
          </div>

          {/* Optional Order / Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Order Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 112-928103-91823"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-white placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Serial Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. SN-892019A"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-white placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Notes or Return Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Keep original retail box and plastic wrapping. Return in-store or by mail."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-white placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Start Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
