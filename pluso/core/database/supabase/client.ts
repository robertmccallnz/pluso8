import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";
import type { Database } from '../schema/types.ts';

const SUPABASE_URL = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials');
  throw new Error('Supabase credentials not found');
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export default supabase;