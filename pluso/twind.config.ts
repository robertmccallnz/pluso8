import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--p))",
        "primary-focus": "hsl(var(--pf))",
        "primary-content": "hsl(var(--pc))",
        secondary: "hsl(var(--s))",
        "secondary-focus": "hsl(var(--sf))",
        "secondary-content": "hsl(var(--sc))",
        accent: "hsl(var(--a))",
        "accent-focus": "hsl(var(--af))",
        "accent-content": "hsl(var(--ac))",
        neutral: "hsl(var(--n))",
        "neutral-focus": "hsl(var(--nf))",
        "neutral-content": "hsl(var(--nc))",
        "base-100": "hsl(var(--b1))",
        "base-200": "hsl(var(--b2))",
        "base-300": "hsl(var(--b3))",
        "base-content": "hsl(var(--bc))",
      },
    },
  },
  preflight: {
    ':root': {
      '--p': '48 96% 89%',  // lemonade primary
      '--s': '99 97% 96%',  // lemonade secondary
      '--a': '48 96% 89%',  // lemonade accent
      '--n': '280 46% 14%', // lemonade neutral
      '--b1': '0 0% 100%',  // lemonade base-100
      '--b2': '0 0% 95%',   // lemonade base-200
      '--b3': '0 0% 90%',   // lemonade base-300
      '--bc': '0 0% 20%',   // lemonade base-content
    }
  },
  rules: [
    ['btn', 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'],
    ['btn-primary', 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'],
    ['navbar', 'flex items-center justify-between w-full'],
    ['navbar-start', 'flex-1 flex items-center justify-start'],
    ['navbar-center', 'flex-none flex items-center justify-center'],
    ['navbar-end', 'flex-1 flex items-center justify-end'],
  ],
} as Options;
