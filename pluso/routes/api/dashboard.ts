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

      // For demo purposes, just return some data
      return new Response(JSON.stringify({
        success: true,
        data: {
          stats: {
            totalUsers: 100,
            activeUsers: 50,
            revenue: "$10,000"
          }
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
  }
};
