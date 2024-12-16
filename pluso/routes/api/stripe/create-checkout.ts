// routes/api/stripe/create-checkout.ts
import { Handlers } from "$fresh/server.ts";
import { createCheckoutSession } from "../../../utils/stripe.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { priceId, customerId } = await req.json();

      if (!priceId || !customerId) {
        return new Response(
          JSON.stringify({ error: "Price ID and Customer ID are required" }), 
          { status: 400 }
        );
      }

      const origin = req.headers.get("origin") || "http://localhost:8000";
      const session = await createCheckoutSession(
        priceId,
        customerId,
        `${origin}/checkout/success`,
        `${origin}/checkout/canceled`
      );

      return new Response(JSON.stringify({ sessionId: session.id }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      return new Response(
        JSON.stringify({ error: "Error creating checkout session" }), 
        { status: 500 }
      );
    }
  },
};
