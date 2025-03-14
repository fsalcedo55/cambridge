/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0175BC",
          "primary-content": "#011D2F",
          secondary: "#DD4535",
          accent: "#F4B617",
          neutral: "#F7F7F7",
          "base-100": "#FFFFFF",
          "base-200": "#DCEEFB",
          "base-300": "#B6E0FE",
          "base-content": "#003E6B",
          error: "#DD4535",
        },
      },
      "cmyk",
    ],
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#DCEEFB",
          100: "#B6E0FE",
          200: "#84C5F4",
          300: "#62B0E8",
          400: "#4098D7",
          500: "#2680C2",
          600: "#186FAF",
          700: "#0F609B",
          800: "#0A558C",
          900: "#003E6B",
        },
        secondary: {
          50: "#FFFBEA",
          100: "#FFF3C4",
          200: "#FCE588",
          300: "#FADB5F",
          400: "#F7C948",
          500: "#F0B429",
          600: "#DE911D",
          700: "#CB6E17",
          800: "#B44D12",
          900: "#8D2B0B",
        },
        neutral: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#243B53",
          900: "#102A43",
        },
        accent: {
          50: "#E0FCFF",
          100: "#BEF8FD",
          200: "#87EAF2",
          300: "#54D1DB",
          400: "#38BEC9",
          500: "#2CB1BC",
          600: "#14919B",
          700: "#0E7C86",
          800: "#0A6C74",
          900: "#044E54",
        },
        danger: {
          50: "#FFEEEE",
          100: "#FACDCD",
          200: "#F29B9B",
          300: "#E66A6A",
          400: "#D64545",
          500: "#BA2525",
          600: "#A61B1B",
          700: "#911111",
          800: "#780A0A",
          900: "#610404",
        },
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        "open-sans": ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/forms"),
  ],
}
