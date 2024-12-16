import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pluso: {
          // Primary brand colors
          blue: {
            DEFAULT: '#1E88E5',  // plu_ color
            hover: '#1976D2',    // darker for hover states
            light: '#64B5F6',    // lighter variants
            dark: '#1565C0'      // darker variants
          },
          cyan: {
            DEFAULT: '#00ACC1',  // SO color
            hover: '#0097A7',    // darker for hover states
            light: '#4DD0E1',    // lighter variants
            dark: '#00838F'      // darker variants
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;