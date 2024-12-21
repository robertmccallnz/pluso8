/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./routes/**/*.{tsx,jsx}",
    "./islands/**/*.{tsx,jsx}",
    "./components/**/*.{tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#6b7280",
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
}
