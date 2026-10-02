'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
Radar,
ArrowRight,
Sparkles,
AlertCircle,
CheckCircle2,
Eye,
EyeOff,
} from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function SignupPage() {
const router = useRouter();

const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);

const handleSignup = async (e: React.FormEvent) => {
e.preventDefault();

setLoading(true);
setError(null);
setSuccess(false);

try {
  const supabase = createClient();
  if (!supabase) {
    setError('Supabase is not configured. Please contact support.');
    setLoading(false);
    return;
  }

  const { data, error: signUpError } =
    await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

if (signUpError) {
  const message = signUpError.message.toLowerCase();

  if (
    message.includes('rate limit') ||
    message.includes('email rate limit')
  ) {
    setError(
      'Too many verification emails were requested. Please wait a little while before trying again.'
    );
  } else if (message.includes('already registered')) {
    setError(
      'An account with this email already exists. Try logging in instead.'
    );
  } else {
    setError(signUpError.message);
  }

  setLoading(false);
  return;
}


  // If Supabase requires email verification,
  // there will be a user but no active session.
  if (data.user && !data.session) {
    setSuccess(true);
    setLoading(false);
    return;
  }

  // If email confirmation is disabled,
  // Supabase may create a session immediately.
  if (data.session) {
    router.push('/dashboard');
    router.refresh();
    return;
  }

  setSuccess(true);
  setLoading(false);
} catch (err) {
  console.error(err);

  setError(
    'Unable to create your account right now. Please try again.'
  );

  setLoading(false);
}


};

const handleDemoMode = () => {
router.push('/dashboard');
};

if (success) {
return (
<div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

    <div className="w-full max-w-md relative z-10">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Radar className="h-6 w-6 text-white" />
          </div>

          <span className="font-bold text-2xl tracking-tight text-white">
            Return<span className="text-indigo-400">Radar</span>
          </span>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </div>

        <h1 className="text-xl font-bold text-white">
          Check your email
        </h1>

        <p className="mt-2 text-sm text-zinc-400 leading-6">
          We sent a verification link to{' '}
          <span className="text-zinc-200 font-medium">
            {email}
          </span>
          . Verify your email before logging in.
        </p>

        <Link
          href="/login"
          className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          Continue to Login
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  </div>
);


}

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
        Create your free account
      </h2>

      <p className="mt-1 text-xs text-zinc-400">
        Start tracking return deadlines and never lose money on returns again.
      </p>
    </div>

    <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>

          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

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
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>

        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
            Or Quick Test Drive
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDemoMode}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center justify-center gap-2 group"
      >
        <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>Try Instant Demo Mode</span>
      </button>
    </div>

    <p className="text-center text-xs text-zinc-400">
      Already have an account?{' '}
      <Link
        href="/login"
        className="font-semibold text-indigo-400 hover:text-indigo-300"
      >
        Log in
      </Link>
    </p>
  </div>
</div>


);
}