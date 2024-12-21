import { Plugin } from "$fresh/server.ts";
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export default function myIslandPlugin(): Plugin {
  return {
    name: "my-island-plugin",
    islands: {
      baseLocation: import.meta.url,
      paths: [], // Removed example island paths
    },
  };
}
