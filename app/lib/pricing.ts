// app/lib/pricing.ts
import { TROY_OUNCE_IN_GRAMS } from "./money";

export type PricedItem = {
  premiumUsd?: number;
  weightGrams?: number;
};

export function computeUnitPriceUsd(
  spotPerOz: number,
  item: PricedItem
): number {
  if (!spotPerOz || !Number.isFinite(spotPerOz)) return 0;
  const grams = Number(item.weightGrams || TROY_OUNCE_IN_GRAMS);
  const spotPerUnit = spotPerOz * (grams / TROY_OUNCE_IN_GRAMS);
  const unitUsd = spotPerUnit + Number(item.premiumUsd || 0);
  return Math.max(0, unitUsd);
}
