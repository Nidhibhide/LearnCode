const {heroui} = require("@heroui/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': 'var(--white)',
        'dark-gray': 'var(--dark-gray)',
        'medium-gray': 'var(--medium-gray)',
        'black': 'var(--black)',
        'light-gray-border': 'var(--light-gray-border)',
        'light-gray-hover': 'var(--light-gray-hover)',
        'dark-gray-hover': 'var(--dark-gray-hover)',
        'light-blue': 'var(--light-blue)',
        'blue-150': 'var(--blue-150)',
      },
    },
  },
    darkMode: "class",
  plugins: [heroui()],
}