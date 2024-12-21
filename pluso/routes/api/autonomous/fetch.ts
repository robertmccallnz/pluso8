import { Handlers } from "$fresh/server.ts";
import { ResourceFetcher } from "../../../core/agents/services/autonomous/resource-fetcher.ts";

export const handler: Handlers = {
  async POST(req) {
    const body = await req.json();
    const { type, url, checksum, metadata, priority } = body;

    try {
      const fetcher = ResourceFetcher.getInstance();
      const result = await fetcher.fetchResource({
        type,
        url,
        checksum,
        metadata,
        priority
      });

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  },

  async GET(req) {
    const fetcher = ResourceFetcher.getInstance();
    const status = await fetcher.getStatus();

    return new Response(JSON.stringify(status), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
