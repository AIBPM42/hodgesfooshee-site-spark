import { useNavigate } from "react-router-dom";
import SmartSearchBar from "./SmartSearchBar";

export default function HeroSection(){
  const navigate = useNavigate();

  const handleSearch = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    navigate(`/search/properties?${searchParams.toString()}`);
  };

  return (
    <section
      className="
        relative w-screen left-[calc(50%-50vw)]
        overflow-hidden min-h-[78vh] flex items-end pb-10
      "
    >
      {/* Full-bleed background image */}
      <img src="/hodges-hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* Dark overlay for legibility (not charcoal page bg) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.30)_0%,rgba(0,0,0,.55)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
          Your Source for <span className="text-[#FF6A2A]">Nashville Real Estate</span> Excellence
        </h1>
        <p className="mt-4 text-white/85 max-w-3xl mx-auto">
          Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts
        </p>

        {/* Smart Search Bar */}
        <div className="mt-8">
          <SmartSearchBar onGo={handleSearch} variant="full" />
        </div>
      </div>
    </section>
  );
}