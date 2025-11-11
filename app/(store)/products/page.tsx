"use client";
import { useMemo, useState } from "react";
import ProductFilters, {SortKey} from "@/app/components/ProductFilters";
import ProductGrid from "@/app/components/ProductGrid";
import { Product } from "@/app/lib/types";
import { useCart } from "@/app/store/cart";

const PRODUCTS: Product[] = [
  // --- The Royal Mint ---
  {
    id: "au-bar-1oz-royal-mint",
    sku: "AU-BAR-1OZ-ROYALMINT",
    name: "The Royal Mint – Una and the Lion (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "The Royal Mint",
    country: "UK",
    image: "/products/Great-Britain-Great-Engravers-Collection-Una-Lion-1oz.jpg",
    inStock: true,
  },

  // --- Italpreziosi ---
  {
    id: "au-bar-1oz-italpreziosi",
    sku: "AU-BAR-1OZ-ITALPREZIOSI",
    name: "Italpreziosi (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "Italpreziosi",
    country: "IT",
    image: "/products/Italpreziosi-1oz.jpg",
    inStock: true,
  },

  // --- Johnson Matthey ---
  {
    id: "au-bar-1oz-johnson",
    sku: "AU-BAR-1OZ-JM",
    name: "Johnson Matthey (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "Johnson Matthey",
    country: "US",
    image: "/products/johnson-matthey-1oz.jpg",
    inStock: true,
  },

  // --- PAMP Suisse Classic ---
  {
    id: "au-bar-1oz-pamp",
    sku: "AU-BAR-1OZ-PAMP",
    name: "PAMP Suisse Classic (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "PAMP Suisse",
    country: "CH",
    image: "/products/pamp-suisse-classic-1oz.jpg",
    inStock: true,
  },

  // --- American Reserve ---
  {
    id: "au-bar-1oz-american-reserve",
    sku: "AU-BAR-1OZ-AMERICANRESERVE",
    name: "American Reserve (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "American Reserve",
    country: "US",
    image: "/products/american-reserve-1oz.jpg",
    inStock: true,
  },

  // --- Argor-Heraeus ---
  {
    id: "au-bar-1oz-argor",
    sku: "AU-BAR-1OZ-ARGOR",
    name: "Argor-Heraeus (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "Argor-Heraeus",
    country: "CH",
    image: "/products/argor-heraeus-1oz.jpg",
    inStock: true,
  },

  // --- Asahi Refining ---
  {
    id: "au-bar-1oz-asahi",
    sku: "AU-BAR-1OZ-ASAHI",
    name: "Asahi Refining (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "Asahi Refining",
    country: "US",
    image: "/products/asahi-1oz.jpg",
    inStock: true,
  },

  // --- The Holy Land Mint – Lion of Judah ---
  {
    id: "au-bar-1oz-lion-judah",
    sku: "AU-BAR-1OZ-LIONJUDAH",
    name: "The Holy Land Mint – Lion of Judah (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 160,
    brand: "The Holy Land Mint",
    country: "IL",
    image: "/products/The-Holy-Land-Mint-Lion-of-Judah-1oz.jpg",
    inStock: true,
  },

  // --- Valcambi Suisse ---
  {
    id: "au-bar-1oz-valcambi",
    sku: "AU-BAR-1OZ-VALCAMBI",
    name: "Valcambi Suisse (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 145,
    brand: "Valcambi Suisse",
    country: "CH",
    image: "/products/valcambi-1oz.jpg",
    inStock: true,
  },

  // --- Varied Mint ---
  {
    id: "au-bar-1oz-varied-mint",
    sku: "AU-BAR-1OZ-VARIED",
    name: "Any Varied – Any Mint (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 140,
    brand: "Various",
    country: "INTL",
    image: "/products/varied-anymint-1oz.jpg",
    inStock: true,
  },

  // --- PAMP Suisse Lady Fortuna ---
  {
    id: "au-bar-1oz-pamp-fortuna",
    sku: "AU-BAR-1OZ-PAMPFORTUNA",
    name: "PAMP Suisse Lady Fortuna (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 155,
    brand: "PAMP Suisse",
    country: "CH",
    image: "/products/pamp-suisse-fortuna-1oz.jpg",
    inStock: true,
  },

  // --- PAMP Suisse Good Luck Dragon ---
  {
    id: "au-bar-1oz-good-luck",
    sku: "AU-BAR-1OZ-PAMPGOODLUCK",
    name: "PAMP Suisse Good Luck Dragon (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 155,
    brand: "PAMP Suisse",
    country: "CH",
    image: "/products/pamp-suisse-good-luck-yellow-dragon-1oz.jpg",
    inStock: true,
  },

  // --- PAMP Suisse Veriscan ---
  {
    id: "au-bar-1oz-pamp-veriscan",
    sku: "AU-BAR-1OZ-PAMPVERISCAN",
    name: "PAMP Suisse Lady Fortuna Veriscan (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 155,
    brand: "PAMP Suisse",
    country: "CH",
    image: "/products/pamp-suisse-lady-fortuna-veriscan-1oz.jpg",
    inStock: true,
  },

  // --- The Perth Mint ---
  {
    id: "au-bar-1oz-perth",
    sku: "AU-BAR-1OZ-PERTH",
    name: "The Perth Mint Australia (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 150,
    brand: "The Perth Mint",
    country: "AU",
    image: "/products/perth-mint-1oz.jpg",
    inStock: true,
  },
];

export default function ProductsPage() {
  const add = useCart((s) => s.add);

  const [form, setForm] = useState<"ALL" | "BAR" | "COIN">("ALL");
  const [weight, setWeight] = useState<"ALL" | "10g" | "1oz" | "100g">("ALL");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("price-asc");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (form !== "ALL" && p.form !== form) return false;

      if (weight !== "ALL") {
        if (weight === "10g" && Math.abs(p.weightGrams - 10) > 0.01) return false;
        if (weight === "1oz" && Math.abs(p.weightGrams - 31.1035) > 0.01) return false;
        if (weight === "100g" && Math.abs(p.weightGrams - 100) > 0.01) return false;
      }

      if (inStockOnly && !p.inStock) return false;
      return true;
    });
  }, [form, weight, inStockOnly]);

  // Sort by premium or estimated price (approx using $2,000/oz baseline to keep it static client-side)
  const sorted = useMemo(() => {
    // Static baseline used only for sorting consistency without waiting for live spot
    const baselineOz = 2000;
    const GRAMS_PER_OZ = 31.1034768;

    const withApprox = filtered.map((p) => {
      const oz = p.weightGrams / GRAMS_PER_OZ;
      const approxPrice = baselineOz * oz + p.premiumUsd;
      return { p, approxPrice };
    });

    withApprox.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.approxPrice - b.approxPrice;
        case "price-desc":
          return b.approxPrice - a.approxPrice;
        case "premium-asc":
          return a.p.premiumUsd - b.p.premiumUsd;
        case "premium-desc":
          return b.p.premiumUsd - a.p.premiumUsd;
        default:
          return 0;
      }
    });

    return withApprox.map((x) => x.p);
  }, [filtered, sort]);

  const reset = () => {
    setForm("ALL");
    setWeight("ALL");
    setInStockOnly(false);
    setSort("price-asc");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-neutral-600">{sorted.length} items</p>
      </div>

      <ProductFilters
        form={form}
        setForm={setForm}
        weight={weight}
        setWeight={setWeight}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        sort={sort}
        setSort={setSort}
        reset={reset}
      />

      <ProductGrid
        products={sorted}
        onAdd={(p) => add(p, 1)}
      />
    </section>
  );
}
