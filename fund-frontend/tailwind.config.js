/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: "#F5F6F8",
          surface: "#FFFFFF",
          border: "#E3E7ED",
          ink: "#0E1B33",
          navy: {
            50: "#EEF1F7",
            100: "#D7DEEC",
            300: "#8496BE",
            500: "#2C4270",
            700: "#16264A",
            900: "#0B1530",
          },
          slate: {
            400: "#8A93A6",
            500: "#6B7385",
            600: "#4E5768",
          },
          teal: {
            500: "#0F7A6E",
            600: "#0B6058",
          },
          amber: {
            500: "#B4790F",
            600: "#8F5F0B",
          },
          red: {
            500: "#B4322F",
            600: "#912723",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(14, 27, 51, 0.04), 0 1px 3px 0 rgba(14, 27, 51, 0.06)",
        raised: "0 4px 16px -4px rgba(14, 27, 51, 0.12)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
