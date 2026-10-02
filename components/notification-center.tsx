'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../lib/context/app-context';
import { Bell, Check, Clock, AlertTriangle, ShieldCheck, Sparkles, CheckCheck } from 'lucide-react';
import { formatDate } from '../lib/utils/dates';

export function NotificationCenter() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    products,
    userProfile 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-zinc-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2 opacity-50" />
                No notifications right now. You're all caught up!
              </div>
            ) : (
              notifications.map((item) => {
                const isUrgent = item.daysLeft !== undefined && item.daysLeft <= 3;

                return (
                  <div
                    key={item.id}
                    onClick={() => markNotificationAsRead(item.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                      item.isRead ? 'bg-zinc-900/50 hover:bg-zinc-800/30' : 'bg-indigo-950/20 hover:bg-indigo-950/40'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : item.type === 'return_deadline'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {isUrgent ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : item.type === 'warranty_deadline' ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-semibold truncate ${
                          item.isRead ? 'text-zinc-300' : 'text-white'
                        }`}>
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Notification settings reminder */}
          <div className="p-2.5 bg-zinc-950/80 border-t border-zinc-800 text-center">
            <span className="text-[11px] text-zinc-400">
              Email alerts scheduled for 7, 3, and 1 day before expiration.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
