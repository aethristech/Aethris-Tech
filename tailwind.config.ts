import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
      colors: {
        aether: {
          grid: "rgba(0,0,0,0.03)",
        },
        cobalt: {
          DEFAULT: "#2E5BFF",
          dark: "#1A3FB5",
          light: "#7090FF",
        },
        silver: {
          lightest: "#F9FAFB",
          light: "#F3F4F6",
          mid: "#E5E7EB",
          dark: "#9CA3AF",
          darker: "#4B5563",
        },
        charcoal: "#1F2937",
        black: {
          deep: "#050505",
          light: "#111827",
        },
      },
    },
  },
  plugins: [],
};
export default config;
