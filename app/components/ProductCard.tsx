// app/components/ProductCard.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Product } from "../lib/products";
import { TROY_OUNCE_IN_GRAMS } from "../lib/money";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "../store/cart";

type ProductCardProps = {
  product: Product;
  spotPerOz?: number;
};

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function ProductCard({ product, spotPerOz }: ProductCardProps) {
  const add = useCart((s) => s.add);

  const brand = product.brand;
  const name = product.name;
  const grams = product.weightGrams ?? TROY_OUNCE_IN_GRAMS;

  const isCustomAmount = !!product.variableAmount;

  // ========= NORMAL PRODUCTS =========

  const livePrice =
    typeof spotPerOz === "number"
      ? Math.max(
          0,
          spotPerOz * (grams / TROY_OUNCE_IN_GRAMS) +
            (product.premiumUsd || 0)
        )
      : null;

  // ========= CUSTOM PER-GRAM PRODUCT =========

  const minAmount = product.minAmountUsd ?? 100;
  const maxAmount = product.maxAmountUsd ?? 5000;
  const premiumPerGram = product.premiumPerGramUsd ?? 70;

  const [customAmount, setCustomAmount] = useState(minAmount);

  // price per gram = spot per gram + premium per gram
  const pricePerGram = useMemo(() => {
    if (!spotPerOz) return 0;
    const spotPerGram = spotPerOz / TROY_OUNCE_IN_GRAMS;
    return spotPerGram + premiumPerGram;
  }, [spotPerOz, premiumPerGram]);

  // grams = amount / pricePerGram
  const gramsForCustomAmount = useMemo(() => {
    if (!pricePerGram || customAmount <= 0) return 0;
    const g = customAmount / pricePerGram;
    return Math.max(0, Number(g.toFixed(3))); // up to 3 decimal places
  }, [customAmount, pricePerGram]);

  function handleAddCustom() {
    if (!spotPerOz || !pricePerGram) {
      alert("Live pricing not available. Please try again in a moment.");
      return;
    }

    if (customAmount < minAmount || customAmount > maxAmount) {
      alert(
        `Please choose an amount between ${money(minAmount)} and ${money(
          maxAmount
        )}.`
      );
      return;
    }

    if (!gramsForCustomAmount) {
      alert(
        "Unable to calculate grams for this amount. Please adjust and try again."
      );
      return;
    }

    const totalPremiumUsd = gramsForCustomAmount * premiumPerGram;

    // ✅ CartItem without qty; cart store will set qty = 1
    add({
      id: product.id,
      name: product.name,
      image: product.image,
      meta: {
        brand: product.brand,
        type: "custom-gram",
        chosenAmountUsd: customAmount,
        grams: gramsForCustomAmount,
        spotPerOz,
        pricePerGram,
        premiumPerGram,
      },
      // used later by /api/payment-intent to recompute amounts from spot
      weightGrams: gramsForCustomAmount,
      premiumUsd: totalPremiumUsd,
      // required by CartItem: this is the line price, with qty=1
      priceUsd: customAmount,
    });
  }

  return (
    <div className="card space-y-2">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-white">
        <Image
          src={product.image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold">{name}</h3>
        <p className="text-xs text-neutral-600">{brand}</p>
      </div>

      {/* ===== PRICE / INFO BLOCK ===== */}
      {!isCustomAmount ? (
        <div className="flex items-center justify-between">
          {livePrice != null ? (
            <div>
              <p className="text-xs text-neutral-500">Live Price</p>
              <p className="text-sm font-semibold">{money(livePrice)}</p>
            </div>
          ) : (
            <span className="text-xs text-neutral-400">&nbsp;</span>
          )}
        </div>
      ) : (
        <div className="space-y-1 text-xs">
          {spotPerOz ? (
            <>
              {/* <p className="text-neutral-600">
                Buy gold by dollar amount. Choose between{" "}
                <span className="font-medium">
                  {money(minAmount)} – {money(maxAmount)}
                </span>
                .
              </p>
              <p className="text-neutral-600">
                Premium:{" "}
                <span className="font-medium">
                  ${premiumPerGram.toFixed(2)} per gram
                </span>{" "}
                over live spot.
              </p> */}
              <p className="text-neutral-700">
                Est. price per gram now:{" "}
                <span className="font-semibold">{money(pricePerGram)} / g</span>
              </p>
              {gramsForCustomAmount > 0 && (
                <p className="text-neutral-700">
                  For {money(customAmount)} you get approx.{" "}
                  <span className="font-semibold">
                    {gramsForCustomAmount} g
                  </span>{" "}
                  of gold at current prices.
                </p>
              )}
            </>
          ) : (
            <p className="text-red-600">
              Live price unavailable. Please try again in a moment.
            </p>
          )}
        </div>
      )}

      {/* ===== CONTROLS ===== */}
      <div className="justify-self-center w-full">
        {!isCustomAmount ? (
          <>
            {livePrice != null ? (
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  meta: {
                    brand: product.brand,
                  },
                  // used later by /api/payment-intent
                  premiumUsd: product.premiumUsd,
                  weightGrams: product.weightGrams,
                }}
                priceUsd={livePrice}
              />
            ) : (
              <button
                className="btn-secondary w-full sm:w-auto cursor-pointer"
                disabled
                title="Price unavailable"
              >
                Add to Cart
              </button>
            )}
          </>
        ) : (
          <>
            {/* 🔥 Slider control for amount selection */}
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between">
                <label className="block text-xs font-medium text-neutral-700">
                  Choose amount (USD)
                </label>
                <span className="text-sm font-semibold">
                  {money(customAmount)}
                </span>
              </div>

              <input
                type="range"
                min={minAmount}
                max={maxAmount}
                step={10}
                className="w-full accent-black"
                value={customAmount}
                onChange={(e) => {
                  const v = Number(e.target.value || minAmount);
                  if (Number.isNaN(v)) return;
                  const clamped = Math.min(maxAmount, Math.max(minAmount, v));
                  setCustomAmount(clamped);
                }}
              />

              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>{money(minAmount)}</span>
                <span>{money(maxAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary mt-3 w-full"
              onClick={handleAddCustom}
              disabled={!spotPerOz}
            >
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
