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
        // Premium Brand Colors
        brand: {
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
        },
        'luxury-gold': "hsl(var(--luxury-gold))",
        // H&F Brand Colors (HSL)
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
        'hf-text': "hsl(var(--hf-text-primary))",
        // Glass Utilities
        glass: {
          primary: "var(--glass-primary)",
          secondary: "var(--glass-secondary)",
          card: "var(--glass-card)",
          nav: "var(--glass-nav)",
          border: "var(--glass-border)",
        },
        // Text Colors
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          accent: "var(--text-accent)",
        },
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
        'glass-glow': "var(--glass-glow)",
        'premium': "0 8px 32px rgba(17, 160, 217, 0.15)",
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
      },
      fontFamily: {
        display: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
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
        "glass-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "glass-float": "glass-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;