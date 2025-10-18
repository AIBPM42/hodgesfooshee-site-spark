import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="sticky top-4 z-40 mx-auto w-[min(1200px,94vw)]">
      <nav className="glass rounded-3xl px-5 sm:px-7 py-3 flex items-center justify-between shadow-[0_8px_24px_rgba(16,24,40,0.14)]">
        <div className="flex items-center gap-3">
          <Image src="/favicon.svg" alt="Hodges & Fooshee" width={32} height={32} className="rounded" />
          <span className="font-semibold text-charcoal-900">Hodges & Fooshee</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-charcoal-900/90">
          <Link href="/" className="hover:text-copper-600 transition">
            Home
          </Link>
          <Link href="/search/properties" className="hover:text-copper-600 transition">
            Property Search
          </Link>
          <Link href="/open-houses" className="hover:text-copper-600 transition">
            Open Houses
          </Link>
          <Link href="/insights" className="hover:text-copper-600 transition">
            Market Insights
          </Link>
          <Link href="/contact" className="hover:text-copper-600 transition">
            Contact
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full border border-charcoal-900/20 px-4 py-1.5 text-sm hover:bg-white/30 transition">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-copper-sweep text-white px-5 py-2 text-sm shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
