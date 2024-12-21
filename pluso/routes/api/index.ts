import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response(
      JSON.stringify(
        {
          status: 'ok',
          message: 'Pluso API',
          version: '1.0.0',
          endpoints: {
            health: "GET /api/health",
            metrics: "GET /api/metrics",
            models: "GET /api/models",
            chat: {
              maia: "POST /api/chat/maia"
            },
            dashboard: {
              overview: 'GET /api/dashboard',
              metrics: 'GET /api/dashboard/metrics',
              agents: 'GET /api/dashboard/agents',
              agent: 'GET /api/dashboard/agents/:id'
            },
            profile: {
              get: 'GET /api/profile',
              update: 'PUT /api/profile',
              avatar: 'POST /api/profile/avatar'
            },
            settings: {
              get: 'GET /api/settings',
              update: 'PUT /api/settings'
            }
          }
        },
        null,
        2
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
