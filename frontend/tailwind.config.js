/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B192C",
          800: "#1E3E62",
          700: "#2B4C7E",
        },
        trust: {
          DEFAULT: "#1E56A0",
          dark: "#163172",
          light: "#F1F5F9",
        },
        saffron: {
          DEFAULT: "#D97706",
          high: "#EA580C",
          light: "#FEF3C7",
        },
        bisgreen: {
          DEFAULT: "#15803D",
          dark: "#166534",
          light: "#DCFCE7",
        },
        surface: {
          base: "#FFFFFF",
          canvas: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        }
      },
      fontFamily: {
        sans: ["Public Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
