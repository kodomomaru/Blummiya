import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: {
          DEFAULT: "#0f172a",
          subtle: "#1e293b",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(148, 163, 184, 0.12)",
        },
        bloom: {
          emerald: "#10b981",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          violet: "#a855f7",
          rose: "#f43f5e",
        },
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(16, 185, 129, 0.3)",
        "glow-md": "0 0 25px -2px rgba(16, 185, 129, 0.4)",
        "glow-lg": "0 0 45px 0px rgba(16, 185, 129, 0.35)",
        "glow-cyan": "0 0 30px -4px rgba(6, 182, 212, 0.45)",
        "glow-amber": "0 0 30px -4px rgba(245, 158, 11, 0.45)",
        "glow-violet": "0 0 30px -4px rgba(168, 85, 247, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-gentle": "float 6s ease-in-out infinite",
        "glow-flare": "flare 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        flare: {
          "0%": { opacity: "0.6", filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))" },
          "100%": { opacity: "1", filter: "drop-shadow(0 0 22px rgba(6, 182, 212, 0.8))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

