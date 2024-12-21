import { BuildOptions } from "$fresh/plugins/twind.ts";

export const config: BuildOptions = {
  target: "vercel",
  build: {
    target: ["chrome99", "firefox99", "safari15"],
    include: ["src/**/*"],
  },
  server: {
    port: 8000,
  },
};
