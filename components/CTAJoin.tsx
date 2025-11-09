"use client";
import useConfetti from "./ConfettiCelebration";

export default function CTAJoin() {
  const { fire } = useConfetti();

  return (
    <div className="text-center section-tight py-16">
      <h2 className="text-4xl md:text-5xl font-extrabold text-charcoal-900">
        Join Our Insider Network
      </h2>
      <p className="mt-4 max-w-3xl mx-auto text-charcoal-900/80 text-lg">
        Get exclusive access to Nashville&apos;s hidden gems before they hit the public market. Our
        insider network gives you the competitive edge in today&apos;s fast-moving market.
      </p>

      <div className="mt-7 flex items-center justify-center gap-4 flex-wrap">
        <button
          className="glass-strong rounded-full px-6 py-3 text-white bg-copper-sweep shadow-[0_14px_35px_rgba(242,87,45,.35)] hover:shadow-[0_18px_45px_rgba(242,87,45,.45)] transition font-semibold"
          onClick={() => {
            fire();
            // Route to registration or open form modal
            setTimeout(() => {
              window.location.href = "/register";
            }, 500);
          }}
        >
          Get Instant Access
        </button>
        <button
          className="glass rounded-full px-6 py-3 text-charcoal-900 hover:bg-white/40 transition font-medium"
          onClick={() => {
            // Open consultation form
            window.location.href = "/contact";
          }}
        >
          Schedule Private Consultation
        </button>
      </div>
    </div>
  );
}
