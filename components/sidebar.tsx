'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../lib/context/app-context';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
  Store, 
  HelpCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { stats, resetDemoData, isDemoMode } = useApp();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: stats.expiringSoonCount > 0 ? `${stats.expiringSoonCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    {
      label: 'Products',
      href: '/products',
      icon: Package,
      badge: `${stats.totalTrackedProducts}`
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-zinc-950 border-r border-zinc-800/80">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeColor || (isActive ? 'bg-indigo-700 text-white' : 'bg-zinc-800 text-zinc-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Deadline Warning Card */}
        {stats.expiringSoonCount > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Urgent Attention</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              {stats.expiringSoonCount} {stats.expiringSoonCount === 1 ? 'item has a return window' : 'items have return windows'} closing this week!
            </p>
            <Link
              href="/products?status=expiring_soon"
              onClick={onCloseMobile}
              className="mt-2.5 inline-block text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Review items now →
            </Link>
          </div>
        )}
      </div>

      {/* Bottom utility: Demo Data Reset & Info */}
      <div className="pt-4 border-t border-zinc-900 space-y-3">
        {isDemoMode && (
          <button
            type="button"
            onClick={resetDemoData}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}

        <div className="px-3 py-2 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>ReturnRadar v1.0</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-zinc-950 z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
