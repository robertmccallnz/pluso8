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

      // Get metrics data from request
      const body = await req.json();
      const { agentId, metrics } = body;

      // Verify user has access to this agent
      const { data: userAgent, error: accessError } = await supabaseAdmin
        .from('user_agents')
        .select('agent_id')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .single();

      if (accessError || !userAgent) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Unauthorized access to agent'
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Record metrics
      const { error: metricsError } = await supabaseAdmin
        .from('agent_metrics')
        .insert({
          agent_id: agentId,
          metrics,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (metricsError) {
        console.error('Error recording metrics:', metricsError);
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Failed to record metrics'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error recording metrics:', error);
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

      // Get agent ID from query params
      const url = new URL(req.url);
      const agentId = url.searchParams.get('agentId');
      if (!agentId) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Agent ID is required'
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verify user has access to this agent
      const { data: userAgent, error: accessError } = await supabaseAdmin
        .from('user_agents')
        .select('agent_id')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .single();

      if (accessError || !userAgent) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Unauthorized access to agent'
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Get metrics for the agent
      const { data: metrics, error: metricsError } = await supabaseAdmin
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (metricsError) {
        console.error('Error fetching metrics:', metricsError);
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Failed to fetch metrics'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Calculate aggregate metrics
      const aggregateMetrics = metrics.reduce((acc, metric) => {
        const m = metric.metrics;
        return {
          totalRequests: (acc.totalRequests || 0) + (m.requests || 0),
          totalTokens: (acc.totalTokens || 0) + (m.tokens || 0),
          totalCost: (acc.totalCost || 0) + (m.cost || 0),
          avgResponseTime: metrics.length ? 
            ((acc.avgResponseTime || 0) * (metrics.length - 1) + (m.responseTime || 0)) / metrics.length : 
            0,
          errorRate: metrics.length ? 
            ((acc.errorRate || 0) * (metrics.length - 1) + (m.errorRate || 0)) / metrics.length : 
            0
        };
      }, {});

      return new Response(JSON.stringify({ 
        success: true,
        metrics,
        aggregateMetrics
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
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
