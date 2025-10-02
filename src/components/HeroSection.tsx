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
        overflow-hidden min-h-[85vh] flex items-center pb-16
      "
    >
      {/* Full-bleed background image */}
      <img src="/hodges-hero-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* Premium dark overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.65)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-tight text-white mb-6">
          {headline.split(' ').map((word: string, idx: number) => {
            const lower = word.toLowerCase();
            if (lower.includes('nashville') || lower.includes('excellence') || lower.includes('real') || lower.includes('estate')) {
              return (
                <span key={idx} className="relative inline-block">
                  <span className="text-hf-orange">{word} </span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-hf-orange to-hf-green" />
                </span>
              );
            }
            return <span key={idx}>{word} </span>;
          })}
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium mb-10">
          {subheadline}
        </p>

        {/* Premium Glass Search Bar */}
        <div className="mt-10 max-w-5xl mx-auto">
          <SmartSearchBar onGo={handleSearch} variant="full" />
        </div>
      </div>
    </section>
  );
}