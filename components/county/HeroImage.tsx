'use client';

interface HeroImageProps {
  county: string;
  tagline: string;
  lat: number;
  lng: number;
}

export default function HeroImage({ county, tagline, lat, lng }: HeroImageProps) {
  // Generate slug from county name (e.g., "Davidson County" -> "davidson-county")
  const slug = county.toLowerCase().replace(/\s+/g, '-');
  const imageUrl = `/counties/${slug}-hero.jpg`;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '500px',
        aspectRatio: '21/9'
      }}
      data-lat={lat}
      data-lng={lng}
    >
      {/* Photo Background */}
      <img
        src={imageUrl}
        alt={`${county} real estate`}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to gradient if image doesn't exist
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.style.background =
            'linear-gradient(135deg, #FBF3E7 0%, #F7E9D7 25%, #F3DCC7 50%, #EFD0B7 75%, #EBC4A7 100%)';
        }}
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(245,158,11,0.95), rgba(249,115,22,0.95), rgba(244,63,94,0.9))'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20 flex flex-col items-center justify-center text-center">
        {/* County name + AI badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8 text-sm md:text-base lg:text-lg font-medium text-white/95" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.75)' }}>
          <span>{county}</span>
          <span className="opacity-60">•</span>
          <span className="opacity-90">
            Powered by <span className="font-semibold">AI</span> · Real-Time Market Intelligence
          </span>
        </div>

        {/* Tagline - large and bold */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] max-w-5xl tracking-tight text-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.75)' }}>
          {tagline}
        </h1>
      </div>
    </div>
  );
}
