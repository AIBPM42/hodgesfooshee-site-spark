import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  // TODO: replace preview bypass with real auth
  const ENABLE_BYPASS = import.meta.env.VITE_ENABLE_ADMIN_BYPASS === 'true';

  const handleLoginClick = () => {
    if (ENABLE_BYPASS) {
      navigate('/admin/mls-sync-dashboard');
    } else {
      // (future) real auth flow
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="nav-glass flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-3">
            <img src="/logo-hf.png" alt="Hodges & Fooshee" className="h-8 w-8 rounded-md" />
            <nav className="hidden md:flex items-center gap-2">
              <a href="/" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Home</a>
              <a href="#featured" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Featured Listings</a>
              <a href="/search/properties" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Property Search</a>
              <a href="#cities" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Communities</a>
              <a href="/services" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Services</a>
              <a href="#insights" className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Market Insights</a>
              <button onClick={() => navigate('/admin')} className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">
                Admin
              </button>
            </nav>
          </div>
          {/* Right: auth */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={handleLoginClick}>Login</button>
            <button className="btn">Register</button>
          </div>
        </div>
      </div>
    </header>
  );
}