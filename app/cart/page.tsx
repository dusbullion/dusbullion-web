// app/cart/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../store/cart";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotalFn = useCart((s) => s.subtotal);

  const total = subtotalFn();
  const shipping = total > 500 ? 0 : 15;
  const grand = total + shipping;

  if (!items.length) {
    return (
      <section className="section py-8 sm:py-12">
        <h1 className="text-xl font-semibold sm:text-2xl">Your Cart</h1>
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:mt-6 sm:p-6">
          <p className="text-neutral-600">Your cart is empty.</p>
          <Link href="/products" className="btn-secondary mt-4 inline-block">Browse Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section space-y-4 py-6 sm:space-y-6 sm:py-8">
      <h1 className="text-xl font-semibold sm:text-2xl">Your Cart</h1>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr,380px]">
        {/* Items */}
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-200">
            {items.map((it) => (
              <li key={it.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5">
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-24 sm:w-24 sm:shrink-0">
                  <Image src={it.image} alt={it.name} fill className="object-contain" />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* Title + unit price */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium sm:text-sm">{it.name}</p>
                      {it.meta?.brand && (
                        <p className="mt-0.5 text-sm text-neutral-500 sm:text-xs">{it.meta.brand}</p>
                      )}
                    </div>
                    <p className="text-base font-semibold sm:text-sm">{money(it.priceUsd)}</p>
                  </div>

                  {/* Qty + line total */}
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Qty control (compact on mobile) */}
                    <div className="flex w-40 items-stretch overflow-hidden rounded-xl border border-neutral-300 divide-x divide-neutral-300 sm:w-auto">
                      <button
                        className="grid h-10 w-12 place-items-center text-base sm:h-8 sm:w-10 sm:text-sm"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        aria-label="Decrease quantity"
                        type="button"
                      >
                        −
                      </button>

                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min={1}
                        className="h-10 w-16 appearance-none text-center text-base outline-none sm:h-8 sm:w-12 sm:text-sm"
                        value={it.qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || "1", 10);
                          setQty(it.id, isNaN(v) ? 1 : Math.max(1, v));
                        }}
                      />

                      <button
                        className="grid h-10 w-12 place-items-center text-base sm:h-8 sm:w-10 sm:text-sm"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        aria-label="Increase quantity"
                        type="button"
                      >
                        +
                      </button>
                    </div>


                    {/* Line total */}
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-neutral-500">Line total</p>
                      <p className="text-base font-semibold sm:text-sm">
                        {money(it.priceUsd * it.qty)}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className="mt-2 w-full text-left text-sm text-red-600 hover:underline sm:w-auto sm:text-xs"
                    onClick={() => remove(it.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer actions */}
          <div className="flex flex-col items-stretch gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={clear} className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 sm:w-auto">
              Clear cart
            </button>
            <Link href="/products" className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-center text-sm font-medium hover:bg-neutral-50 sm:w-auto">
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-max rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : money(shipping)}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{money(grand)}</span></div>
          </div>
          <button className="btn-secondary mt-4 w-full py-3 text-base sm:py-2 sm:text-sm">Checkout (placeholder)</button>
          <p className="mt-2 text-xs text-neutral-500">You’ll enter address & payment on the next step.</p>
        </aside>
      </div>
    </section>
  );
}
