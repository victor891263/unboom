/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{vue,ts}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily:  {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}