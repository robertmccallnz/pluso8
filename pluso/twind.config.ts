import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        pluso: {
          blue: {
            DEFAULT: '#1E88E5',
            hover: '#1976D2',
            light: '#64B5F6',
            dark: '#1565C0'
          },
          cyan: {
            DEFAULT: '#00ACC1',
            hover: '#0097A7',
            light: '#4DD0E1',
            dark: '#00838F'
          }
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      }
    }
  }
} as Options;