// app/api/payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { TROY_OUNCE_IN_GRAMS, usdToCents } from "@/app/lib/money";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartItem = {
  id: string;
  name: string;
  image?: string;
  qty: number;
  meta?: { brand?: string };
  premiumUsd?: number;
  weightGrams?: number;
};

type Buyer = {
  email?: string;
  name?: string;
  shipping?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string; // e.g. "US"
  };
};

function computeShipping(subtotalUsd: number) {
  // You can adjust this however you want
  return subtotalUsd > 500 ? 0 : 15;
}

// 5.5% processing fee on (subtotal + shipping)
const PROCESSING_FEE_RATE = 0.055;

export async function POST(req: Request) {
  try {
    const { items, buyer }: { items: CartItem[]; buyer?: Buyer } =
      await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;

    // 1) Get live spot price
    const spotRes = await fetch(`${origin}/api/spot`, { cache: "no-store" });
    if (!spotRes.ok) {
      console.error("Spot API failed", spotRes.status);
      return NextResponse.json(
        { error: "Spot unavailable" },
        { status: 503 }
      );
    }
    const spotJson = await spotRes.json();
    const usdPerOz = Number(spotJson?.usdPerOz || 0);
    if (!usdPerOz) {
      console.error("Invalid usdPerOz", spotJson);
      return NextResponse.json(
        { error: "Spot unavailable" },
        { status: 503 }
      );
    }

    // 2) Server-side subtotal based on weight + premium
    const subtotalUsd = items.reduce((sum, it) => {
      const grams = Number(it.weightGrams || TROY_OUNCE_IN_GRAMS);
      const spotPerUnit = usdPerOz * (grams / TROY_OUNCE_IN_GRAMS);
      const unitUsd = spotPerUnit + Number(it.premiumUsd || 0);
      const qty = Number(it.qty || 1);
      return sum + unitUsd * qty;
    }, 0);

    const shippingUsd = computeShipping(subtotalUsd);

    // 3) 5.5% fee on (subtotal + shipping)
    const baseForFeeUsd = subtotalUsd + shippingUsd;
    const processingFeeUsd = Number(
      (baseForFeeUsd * PROCESSING_FEE_RATE).toFixed(2) // round to 2 decimals
    );

    // 4) Final total = subtotal + shipping + fee
    const totalUsd = subtotalUsd + shippingUsd + processingFeeUsd;

    // 🔑 Generate a simple internal order ID to use across Stripe + Google Sheet
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, "0")}`;

    // Optional: lightweight cart summary for metadata (must be short-ish)
    const cartSummary = items.map((it) => ({
      id: it.id,
      name: it.name,
      qty: it.qty,
      brand: it.meta?.brand,
    }));

    // 5) Create PaymentIntent with full amount (including fee)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: usdToCents(totalUsd),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: buyer?.email,
      shipping: buyer?.shipping
        ? {
            name: buyer.name || buyer.email || "Customer",
            address: buyer.shipping,
          }
        : undefined,
      metadata: {
        order_id: orderId,
        buyer_email: buyer?.email || "",
        spot_usd_per_oz: usdPerOz.toFixed(2),
        subtotal_usd: subtotalUsd.toFixed(2),
        shipping_usd: shippingUsd.toFixed(2),
        processing_fee_rate_pct: String(PROCESSING_FEE_RATE * 100), // "5.5"
        processing_fee_usd: processingFeeUsd.toFixed(2),
        total_usd: totalUsd.toFixed(2),
        cart_items: JSON.stringify(cartSummary),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amountUsd: totalUsd,
      orderId, // 👈 returned in case you want to show "Order #..." on client
      breakdown: {
        subtotalUsd,
        shippingUsd,
        processingFeeUsd,
        totalUsd,
      },
    });
  } catch (err) {
    console.error("payment-intent error", err);
    return NextResponse.json(
      { error: "Failed to create PaymentIntent" },
      { status: 500 }
    );
  }
}
