import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Figma Design Tokens ───────────────────────────────
      colors: {
        // App backgrounds
        "bg-primary": "#F9FAFB",
        "bg-card": "#FFFFFF",
        "bg-glass": "rgba(255,255,255,0.7)",

        // Brand
        brand: {
          emerald: "#10B981",
          teal: "#14B8A6",
          dark: "#065F46",
        },

        // Risk system
        risk: {
          low: "#10B981",       // Green — emerald
          moderate: "#F59E0B",  // Amber/Orange
          high: "#F97316",      // Orange
          severe: "#EF4444",    // Red/Crimson
        },

        // Metric card gradients (matching Figma)
        metric: {
          temp: "#F97316",       // Orange
          humidity: "#0EA5E9",   // Sky blue
          wind: "#10B981",       // Emerald
          visibility: "#8B5CF6", // Violet
        },

        // AI/ML accent
        ai: {
          purple: "#8B5CF6",
          violet: "#7C3AED",
        },

        // Lung health
        lung: "#EC4899",         // Pink

        // Alerts
        alert: {
          orange: "#F59E0B",
          blue: "#0EA5E9",
          green: "#10B981",
          purple: "#8B5CF6",
        },
      },

      // ─── Gradients ─────────────────────────────────────────
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #059669 100%)",
        "card-emerald": "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        "card-pink": "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)",
        "card-purple": "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        "card-orange": "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
        "card-sky": "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
        "card-wind": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
        "card-violet": "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
        "alert-orange": "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
      },

      // ─── Typography ────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      // ─── Border radius ─────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ─── Shadows ───────────────────────────────────────────
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.12)",
        glass: "0 8px 32px rgba(16, 185, 129, 0.15)",
      },

      // ─── Animations ────────────────────────────────────────
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
