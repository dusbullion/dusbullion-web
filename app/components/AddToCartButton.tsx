// app/components/AddToCartButton.tsx
"use client";

import { useCart } from "../store/cart";

type ProductInput = {
  id: string;
  name: string;
  image: string;
  meta?: { brand?: string; [key: string]: any };
  premiumUsd?: number;
  weightGrams?: number;
};

type Props = {
  product: ProductInput;
  priceUsd: number;
};

export default function AddToCartButton({ product, priceUsd }: Props) {
  const add = useCart((s) => s.add);
  
  return (
    <button
      className="btn-secondary w-full sm:w-auto cursor-pointer"
      onClick={() =>
        add(
          {
            id: product.id,
            name: product.name,
            image: product.image,
            priceUsd,                 // used for UI subtotal
            meta: product.meta,
            premiumUsd: product.premiumUsd,   // 🔐 used by /api/checkout
            weightGrams: product.weightGrams, // 🔐 used by /api/checkout
          },
          1
        )
      }
    >
      Add to Cart
    </button>
  );
}
