import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-noe)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        noe: ["var(--font-noe)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        woranz: {
          ink: "#1A1A2E",
          slate: "#2E3547",
          text: "#6B7280",
          muted: "#9CA3AF",
          light: "#C4C4C4",
          yellow: "#FFE016",
          "yellow-hover": "#F5D800",
          warm: {
            1: "#FBF9F6",
            2: "#F9F7F4",
            3: "#F3F1EE",
            4: "#F0EDE8",
          },
          divider: "#E4E4E7",
          line: "#E8E4DF",
          border: "#E5E7EB",
          soft: "#1A1A2E1A",
        },
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
      },
      fontSize: {
        micro: [
          "0.5625rem",
          {
            lineHeight: "1.4",
          },
        ],
        fine: [
          "0.6875rem",
          {
            lineHeight: "1.4",
          },
        ],
        "display-mobile": [
          "2rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.03125rem",
            fontWeight: "700",
          },
        ],
        display: [
          "4.5rem",
          {
            lineHeight: "1.05",
            letterSpacing: "-0.0625rem",
            fontWeight: "800",
          },
        ],
        "section-mobile": [
          "1.75rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.03125rem",
            fontWeight: "700",
          },
        ],
        section: [
          "2.75rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.0625rem",
            fontWeight: "700",
          },
        ],
        "card-mobile": [
          "1.25rem",
          {
            lineHeight: "1.2",
            fontWeight: "700",
          },
        ],
        card: [
          "1.625rem",
          {
            lineHeight: "1.15",
            fontWeight: "600",
          },
        ],
        lead: [
          "1.1875rem",
          {
            lineHeight: "1.5",
          },
        ],
        body: [
          "0.9375rem",
          {
            lineHeight: "1.5",
          },
        ],
        "body-lg": [
          "1.0625rem",
          {
            lineHeight: "1.5",
          },
        ],
        label: [
          "0.8125rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.03125rem",
            fontWeight: "600",
          },
        ],
        legal: [
          "0.625rem",
          {
            lineHeight: "1.4",
          },
        ],
        "quote-price": [
          "2.5rem",
          {
            lineHeight: "1",
            letterSpacing: "-0.125rem",
            fontWeight: "700",
          },
        ],
      },
      spacing: {
        "page-mobile": "1.5rem",
        page: "5rem",
        "page-wide": "7.5rem",
        "section-mobile": "3rem",
        section: "5rem",
        "section-sm": "5rem",
        "section-xs": "4rem",
        hero: "2.5rem",
        "hero-top": "2.5rem",
        card: "1.5rem",
        "card-lg": "2rem",
        "button-y": "1.125rem",
        field: "1.25rem",
        "field-lg": "1.5rem",
        "field-wide": "17.5625rem",
        "avatar-lg": "3.25rem",
        "qr-mobile": "1.875rem",
        qr: "2.4375rem",
      },
      maxWidth: {
        page: "90rem",
        content: "75rem",
        "content-wide": "80rem",
        copy: "33.75rem",
        faq: "44.6875rem",
        hero: "75rem",
        "hero-copy": "50rem",
        quoter: "50rem",
        "quoter-mobile": "100%",
        cta: "37.5rem",
        "field-lg": "17.5625rem",
        package: "22.5rem",
        feature: "22.5rem",
        "feature-mobile": "16.25rem",
      },
      minWidth: {
        field: "8.75rem",
        "field-lg": "17.5625rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        pill: "9999px",
        field: "0.75rem",
        button: "0.5rem",
        "button-mobile": "0.625rem",
      },
      boxShadow: {
        panel: "0 0.75rem 2.5rem rgba(0, 0, 0, 0.04)",
        quoter: "0 0.5rem 2rem rgba(0, 0, 0, 0.1)",
        elevated: "0 12px 40px rgba(0, 0, 0, 0.06)",
        button: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.12)",
      },
      letterSpacing: {
        step: "-0.125rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
