import { Handlers } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.194.0/http/cookie.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      // Get token from cookie
      const cookies = getCookies(req.headers);
      const token = cookies["sb-auth-token"];

      if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // For demo, return mock settings
      return new Response(JSON.stringify({
        success: true,
        settings: {
          theme: "dark",
          notifications: true,
          language: "en",
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async POST(req, _ctx) {
    try {
      // Get token from cookie
      const cookies = getCookies(req.headers);
      const token = cookies["sb-auth-token"];

      if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get settings from request body
      const body = await req.json();

      // For demo, just echo back the settings
      return new Response(JSON.stringify({
        success: true,
        settings: body
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
