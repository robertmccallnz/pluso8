// routes/api/legal-chat.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { message } = body;

      // Here you would integrate with your LLM service
      // For now, returning a mock response
      const response = {
        response: `Legal Assistant: I received your message: "${message}"`
      };

      return new Response(JSON.stringify(response), {
        headers: { 
          "Content-Type": "application/json",
          // Add CORS headers if needed
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  // Add OPTIONS handler for CORS if needed
  OPTIONS(req) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },
};