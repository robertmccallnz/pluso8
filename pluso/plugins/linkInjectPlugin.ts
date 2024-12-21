import { Plugin } from "$fresh/server.ts";

function MyPlugin(): Plugin {
  return {
    name: "link-inject",
    render(ctx) {
      ctx.render();
      return {
        links: [{ rel: "stylesheet", href: "styles.css" }],
      };
    },
  };
}

export default MyPlugin;
