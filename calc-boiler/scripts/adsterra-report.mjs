// Adsterra revenue report, normalised for traffic.
//
// Absolute revenue is close to useless for judging an ad change on this site,
// because underlying traffic swings hard with the Australian financial year —
// pageviews fell ~73% between early and late July 2026 while revenue stayed
// flat, purely because CPM happened to rise over the same window. Comparing
// "revenue before" to "revenue after" would have scored that as a win.
//
// So this reports revenue per 1,000 PAGEVIEWS, not per impression. The 728x90
// (desktop) and 320x50 (mobile) units fire once per pageview on their
// respective breakpoints, so their combined impressions are a usable pageview
// proxy that is independent of whatever the unit under test is doing.
//
// Usage:
//   ADSTERRA_API_KEY=xxx node scripts/adsterra-report.mjs 2026-06-28 2026-07-28
//
// The key is read from the environment on purpose. Do not paste it in here.

const API = "https://api3.adsterratools.com/publisher";
const DOMAIN = 5803712; // pay-calculator-australia.com

// Placement IDs from /publisher/placements.json for this domain.
const PLACEMENTS = {
  29439537: "SocialBar",
  29439539: "300x250",
  29439538: "468x60",
  29439544: "320x50",
  29439543: "728x90",
  29439541: "160x600",
};

// Units that render once per pageview, used as the traffic denominator.
//
// CAVEAT for date ranges before 2026-07-28: until that deploy the 320x50 was
// rendered TWICE per mobile pageview (top and bottom shared one key), so the
// mobile half of this proxy is roughly double-counted in earlier windows and
// pageviews are overstated. Do not compare a per-1k figure from before that
// date against one from after it without halving the historical 320x50 count.
const PAGEVIEW_PROXY = [29439543, 29439544]; // 728x90 desktop + 320x50 mobile
const PROXY_FIX_DATE = "2026-07-28";

const key = process.env.ADSTERRA_API_KEY;
if (!key) {
  console.error("Set ADSTERRA_API_KEY in the environment.");
  process.exit(1);
}

const [, , from, to] = process.argv;
if (!from || !to) {
  console.error("Usage: node scripts/adsterra-report.mjs <YYYY-MM-DD> <YYYY-MM-DD>");
  process.exit(1);
}

async function fetchStats(groupBy) {
  const url = `${API}/stats.json?start_date=${from}&finish_date=${to}&group_by=${groupBy}&domain=${DOMAIN}`;
  const res = await fetch(url, { headers: { "X-API-Key": key } });
  if (!res.ok) throw new Error(`Adsterra ${groupBy} request failed: ${res.status}`);
  return (await res.json()).items ?? [];
}

const byPlacement = await fetchStats("placement");
const byDate = await fetchStats("date");

const pageviews = byPlacement
  .filter((r) => PAGEVIEW_PROXY.includes(r.placement))
  .reduce((sum, r) => sum + r.impression, 0);

const revenue = byPlacement.reduce((sum, r) => sum + r.revenue, 0);

console.log(`\nAdsterra — pay-calculator-australia.com — ${from} to ${to}`);
console.log(`Estimated pageviews: ${pageviews.toLocaleString()}  (728x90 + 320x50 impressions)`);
if (from < PROXY_FIX_DATE) {
  console.log(
    `WARNING: range starts before ${PROXY_FIX_DATE}, when the 320x50 fired twice per\n` +
      `         mobile pageview. Pageviews are overstated and per-1k figures understated.`,
  );
}
console.log("");

console.log("placement       impressions        revenue     per 1k pageviews");
for (const row of byPlacement.sort((a, b) => b.revenue - a.revenue)) {
  const name = PLACEMENTS[row.placement] ?? String(row.placement);
  const per1k = pageviews ? (row.revenue / pageviews) * 1000 : 0;
  console.log(
    `${name.padEnd(14)}${String(row.impression).padStart(12)}` +
      `${("$" + row.revenue.toFixed(2)).padStart(15)}${("$" + per1k.toFixed(2)).padStart(21)}`,
  );
}

const totalPer1k = pageviews ? (revenue / pageviews) * 1000 : 0;
console.log(`\nTOTAL         ${String("").padStart(12)}${("$" + revenue.toFixed(2)).padStart(15)}${("$" + totalPer1k.toFixed(2)).padStart(21)}`);

// Daily variance sets the floor on what any A/B comparison can actually detect.
const daily = byDate.map((r) => r.revenue);
if (daily.length > 1) {
  const mean = daily.reduce((a, b) => a + b, 0) / daily.length;
  const sd = Math.sqrt(daily.reduce((s, x) => s + (x - mean) ** 2, 0) / daily.length);
  const seDiff = Math.sqrt(2) * (sd / mean) / Math.sqrt(daily.length);
  console.log(
    `\nDaily revenue: mean $${mean.toFixed(2)}, stdev $${sd.toFixed(2)} (${((sd / mean) * 100).toFixed(0)}% of mean)`,
  );
  console.log(
    `Smallest change a ${daily.length}-day A/B could detect at 95%: ~${(1.96 * seDiff * 100).toFixed(0)}%`,
  );
}
