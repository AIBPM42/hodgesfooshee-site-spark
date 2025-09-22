// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hf: {
          orange:  '#F04F23', // logo orange
          purple:  '#6F3FA0', // logo purple
          green:   '#7BB542', // logo green
          yellow:  '#F0B323', // logo yellow
          black:   '#121212',
          ink:     '#0B0B0B',
          smoke:   '#0F0F0F',
          glass:   'rgba(12,12,12,0.35)'
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
