// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hf: {
          black: "#0B0B0B",
          orange: "#F05A28",
          purple: "#6A4C9C",
          green:  "#6BB544",
          red:    "#D94F4F",
          cream:  "#F7F4EE",
        },
      },
      boxShadow: {
        glass: "0 10px 35px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)"
      },
      backdropBlur: { 18: "18px" },
      borderRadius: { xl2: "18px" }
    }
  },
  plugins: []
} satisfies Config
