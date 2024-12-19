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
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      }
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
  },

  async POST(req) {
    const url = new URL(req.url);
    if (!url.pathname.endsWith('/avatar')) {
      return new Response('Not found', { status: 404 });
    }

    // Check authentication
    const cookies = req.headers.get('cookie');
    const session = cookies?.includes('session=');
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
      const form = await req.formData();
      const avatar = form.get('avatar');
      if (!avatar) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'No avatar provided'
        }), { status: 400 });
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Avatar updated'
      }));
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Invalid request'
      }), { status: 400 });
    }
  }
};
