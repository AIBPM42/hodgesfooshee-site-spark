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

// Play realistic confetti popper sound using HTML5 Audio
function playConfettiSound() {
  try {
    // Use the local confetti sound file provided by user
    const soundUrl = '/confetti-pop.mp3';

    // Play multiple confetti pops over 3 seconds to match the visual confetti
    const playPop = (delay: number, volume: number) => {
      setTimeout(() => {
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.playbackRate = 1 + (Math.random() * 0.2 - 0.1); // Slight variation in pitch

        // Attempt to play with detailed error logging
        audio.play()
          .then(() => console.log(`✅ Pop ${delay}ms played successfully`))
          .catch(e => {
            console.error(`❌ Audio play error at ${delay}ms:`, e);
            console.error('Error name:', e.name);
            console.error('Error message:', e.message);
          });
      }, delay);
    };

    // Fire 5 pops over 3 seconds with varying volumes
    console.log('🎉 Starting confetti pops...');
    playPop(0, 0.7);      // Initial burst
    playPop(200, 0.6);    // Second pop
    playPop(450, 0.5);    // Third pop
    playPop(800, 0.4);    // Fourth pop
    playPop(1200, 0.3);   // Final pop
  } catch (e) {
    console.error('Audio initialization error:', e);
  }
}

export default function InsiderSignupModal({
  openByDefault = true,
  onClose,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(openByDefault);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    // Play confetti pop sound
    playConfettiSound();

    // Fire LOTS of confetti cannon bursts from behind the form
    const shootConfetti = (delay: number, originX: number) => {
      setTimeout(() => {
        // Each burst fires 200 particles (double the previous amount)
        confetti({
          particleCount: 200,
          angle: 60 + (Math.random() * 60), // Shoot upward at varying angles
          spread: 100,
          origin: { x: originX, y: 1 }, // From bottom
          startVelocity: 60,
          gravity: 0.8,
          ticks: 350,
          scalar: 1.3,
          colors: CONFETTI_COLORS,
          zIndex: 999, // Behind modal (modal is z-1000)
        });
      }, delay);
    };

    // Fire confetti bursts synchronized with sound pops - LOTS of cannons!
    shootConfetti(0, 0.1);        // Far left
    shootConfetti(0, 0.3);        // Left
    shootConfetti(0, 0.5);        // Center
    shootConfetti(0, 0.7);        // Right
    shootConfetti(0, 0.9);        // Far right

    shootConfetti(200, 0.2);      // Second burst wave
    shootConfetti(200, 0.5);
    shootConfetti(200, 0.8);

    shootConfetti(450, 0.15);     // Third burst wave
    shootConfetti(450, 0.4);
    shootConfetti(450, 0.6);
    shootConfetti(450, 0.85);

    shootConfetti(800, 0.25);     // Fourth burst wave
    shootConfetti(800, 0.5);
    shootConfetti(800, 0.75);

    shootConfetti(1200, 0.3);     // Final burst wave
    shootConfetti(1200, 0.5);
    shootConfetti(1200, 0.7);
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

    // Show success card immediately
    setSubmitted(true);
    fireConfettiShow();

    // Close after 3 seconds of confetti
    setTimeout(() => handleClose(), 3000);
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
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-3xl bg-white/12
                       backdrop-blur-2xl ring-1 ring-white/25
                       shadow-[0_30px_120px_rgba(0,0,0,0.45)]
                       p-6 md:p-8 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Join Our Insider Network
              </h3>
              <p className="mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
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
        ) : (
          <div
            className="w-full max-w-xl rounded-3xl bg-white
                       shadow-[0_30px_120px_rgba(0,0,0,0.45)]
                       p-8 md:p-12 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A32] to-[#FF4E1C]
                            flex items-center justify-center shadow-[0_10px_30px_rgba(255,110,60,0.4)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              You're In!
            </h3>

            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to the Insider Network. We'll notify you the moment exclusive properties become available.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
