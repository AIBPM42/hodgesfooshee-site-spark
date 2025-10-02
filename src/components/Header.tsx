import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `px-3 py-2 rounded-full hover:bg-white/10 text-white/90 transition ${isActive ? 'bg-white/10' : ''}`;

  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="nav-glass flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-3">
            <img src="/logo-hf.png" alt="Hodges & Fooshee" className="h-8 w-8 rounded-md" />
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/" end className={linkClass}>Home</NavLink>
              <a href="#featured" onClick={(e) => handleHashClick(e, 'featured')} className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Featured Listings</a>
              <NavLink to="/search/properties" className={linkClass}>Property Search</NavLink>
              <a href="#cities" onClick={(e) => handleHashClick(e, 'cities')} className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Communities</a>
              <NavLink to="/services" className={linkClass}>Services</NavLink>
              <a href="#insights" onClick={(e) => handleHashClick(e, 'insights')} className="px-3 py-2 rounded-full hover:bg-white/10 text-white/90">Market Insights</a>
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            </nav>
          </div>
          {/* Right: auth */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => navigate('/login')}>Login</button>
            <button className="btn">Register</button>
          </div>
        </div>
      </div>
    </header>
  );
}