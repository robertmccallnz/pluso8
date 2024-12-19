import { Handlers } from "$fresh/server.ts";
import { supabaseAdmin } from "../../../core/database/supabase/client.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      // Check if user is admin
      const cookies = req.headers.get('cookie');
      const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];
      if (!sessionToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(sessionToken);
      if (userError || !user?.user_metadata?.isAdmin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get user statistics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: totalUsers, error: totalError } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' });

      const { data: activeUsers, error: activeError } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' })
        .gt('last_sign_in_at', thirtyDaysAgo.toISOString());

      const { data: newUsers, error: newError } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' })
        .gt('created_at', thirtyDaysAgo.toISOString());

      if (totalError || activeError || newError) {
        throw new Error('Failed to fetch user statistics');
      }

      return new Response(JSON.stringify({
        total: totalUsers?.length || 0,
        active: activeUsers?.length || 0,
        new: newUsers?.length || 0,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in admin users handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
