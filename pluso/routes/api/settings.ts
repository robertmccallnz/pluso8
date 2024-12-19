import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req) {
    // Check authentication
    const cookies = req.headers.get('cookie');
    const session = cookies?.includes('session=');
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    return new Response(JSON.stringify({
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        desktop: true
      },
      privacy: {
        shareData: false,
        analytics: true
      },
      language: 'en',
      timezone: 'UTC'
    }));
  },

  async PUT(req) {
    // Check authentication
    const cookies = req.headers.get('cookie');
    const session = cookies?.includes('session=');
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
      const data = await req.json();
      return new Response(JSON.stringify({
        success: true,
        data
      }));
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Invalid request'
      }), { status: 400 });
    }
  }
};
