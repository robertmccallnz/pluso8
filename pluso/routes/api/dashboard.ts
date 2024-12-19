import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const path = url.pathname.split('/api/dashboard')[1];

    // Check authentication
    const cookies = req.headers.get('cookie');
    const session = cookies?.includes('session=');
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    switch (path) {
      case '':
      case '/': {
        return new Response(JSON.stringify({ 
          status: 'authenticated',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          }
        }));
      }

      case '/metrics': {
        return new Response(JSON.stringify({
          overview: {
            visitors: 100,
            pageViews: 500,
            bounceRate: '45%',
            activeUsers: 25
          },
          charts: {
            daily: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              data: [30, 45, 61, 87, 100]
            },
            weekly: {
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              data: [300, 450, 610, 870]
            }
          }
        }));
      }

      case '/agents': {
        return new Response(JSON.stringify({
          agents: [
            { id: '1', name: 'Agent 1', status: 'active', type: 'chat' },
            { id: '2', name: 'Agent 2', status: 'inactive', type: 'task' },
            { id: '3', name: 'Agent 3', status: 'training', type: 'assistant' }
          ]
        }));
      }

      default: {
        // Check if it's a single agent request
        if (path.startsWith('/agents/')) {
          const id = path.split('/agents/')[1];
          return new Response(JSON.stringify({
            id,
            name: `Agent ${id}`,
            status: 'active',
            type: 'chat',
            metrics: {
              conversations: 150,
              avgResponseTime: '2.3s',
              satisfaction: '4.8/5'
            }
          }));
        }

        return new Response('Not found', { status: 404 });
      }
    }
  }
};
