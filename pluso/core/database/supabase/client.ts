import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwfmkyvqcqbsxjidkaoj.supabase.co'
const supabaseAnonKey = Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabaseJwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')

console.log('Supabase Config:', {
  url: !!supabaseUrl,
  anonKey: !!supabaseAnonKey,
  serviceKey: !!supabaseServiceKey,
  jwtSecret: !!supabaseJwtSecret
})

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !supabaseJwtSecret) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase clients with JWT verification
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    // First try to decode the token to check basic structure
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return { user: null, error: new Error('Invalid token format') };
    }

    // Try to get the user from the existing client
    const { data: { session }, error: sessionError } = await supabaseAnon.auth.getSession();
    
    if (session?.access_token === token) {
      const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
      if (userError) {
        return { user: null, error: userError };
      }
      return { user, error: null };
    }

    // If session doesn't match, try setting the token
    try {
      await supabaseAnon.auth.setSession({
        access_token: token,
        refresh_token: ''
      });

      const { data: { user }, error } = await supabaseAnon.auth.getUser();
      if (error) {
        if (error.message?.includes('missing sub claim') || 
            error.message?.includes('invalid token') ||
            error.message?.includes('expired')) {
          return { user: null, error: new Error('Token expired or invalid') };
        }
        return { user: null, error };
      }

      return { user, error: null };
    } catch (setSessionError) {
      return { user: null, error: new Error('Failed to validate session token') };
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error during token verification')
    };
  }
}

// Helper function to check if user is in trial period
export async function isInTrialPeriod(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('trial_end_date')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (!user?.trial_end_date) return false
    return new Date(user.trial_end_date) > new Date()
  } catch (error) {
    console.error('Error checking trial period:', error)
    return false
  }
}
