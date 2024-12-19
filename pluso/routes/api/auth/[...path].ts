import { Handlers } from "$fresh/server.ts";
import { supabaseAnon, verifyToken, supabaseAdmin } from "../../../core/database/supabase/client.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const path = url.pathname.split('/api/auth/')[1];

    switch (path) {
      case 'login': {
        try {
          // Handle both JSON and form data
          let email, password;
          const contentType = req.headers.get('content-type');
          
          if (contentType?.includes('application/json')) {
            const body = await req.json();
            email = body.email;
            password = body.password;
          } else if (contentType?.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            email = formData.get('email');
            password = formData.get('password');
          } else {
            console.error('Unsupported content type:', contentType);
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Unsupported content type'
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          if (!email || !password) {
            console.error('Missing email or password');
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Email and password are required'
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          console.log('Attempting login with:', { email });
          const { data: { user, session }, error } = await supabaseAnon.auth.signInWithPassword({
            email: email.toString(),
            password: password.toString(),
          });

          console.log('Supabase login response:', { 
            success: !!user && !!session, 
            error: error?.message,
            sessionExists: !!session,
            userExists: !!user
          });

          if (error) {
            console.error('Login error:', error);
            return new Response(JSON.stringify({ 
              success: false,
              message: error.message
            }), { 
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          if (!session) {
            console.error('No session created');
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Failed to create session'
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Verify that we can use this token
          const { user: verifiedUser, error: verifyError } = await verifyToken(session.access_token);
          if (verifyError || !verifiedUser) {
            console.error('Token verification failed:', verifyError);
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Failed to verify session token'
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Set cookie without Secure flag for localhost
          const isLocalhost = req.headers.get('host')?.includes('localhost');
          const cookieOptions = isLocalhost 
            ? `HttpOnly; Path=/; Max-Age=${session.expires_in}` 
            : `HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${session.expires_in}`;
          
          // Create response headers
          const headers = new Headers();
          headers.set('Set-Cookie', `session=${session.access_token}; ${cookieOptions}`);
          headers.set('Location', '/dashboard');

          console.log('Setting response headers:', {
            cookie: headers.get('Set-Cookie'),
            location: headers.get('Location')
          });

          // Return a redirect response without a body
          return new Response(null, {
            status: 302,
            headers
          });

        } catch (error) {
          console.error('Login error:', error);
          return new Response(JSON.stringify({ 
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      case 'signup': {
        try {
          // Handle both JSON and form data
          let email, password, name;
          const contentType = req.headers.get('content-type');
          
          if (contentType?.includes('application/json')) {
            const body = await req.json();
            email = body.email;
            password = body.password;
            name = body.name;
          } else if (contentType?.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            email = formData.get('email');
            password = formData.get('password');
            name = formData.get('name');
          } else {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Unsupported content type'
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          if (!email || !password || !name) {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Email, password, and name are required'
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email.toString())) {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Invalid email format'
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Create user
          const { data: { user, session }, error } = await supabaseAnon.auth.signUp({
            email: email.toString(),
            password: password.toString(),
            options: {
              data: {
                name: name.toString(),
              },
            },
          });

          if (error) {
            console.error('Signup error:', error);
            return new Response(JSON.stringify({ 
              success: false,
              message: error.message
            }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          if (!user) {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Failed to create user'
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Set session cookie if available
          const headers = new Headers({
            'Content-Type': 'application/json'
          });
          
          if (session) {
            headers.append('Set-Cookie', `session=${session.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${session.expires_in}`);
          }

          return new Response(JSON.stringify({ 
            success: true,
            message: 'User created successfully',
            user: {
              id: user.id,
              email: user.email,
              name: name,
            }
          }), {
            headers,
            status: 201
          });
        } catch (error) {
          console.error('Signup error:', error);
          return new Response(JSON.stringify({ 
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      default:
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Invalid endpoint'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  },

  async GET(req) {
    const url = new URL(req.url);
    const path = url.pathname.split('/api/auth/')[1];

    switch (path) {
      case 'user': {
        try {
          const token = await verifyToken(req);
          if (!token) {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Not authenticated'
            }), { 
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

          if (error || !user) {
            return new Response(JSON.stringify({ 
              success: false,
              message: 'Failed to get user'
            }), { 
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ 
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0],
              avatar: user.user_metadata?.avatar_url,
              isAdmin: user.user_metadata?.isAdmin || false
            }
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Get user error:', error);
          return new Response(JSON.stringify({ 
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      case 'logout': {
        const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Logged out successfully'
        }), {
          headers,
          status: 200
        });
      }

      default:
        return new Response(JSON.stringify({ 
          success: false,
          message: 'Invalid endpoint'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  }
};
