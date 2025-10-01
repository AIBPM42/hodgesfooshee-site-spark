import { useNavigate } from "react-router-dom";
import SmartSearchBar from "./SmartSearchBar";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroSectionProps {
  settings?: any;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const handleSearch = (params: Record<string, string>) => {
    trackEvent('search', { params });
    const searchParams = new URLSearchParams(params);
    navigate(`/search/properties?${searchParams.toString()}`);
  };

  const headline = settings?.headline || "Your Source for Nashville Real Estate Excellence";
  const subheadline = settings?.subheadline || "Discover exceptional properties across Middle Tennessee with Nashville's most trusted real estate experts";

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
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
          {headline.split(' ').map((word: string, idx: number) => 
            word.toLowerCase().includes('nashville') || word.toLowerCase().includes('excellence') ? (
              <span key={idx} className="text-[#FF6A2A]">{word} </span>
            ) : (
              <span key={idx}>{word} </span>
            )
          )}
        </h1>
        <p className="mt-4 text-white/85 max-w-3xl mx-auto">
          {subheadline}
        </p>

        {/* Smart Search Bar */}
        <div className="mt-8">
          <SmartSearchBar onGo={handleSearch} variant="full" />
        </div>
      </div>
    </section>
  );
}