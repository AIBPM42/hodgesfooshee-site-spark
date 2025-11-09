'use client';

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

type Props = {
  openByDefault?: boolean;          // default: true
  onClose?: () => void;
  onSubmit?: (data: { firstName: string; lastName: string; email: string }) => Promise<void> | void;
};

// Hodges palette + accents (orange gradient + black/white)
const CONFETTI_COLORS = ['#FF7A32', '#FF4E1C', '#111827', '#ffffff', '#F97316'];

export default function InsiderSignupModal({
  openByDefault = true,
  onClose,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(openByDefault);
  const [loading, setLoading] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Open immediately and focus first name
  useEffect(() => {
    if (open) {
      setTimeout(() => firstNameRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const fireConfettiShow = () => {
    const duration = 3000;
    const end = Date.now() + duration;

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
      });

    // Initial bursts
    burst(0.35, { origin: { x: 0.2, y: 0.6 } });
    burst(0.35, { origin: { x: 0.8, y: 0.6 } });
    burst(0.2,  { origin: { x: 0.5, y: 0.4 }, spread: 90, startVelocity: 65, scalar: 1.1 });

    // Continuous rain
    const interval = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
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
      });
    }, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value?.trim() || '';
    const lastName = lastNameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    if (!email) return;

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ firstName, lastName, email });
      } else {
        // Default: send to leads API
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            source: 'insider_modal'
          })
        });
      }
    } catch (error) {
      console.error('Insider signup error:', error);
    } finally {
      setLoading(false);
    }

    fireConfettiShow();
    // Keep modal up for a moment so they see the celebration
    setTimeout(() => handleClose(), 900);
  };

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
      />

      {/* modal */}
      <div className="fixed inset-0 z-[1000] grid place-items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl bg-white/12
                     backdrop-blur-2xl ring-1 ring-white/25
                     shadow-[0_30px_120px_rgba(0,0,0,0.45)]
                     p-6 md:p-8 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold">
              Join Our Insider Network
            </h3>
            <p className="mt-2 text-white/80">
              Get first access to Nashville's hidden gems before they hit the market.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
              <input
                ref={firstNameRef}
                type="text"
                placeholder="First name"
                required
                className="w-full bg-transparent placeholder-white/70 text-white outline-none"
              />
            </div>
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
              <input
                ref={lastNameRef}
                type="text"
                placeholder="Last name"
                required
                className="w-full bg-transparent placeholder-white/70 text-white outline-none"
              />
            </div>
            <div className="rounded-xl bg-white/15 ring-1 ring-white/25 px-4 py-3">
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="Email address"
                className="w-full bg-transparent placeholder-white/70 text-white outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-5 py-3 font-semibold
                         text-white bg-gradient-to-r from-[#FF7A32] to-[#FF4E1C]
                         shadow-[0_10px_30px_rgba(255,110,60,0.45)]
                         transition-transform hover:-translate-y-0.5 active:translate-y-0
                         disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Get Instant Access'}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-5 py-3 font-semibold text-white/90
                         ring-1 ring-white/30 hover:bg-white/10 transition"
            >
              Not now
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
