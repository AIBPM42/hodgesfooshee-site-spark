import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}"
  ],
  safelist: [
    'bg-[var(--bg)]',
    'bg-[var(--sidebar)]',
    'bg-[var(--surface)]',
    'text-[var(--text-primary)]',
    'text-[var(--text-secondary)]',
    'border-[var(--border-subtle)]'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // CSS-variable backed colors for DX (hover previews + autocomplete)
        linen75: "var(--hf-linen-75)",
        porcelain: "var(--hf-porcelain-50)",
        pebble100: "var(--hf-pebble-100)",
        footer: "var(--hf-footer)",
        ink: "var(--hf-ink)",
        inkSoft: "var(--hf-ink-soft)",
        copper600: "var(--hf-copper-600)",
        // Legacy static colors (keep for compatibility)
        linen90: '#E8DCCB',
        porcelain50: '#F7F3EE',
        pebble110: '#DCCDB8',
        copper500: '#F2572D',
        copper400: '#FF6A3E',
        auburn800: '#2C343A',
        // Legacy Brand Colors (keep for compatibility)
        'hf-orange': "hsl(var(--hf-orange))",
        'hf-orange-dark': "hsl(var(--hf-orange-dark))",
        'hf-orange-light': "hsl(var(--hf-orange-light))",
        'hf-green': "hsl(var(--hf-green))",
        'hf-green-dark': "hsl(var(--hf-green-dark))",
        'hf-purple': "hsl(var(--hf-purple))",
        'hf-purple-dark': "hsl(var(--hf-purple-dark))",
        'hf-red': "hsl(var(--hf-red))",
        'hf-charcoal': {
          800: "hsl(var(--hf-charcoal-800))",
          900: "hsl(var(--hf-charcoal-900))",
        },
        // Fire 12 Hodges Brand Colors
        hodges: {
          orange: "#E87722",
          green: "#7BB241",
          purple: "#6F4DA0",
          crimson: "#C0392B",
          onyx: "#0D0F12",
          slate: "#121418",
          carbon: "#16191F",
          fog: "#1B2027",
          ink: "#0E1116",
        },
      },
      boxShadow: {
        soft: "0 6px 24px rgba(16, 24, 40, 0.06)",
        lift: "0 10px 32px rgba(16, 24, 40, 0.10)",
        glow: "0 8px 28px rgba(201, 74, 30, 0.28)",
        glass: '0 6px 24px rgba(28,32,38,.10), 0 2px 6px rgba(28,32,38,.06)',
        pill: '0 8px 18px rgba(28,32,38,.08)',
        cta: '0 14px 30px rgba(201,74,30,.22)',
        inner: "inset 0 1px 0 rgba(255,255,255,0.05)",
        ring: "0 0 0 1px rgba(255,255,255,0.07)",
        'premium': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'luxury': "0 20px 60px rgba(0, 0, 0, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "20px",
      },
      backgroundImage: {
        'glass-gradient': "var(--bg-gradient)",
        'gradient-radial': "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        'gradient-luxury': "linear-gradient(135deg, #29b6f6, #ffc107)",
        'hero-gradient': "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(17, 160, 217, 0.3))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: '0.75rem',
        '2xl': '20px',
        xl2: '1.25rem',
        xxl: '1.5rem',
      },
      fontFamily: {
        display: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        'kpi-large': ['2rem', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'kpi-medium': ['1.5rem', { lineHeight: '1', fontWeight: '600' }],
        'micro-caps': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.15em', fontWeight: '600' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glass-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "glass-float": "glass-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;