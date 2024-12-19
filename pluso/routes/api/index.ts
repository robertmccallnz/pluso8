import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req) {
    return new Response(JSON.stringify({
      status: 'ok',
      message: 'Pluso API',
      version: '1.0.0',
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          logout: 'POST /api/auth/logout',
          status: 'GET /api/auth/status',
          register: 'POST /api/auth/register'
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
    }));
  }
};
