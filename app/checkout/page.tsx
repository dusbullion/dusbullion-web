// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../store/cart";
import { useAuth } from "../lib/auth-context";
import {
  loadUserProfile,
  emptyProfile,
  type UserProfile,
} from "../lib/profile-store";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type AddressForm = {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

type BuyerForm = {
  name: string;
  email: string;
  phone: string;
  billing: AddressForm;
  shipping: AddressForm;
  sameAsBilling: boolean;
};

type PriceBreakdown = {
  subtotalUsd: number;
  shippingUsd: number;
  processingFeeUsd: number;
  totalUsd: number;
};

type CheckoutInnerProps = {
  clientSecret: string;
  lockedSubtotal: number;
  lockExpiresAt: number;
  profile: UserProfile | null;
  userEmail: string | null;
  breakdown: PriceBreakdown | null;
};

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const mm = min.toString().padStart(2, "0");
  const ss = sec.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

const emptyAddress: AddressForm = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none";

function CheckoutInner({
  clientSecret,
  lockedSubtotal,
  lockExpiresAt,
  profile,
  userEmail,
  breakdown,
}: CheckoutInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const clear = useCart((s) => s.clear);

  const [buyer, setBuyer] = useState<BuyerForm>({
    name: "",
    email: userEmail ?? "",
    phone: "",
    billing: emptyAddress,
    shipping: emptyAddress,
    sameAsBilling: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [remainingMs, setRemainingMs] = useState(
    () => lockExpiresAt - Date.now()
  );
  const lockExpired = remainingMs <= 0;

  // countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setRemainingMs(lockExpiresAt - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [lockExpiresAt]);

  // one-time prefill from profile
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (prefilled) return;

    const baseProfile = profile ?? emptyProfile;

    const billing: AddressForm = {
      fullName: baseProfile.billing.fullName ?? "",
      line1: baseProfile.billing.line1 ?? "",
      line2: baseProfile.billing.line2 ?? "",
      city: baseProfile.billing.city ?? "",
      state: baseProfile.billing.state ?? "",
      postalCode: baseProfile.billing.postalCode ?? "",
      country: baseProfile.billing.country || "US",
      phone: baseProfile.billing.phone ?? "",
    };

    const shipping: AddressForm = {
      fullName: baseProfile.shipping.fullName ?? "",
      line1: baseProfile.shipping.line1 ?? "",
      line2: baseProfile.shipping.line2 ?? "",
      city: baseProfile.shipping.city ?? "",
      state: baseProfile.shipping.state ?? "",
      postalCode: baseProfile.shipping.postalCode ?? "",
      country: baseProfile.shipping.country || "US",
      phone: baseProfile.shipping.phone ?? "",
    };

    setBuyer((prev) => ({
      ...prev,
      name:
        baseProfile.firstName || baseProfile.lastName
          ? `${baseProfile.firstName ?? ""} ${
              baseProfile.lastName ?? ""
            }`.trim()
          : prev.name,
      email: userEmail ?? prev.email,
      phone: baseProfile.phone ?? prev.phone,
      billing,
      shipping,
    }));
    setPrefilled(true);
  }, [profile, userEmail, prefilled]);

  function updatePersonal<
    K extends keyof Omit<BuyerForm, "billing" | "shipping" | "sameAsBilling">
  >(key: K, value: BuyerForm[K]) {
    setBuyer((prev) => ({ ...prev, [key]: value }));
  }

  function updateAddress(
    type: "billing" | "shipping",
    field: keyof AddressForm,
    value: string
  ) {
    setBuyer((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!stripe || !elements) return;

    if (lockExpired) {
      setErrorMsg(
        "Your 10-minute price lock has expired. Please go back to the cart to refresh prices."
      );
      return;
    }

    setSubmitting(true);

    const ship = buyer.sameAsBilling ? buyer.billing : buyer.shipping;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: buyer.email || undefined,
        shipping: {
          name: ship.fullName || buyer.name || buyer.email || "Customer",
          address: {
            line1: ship.line1,
            line2: ship.line2 || undefined,
            city: ship.city,
            state: ship.state || undefined,
            postal_code: ship.postalCode,
            country: ship.country || "US",
          },
          phone: ship.phone || buyer.phone || undefined,
        },
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setErrorMsg(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    // non-redirect flows
    clear();
  }

  // use breakdown from backend if available, otherwise fall back
  const subtotal =
    breakdown?.subtotalUsd != null ? breakdown.subtotalUsd : lockedSubtotal;
  const shippingUsd = breakdown?.shippingUsd ?? 0;
  const processingFeeUsd =
    breakdown?.processingFeeUsd ?? Number((subtotal * 0.055).toFixed(2));
  const totalUsd =
    breakdown?.totalUsd ?? subtotal + shippingUsd + processingFeeUsd;

  return (
    <form
      onSubmit={handleSubmit}
      className="section mx-auto flex max-w-4xl flex-col gap-6 py-8"
    >
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {/* Price lock banner with big timer */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 sm:px-6 sm:py-5">
        {!lockExpired ? (
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold text-amber-900 sm:text-base">
                Your price is locked for 10 minutes.
              </p>
              <p className="mt-1 text-xs text-amber-800 sm:text-sm">
                Complete your payment before the timer reaches zero to keep this
                price.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium uppercase tracking-wide text-amber-800">
                Time remaining
              </span>
              <span className="mt-1 rounded-xl bg-amber-900 px-4 py-2 text-2xl font-mono font-bold text-amber-50 sm:text-3xl">
                {formatCountdown(remainingMs)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-amber-900 sm:text-base">
              Price lock expired.
            </p>
            <p className="mt-1 text-xs text-amber-800 sm:text-sm">
              Please return to your cart to refresh live prices and start a new
              10-minute lock.
            </p>
            <Link href="/cart" className="btn-secondary mt-4 inline-block">
              My Cart
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.25fr)]">
        {/* Left: form sections */}
        <div className="space-y-6">
          {/* 1. Personal info */}
          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
              1. Personal information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  className={inputClass}
                  placeholder="Full name"
                  value={buyer.name}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Email
                </label>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={buyer.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Phone (for updates)
                </label>
                <input
                  className={inputClass}
                  type="tel"
                  placeholder="Optional"
                  value={buyer.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 2. Billing */}
          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
              2. Billing address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.fullName}
                  onChange={(e) =>
                    updateAddress("billing", "fullName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Address line 1
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.line1}
                  onChange={(e) =>
                    updateAddress("billing", "line1", e.target.value)
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Address line 2 (optional)
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.line2}
                  onChange={(e) =>
                    updateAddress("billing", "line2", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  City
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.city}
                  onChange={(e) =>
                    updateAddress("billing", "city", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  State / Province
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.state}
                  onChange={(e) =>
                    updateAddress("billing", "state", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Postal code
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.postalCode}
                  onChange={(e) =>
                    updateAddress("billing", "postalCode", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700">
                  Country
                </label>
                <input
                  className={inputClass}
                  value={buyer.billing.country}
                  onChange={(e) =>
                    updateAddress(
                      "billing",
                      "country",
                      e.target.value.toUpperCase()
                    )
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700">
                  Phone (for billing contact)
                </label>
                <input
                  className={inputClass}
                  type="tel"
                  value={buyer.billing.phone}
                  onChange={(e) =>
                    updateAddress("billing", "phone", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* 3. Delivery */}
          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
                3. Delivery address
              </h2>
              <label className="inline-flex items-center gap-2 text-xs text-neutral-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300"
                  checked={buyer.sameAsBilling}
                  onChange={(e) =>
                    setBuyer((prev) => ({
                      ...prev,
                      sameAsBilling: e.target.checked,
                      shipping: e.target.checked
                        ? { ...prev.billing }
                        : prev.shipping,
                    }))
                  }
                />
                Same as billing
              </label>
            </div>

            {!buyer.sameAsBilling && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700">
                    Full name
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.fullName}
                    onChange={(e) =>
                      updateAddress("shipping", "fullName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700">
                    Address line 1
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.line1}
                    onChange={(e) =>
                      updateAddress("shipping", "line1", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700">
                    Address line 2 (optional)
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.line2}
                    onChange={(e) =>
                      updateAddress("shipping", "line2", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700">
                    City
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.city}
                    onChange={(e) =>
                      updateAddress("shipping", "city", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700">
                    State / Province
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.state}
                    onChange={(e) =>
                      updateAddress("shipping", "state", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700">
                    Postal code
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.postalCode}
                    onChange={(e) =>
                      updateAddress("shipping", "postalCode", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700">
                    Country
                  </label>
                  <input
                    className={inputClass}
                    value={buyer.shipping.country}
                    onChange={(e) =>
                      updateAddress(
                        "shipping",
                        "country",
                        e.target.value.toUpperCase()
                      )
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700">
                    Phone (for delivery updates)
                  </label>
                  <input
                    className={inputClass}
                    type="tel"
                    value={buyer.shipping.phone}
                    onChange={(e) =>
                      updateAddress("shipping", "phone", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </section>

          {/* 4. Payment */}
          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
              4. Payment
            </h2>
            <PaymentElement />
            <p className="text-xs text-neutral-500">
              Card details and wallets (Apple Pay, Google Pay, etc.) are
              securely processed by Stripe. We never see your full card number.
            </p>
          </section>
        </div>

        {/* Right: summary + button */}
        <aside className="h-max space-y-3 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="flex justify-between text-sm">
            <span>Subtotal (locked)</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Secure Payment Processing Fee</span>
            <span>{formatMoney(processingFeeUsd)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>
              {shippingUsd === 0
                ? "FREE"
                : formatMoney(shippingUsd)}
            </span>
          </div>
          
          <div className="mt-2 flex justify-between border-t pt-2 text-sm font-semibold">
            <span>Total</span>
            <span>{formatMoney(totalUsd)}</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Total includes metal price at time of checkout, shipping, and
            Secure Payment Processing Fee.
          </p>

          <button
            type="submit"
            disabled={
              submitting || !clientSecret || !stripe || !elements || lockExpired
            }
            className="btn-secondary mt-3 w-full cursor-pointer disabled:opacity-60"
          >
            {lockExpired
              ? "Price lock expired"
              : submitting
              ? "Processing…"
              : "Pay securely"}
          </button>

          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}
        </aside>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotalFn = useCart((s) => s.subtotal);
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPI, setLoadingPI] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

  // snapshot subtotal + lock time once
  const [lockedSubtotal] = useState(() => subtotalFn());
  const [lockExpiresAt] = useState(() => Date.now() + 10 * 60 * 1000);

  // load profile
  useEffect(() => {
    if (!user) {
      setProfile(emptyProfile);
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await loadUserProfile(user.uid);
        if (!cancelled) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load profile at checkout:", err);
        if (!cancelled) setProfile(emptyProfile);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // create PaymentIntent
  useEffect(() => {
    async function run() {
      if (!items.length) {
        setLoadingPI(false);
        return;
      }

      try {
        const res = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            buyer: { email: user?.email },
            lockedSubtotal,
            lockExpiresAt,
          }),
        });

        const text = await res.text();

        if (!res.ok) {
          console.error("Payment-intent error:", text);
          alert("Failed to start checkout.");
          setLoadingPI(false);
          return;
        }

        const json = JSON.parse(text);
        if (json.clientSecret) {
          setClientSecret(json.clientSecret);
          if (json.breakdown) {
            setBreakdown(json.breakdown as PriceBreakdown);
          }
        } else {
          console.error("No clientSecret:", json);
          alert("Missing clientSecret from server.");
        }
      } catch (err) {
        console.error("Checkout fetch error:", err);
        alert("Network error, see console.");
      } finally {
        setLoadingPI(false);
      }
    }
    run();
  }, [items, user?.email, lockedSubtotal, lockExpiresAt]);

  if (!items.length) {
    return (
      <section className="section py-10">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-neutral-600">Your cart is empty.</p>
      </section>
    );
  }

  if (loadingPI || !clientSecret || profileLoading) {
    return (
      <section className="section py-10">
        <p>Preparing secure checkout…</p>
      </section>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <CheckoutInner
        clientSecret={clientSecret}
        lockedSubtotal={lockedSubtotal}
        lockExpiresAt={lockExpiresAt}
        profile={profile}
        userEmail={user?.email ?? null}
        breakdown={breakdown}
      />
    </Elements>
  );
}
