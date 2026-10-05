import type { Config } from "tailwindcss";

/**
 * Aurora Design System — Tailwind CSS Configuration
 * Crafted for trysomenew online tools platform (177-200 tools).
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1) Brand Colours (Aurora Indigo)
        aurora: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1", // Main Brand
          600: "#4F46E5", // Primary Buttons & Links
          700: "#4338CA", // Hover State
          800: "#3730A3",
          900: "#312E81",
        },
        // Secondary (Violet)
        secondary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        // Accent / Main CTA (Orange)
        accent: {
          DEFAULT: "#FF7A1A",
          hover: "#EA6A0C",
          soft: "#FFF1E6",
        },
        // 2 & 3) Neutrals & Theme Tokens
        neutral: {
          light: {
            page: "#FFFFFF",
            section: "#F8FAFC",
            card: "#FFFFFF",
            border: "#E2E8F0",
            borderStrong: "#CBD5E1",
            heading: "#0F172A",
            body: "#334155",
            muted: "#64748B",
            placeholder: "#94A3B8",
          },
          dark: {
            page: "#0A0F1E",
            section: "#0F172A",
            card: "#131B2E",
            cardHover: "#1A2440",
            border: "#243049",
            heading: "#F8FAFC",
            body: "#CBD5E1",
            muted: "#94A3B8",
            primaryDark: "#818CF8",
          },
        },
        // 4) Status Colours
        status: {
          success: { DEFAULT: "#22C55E", bg: "#F0FDF4" },
          error: { DEFAULT: "#EF4444", bg: "#FEF2F2" },
          warning: { DEFAULT: "#F59E0B", bg: "#FFFBEB" },
          info: { DEFAULT: "#0EA5E9", bg: "#F0F9FF" },
        },
        // 5) Category Colours
        category: {
          pdf: { icon: "#EF4444", soft: "#FEE2E2" },
          image: { icon: "#10B981", soft: "#D1FAE5" },
          video: { icon: "#8B5CF6", soft: "#EDE9FE" },
          text: { icon: "#3B82F6", soft: "#DBEAFE" },
          converters: { icon: "#F97316", soft: "#FFEDD5" },
          developer: { icon: "#475569", soft: "#E2E8F0" },
          calculators: { icon: "#14B8A6", soft: "#CCFBF1" },
          seo: { icon: "#EC4899", soft: "#FCE7F3" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "-apple-system", "sans-serif"],
      },
      fontSize: {
        // Typography scale
        h1: ["52px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h1-mobile": ["36px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h2: ["36px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h3: ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        button: "12px",
        input: "14px",
        card: "18px",
        modal: "24px",
        chip: "999px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px",
        "section-desktop": "80px",
        "section-mobile": "40px",
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        "aurora-sm": "0 1px 2px rgba(15, 23, 42, 0.06)",
        "aurora-card-hover": "0 12px 30px rgba(99, 102, 241, 0.15)",
        "aurora-glow": "0 0 40px rgba(99, 102, 241, 0.25)",
        "aurora-cta": "0 6px 20px rgba(255, 122, 26, 0.35)",
        "aurora-cta-hover": "0 10px 28px rgba(255, 122, 26, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
        "hero-glow": "radial-gradient(circle at 50% 0%, #E0E7FF 0%, transparent 60%)",
        "hero-glow-dark": "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
