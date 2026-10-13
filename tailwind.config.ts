import type { Config } from "tailwindcss";

// RERUN palette: a late-night TV set. Black glass (ink), warm phosphor text (bone),
// tape orange (pulse) for actions, label amber (ember) for highlights, and the
// "no signal" blue (signal) for small broadcast accents. Up/down stay semantic.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0C", 2: "#0F1013" },
        panel: { DEFAULT: "#121317", 2: "#181A1F", 3: "#21242B" },
        line: { DEFAULT: "#25272E", strong: "#363944" },
        bone: { DEFAULT: "#F1EBDD", dim: "#B4AE9F" },
        muted: "#878393",
        pulse: { DEFAULT: "#FF6A1A", deep: "#E0520B", ink: "#1E0900" },
        ember: { DEFAULT: "#FFC23D", deep: "#F0A800" },
        signal: { DEFAULT: "#4D6BFF", soft: "#8EA2FF" },
        up: "#3DDC97",
        down: "#FF5470",
        warn: "#FFC23D",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,106,26,.4), 0 10px 30px -10px rgba(255,106,26,.5)",
      },
      keyframes: {
        beat: {
          "0%,100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.15)" },
          "45%": { transform: "scale(.97)" },
        },
        blink: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0.15" },
        },
        "rewind-in": {
          from: { transform: "translateX(6px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        trace: {
          from: { strokeDashoffset: "240" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        beat: "beat .6s ease-out",
        blink: "blink 1.2s steps(1) infinite",
        trace: "trace 2.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
