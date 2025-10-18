import CTAButton from "./CTAButton";

export default function InsiderBand() {
  return (
    <section className="relative py-14 md:py-18 section-halo">
      <div className="mx-auto max-w-5xl text-center space-y-6 px-6">
        <h2 className="text-3xl md:text-[40px] leading-tight font-semibold text-ink">
          Join Our Insider Network
        </h2>
        <p className="text-[17px] md:text-lg text-ink/80 max-w-3xl mx-auto">
          Get exclusive access to Nashville's hidden gems before they hit the public market. Our insider network gives you the competitive edge in today's fast-moving market.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <CTAButton
            onClick={() => window.location.href = '/register'}
            icon="↗"
          >
            Get Instant Access
          </CTAButton>
          <CTAButton
            onClick={() => window.location.href = '/contact'}
            icon="📅"
          >
            Schedule Private Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
