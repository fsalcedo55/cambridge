/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
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
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui"), require("@headlessui/tailwindcss")],
}
