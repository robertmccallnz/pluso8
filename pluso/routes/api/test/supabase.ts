import { HandlerContext } from "$fresh/server.ts";
import supabase from "../../../core/database/supabase/client.ts";
import { runMigrations } from "../../../core/database/schema/migrate.ts";

export async function handler(req: Request, _ctx: HandlerContext): Promise<Response> {
  try {
    // Run migrations first
    await runMigrations();
    
    // Test connection by checking for required tables
    const tables = ['agents', 'agent_metrics', 'agent_evaluations', 'agent_error_logs', 'agent_performance_snapshots'];
    const results = [];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
        
      if (error) {
        console.error(`Error accessing table ${table}:`, error);
        results.push({ table, success: false, error: error.message });
      } else {
        console.log(`Table ${table} exists and is accessible`);
        results.push({ table, success: true });
      }
    }
    
    const allSuccessful = results.every(r => r.success);
    
    return new Response(JSON.stringify({ 
      success: allSuccessful,
      results
    }, null, 2), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      },
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }, null, 2), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept"
      },
    });
  }
}
