import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";

export default defineConfig({
  plugins: [
    twindPlugin({
      selfURL: import.meta.url,
      configPath: "./twind.config.ts",
    }),
  ],
  static: {
    maxAge: 120,
    immutable: true,
  },
  build: {
    target: "es2022",
    cssMinify: true,
  }
});