/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-ocean": "#0A121E",
        "surface-container-lowest": "#080f11",
        "surface-dim": "#0d1516",
        "surface": "#0d1516",
        "surface-container-low": "#151d1e",
        "surface-container": "#192122",
        "surface-container-high": "#242b2d",
        "surface-container-highest": "#2e3638",
        "surface-bright": "#333a3c",
        "slate-gray": "#1C2533",
        "ice-white": "#F0F4F8",
        "primary": "#c3f5ff",
        "primary-container": "#00e5ff",
        "primary-fixed-dim": "#00daf3",
        "risk-low": "#00E676",
        "risk-medium": "#FFC400",
        "risk-high": "#FF3D00",
        "safety-orange": "#FF6D00",
        "outline-variant": "#3b494c",
        "outline": "#849396",
        "on-surface": "#dce4e5",
        "on-surface-variant": "#bac9cc"
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
