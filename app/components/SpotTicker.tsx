"use client";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

type SpotResponse = { usdPerOz: number; updatedAt: string; provider: string; error?: string };

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function SpotTicker() {
  const prev = useRef<number | null>(null);

  const { data, isLoading, isError } = useQuery<SpotResponse>({
    queryKey: ["spot-price"],
    queryFn: async () => {
      const r = await fetch("/api/spot", { cache: "no-store" });
      return r.json();
    },
    refetchInterval: 15000,
  });

  const price = data?.usdPerOz ?? 0;
  const diff = prev.current != null && price > 0 ? price - (prev.current as number) : 0;

  useEffect(() => {
    if (price > 0) prev.current = price;
  }, [price]);

  const arrow = diff > 0 ? "▲" : diff < 0 ? "▼" : "•";
  const arrowClass = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-neutral-500";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#c89f48]">
        <span>Gold (XAU):</span>
        <span className="inline-block h-3 w-16 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  if (isError || !price) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#c89f48]">
        <span>Gold (XAU):</span>
        <span className="text-neutral-500">unavailable</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-[#c89f48]">Gold (XAU):</span>
        <span className="font-medium text-white">{formatUsd(price)} / oz |</span>
        <span className="font-medium text-white">{formatUsd(price*31.1035)} / kg</span>
        <span className={`${arrowClass} text-[10px]`}>{arrow}</span>
    </div>
  );
}
