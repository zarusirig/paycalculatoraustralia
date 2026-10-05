// =============================================================================
// Embeddable "current figure" badges: national minimum wage, super guarantee
// rate, tax-free threshold and HELP repayment threshold.
//
// One standalone HTML document at /embed/badge/?figure=<id>, served by a route
// handler (so it escapes the site layout, ads and analytics and is safe inside
// third-party iframes). Every value is read from the site's single sources of
// truth at build time, so a badge embedded on someone else's page shows the
// new figure as soon as this site is redeployed with the new rate. Publishers
// never edit the snippet.
//
// Relative imports only, so `npm test` can compile it without path aliases.
// =============================================================================

import {
  EMPLOYMENT,
  HECS_HELP,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_FREE_THRESHOLD,
} from "../constants/australian-tax";

export const BADGE_PATH = "/embed/badge/";
export const BADGE_URL = `${SITE_CONFIG.baseUrl}${BADGE_PATH}`;
export const BADGE_HEIGHT = 132;

const aud = (n: number, dp = 0) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

export interface FigureBadge {
  id: "minimum-wage" | "super-guarantee" | "tax-free-threshold" | "help-threshold";
  label: string;
  value: string;
  detail: string;
  /** Page on this site with the working and sources; the credit link goes here. */
  href: string;
}

export const FIGURE_BADGES: readonly FigureBadge[] = [
  {
    id: "minimum-wage",
    label: "National Minimum Wage",
    value: `${aud(EMPLOYMENT.minimumWageHourly, 2)} an hour`,
    detail: `${aud(EMPLOYMENT.minimumWageWeekly, 2)} for a ${EMPLOYMENT.standardWeeklyHours}-hour week, from 1 July 2026 (Fair Work Commission)`,
    href: `${SITE_CONFIG.baseUrl}/minimum-wage-australia/`,
  },
  {
    id: "super-guarantee",
    label: "Super guarantee rate",
    value: `${Math.round(SUPER_GUARANTEE.rate * 1000) / 10}%`,
    detail: `Employer super on qualifying earnings, ${SITE_CONFIG.financialYear} (ATO)`,
    href: `${SITE_CONFIG.baseUrl}/super-guarantee-rate-history/`,
  },
  {
    id: "tax-free-threshold",
    label: "Tax-free threshold",
    value: aud(TAX_FREE_THRESHOLD),
    detail: `Australian residents, ${SITE_CONFIG.financialYear} (ATO)`,
    href: `${SITE_CONFIG.baseUrl}/tax-free-threshold/`,
  },
  {
    id: "help-threshold",
    label: "HELP minimum repayment threshold",
    value: aud(HECS_HELP.minimumThreshold),
    detail: `Repayment income, ${SITE_CONFIG.financialYear} (ATO)`,
    href: `${SITE_CONFIG.baseUrl}/hecs-help-calculator/`,
  },
];

export type BadgeId = FigureBadge["id"];

export function isBadgeId(v: string | null | undefined): v is BadgeId {
  return FIGURE_BADGES.some((b) => b.id === v);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `
*{box-sizing:border-box}
:root{--ink:#1a2744;--muted:#5b6475;--line:#e3dccf;--bg:#ffffff;--accent:#1e7a5c;--accent-soft:#e6f5f0}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--ink:#eef1f6;--muted:#aab3c2;--line:#33405a;--bg:#141b2b;--accent:#5cc9a4;--accent-soft:#16372f}}
:root[data-theme=dark]{--ink:#eef1f6;--muted:#aab3c2;--line:#33405a;--bg:#141b2b;--accent:#5cc9a4;--accent-soft:#16372f}
html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.b{max-width:420px;margin:0;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--accent-soft)}
.k{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}
.v{font-size:28px;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums;line-height:1.15}
.d{font-size:13px;color:var(--muted);margin:2px 0 6px}
.c{font-size:12px;color:var(--muted)}
.c a{color:var(--accent);font-weight:600}
`;

/** The full HTML document. Pure: same output for the same constants. */
export function badgeHtml(): string {
  const sections = FIGURE_BADGES.map(
    (b) => `<section class="b" data-f="${b.id}">
<div class="k">${esc(b.label)}</div>
<div class="v">${esc(b.value)}</div>
<p class="d">${esc(b.detail)}</p>
<div class="c">Checked ${esc(SITE_CONFIG.lastVerified)}. Source and working: <a href="${b.href}" target="_blank" rel="noopener">${esc(SITE_CONFIG.name)}</a></div>
</section>`,
  ).join("\n");
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Current Australian pay and tax figures | ${SITE_CONFIG.name}</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${SITE_CONFIG.baseUrl}/embed/">
<meta name="description" content="Embeddable badge showing a current Australian pay or tax figure.">
<style>${CSS}</style>
</head>
<body>
${sections}
<script>
(function(){
var q=new URLSearchParams(location.search),f=q.get("figure"),all=document.querySelectorAll("[data-f]"),hit=false,i;
for(i=0;i<all.length;i++)if(all[i].getAttribute("data-f")===f)hit=true;
if(hit)for(i=0;i<all.length;i++)all[i].style.display=all[i].getAttribute("data-f")===f?"block":"none";
else for(i=1;i<all.length;i++)all[i].style.display="none";
if(q.get("theme")==="dark"||q.get("theme")==="light")document.documentElement.setAttribute("data-theme",q.get("theme"));
try{parent.postMessage({type:"pca-embed-height",height:document.documentElement.scrollHeight},"*")}catch(e){}
})();
</script>
</body>
</html>
`;
}

/** Copy-paste code: iframe plus a visible, crawlable credit link outside it. */
export function badgeEmbedCode(id: BadgeId, height: number = BADGE_HEIGHT): string {
  const b = FIGURE_BADGES.find((x) => x.id === id)!;
  return `<iframe src="${BADGE_URL}?figure=${id}" title="${esc(b.label)} (Australia)" width="100%" height="${height}" style="border:0;max-width:420px;width:100%" loading="lazy"></iframe>
<p style="font-size:13px;margin:4px 0 0">${esc(b.label)}: <a href="${b.href}">${SITE_CONFIG.name}</a></p>`;
}
