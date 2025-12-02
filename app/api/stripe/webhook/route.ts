// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // 👈 required for raw body + webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    // Important: we must read the raw body as text for signature verification
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      /** ---------------- CHECKOUT SESSION (old flow) ---------------- **/
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(
          "✅ Checkout session completed:",
          session.id,
          "amount_total:",
          session.amount_total,
          "customer_email:",
          session.customer_details?.email
        );
        // TODO:
        // - create / update order in Firestore
        // - mark as paid
        // - trigger email, etc.
        break;
      }

      /** ---------------- IDENTITY VERIFICATION ---------------- **/
      case "identity.verification_session.verified": {
        const vs = event.data.object as any;
        console.log(
          "✅ Identity verified:",
          vs.id,
          "email:",
          vs.metadata?.user_email
        );
        // TODO:
        // - mark this user/email as "KYC verified" in your DB
        break;
      }

      /** ---------------- PAYMENT INTENT (Payment Element) ---------------- **/
      case "payment_intent.processing": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(
          "ℹ️ Payment processing:",
          pi.id,
          pi.amount,
          pi.currency,
          pi.payment_method_types
        );
        // Example:
        // await updateOrder(pi.id, { status: "processing" });
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(
          "✅ Payment succeeded:",
          pi.id,
          pi.amount,
          pi.currency,
          pi.payment_method_types
        );
        // Example:
        // await updateOrder(pi.id, {
        //   status: "paid",
        //   paidAt: new Date(),
        //   paymentMethodTypes: pi.payment_method_types,
        //   metadata: pi.metadata,
        // });
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const msg =
          pi.last_payment_error?.message || "Unknown payment failure";
        console.warn("❌ Payment failed:", pi.id, msg);
        // Example:
        // await updateOrder(pi.id, { status: "failed", failureReason: msg });
        break;
      }

      /** ---------------- OPTIONAL EXTRA EVENTS ---------------- **/
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("💸 Charge refunded:", charge.id, charge.amount_refunded);
        // Example:
        // await updateOrderByCharge(charge.id, { status: "refunded" });
        break;
      }

      default: {
        // For debugging; you can comment this out later
        console.log("Unhandled Stripe event type:", event.type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
