'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../lib/context/app-context';
import { NotificationCenter } from './notification-center';
import { Radar, Plus, Search, ShieldCheck, Sparkles, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onToggleSidebar?: () => void;
}

export function Navbar({ onOpenAddModal, onToggleSidebar }: NavbarProps) {
  const { filterOptions, setFilterOptions, isDemoMode, userProfile } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Radar className="h-5 w-5 text-white animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Return<span className="text-indigo-400">Radar</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                Deadline & Warranty Tracker
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products, stores, order IDs..."
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Badge */}
          {isDemoMode && (
            <div 
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-500/20"
              title="You are previewing with interactive local data"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Demo Mode</span>
            </div>
          )}

          {/* Quick Add Product Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* Notification Center */}
          <NotificationCenter />

          {/* User Profile Avatar */}
          <div className="flex items-center pl-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-zinc-700">
              {userProfile.fullName ? userProfile.fullName.charAt(0) : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
