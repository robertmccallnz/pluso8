// routes/api/stripe/webhook.ts
import { Handlers } from "$fresh/server.ts";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

export const handler: Handlers = {
  async POST(req) {
    try {
      const signature = req.headers.get("stripe-signature");
      if (!signature) {
        return new Response("No signature", { status: 400 });
      }

      const body = await req.text();
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error(`⚠️  Webhook signature verification failed:`, err.message);
        return new Response(`Webhook signature verification failed: ${err.message}`, { 
          status: 400 
        });
      }

      // Handle specific event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
          // Add your payment success logic here
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.error(`❌ Payment failed: ${failedPayment.id}`);
          // Add your payment failure logic here
          break;

        case 'customer.subscription.created':
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`🔔 New subscription: ${subscription.id}`);
          // Add your subscription creation logic here
          break;

        case 'customer.subscription.updated':
          const updatedSub = event.data.object as Stripe.Subscription;
          console.log(`📝 Subscription updated: ${updatedSub.id}`);
          // Add your subscription update logic here
          break;

        case 'customer.subscription.deleted':
          const deletedSub = event.data.object as Stripe.Subscription;
          console.log(`🗑️ Subscription cancelled: ${deletedSub.id}`);
          // Add your subscription cancellation logic here
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response("Success", { status: 200 });
    } catch (err) {
      console.error("Error processing webhook:", err);
      return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
  },
};
