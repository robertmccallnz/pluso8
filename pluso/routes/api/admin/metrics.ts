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

      // Get metrics from the last 24 hours
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const { data: metrics, error: metricsError } = await supabaseAdmin
        .from('agent_metrics')
        .select('*')
        .gt('created_at', last24Hours.toISOString());

      if (metricsError) {
        throw new Error('Failed to fetch metrics');
      }

      // Calculate aggregate metrics
      const totalRequests = metrics.length;
      const avgResponseTime = metrics.reduce((sum, m) => sum + m.response_time, 0) / totalRequests;
      const errorCount = metrics.filter(m => m.success_rate < 1).length;
      const errorRate = (errorCount / totalRequests) * 100;

      // Calculate cost
      const { data: costData, error: costError } = await supabaseAdmin
        .from('billing_records')
        .select('amount')
        .gt('created_at', last24Hours.toISOString());

      if (costError) {
        throw new Error('Failed to fetch cost data');
      }

      const costToDate = costData.reduce((sum, record) => sum + record.amount, 0);

      return new Response(JSON.stringify({
        totalRequests,
        avgResponseTime,
        errorRate,
        costToDate,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in admin metrics handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
