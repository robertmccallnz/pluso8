import { defineConfig } from "$fresh/server.ts";
import myIslandPlugin from "./plugins/myIslandPlugin.ts";
import linkInjectPlugin from "./plugins/linkInjectPlugin.ts";
import myCoolPlugin from "./plugins/myCoolPlugin.ts";

export default defineConfig({
  plugins: [
    myIslandPlugin(),
    linkInjectPlugin(),
    myCoolPlugin(),
  ],
  router: {
    trailingSlash: false
  },
  static: {
    maxAge: 60 * 60, // 1 hour
  },
  build: {
    target: "es2022",
    cssMinify: true,
  }
});