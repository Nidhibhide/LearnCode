const { heroui } = require("@heroui/react");
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
        // 🔵 BRAND COLORS (main theme)
        primary: "#3B82F6", // default button, links (blue-500)
        primaryHover: "#2563EB", // hover state (blue-600)
        primaryDark: "#1D4ED8", // active/pressed (blue-700)

        // 💜 SECONDARY (purple)
        secondary: "#9333EA", // purple-600
        secondaryHover: "#7E22CE", // purple-700
        secondaryDark: "#6B21A8", // purple-800
        secondaryBg: "#F3E8FF", // purple-100

        // ⚪ BACKGROUND COLORS
        background: "#F3F4F6", // page background (gray-100)
        surface: "#FFFFFF", // cards, modals, containers
        surfaceAlt: "#F9FAFB", // subtle sections (gray-50)

        // 📝 TEXT COLORS
        textPrimary: "#111827", // main text (gray-900)
        textSecondary: "#6B7280", // secondary text (gray-500/600)
        textMuted: "#9CA3AF", // placeholder / disabled (gray-400)

        // 🔲 BORDER COLORS
        border: "#E5E7EB", // default borders (gray-200)
        borderDark: "#D1D5DB", // strong borders (gray-300)

        // ✅ SUCCESS (green)
        success: "#16A34A", // text/icons (green-600)
        successBg: "#DCFCE7", // background (green-100)

        // ❌ ERROR (red)
        error: "#DC2626", // text/icons (red-600)
        errorBg: "#FEE2E2", // background (red-100)

        // ⚠️ WARNING (yellow)
        warning: "#CA8A04", // text/icons (yellow-600)
        warningBg: "#FEF9C3", // background (yellow-100)

        // ℹ️ INFO (blue)
        info: "#3B82F6", // info text/icons
        infoBg: "#DBEAFE", // info background (blue-100)

        // ⚫ SIDEBAR
        sidebar: "#0F172A", // sidebar background (modern dark)
        sidebarText: "#FFFFFF", // sidebar text/icons
        sidebarHover: "#1F2937", // hover state (gray-800)
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
