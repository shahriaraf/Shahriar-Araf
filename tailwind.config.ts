import type { Config } from "tailwindcss";

const config: Config = {
  // NOTE: these paths used to point at "./src/pages", "./src/components",
  // "./src/app" — folders that do not exist in this project (the app uses
  // "app/" and "components/" at the project root, no "src/" folder). Tailwind
  // v4 has automatic content detection as a fallback, which is why things
  // still worked, but pointing this at the real folders is faster and more
  // reliable than relying on the fallback scan.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "hologram-scan": {
          "0%, 100%": {
            transform: "translateY(-10%) translateX(0)",
            opacity: "0.5",
          },
          "50%": { transform: "translateY(10%) translateX(-5%)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
      },
      animation: {
        hologram: "hologram-scan 4s ease-in-out infinite",
        "glow-pulse": "pulse-glow 3s ease-in-out infinite alternate",
      },
      fontFamily: {
        // Only the fonts actually used in the app are mapped here. Oxanium,
        // Roboto Mono, and Rubik Glitch used to be mapped to `cyber`, `mono`,
        // and `glitch` here, but nothing in the codebase ever used those
        // utility classes, and the underlying next/font loaders for them
        // have been removed from layout.tsx.
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
