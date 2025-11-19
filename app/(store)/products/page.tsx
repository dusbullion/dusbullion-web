// app/(store)/products/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import PRODUCTS from "@/app/lib/products";
import ProductGrid from "@/app/components/ProductGrid";

type SpotResponse = {
  usdPerOz: number;
  updatedAt: string;
  provider: string;
  error?: string;
};

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function ProductsPage() {
  const { data, isLoading, isError } = useQuery<SpotResponse>({
    queryKey: ["spot-price"],
    queryFn: async () => {
      const r = await fetch("/api/spot", { cache: "no-store" });
      return r.json();
    },
    refetchInterval: 15000, // refresh every 15s
  });

  const spotPerOz = data?.usdPerOz ?? 0;

  return (
    <section className="section py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-neutral-600">
          Live spot:{" "}
          {isLoading
            ? "loading…"
            : isError || !spotPerOz
            ? "unavailable"
            : `${money(spotPerOz)} / oz`}
        </p>
      </header>

      {/* Uses live spot price for each ProductCard */}
      <ProductGrid products={PRODUCTS} spotPerOz={spotPerOz} />
    </section>
  );
}
