/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{vue,ts}", "./public/index.html"],
  theme: {
    extend: {
      width: {
        '5.5': '1.375rem',
      },
      height: {
        '5.5': '1.375rem',
      }
    },
  },
  plugins: [],
}