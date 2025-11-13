// app/api/spot/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // optional, fast

type SpotPayload = {
  usdPerOz: number;
  updatedAt: string;
  provider: string;
  error?: string;
};

export async function GET() {
  const provider = process.env.GOLD_API_PROVIDER || "metalsapi";
  const url = process.env.GOLD_API_URL;
  const key = process.env.GOLD_API_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Missing GOLD_API_URL/GOLD_API_KEY", usdPerOz: 0, updatedAt: new Date().toISOString(), provider },
      { status: 200 }
    );
  }

  try {
    let usdPerOz = 0;
    let updatedAt = new Date().toISOString();

    if (provider === "goldapi") {
      const res = await fetch(url, {
        headers: { "x-access-token": key, "Content-Type": "application/json" },
        next: { revalidate: 15 },
      });
      if (!res.ok) throw new Error(`Upstream ${res.status}`);
      const data = await res.json();
      // GoldAPI: data.price is USD/oz, data.timestamp (seconds)
      usdPerOz = Number(data?.price);
      updatedAt = data?.timestamp ? new Date(data.timestamp * 1000).toISOString() : updatedAt;
    } 
    else if (provider === "metalsapi") {
      const qs = new URLSearchParams({ base: "XAU", symbols: "USD", access_key: key });
      const res = await fetch(`${url}?${qs.toString()}`, { next: { revalidate: 15 } });
      if (!res.ok) throw new Error(`Upstream ${res.status}`);
      const data = await res.json();
      // Metals-API: data.rates.USD is USD per oz
      usdPerOz = Number(data?.rates?.USD);
      updatedAt = data?.timestamp ? new Date(data.timestamp * 1000).toISOString() : updatedAt;
    } 
    else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    if (!Number.isFinite(usdPerOz) || usdPerOz <= 0) throw new Error("Invalid price from provider");

    return new NextResponse(
      JSON.stringify({ usdPerOz, updatedAt, provider } satisfies SpotPayload),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=5, s-maxage=15, stale-while-revalidate=30",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { usdPerOz: 0, updatedAt: new Date().toISOString(), provider, error: err?.message || "Fetch failed" } as SpotPayload,
      { status: 200 }
    );
  }
}
