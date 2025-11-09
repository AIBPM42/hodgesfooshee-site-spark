'use client';

import * as React from 'react';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// ---------- form schema ----------
const SignInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type SignInInput = z.infer<typeof SignInSchema>;

// ---------- UI ----------
export default function SignInPage() {
  const supabase = createClientComponentClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInInput>({ resolver: zodResolver(SignInSchema) });

  const [msg, setMsg] = React.useState<string | null>(null);

  async function onSubmit(values: SignInInput) {
    setMsg(null);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError('password', { message: 'Invalid email or password' });
      setMsg(error.message);
      return;
    }

    // Wait a moment for session to be established, then redirect based on role
    if (data.session) {
      // Fetch user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      // Redirect based on role
      const redirectPath =
        profile?.role === 'super_admin' || profile?.role === 'broker' || profile?.role === 'admin'
          ? '/admin'
          : '/dashboard';

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-porcelain">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-3xl shadow-[0_30px_120px_rgba(0,0,0,0.12)] p-6 md:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-copper-sweep text-white shadow-lg">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--hf-ink)' }}>
              Hodges Sign In
            </h1>
            <p className="text-lg" style={{ color: 'var(--sub)' }}>
              Access your Hodges & Fooshee dashboard
            </p>
          </div>

          <div className="space-y-4">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--hf-ink)' }}>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
              </label>
              <div className="input-glass rounded-xl px-4 py-3">
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  className="w-full bg-transparent outline-none"
                  style={{ color: 'var(--hf-ink)' }}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--hf-ink)' }}>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </div>
              </label>
              <div className="input-glass rounded-xl px-4 py-3">
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none"
                  style={{ color: 'var(--hf-ink)' }}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-sm" style={{ color: 'var(--sub)' }}>
              <a href="/auth/forgot" className="link-ux transition underline-offset-4 hover:underline">
                Forgot password?
              </a>
              <a href="/register" className="link-ux transition underline-offset-4 hover:underline">
                Create account
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-copper w-full rounded-xl px-6 py-4 font-semibold text-lg text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </button>

            <div className="relative my-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full rounded-xl px-6 py-3 font-medium bg-white/60 border hover:bg-white/80 transition flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--border)', color: 'var(--hf-ink)' }}
            >
              <ShieldCheck className="h-5 w-5" />
              Continue with Google
            </button>

            {msg && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center text-sm">
                {msg}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-xs" style={{ color: 'var(--sub)' }}>
            Protected area • Audit logged • v1.0
          </div>
        </form>
      </div>
    </div>
  );
}
