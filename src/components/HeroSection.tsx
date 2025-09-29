export default function HeroSection(){
  return (
    <section
      className="
        relative w-screen left-[calc(50%-50vw)]
        overflow-hidden min-h-[78vh] flex items-end pb-10
      "
    >
      {/* Full-bleed background image */}
      <img src="/hero-house.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* Dark overlay for legibility (not charcoal page bg) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.30)_0%,rgba(0,0,0,.55)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
          Your Source for <span className="text-[var(--accent)]">Nashville Real Estate</span> Excellence
        </h1>
        <p className="mt-4 text-white/85 max-w-3xl mx-auto">
          Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts
        </p>

        {/* Glass search panel (keep your inputs; this is just style) */}
        <div className="search-glass mt-8 p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <button className="h-12 rounded-full px-4 bg-white/85 text-[#111] text-left">Any Type</button>
            <button className="h-12 rounded-full px-4 bg-white/85 text-[#111] text-left">All Counties</button>
            <button className="h-12 rounded-full px-4 bg-white/85 text-[#111] text-left">Min Beds</button>
            <button className="h-12 rounded-full px-4 bg-white/85 text-[#111] text-left">Min Baths</button>
            <div className="col-span-2 md:col-span-1 flex">
              <button className="btn w-full md:w-auto">Search Properties</button>
            </div>
          </div>

          {/* Price stripe */}
          <div className="mt-5 h-[4px] w-full bg-white/30 rounded-full">
            <div className="h-full w-1/2 bg-white rounded-full"></div>
          </div>
          <div className="mt-2 text-right text-white/80">$100,000 – $1,000,000</div>
        </div>
      </div>
    </section>
  );
}