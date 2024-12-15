import type { Config } from "tailwindcss";

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
          },
          // Extended brand palette
          orange: {
            DEFAULT: '#FF6B00',  // accent color
            hover: '#F44D00'     // hover state
          },
          // Monochrome scale
          charcoal: {
            DEFAULT: '#1A1A1A',  // default text
            light: '#4A4A4A',    // secondary text
            lighter: '#717171'   // tertiary text
          },
          offwhite: {
            DEFAULT: '#F5F5F5',  // background
            dark: '#E5E5E5'      // secondary background
          }
        }
      },
      fontFamily: {
        mono: ['Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      spacing: {
        // Add any custom spacing if needed
      },
      borderRadius: {
        // Add any custom border radius if needed
      }
    }
  },
  plugins: []
} as Config;