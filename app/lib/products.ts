// lib/products.ts

export type Metal = "GOLD" | "SILVER";
export type Form = "BAR" | "COIN";

export type Product = {
  id: string;
  sku: string;
  name: string;          // e.g. "Valcambi Suisse (1oz Gold Bar)"
  metal: Metal;          // "GOLD"
  form: Form;            // "BAR"
  weightGrams: number;   // 31.1035 for 1oz
  purity: string;        // "999.9"
  premiumUsd: number;    // added to spot (per oz)
  brand: string;         // display brand
  country: string;       // ISO-ish (e.g., "CH", "US")
  image: string;         // /public/products/...
  inStock: boolean;

  // 🔽 NEW – for special “custom per gram” product
  variableAmount?: boolean;     // true = user chooses dollar amount instead of qty
  minAmountUsd?: number;        // min amount user can enter
  maxAmountUsd?: number;        // max amount user can enter
  premiumPerGramUsd?: number;   // premium per gram over spot (e.g. 70)
};

export const PRODUCTS: Product[] = [
  // --- 🔥 NEW: Custom Gold Purchase (Per Gram) ---
  {
    id: "au-custom-gram",
    sku: "AU-CUSTOM-GRAM",
    name: "Dore Gold Purchase (Per Gram)",
    metal: "GOLD",
    form: "BAR",
    // These fields are not used in the standard way for this product,
    // but we must still provide values.
    weightGrams: 1,
    purity: "999.9",
    premiumUsd: 0,
    brand: "dusbullion",
    country: "US",
    image: "/products/dore-bar-gold-grains.jpg", // 👉 create this image in /public/products
    inStock: true,

    variableAmount: true,
    minAmountUsd: 100,
    maxAmountUsd: 5000,
    premiumPerGramUsd: 70, // $70 premium per gram over spot
  },
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
  // --- The Credit Suisse ---
  {
    id: "au-bar-1oz-credit-suisse",
    sku: "AU-BAR-1OZ-CREDITSUISSE",
    name: "The Credit Suisse (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 200,
    brand: "The Credit Suisse",
    country: "CH",
    image: "/products/credit-suisse-1oz.jpg",
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
    premiumUsd: 120,
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
    premiumUsd: 150,
    brand: "Valcambi Suisse",
    country: "CH",
    image: "/products/valcambi-1oz.jpg",
    inStock: true,
  },

  // --- Varied Mint (Any Mint) ---
  {
    id: "au-bar-1oz-varied-mint",
    sku: "AU-BAR-1OZ-VARIED",
    name: "Varied Mint – Any Mint (1oz Gold Bar)",
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
    premiumUsd: 200,
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
    premiumUsd: 200,
    brand: "PAMP Suisse",
    country: "CH",
    image: "/products/pamp-suisse-good-luck-yellow-dragon-1oz.jpg",
    inStock: true,
  },

  // --- PAMP Suisse Lady Fortuna Veriscan ---
  {
    id: "au-bar-1oz-pamp-veriscan",
    sku: "AU-BAR-1OZ-PAMPVERISCAN",
    name: "PAMP Suisse Lady Fortuna Veriscan (1oz Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 31.1035,
    purity: "999.9",
    premiumUsd: 200,
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
    premiumUsd: 120,
    brand: "The Perth Mint",
    country: "AU",
    image: "/products/perth-mint-1oz.jpg",
    inStock: true,
  },

  // --- The Varied Any Mint 1kg ---
  {
    id: "au-bar-1kg-varied",
    sku: "AU-BAR-1OZ-VARIED",
    name: "Varied Mint – Any Mint (1KG Gold Bar)",
    metal: "GOLD",
    form: "BAR",
    weightGrams: 999.865,
    purity: "999.9",
    premiumUsd: 3858,
    brand: "Various",
    country: "INTL",
    image: "/products/varied-anymint-1kg.jpg",
    inStock: true,
  },

  
];

export default PRODUCTS;

// Optional helpers
export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
export function listInStock() {
  return PRODUCTS.filter((p) => p.inStock);
}
