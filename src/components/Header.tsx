export default function Header() {
  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="nav-glass flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-3">
            <img src="/logo-hf.png" alt="Hodges & Fooshee" className="h-8 w-8 rounded-md" />
            <nav className="hidden md:flex items-center gap-2">
              {['Home','Featured Listings','Property Search','Communities','Our Services','Market Insights','About','Contact'].map(x=>(
                <a key={x} href="#" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">{x}</a>
              ))}
            </nav>
          </div>
          {/* Right: auth */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost">Login</button>
            <button className="btn">Register</button>
          </div>
        </div>
      </div>
    </header>
  );
}