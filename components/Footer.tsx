export default function Footer() {
  return (
    <footer className="relative mt-20 bg-[#E5D8C6]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C94A1E] via-[#F2572D] to-[#FF6A3E]" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Hodges & Fooshee" className="h-8 w-8"/>
            <span className="font-semibold text-ink">Hodges & Fooshee</span>
          </div>
          <p className="text-sm leading-relaxed text-ink/80">
            Your trusted partners in Middle Tennessee real estate for over 25 years.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-ink">Quick Links</h4>
          <ul className="space-y-2 text-sm text-ink/80">
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="/search/properties">Properties</a></li>
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="/open-houses">Open Houses</a></li>
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="/insights">Market Insights</a></li>
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="/contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-ink">Services</h4>
          <ul className="space-y-2 text-sm text-ink/80">
            <li>Residential Sales</li>
            <li>Luxury Properties</li>
            <li>Investment Consulting</li>
            <li>Property Management</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 text-ink">Contact</h4>
          <ul className="space-y-2 text-sm text-ink/80">
            <li>123 Main Street, Suite 100</li>
            <li>Nashville, TN</li>
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="tel:15551234567">(555) 123-4567</a></li>
            <li><a className="hover:text-[var(--copper-600)] transition-colors" href="mailto:info@hodgesfooshee.com">info@hodgesfooshee.com</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-inkSoft text-sm py-5 border-t border-white/50">
        © {new Date().getFullYear()} Hodges & Fooshee Realty. All rights reserved.
      </div>
    </footer>
  );
}
