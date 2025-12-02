import Stripe from "stripe";
import { ENV } from "./env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    _stripe = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }

  return _stripe;
}

export async function createCheckoutSession(params: {
  userId: number;
  userEmail: string;
  packageId: string;
  price: number;
  credits: number;
  type: string;
}): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `باقة ${params.type} - ${params.credits} تحليل`,
            description: `${params.credits} تحليل ${params.type === "CV" ? "سيرة ذاتية" : "بورتفوليو"}`,
          },
          unit_amount: Math.round(params.price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${ENV.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ENV.frontendUrl}/pricing?canceled=true`,
    customer_email: params.userEmail,
    metadata: {
      userId: params.userId.toString(),
      packageId: params.packageId,
      credits: params.credits.toString(),
      type: params.type,
    },
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
}

export async function verifyCheckoutSession(sessionId: string): Promise<{
  success: boolean;
  metadata?: {
    userId: string;
    packageId: string;
    credits: string;
    type: string;
  };
}> {
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        success: true,
        metadata: session.metadata as any,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { success: false };
  }
}
