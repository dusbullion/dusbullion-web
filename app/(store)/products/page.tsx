import ProductCard from "../../components/ProductCard";
import PRODUCTS from "@/app/lib/products"; // your 1oz bars list

async function getSpot() {
  // Call your existing API route (server fetch)
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/spot`, {
    cache: "no-store",
  }).catch(() => null);

  if (!r || !r.ok) return { usdPerOz: 0 };
  return r.json();
}

export const metadata = {
  title: "Products | dusbullion.com",
  description: "Buy 1oz gold bars from top global mints at live spot-linked prices.",
};


export default async function ProductsPage() {
  const spot = await getSpot();
  const spotPerOz = Number(spot?.usdPerOz || 0);

  return (
    <section className="section py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-neutral-600 text-sm">
          Live spot: {spotPerOz ? spotPerOz.toLocaleString("en-US", { style: "currency", currency: "USD" }) + " / oz" : "unavailable"}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} p={p as any} spotPerOz={spotPerOz} />
        ))}
      </div>
    </section>
  );
}
