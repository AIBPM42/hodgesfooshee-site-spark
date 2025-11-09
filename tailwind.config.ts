import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // AICA-style neutrals
        porcelain: "#F7F6F4",      // light canvas
        ink: {
          950: "#0F1216",         // dark canvas
          900: "#13171C",
          800: "#171B21",
        },
        card: {
          light: "#FFFFFF",
          dark: "#121519",
        },
        // Accent (your orange)
        brand: {
          50:  "#FFF4EC",
          100: "#FFE6D6",
          200: "#FFC8AE",
          300: "#FFA07B",
          400: "#FF7F52",
          500: "#FF6A3D",
          600: "#F1582A",
          700: "#C4431E",
          800: "#9C3518",
          900: "#742812",
        },
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,.04), 0 10px 20px rgba(0,0,0,.06)",
        cardDark: "0 1px 1px rgba(0,0,0,.25), 0 12px 24px rgba(0,0,0,.35)",
        glass: "0 1px 0 rgba(255,255,255,.6), 0 12px 28px rgba(0,0,0,.12)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      backdropBlur: {
        18: "18px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
