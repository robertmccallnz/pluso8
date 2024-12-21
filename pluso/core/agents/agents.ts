import { Handlers } from "$fresh/server.ts";
import { supabaseAdmin } from "../../core/database/supabase/client.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      // Check authentication
      const cookies = req.headers.get('cookie');
      const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];

      if (!sessionToken) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Unauthorized'
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get user from session
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(sessionToken);
      if (userError || !user) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Invalid session'
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get agent data from request
      const body = await req.json();
      const { name, type, industry, features, models, systemPrompt } = body;

      // Create agent
      const { data: agent, error: agentError } = await supabaseAdmin
        .from('agents')
        .insert({
          name,
          type,
          industry,
          features,
          models,
          system_prompt: systemPrompt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (agentError) {
        console.error('Error creating agent:', agentError);
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Failed to create agent'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Link agent to user
      const { error: linkError } = await supabaseAdmin
        .from('user_agents')
        .insert({
          user_id: user.id,
          agent_id: agent.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (linkError) {
        console.error('Error linking agent to user:', linkError);
        // Rollback agent creation
        await supabaseAdmin
          .from('agents')
          .delete()
          .match({ id: agent.id });

        return new Response(JSON.stringify({ 
          success: false,
          message: 'Failed to link agent to user'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true,
        agent
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'An error occurred'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async GET(req) {
    try {
      // Check authentication
      const cookies = req.headers.get('cookie');
      const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];

      if (!sessionToken) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Unauthorized'
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get user from session
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(sessionToken);
      if (userError || !user) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Invalid session'
        }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get user's agents
      const { data: userAgents, error: agentsError } = await supabaseAdmin
        .from('user_agents')
        .select(`
          agent_id,
          agents (
            id,
            name,
            type,
            industry,
            features,
            models,
            system_prompt,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Failed to fetch agents'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get metrics for each agent
      const agents = await Promise.all(userAgents.map(async ({ agents: agent }) => {
        const { data: metrics } = await supabaseAdmin
          .from('agent_metrics')
          .select('*')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...agent,
          metrics: metrics || null
        };
      }));

      return new Response(JSON.stringify({ 
        success: true,
        agents
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'An error occurred'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
