// utils/stripe.ts
import Stripe from "https://esm.sh/stripe@14.10.0?dts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

// Initialize Stripe client
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Subscription price IDs - replace with your actual price IDs from Stripe dashboard
export const SUBSCRIPTION_PRICES = {
  BASIC: "price_basic",
  PRO: "price_pro",
  ENTERPRISE: "price_enterprise",
} as const;

// Helper functions for common Stripe operations
export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function retrieveSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: priceId,
    }],
  });
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function createCheckoutSession(priceId: string, customerId: string, successUrl: string, cancelUrl: string) {
  return await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

// Utility function to format amount in cents
export function formatAmountForStripe(amount: number, currency: string): number {
  const currencies = ['usd', 'eur', 'gbp'];
  const isZeroDecimal = !currencies.includes(currency.toLowerCase());
  return isZeroDecimal ? amount : Math.round(amount * 100);
}

// Utility function to handle Stripe errors
export function handleStripeError(error: Stripe.StripeError) {
  let message = 'An error occurred with the payment';
  
  switch (error.type) {
    case 'StripeCardError':
      message = error.message ?? 'Your card was declined';
      break;
    case 'StripeInvalidRequestError':
      message = 'Invalid parameters were supplied to Stripe\'s API';
      break;
    case 'StripeAPIError':
      message = 'An error occurred while communicating with Stripe';
      break;
    case 'StripeConnectionError':
      message = 'Network communication with Stripe failed';
      break;
    case 'StripeAuthenticationError':
      message = 'Authentication with Stripe failed';
      console.error('Check your Stripe API keys');
      break;
    case 'StripeRateLimitError':
      message = 'Too many requests made to the Stripe API too quickly';
      break;
    default:
      message = 'An unexpected error occurred';
  }

  return {
    error: true,
    message,
    code: error.code,
    type: error.type,
  };
}
