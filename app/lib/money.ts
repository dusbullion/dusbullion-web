// app/lib/money.ts
export const TROY_OUNCE_IN_GRAMS = 31.1034768;

export function usdToCents(n: number) {
  return Math.max(0, Math.round(n * 100));
}

export function centsToUsd(n: number) {
  return n / 100;
}
