import supabase from '../supabase/client.ts';
import { join } from "https://deno.land/std@0.210.0/path/mod.ts";

export async function runMigrations() {
  try {
    const migrationPath = join(Deno.cwd(), 'core', 'database', 'schema', 'migrations', '001_create_metrics_tables.sql');
    const sql = await Deno.readTextFile(migrationPath);
    
    const { error } = await supabase.from('_migrations').select('*').limit(1);
    if (error?.message.includes('relation "_migrations" does not exist')) {
      console.log('Running initial migrations...');
      const { error: migrationError } = await supabase.rpc('exec_sql', { sql });
      if (migrationError) throw migrationError;
      console.log('Migrations completed successfully');
    } else {
      console.log('Migrations already run');
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
