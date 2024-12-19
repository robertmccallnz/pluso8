import { Handlers } from "$fresh/server.ts";
import { supabaseAdmin } from "../../../core/database/supabase/client.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { userId } = await req.json();

      if (!userId) {
        return new Response(JSON.stringify({ 
          success: false,
          message: 'User ID is required'
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { isAdmin: true } }
      );

      if (error) {
        return new Response(JSON.stringify({ 
          success: false,
          message: error.message
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'User updated successfully',
        user: data.user
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
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
