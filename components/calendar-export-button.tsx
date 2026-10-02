'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../lib/types';
import { generateGoogleCalendarUrl, downloadICalendarFile } from '../lib/utils/dates';
import { Calendar, Download, ExternalLink, ChevronDown } from 'lucide-react';

interface CalendarExportButtonProps {
  product: Product;
  type?: 'return' | 'warranty';
  className?: string;
  variant?: 'button' | 'icon';
}

export function CalendarExportButton({
  product,
  type = 'return',
  className = '',
  variant = 'button'
}: CalendarExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const googleUrl = generateGoogleCalendarUrl(product, type);

  const handleDownloadIcs = () => {
    downloadICalendarFile(product, type);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {variant === 'button' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 transition-colors"
          title="Add deadline to calendar"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Add to Calendar</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Add to calendar"
        >
          <Calendar className="w-4 h-4 text-indigo-400" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-zinc-800/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Sync {type === 'return' ? 'Return Window' : 'Warranty'}
          </div>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Calendar</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Apple / Outlook (.ics)</span>
          </button>
        </div>
      )}
    </div>
  );
}
