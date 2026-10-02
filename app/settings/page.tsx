'use client';

import React, { useState } from 'react';
import { useApp } from '../../lib/context/app-context';
import { AppLayoutWrapper } from '../../components/app-layout-wrapper';
import { CURRENCIES } from '../../lib/presets/stores';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Download, 
  RotateCcw,
  CheckCircle2, 
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    userProfile, 
    updateUserProfile, 
    products, 
    resetDemoData,
    isDemoMode
  } = useApp();

  const [profileDraft, setProfileDraft] = useState(() => ({
    id: userProfile.id,
    fullName: userProfile.fullName,
    preferredCurrency: userProfile.preferredCurrency,
    emailAlerts: userProfile.emailNotificationsEnabled
  }));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  if (profileDraft.id !== userProfile.id) {
    setProfileDraft({
      id: userProfile.id,
      fullName: userProfile.fullName,
      preferredCurrency: userProfile.preferredCurrency,
      emailAlerts: userProfile.emailNotificationsEnabled
    });
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setSavedSuccess(false);
    try {
      await updateUserProfile({
        fullName: profileDraft.fullName.trim(),
        preferredCurrency: profileDraft.preferredCurrency,
        emailNotificationsEnabled: profileDraft.emailAlerts
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Unable to save account preferences.', error);
      setProfileError(error instanceof Error ? error.message : 'Unable to save your changes right now.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `returnradar-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppLayoutWrapper>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-indigo-400" />
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure your notifications and display currency.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        {/* 1. Profile & Preferences */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">User Profile & Currency</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={profileDraft.fullName}
                  onChange={(e) => setProfileDraft((draft) => ({ ...draft, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={userProfile.email}
                  placeholder="Not signed in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800 text-zinc-400 text-xs cursor-not-allowed"
                />
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  {isDemoMode
                    ? 'Demo profile information is stored on this device.'
                    : 'This is the email address linked to your signed-in account.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Default Currency
              </label>
              <select
                value={profileDraft.preferredCurrency}
                onChange={(e) => setProfileDraft((draft) => ({ ...draft, preferredCurrency: e.target.value }))}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingProfile ? 'Saving…' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Notification Schedule */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Deadline Alerts & Reminders</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-white">Email Reminders Schedule</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Receive proactive warnings before return windows close (7 days, 3 days, and 1 day prior).
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileDraft.emailAlerts}
                onChange={(e) => setProfileDraft((draft) => ({ ...draft, emailAlerts: e.target.checked }))}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-white">Calendar Sync Integration</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Export return deadlines to Google Calendar or Apple / Outlook with 1-day advance alarms.
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* 3. Data Export & Reset */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white">Data Management</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Products as JSON</span>
            </button>

            <button
              type="button"
              onClick={resetDemoData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Restore Sample Products</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
