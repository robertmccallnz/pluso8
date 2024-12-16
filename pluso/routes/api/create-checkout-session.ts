// 2. Update routes/api/create-checkout-session.ts:
import Stripe from "stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16", // Use latest API version
  httpClient: Stripe.createFetchHttpClient(), // Use Deno's fetch
});

export async function handler(req: Request): Promise<Response> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PluSO Subscription",
              description: "Monthly subscription to PluSO AI Agent Platform",
            },
            unit_amount: 2000, // $20.00
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}