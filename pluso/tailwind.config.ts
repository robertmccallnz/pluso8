import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("npm:daisyui")
  ],
  daisyui: {
    themes: ["lemonade"],
    darkTheme: "lemonade",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  }
} satisfies Config;
