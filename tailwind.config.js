/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0175BC",
          "primary-content": "#ffffff",
          secondary: "#DD4535",
          accent: "#F4B617",
          neutral: "#F7F7F7",
          "base-100": "#ffffff",
          "base-200": "#E6E6E6",
          "base-300": "#CFCFCF",
          "base-content": "#292929",
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
