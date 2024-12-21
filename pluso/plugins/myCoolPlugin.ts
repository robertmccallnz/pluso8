import { Plugin, ResolvedFreshConfig } from "$fresh/server.ts";

function MyPlugin(): Plugin {
  let config: ResolvedFreshConfig;

  return {
    name: "my-cool-plugin",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
  };
}

export default MyPlugin;
