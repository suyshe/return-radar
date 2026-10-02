'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
Radar,
ArrowRight,
Sparkles,
AlertCircle,
Eye,
EyeOff,
} from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();

setLoading(true);
setError(null);

try {
  const supabase = createClient();

  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (signInError) {
    setError(signInError.message);
    setLoading(false);
    return;
  }

  router.push('/dashboard');
  router.refresh();
} catch (err) {
  console.error(err);

  setError(
    'Unable to sign in right now. Please check your connection and try again.'
  );

  setLoading(false);
}


};

const handleDemoLogin = () => {
router.push('/dashboard');
};

return (
<div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

  <div className="w-full max-w-md space-y-6 relative z-10">
    <div className="text-center">
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
          <Radar className="h-6 w-6 text-white" />
        </div>

        <span className="font-bold text-2xl tracking-tight text-white">
          Return<span className="text-indigo-400">Radar</span>
        </span>
      </Link>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
        Log in to your account
      </h2>

      <p className="mt-1 text-xs text-zinc-400">
        Monitor return windows, warranties, and save money
      </p>
    </div>

    <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>

          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[11px] text-indigo-400 hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Logging in...' : 'Sign In'}
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>

        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
            Or Instant Preview
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center justify-center gap-2 group"
      >
        <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>Enter as Guest (Demo Mode)</span>
      </button>
    </div>

    <p className="text-center text-xs text-zinc-400">
      Don't have an account yet?{' '}
      <Link
        href="/signup"
        className="font-semibold text-indigo-400 hover:text-indigo-300"
      >
        Sign up for free
      </Link>
    </p>
  </div>
</div>


);
}