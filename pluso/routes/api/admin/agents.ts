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

      // Get agent statistics
      const { data: agents, error: agentsError } = await supabaseAdmin
        .from('agents')
        .select('*');

      if (agentsError) {
        throw new Error('Failed to fetch agents');
      }

      // Calculate statistics
      const activeAgents = agents.filter(agent => agent.status === 'active');
      const agentTypes = agents.reduce((acc, agent) => {
        acc[agent.type] = (acc[agent.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return new Response(JSON.stringify({
        total: agents.length,
        active: activeAgents.length,
        byType: agentTypes,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in admin agents handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
