import { Handlers } from "$fresh/server.ts";

const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response("Hello World!");
  },
};

export default handler;
