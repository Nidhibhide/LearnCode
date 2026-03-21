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
        // Primary colors
        primary: '#000000',
        'primary-hover': '#1a1a1a',
        secondary: '#ffffff',
        
        // Background colors
        'bg-primary': '#ffffff',
        'bg-secondary': '#f5f5f5',
        'bg-tertiary': '#e5e5e5',
        
        // Text colors  
        'text-primary': '#000000',
        'text-secondary': '#555555',
        'text-muted': '#777777',
        'text-light': '#999999',
        
        // Border colors
        'border-light': '#e5e5e5',
        'border-medium': '#d4d4d4',
        'border-dark': '#a3a3a3',
        
        // Button colors
        'btn-primary': '#000000',
        'btn-primary-hover': '#262626',
        'btn-secondary': '#404040',
        'btn-outline': '#000000',
        
        // Status colors (black-white theme)
        success: '#171717',
        'success-bg': '#e5e5e5',
        warning: '#262626',
        'warning-bg': '#e5e5e5', 
        error: '#000000',
        'error-bg': '#e5e5e5',
        info: '#171717',
        'info-bg': '#e5e5e5',
        
        // Accent
        accent: '#000000',
        'accent-hover': '#262626',
      },
    },
  },
    darkMode: "class",
  plugins: [heroui()],
}
