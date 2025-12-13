import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",      // Ensure HTML file is scanned
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    // Offer badge colors - ensure these dynamic classes are always included
    'bg-gradient-to-br',
    // Teal
    'from-teal-50', 'to-teal-100', 'text-teal-800', 'border-teal-300',
    'dark:from-teal-500/10', 'dark:to-teal-500/20', 'dark:text-teal-100', 'dark:border-teal-500/20', 'hover:dark:border-teal-500/30',
    // Purple  
    'from-purple-50', 'to-purple-100', 'text-purple-800', 'border-purple-300',
    'dark:from-purple-500/10', 'dark:to-purple-500/20', 'dark:text-purple-100', 'dark:border-purple-500/20', 'hover:dark:border-purple-500/30',
    // Indigo
    'from-indigo-50', 'to-indigo-100', 'text-indigo-800', 'border-indigo-300',
    'dark:from-indigo-500/10', 'dark:to-indigo-500/20', 'dark:text-indigo-100', 'dark:border-indigo-500/20', 'hover:dark:border-indigo-500/30',
    // Emerald
    'from-emerald-50', 'to-emerald-100', 'text-emerald-800', 'border-emerald-300',
    'dark:from-emerald-500/10', 'dark:to-emerald-500/20', 'dark:text-emerald-100', 'dark:border-emerald-500/20', 'hover:dark:border-emerald-500/30',
    // Slate (default)
    'from-slate-50', 'to-slate-100', 'text-slate-800', 'border-slate-300',
    'dark:from-slate-500/10', 'dark:to-slate-500/20', 'dark:text-slate-100', 'dark:border-slate-500/20', 'hover:dark:border-slate-500/30',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",     // 16px mobile
        sm: "1.25rem",       // 20px mobile-large  
        md: "1.5rem",        // 24px tablet
        lg: "2rem",          // 32px desktop
        xl: "2.5rem",        // 40px large desktop
        "2xl": "4rem",       // 64px extra large
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "pulse-once": {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        "fadeInSlow": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "softBounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "like": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.2)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-once": "pulse-once 0.8s ease-in-out",
        "fadeInSlow": "fadeInSlow 1.2s ease forwards",
        "softBounce": "softBounce 2.2s ease-in-out infinite",
        "like": "like 0.6s ease-in-out",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in-scale": "fade-in-scale 0.4s cubic-bezier(0.2, 0.0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [animate],
} satisfies Config;