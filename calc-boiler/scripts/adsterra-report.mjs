#!/usr/bin/env node
// Adsterra revenue report for pay-calculator-australia.com.
//
// Usage (run from calc-boiler; node 18+, no dependencies):
//
//   node scripts/adsterra-report.mjs                       # last 28 days, print to stdout
//   node scripts/adsterra-report.mjs --days 7 --compare    # last 7 days vs the 7 before
//   node scripts/adsterra-report.mjs --from 2026-09-01 --to 2026-09-28
//   node scripts/adsterra-report.mjs --days 28 --compare --out auto
//   node scripts/adsterra-report.mjs --days 28 --out /tmp/report.md
//   node scripts/adsterra-report.mjs --days 28 --out auto --note "Baseline before X"
//
// Flags:
//   --days N          window length in days (default 28). The window ends
//                     YESTERDAY (UTC) because Adsterra's figure for today is
//                     partial and would drag the average down.
//   --from / --to     explicit window (YYYY-MM-DD, inclusive). Overrides --days.
//   --compare         also fetch the same-length window immediately before and
//                     show the delta (totals + a per-placement delta column).
//   --out <path>      write the Markdown report to <path> instead of stdout.
//   --out auto        write to <repo root>/docs/revenue/YYYY-MM-DD-adsterra-<N>d.md
//                     (repo root = parent of calc-boiler, resolved from this
//                     file's location so the cwd does not matter).
//   --note "<text>"   a line printed directly under the title, e.g. to mark a
//                     report as the baseline for a test.
//
// Auth: reads ADSTERRA_API_TOKEN from the environment, falling back to
// ~/.config/adsterra/env (a KEY=value file). The token is never printed and
// must never be committed. The API is GET-only; nothing here can change the
// account.
//
// All money is USD, as reported by Adsterra. Adsterra's "cpm" is revenue per
// 1,000 impressions of that unit. The extra "revenue per 1k pageviews" line
// uses 728x90 + 320x50 impressions as a pageview proxy (each fires once per
// pageview on its breakpoint) so an ad change can be judged independently of
// traffic swings — see docs/revenue/README.md.

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://api3.adsterratools.com/publisher";
const DOMAIN_ID = 5803712; // pay-calculator-australia.com
const DOMAIN_NAME = "pay-calculator-australia.com";

const PLACEMENTS = {
  29439537: "SocialBar_1",
  29439543: "728x90",
  29439539: "300x250",
  29439544: "320x50",
  29439538: "468x60",
  29439541: "160x600",
  29439540: "160x300",
  29439534: "Popunder_1",
  29439535: "NativeBanner_1",
  29439536: "Smartlink_1",
};
const SOCIAL_BAR_ID = 29439537;
// Units that render once per pageview on their breakpoint (desktop / mobile).
const PAGEVIEW_PROXY = [29439543, 29439544];

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const args = { days: 28, from: null, to: null, compare: false, out: null, note: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) fail(`${a} needs a value`);
      return v;
    };
    if (a === "--days") args.days = Number(next());
    else if (a === "--from") args.from = next();
    else if (a === "--to") args.to = next();
    else if (a === "--compare") args.compare = true;
    else if (a === "--out") args.out = next();
    else if (a === "--note") args.note = next();
    else if (a === "-h" || a === "--help") {
      console.log("See the comment at the top of scripts/adsterra-report.mjs for usage.");
      process.exit(0);
    } else fail(`Unknown argument: ${a}`);
  }
  if (!Number.isInteger(args.days) || args.days < 1) fail("--days must be a positive integer");
  if ((args.from && !args.to) || (!args.from && args.to)) fail("--from and --to must be given together");
  for (const d of [args.from, args.to]) {
    if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) fail(`Bad date "${d}", expected YYYY-MM-DD`);
  }
  return args;
}

