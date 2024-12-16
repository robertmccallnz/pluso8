// routes/api/stripe/create-portal.ts
import { Handlers } from "$fresh/server.ts";
import { createPortalSession } from "../../../utils/stripe.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { customerId } = await req.json();

      if (!customerId) {
        return new Response(
          JSON.stringify({ error: "Customer ID is required" }), 
          { status: 400 }
        );
      }

      const origin = req.headers.get("origin") || "http://localhost:8000";
      const session = await createPortalSession(customerId, `${origin}/account`);

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error creating portal session:", err);
      return new Response(
        JSON.stringify({ error: "Error creating portal session" }), 
        { status: 500 }
      );
    }
  },
};
