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
        'luxury-gold': 'hsl(var(--luxury-gold))',
        'luxury-gold-foreground': 'hsl(var(--luxury-gold-foreground))',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: "0 10px 35px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
        card: "0 4px 20px -4px hsl(var(--primary) / 0.1)",
        premium: "0 20px 60px -10px hsl(var(--primary) / 0.4)",
        luxury: "0 10px 40px -10px hsl(var(--luxury-gold) / 0.3)",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
        'gradient-luxury': 'linear-gradient(135deg, hsl(var(--luxury-gold)), hsl(var(--primary)))',
        'gradient-hero': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: { 18: "18px" },
      borderRadius: { xl2: "18px" }
    }
  },
  plugins: []
} satisfies Config
