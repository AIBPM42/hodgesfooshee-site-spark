"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import Link from 'next/link'
import { UserRole } from '@/lib/supabase'
import confetti from 'canvas-confetti'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'public_user' as UserRole,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Hodges palette confetti colors
  const CONFETTI_COLORS = ['#FF7A32', '#FF4E1C', '#111827', '#ffffff', '#F97316']

  const fireConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const burst = (particleRatio: number, opts = {}) =>
      confetti({
        particleCount: Math.floor(200 * particleRatio),
        spread: 70,
        startVelocity: 55,
        gravity: 0.8,
        ticks: 250,
        scalar: 0.9,
        colors: CONFETTI_COLORS,
        ...opts,
      })

    // Initial bursts
    burst(0.35, { origin: { x: 0.2, y: 0.6 } })
    burst(0.35, { origin: { x: 0.8, y: 0.6 } })
    burst(0.2, { origin: { x: 0.5, y: 0.4 }, spread: 90, startVelocity: 65, scalar: 1.1 })

    // Continuous rain
    const interval = setInterval(() => {
      const timeLeft = end - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      confetti({
        particleCount: 6 + Math.floor(Math.random() * 8),
        angle: 90,
        spread: 120,
        gravity: 1.1 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 1.2,
        ticks: 220 + Math.floor(Math.random() * 140),
        scalar: 0.6 + Math.random() * 0.9,
        colors: CONFETTI_COLORS,
        origin: { x: Math.random(), y: -0.05 },
      })
    }, 16)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.role, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      })

      // Fire confetti on success!
      fireConfetti()

      // Wait for confetti before redirecting
      setTimeout(() => {
        if (formData.role === 'agent') {
          router.push('/pending-approval')
        } else {
          router.push('/login')
        }
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to register')
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl bg-white/12 backdrop-blur-2xl ring-1 ring-white/25 shadow-[0_30px_120px_rgba(0,0,0,0.45)] p-6 md:p-10"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-white/80 text-lg">
            Join Hodges & Fooshee Realty
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-white/90 mb-2">
              I am a... *
            </label>
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-transparent text-white outline-none appearance-none cursor-pointer"
              >
                <option value="public_user" className="bg-gray-800">Buyer/Seller (Public User)</option>
                <option value="agent" className="bg-gray-800">Real Estate Agent (Requires Approval)</option>
              </select>
            </div>
            {formData.role === 'agent' && (
              <p className="text-xs text-white/60 mt-2">
                Agent accounts require approval from the broker before activation.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-semibold text-white/90 mb-2">
                First Name *
              </label>
              <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-semibold text-white/90 mb-2">
                Last Name *
              </label>
              <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
              Email *
            </label>
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-white/90 mb-2">
              Phone
            </label>
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                placeholder="(615) 555-0123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                Password *
              </label>
              <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 mb-2">
                Confirm Password *
              </label>
              <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-transparent text-white placeholder-white/70 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-6 py-4 font-semibold text-lg text-white bg-gradient-to-r from-[#FF7A32] to-[#FF4E1C] shadow-[0_10px_30px_rgba(255,110,60,0.45)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF7A32] hover:text-[#FF4E1C] font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
