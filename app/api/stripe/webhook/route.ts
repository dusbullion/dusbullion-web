// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { appendOrderToSheet } from "@/app/lib/google-sheets";

export const runtime = "nodejs"; // required for raw body + webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    // ⚠️ must read *raw* body as text for signature verification
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      /** ---------------- CHECKOUT SESSION (if you ever use it) ---------------- **/
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
        // e.g. mark user as KYC-verified in DB
        break;
      }

      /** ---------------- PAYMENT INTENT (Payment Element flow) ---------------- **/
      case "payment_intent.processing": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(
          "ℹ️ Payment processing:",
          pi.id,
          pi.amount,
          pi.currency,
          pi.payment_method_types
        );
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

        // Amount in major units (USD)
        const amountUsd = (pi.amount_received ?? pi.amount ?? 0) / 100;

        // Read breakdown from metadata (set in /api/payment-intent)
        const meta = pi.metadata || {};

        const totalUsd =
          meta.total_usd && !isNaN(Number(meta.total_usd))
            ? Number(meta.total_usd)
            : amountUsd;

        const subtotalUsd =
          meta.subtotal_usd && !isNaN(Number(meta.subtotal_usd))
            ? Number(meta.subtotal_usd)
            : null;

        const shippingUsd =
          meta.shipping_usd && !isNaN(Number(meta.shipping_usd))
            ? Number(meta.shipping_usd)
            : null;

        const processingFeeUsd =
          meta.processing_fee_usd && !isNaN(Number(meta.processing_fee_usd))
            ? Number(meta.processing_fee_usd)
            : null;

        // Fallback: compute fee if not present
        const feeUsd =
          processingFeeUsd ?? Number((totalUsd * 0.055).toFixed(2));

        const netUsd = Number((totalUsd - feeUsd).toFixed(2));

        const shipping = pi.shipping || null;
        const customerEmail =
          pi.receipt_email ||
          shipping?.phone || // (Stripe sometimes stores email only on receipt_email)
          null;

        const shippingName = shipping?.name || null;
        const shippingAddress = shipping?.address || null;
        const phone = shipping?.phone || null;

        const nowIso = new Date().toISOString();

        // 📝 Row order should match your Google Sheet header
        const row: (string | number | null)[] = [
          nowIso, // A: Recorded at (server time)
          pi.id, // B: Stripe PaymentIntent ID
          pi.status, // C: Status (succeeded)
          totalUsd.toFixed(2), // D: Gross total (USD)
          feeUsd.toFixed(2), // E: Secure payment processing fee (USD)
          netUsd.toFixed(2), // F: Net after fee (USD)
          pi.currency.toUpperCase(), // G: Currency
          customerEmail, // H: Customer email (may be null)
          shippingName, // I: Shipping name
          shippingAddress?.line1 || "", // J: Ship line1
          shippingAddress?.line2 || "", // K: Ship line2
          shippingAddress?.city || "", // L: Ship city
          shippingAddress?.state || "", // M: Ship state
          shippingAddress?.postal_code || "", // N: Ship postal
          shippingAddress?.country || "", // O: Ship country
          phone || "", // P: Phone
          (meta.order_id as string) || "", // Q: internal order id (if you ever set one)
          JSON.stringify(meta || {}), // R: raw metadata (optional)
          (pi.payment_method_types || []).join(", "), // S: payment method types
        ];

        // ✅ Append to Google Sheet (don’t fail webhook if Sheets fails)
        try {
          await appendOrderToSheet(row);
          console.log("📊 Logged order to Google Sheet for PI:", pi.id);
        } catch (sheetErr) {
          console.error("Failed to log order to Google Sheets:", sheetErr);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const msg =
          pi.last_payment_error?.message || "Unknown payment failure";
        console.warn("❌ Payment failed:", pi.id, msg);
        break;
      }

      /** ---------------- OPTIONAL EXTRA EVENTS ---------------- **/
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("💸 Charge refunded:", charge.id, charge.amount_refunded);
        break;
      }

      default: {
        // For debugging; can be muted in production
        console.log("Unhandled Stripe event type:", event.type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
