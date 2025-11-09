import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const county = searchParams.get("county") ?? "Davidson County";
  const lat = searchParams.get("lat") ?? "36.1627";
  const lng = searchParams.get("lng") ?? "-86.7816";
  const tagline =
    searchParams.get("tagline") ??
    "The Heart of Music City — Where Culture Meets Opportunity";

  const width = 1920;
  const height = 800;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Gradient Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #FBF3E7 0%, #F7E9D7 25%, #F3DCC7 50%, #EFD0B7 75%, #EBC4A7 100%)",
          }}
        />

        {/* Overlay with blur effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(251, 243, 231, 0.6) 0%, rgba(239, 208, 183, 0.3) 60%)",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background:
              "linear-gradient(90deg, rgba(245,158,11,0.8), rgba(249,115,22,0.8), rgba(244,63,94,0.75))",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "80px 100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          {/* County name + AI badge */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#78350f",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span>{county}</span>
            <span style={{ opacity: 0.5, fontSize: 28 }}>•</span>
            <span style={{ opacity: 0.8, fontSize: 28 }}>
              Powered by <span style={{ color: "#b45309" }}>AI</span> · Real-Time Market Intelligence
            </span>
          </div>

          {/* Tagline - large */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 1500,
              letterSpacing: "-0.02em",
              color: "#18181b",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
