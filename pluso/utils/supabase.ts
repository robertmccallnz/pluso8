// Temporary mock implementation until Supabase is properly configured
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: null }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
};

export interface UserSession {
  user: {
    id: string;
    email?: string;
    user_metadata: {
      name?: string;
      avatar_url?: string;
    };
  } | null;
  error: Error | null;
}
