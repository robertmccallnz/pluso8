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

      // Get system metrics
      const [cpuInfo, memInfo] = await Promise.all([
        Deno.systemMemoryInfo(),
        Deno.loadavg(),
      ]);

      // Calculate CPU usage (average load over last minute)
      const cpuUsage = Math.min(Math.round(memInfo[0] * 100), 100);

      // Calculate memory usage
      const memoryTotal = cpuInfo.total;
      const memoryUsed = memoryTotal - cpuInfo.available;
      const memoryUsage = Math.round((memoryUsed / memoryTotal) * 100);

      // Get storage usage from Supabase
      const { data: storageData, error: storageError } = await supabaseAdmin
        .from('system_metrics')
        .select('storage_usage')
        .single();

      if (storageError) {
        throw new Error('Failed to fetch storage data');
      }

      // Get system uptime
      const uptime = Deno.uptime(); // in seconds

      return new Response(JSON.stringify({
        cpu: cpuUsage,
        memory: memoryUsage,
        storage: storageData.storage_usage,
        uptime: uptime,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error in admin system handler:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
