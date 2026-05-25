import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        sphere: {
          juridico: "#1B2A4A",
          investimentos: "#1F7A4D",
          criativa: "#C4612F",
          geral: "#5B6470",
        },
      },
    },
  },
  plugins: [],
};
export default config;