function fail(msg) {
  console.error(`adsterra-report: ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------- dates

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(isoDate, n) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
}

function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;
}

function resolveWindow(args) {
  if (args.from) {
    if (args.from > args.to) fail("--from is after --to");
    return { from: args.from, to: args.to, days: daysBetween(args.from, args.to) };
  }
  const to = addDays(iso(new Date()), -1); // yesterday, UTC
  return { from: addDays(to, -(args.days - 1)), to, days: args.days };
}

// ---------------------------------------------------------------- auth

async function loadToken() {
  if (process.env.ADSTERRA_API_TOKEN) return process.env.ADSTERRA_API_TOKEN;
  if (process.env.ADSTERRA_API_KEY) return process.env.ADSTERRA_API_KEY;
  const envPath = path.join(homedir(), ".config", "adsterra", "env");
  let text;
  try {
    text = await readFile(envPath, "utf8");
  } catch {
    fail(`no ADSTERRA_API_TOKEN in the environment and could not read ${envPath}`);
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?(ADSTERRA_API_TOKEN|ADSTERRA_API_KEY)\s*=\s*"?([^"\s]+)"?\s*$/);
    if (m) return m[2];
  }
  fail(`${envPath} does not contain ADSTERRA_API_TOKEN=...`);
}

// ---------------------------------------------------------------- api

async function getJson(token, endpoint) {
  const res = await fetch(`${API}/${endpoint}`, { headers: { "X-API-Key": token } });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 200);
    throw new Error(`Adsterra ${endpoint.split("?")[0]} -> HTTP ${res.status}: ${body}`);
  }
  return res.json();
}

async function fetchStats(token, from, to, groupBy) {
  const q = `domain=${DOMAIN_ID}&start_date=${from}&finish_date=${to}&group_by=${groupBy}`;
  const json = await getJson(token, `stats.json?${q}`);
  return { items: json.items ?? [], updated: json.dbLastUpdateTime ?? null };
}

async function fetchPeriod(token, from, to) {
  const [byDate, byPlacement, byCountry] = await Promise.all([
    fetchStats(token, from, to, "date"),
    fetchStats(token, from, to, "placement"),
    fetchStats(token, from, to, "country"),
  ]);
  const totals = sumRows(byPlacement.items);
  const pageviews = byPlacement.items
    .filter((r) => PAGEVIEW_PROXY.includes(r.placement))
    .reduce((s, r) => s + (r.impression ?? 0), 0);
  return {
    from,
    to,
    days: daysBetween(from, to),
    updated: byDate.updated,
    byDate: [...byDate.items].sort((a, b) => (a.date < b.date ? -1 : 1)),
    byPlacement: [...byPlacement.items].sort((a, b) => b.revenue - a.revenue),
    byCountry: [...byCountry.items].sort((a, b) => b.revenue - a.revenue),
    totals,
    pageviews,
  };
}

function sumRows(rows) {
  const t = { impression: 0, clicks: 0, revenue: 0 };
  for (const r of rows) {
    t.impression += r.impression ?? 0;
    t.clicks += r.clicks ?? 0;
    t.revenue += r.revenue ?? 0;
  }
  t.cpm = t.impression ? (t.revenue / t.impression) * 1000 : 0;
  return t;
}

// ---------------------------------------------------------------- formatting

const usd = (n) => `$${n.toFixed(2)}`;
const int = (n) => Math.round(n).toLocaleString("en-AU");
const pct = (n) => `${n.toFixed(1)}%`;

function delta(now, before) {
  if (!before) return now ? "new" : "–";
  const d = ((now - before) / before) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`;
}

function placementName(id) {
  return PLACEMENTS[id] ?? String(id);
}

function table(headers, rows, align) {
  const sep = headers.map((_, i) => (align?.[i] === "r" ? "---:" : "---"));
  return [`| ${headers.join(" | ")} |`, `| ${sep.join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
}

function buildReport(cur, prev, opts) {
  const lines = [];
  const title = `# Adsterra revenue — ${DOMAIN_NAME} — ${cur.from} to ${cur.to} (${cur.days}d)`;
  lines.push(title, "");
  if (opts.note) lines.push(`**${opts.note}**`, "");
  lines.push(
    `Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC` +
      (cur.updated ? ` · Adsterra data last updated ${cur.updated}` : "") +
      ". All figures USD.",
    "",
  );

  // Totals
  const t = cur.totals;
  const sb = cur.byPlacement.find((r) => r.placement === SOCIAL_BAR_ID);
  const sbRev = sb?.revenue ?? 0;
  const sbShare = t.revenue ? (sbRev / t.revenue) * 100 : 0;
  const per1k = cur.pageviews ? (t.revenue / cur.pageviews) * 1000 : 0;
  const sbPer1k = cur.pageviews ? (sbRev / cur.pageviews) * 1000 : 0;

  lines.push("## Totals", "");
  const totalRows = [
    ["Revenue", usd(t.revenue)],
    ["Impressions", int(t.impression)],
    ["Clicks", int(t.clicks)],
    ["CPM (all units)", usd(t.cpm)],
    ["Revenue / day", usd(t.revenue / cur.days)],
    ["Social Bar revenue", `${usd(sbRev)} (${pct(sbShare)} of total)`],
    ["Est. pageviews (728x90 + 320x50 impressions)", int(cur.pageviews)],
    ["Revenue per 1k pageviews", usd(per1k)],
    ["Social Bar revenue per 1k pageviews", usd(sbPer1k)],
  ];
  if (prev) {
    const p = prev.totals;
    const psb = prev.byPlacement.find((r) => r.placement === SOCIAL_BAR_ID)?.revenue ?? 0;
    const pPer1k = prev.pageviews ? (p.revenue / prev.pageviews) * 1000 : 0;
    const pSbPer1k = prev.pageviews ? (psb / prev.pageviews) * 1000 : 0;
    const prevCol = [
      usd(p.revenue),
      int(p.impression),
      int(p.clicks),
      usd(p.cpm),
      usd(p.revenue / prev.days),
      `${usd(psb)} (${pct(p.revenue ? (psb / p.revenue) * 100 : 0)})`,
      int(prev.pageviews),
      usd(pPer1k),
      usd(pSbPer1k),
    ];
    const deltaCol = [
      delta(t.revenue, p.revenue),
      delta(t.impression, p.impression),
      delta(t.clicks, p.clicks),
      delta(t.cpm, p.cpm),
      delta(t.revenue / cur.days, p.revenue / prev.days),
      delta(sbRev, psb),
      delta(cur.pageviews, prev.pageviews),
      delta(per1k, pPer1k),
      delta(sbPer1k, pSbPer1k),
    ];
    lines.push(
      table(
        ["Metric", `Current (${cur.from} → ${cur.to})`, `Prior (${prev.from} → ${prev.to})`, "Δ"],
        totalRows.map((r, i) => [r[0], r[1], prevCol[i], deltaCol[i]]),
        ["l", "r", "r", "r"],
      ),
    );
  } else {
    lines.push(table(["Metric", "Value"], totalRows, ["l", "r"]));
  }
  lines.push("");

  // Per placement
  lines.push("## By placement", "");
  const headers = ["Placement", "Impressions", "Clicks", "CPM", "Revenue", "Share"];
  if (prev) headers.push(`Prior revenue`, "Δ revenue");
  const plRows = cur.byPlacement.map((r) => {
    const row = [
      placementName(r.placement),
      int(r.impression),
      int(r.clicks),
      usd(r.cpm ?? 0),
      usd(r.revenue),
      pct(t.revenue ? (r.revenue / t.revenue) * 100 : 0),
    ];
    if (prev) {
      const pr = prev.byPlacement.find((x) => x.placement === r.placement)?.revenue ?? 0;
      row.push(usd(pr), delta(r.revenue, pr));
    }
    return row;
  });
  if (prev) {
    // Placements that earned in the prior window but not in this one.
    for (const pr of prev.byPlacement) {
      if (cur.byPlacement.some((r) => r.placement === pr.placement)) continue;
      plRows.push([placementName(pr.placement), "0", "0", usd(0), usd(0), pct(0), usd(pr.revenue), delta(0, pr.revenue)]);
    }
  }
  lines.push(table(headers, plRows, ["l", "r", "r", "r", "r", "r", "r", "r"]), "");

  // Per day (last 14)
  const dayRows = cur.byDate.slice(-14);
  lines.push(`## By day (last ${dayRows.length} days of the window)`, "");
  lines.push(
    table(
      ["Date", "Impressions", "Clicks", "CPM", "Revenue"],
      dayRows.map((r) => [r.date, int(r.impression), int(r.clicks), usd(r.cpm ?? 0), usd(r.revenue)]),
      ["l", "r", "r", "r", "r"],
    ),
    "",
  );
  if (cur.byDate.length > 1) {
    const daily = cur.byDate.map((r) => r.revenue);
    const mean = daily.reduce((a, b) => a + b, 0) / daily.length;
    const sd = Math.sqrt(daily.reduce((s, x) => s + (x - mean) ** 2, 0) / daily.length);
    const seDiff = mean ? (Math.SQRT2 * (sd / mean)) / Math.sqrt(daily.length) : 0;
    lines.push(
      `Daily revenue: mean ${usd(mean)}, stdev ${usd(sd)} (${mean ? ((sd / mean) * 100).toFixed(0) : 0}% of mean). ` +
        `Smallest before/after change a ${daily.length}-day window can detect at 95%: ~${(1.96 * seDiff * 100).toFixed(0)}%.`,
      "",
    );
  }

  // Top countries
  lines.push("## Top 5 countries by revenue", "");
  lines.push(
    table(
      ["Country", "Impressions", "Clicks", "CPM", "Revenue", "Share"],
      cur.byCountry
        .slice(0, 5)
        .map((r) => [
          r.country,
          int(r.impression),
          int(r.clicks),
          usd(r.cpm ?? 0),
          usd(r.revenue),
          pct(t.revenue ? (r.revenue / t.revenue) * 100 : 0),
        ]),
      ["l", "r", "r", "r", "r", "r"],
    ),
    "",
  );

  lines.push(
    "---",
    `Source: Adsterra Publisher API, domain ${DOMAIN_ID}. Generated by \`calc-boiler/scripts/adsterra-report.mjs\`.`,
    "",
  );
  return lines.join("\n");
}

// ---------------------------------------------------------------- main

const args = parseArgs(process.argv.slice(2));
const win = resolveWindow(args);
const token = await loadToken();

const current = await fetchPeriod(token, win.from, win.to);
let previous = null;
if (args.compare) {
  const prevTo = addDays(win.from, -1);
  const prevFrom = addDays(prevTo, -(win.days - 1));
  previous = await fetchPeriod(token, prevFrom, prevTo);
}

const report = buildReport(current, previous, { note: args.note });

if (args.out) {
  let outPath = args.out;
  if (outPath === "auto") {
    const here = path.dirname(fileURLToPath(import.meta.url)); // calc-boiler/scripts
    const repoRoot = path.resolve(here, "..", "..");
    outPath = path.join(repoRoot, "docs", "revenue", `${iso(new Date())}-adsterra-${win.days}d.md`);
  }
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, report, "utf8");
  console.log(`Wrote ${outPath}`);
  // Echo the headline so the caller sees it without opening the file.
  const sb = current.byPlacement.find((r) => r.placement === SOCIAL_BAR_ID)?.revenue ?? 0;
  const t = current.totals;
  let headline = `${win.from} → ${win.to}: revenue ${usd(t.revenue)}, Social Bar ${usd(sb)} (${pct(t.revenue ? (sb / t.revenue) * 100 : 0)})`;
  if (previous) headline += `, vs prior ${previous.days}d ${delta(t.revenue, previous.totals.revenue)}`;
  console.log(headline);
} else {
  process.stdout.write(report);
}
