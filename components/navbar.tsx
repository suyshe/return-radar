'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../lib/context/app-context';
import { NotificationCenter } from './notification-center';
import { createClient } from '../lib/supabase/client';
import {
  AlertCircle,
  ChevronDown,
  LogOut,
  Menu,
  Plus,
  Radar,
  Search,
  Settings,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onToggleSidebar?: () => void;
}

export function Navbar({ onOpenAddModal, onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const { filterOptions, setFilterOptions, isDemoMode, userProfile } = useApp();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [accountAction, setAccountAction] = useState<'logout' | 'delete' | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const initial =
    userProfile.fullName.trim().charAt(0).toUpperCase() ||
    userProfile.email.trim().charAt(0).toUpperCase() ||
    'U';

  const handleLogout = async () => {
    setAccountError(null);
    setAccountAction('logout');
    try {
      if (!isDemoMode) {
        const supabase = createClient();
        if (!supabase) {
          throw new Error('Unable to connect to your account right now.');
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Unable to log out.', error);
      setAccountError(error instanceof Error ? error.message : 'Unable to log out right now.');
    } finally {
      setAccountAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    setAccountError(null);
    setAccountAction('delete');
    try {
      const response = await fetch('/api/account', { method: 'DELETE' });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || 'Unable to delete your account right now.');
      }

      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) console.warn('Account was deleted, but local sign-out failed.', error);
      }

      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Unable to delete account.', error);
      setAccountError(error instanceof Error ? error.message : 'Unable to delete your account right now.');
    } finally {
      setAccountAction(null);
    }
  };

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

          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* User account menu */}
          <div className="relative pl-1">
            <button
              type="button"
              onClick={() => {
                setAccountError(null);
                setIsAccountMenuOpen((open) => !open);
              }}
              className="inline-flex items-center gap-2 rounded-full p-1 text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open account menu"
              aria-expanded={isAccountMenuOpen}
            >
              <span className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-zinc-700">
                {initial}
              </span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-zinc-400" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
                <div className="border-b border-zinc-800 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {userProfile.fullName || 'Guest User'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-400">
                    {userProfile.email || 'Demo account'}
                  </p>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/settings"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    Account settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={accountAction !== null}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {accountAction === 'logout' ? 'Logging out…' : 'Log out'}
                  </button>
                  {!isDemoMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setDeleteConfirmation('');
                        setAccountError(null);
                        setIsDeleteDialogOpen(true);
                      }}
                      disabled={accountAction !== null}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete account
                    </button>
                  )}
                </div>
                {accountError && (
                  <div className="mx-3 mb-3 flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs text-rose-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{accountError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && accountAction !== 'delete') {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 id="delete-account-title" className="text-lg font-bold text-white">
              Delete your account?
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              This permanently deletes your account and its saved ReturnRadar data. This action cannot be undone.
            </p>
            <label htmlFor="delete-account-confirmation" className="mt-5 block text-xs font-medium text-zinc-300">
              Type <span className="font-bold text-white">DELETE</span> to confirm.
            </label>
            <input
              id="delete-account-confirmation"
              autoFocus
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              disabled={accountAction === 'delete'}
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            {accountError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{accountError}</span>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={accountAction === 'delete'}
                className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || accountAction !== null}
                className="rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {accountAction === 'delete' ? 'Deleting…' : 'Delete account'}
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}
