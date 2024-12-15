import { createClient } from '@supabase/supabase-js'
import { Database } from '../schema/types'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase credentials')
}

// Configuration for connection pooling
const poolConfig = {
  schema: 'public',
  poolSize: 20,
  poolTimeout: 60,
  poolIdleTimeout: 60,
}

// Create the Supabase client with pool configuration
const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
    db: {
      schema: poolConfig.schema,
    },
    global: {
      headers: {
        'x-connection-pool': 'true',
      },
    },
  }
)

// Create a function to get a client from the pool
export const getClient = () => supabase

// Helper function to release a client back to the pool
export const releaseClient = async () => {
  // Implementation depends on your specific needs
  // You might want to implement connection cleanup here
}

// Transaction helper
export const withTransaction = async <T>(
  callback: (client: typeof supabase) => Promise<T>
): Promise<T> => {
  const client = getClient()
  try {
    const result = await callback(client)
    return result
  } catch (error) {
    throw error
  } finally {
    await releaseClient()
  }
}

export default supabase