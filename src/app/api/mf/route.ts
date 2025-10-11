import { NextResponse } from "next/server";

let cachedFunds: any[] = [];
let cacheTime = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const refresh = url.searchParams.get("refresh") === "true";

  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;

  // Force refresh if "refresh=true" (used by cron job)
  if (refresh || !cachedFunds.length || now - cacheTime > twelveHours) {
    console.log("⏳ Refreshing fund cache...");

    const res = await fetch("https://api.mfapi.in/mf");
    const allFunds = await res.json();

    const activeFunds = allFunds.filter((fund: any) => fund.isinGrowth);

    const results: any[] = [];
    const concurrency = 20;

    for (let i = 0; i < activeFunds.length; i += concurrency) {
      const batch = activeFunds.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (fund: any) => {
          try {
            const navRes = await fetch(`https://api.mfapi.in/mf/${fund.schemeCode}`);
            const navData = await navRes.json();
            const latest = navData?.data?.[0];
            if (!latest) return null;

            const today = new Date().toISOString().split("T")[0];
            const navDate = new Date(latest.date).toISOString().split("T")[0];
            if (navDate !== today) return null;

            return {
              ...fund,
              latestNav: latest.nav,
              navDate: latest.date,
            };
          } catch {
            return null;
          }
        })
      );
      results.push(...batchResults.filter(Boolean));
    }

    cachedFunds = results;
    cacheTime = now;
    console.log(`✅ Cached ${cachedFunds.length} active funds with today's NAV`);
  }

  let filteredFunds = cachedFunds;
  if (search) {
    filteredFunds = cachedFunds.filter((fund) =>
      fund.schemeName.toLowerCase().includes(search)
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedFunds = filteredFunds.slice(start, end);

  return NextResponse.json({
    total: filteredFunds.length,
    page,
    limit,
    funds: paginatedFunds,
  });
}
