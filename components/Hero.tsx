"use client";

export default function Hero() {
  return (
    <section className="relative -mt-10 md:-mt-14">
      <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <img
          src="/hodges-hero-bg.jpg"
          alt="Nashville luxury home"
          className="h-[58vh] md:h-[72vh] w-full object-cover"
        />
        {/* dark->light veil for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
        {/* centered title */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 md:px-10">
          <h1 className="mx-auto max-w-5xl text-center font-serif tracking-tight text-white text-4xl md:text-6xl leading-tight text-shadow-lg">
            Your Source for <span className="text-copper-500">Nashville Real Estate</span> Excellence
          </h1>
          <p className="mt-4 text-center text-white/85 text-base md:text-lg">
            Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts.
          </p>
        </div>
      </div>
    </section>
  );
}
