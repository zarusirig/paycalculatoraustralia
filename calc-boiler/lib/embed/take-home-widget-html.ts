// =============================================================================
// The standalone HTML document for /embed/take-home-pay/ (F8, Lever D).
//
// Self-contained on purpose: no site layout, no ads, no popunder, no
// analytics, no external requests — it runs inside other people's pages.
// noindex + canonical to the full calculator; the page that should rank is
// /take-home-pay-calculator/, and the embed code's credit link points there.
// =============================================================================

import { SITE_CONFIG } from "../constants/australian-tax";
import { EMBED_DATA, EMBED_ENGINE_JS } from "./take-home-engine";

export const EMBED_PATH = "/embed/take-home-pay/";
export const EMBED_URL = `${SITE_CONFIG.baseUrl}${EMBED_PATH}`;
export const EMBED_CANONICAL = `${SITE_CONFIG.baseUrl}/take-home-pay-calculator/`;
export const EMBED_DEFAULT_HEIGHT = 560;
/** postMessage type the optional auto-resize snippet listens for. */
export const EMBED_RESIZE_MESSAGE = "pca-embed-height";

const CSS = `
*{box-sizing:border-box}
:root{--ink:#1a2744;--muted:#5b6475;--line:#e3dccf;--bg:#ffffff;--panel:#f7f3ec;--accent:#1e7a5c;--accent-soft:#e6f5f0}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--ink:#eef1f6;--muted:#aab3c2;--line:#33405a;--bg:#141b2b;--panel:#1b2438;--accent:#5cc9a4;--accent-soft:#16372f}}
:root[data-theme=dark]{--ink:#eef1f6;--muted:#aab3c2;--line:#33405a;--bg:#141b2b;--panel:#1b2438;--accent:#5cc9a4;--accent-soft:#16372f}
html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.w{max-width:640px;margin:0 auto;padding:16px;border:1px solid var(--line);border-radius:12px}
h1{font-size:18px;margin:0 0 2px}
.sub{color:var(--muted);font-size:13px;margin:0 0 14px}
.row{display:flex;gap:8px;flex-wrap:wrap}
label{font-size:13px;font-weight:600;display:block;margin-bottom:4px}
.f{flex:1 1 180px}
input[type=number],select{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font-size:16px}
.chk{display:flex;gap:14px;flex-wrap:wrap;margin:10px 0 14px;font-size:14px}
.chk label{font-weight:500;display:flex;align-items:center;gap:6px;margin:0}
.hero{background:var(--accent-soft);border-radius:10px;padding:12px 14px;margin-bottom:10px}
.hero .k{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}
.hero .v{font-size:30px;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.cell{background:var(--panel);border-radius:8px;padding:8px 10px}
.cell .k{font-size:12px;color:var(--muted)}
.cell .v{font-weight:700;font-variant-numeric:tabular-nums}
table{width:100%;border-collapse:collapse;font-size:14px}
td{padding:5px 0;border-top:1px solid var(--line)}
td:last-child{text-align:right;font-variant-numeric:tabular-nums}
.foot{margin-top:12px;font-size:12px;color:var(--muted)}
.foot a{color:var(--accent);font-weight:600}
@media (max-width:420px){.grid{grid-template-columns:1fr 1fr}}
`;

/** The full HTML document. Pure — same output for the same constants. */
export function takeHomeWidgetHtml(): string {
  const data = JSON.stringify(EMBED_DATA);
  const fy = EMBED_DATA.fy;
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Take-Home Pay Calculator ${fy} | ${SITE_CONFIG.name}</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${EMBED_CANONICAL}">
<meta name="description" content="Embeddable Australian take-home pay calculator for ${fy}.">
<style>${CSS}</style>
</head>
<body>
<main class="w">
<h1>Take-home pay calculator</h1>
<p class="sub">Australian residents, ${fy} ATO tax rates</p>
<form id="f" onsubmit="return false">
<div class="row">
<div class="f"><label for="s">Salary or wage ($)</label><input id="s" type="number" inputmode="decimal" min="0" step="any" value="80000"></div>
<div class="f"><label for="p">Paid per</label><select id="p"><option value="1">Year</option><option value="12">Month</option><option value="26">Fortnight</option><option value="52">Week</option><option value="h">Hour (${EMBED_DATA.hoursPerWeek} hrs/wk)</option></select></div>
</div>
<div class="chk"><label><input id="h" type="checkbox"> I have a HECS/HELP debt</label><label><input id="i" type="checkbox"> Amount includes super</label></div>
</form>
<div class="hero" aria-live="polite"><div class="k">Take-home pay per year</div><div class="v" id="ty">$0</div></div>
<div class="grid"><div class="cell"><div class="k">Monthly</div><div class="v" id="tm">$0</div></div><div class="cell"><div class="k">Fortnightly</div><div class="v" id="tf">$0</div></div><div class="cell"><div class="k">Weekly</div><div class="v" id="tw">$0</div></div></div>
<table><tbody>
<tr><td>Gross salary (excl. super)</td><td id="bg">$0</td></tr>
<tr><td>Income tax (after LITO)</td><td id="bt">$0</td></tr>
<tr><td>Medicare levy</td><td id="bm">$0</td></tr>
<tr><td>HECS/HELP repayment</td><td id="bh">$0</td></tr>
<tr><td>Employer super (paid on top)</td><td id="bs">$0</td></tr>
</tbody></table>
<p class="foot">Estimate only; assumes no Medicare levy surcharge or salary sacrifice. Calculator by <a href="${EMBED_CANONICAL}" target="_blank" rel="noopener">${SITE_CONFIG.name}</a>.</p>
</main>
<script>
(function(){
var D=${data};
${EMBED_ENGINE_JS}
var $=function(id){return document.getElementById(id)};
var fmt=function(n){return n.toLocaleString("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0})};
var fmt2=function(n){return n.toLocaleString("en-AU",{style:"currency",currency:"AUD",minimumFractionDigits:2,maximumFractionDigits:2})};
var q=new URLSearchParams(location.search);
if(q.get("salary")&&isFinite(+q.get("salary")))$("s").value=q.get("salary");
if(q.get("period")){var o=$("p").querySelector('option[value="'+q.get("period")+'"]');if(o)$("p").value=q.get("period")}
if(q.get("theme")==="dark"||q.get("theme")==="light")document.documentElement.setAttribute("data-theme",q.get("theme"));
function annual(){var v=parseFloat($("s").value)||0,p=$("p").value;return p==="h"?v*D.hoursPerWeek*52:v*(+p)}
function run(){
var r=pcaTakeHome(D,annual(),$("h").checked,$("i").checked);
$("ty").textContent=fmt(r.takeHome);$("tm").textContent=fmt2(r.takeHome/12);$("tf").textContent=fmt2(r.takeHome/26);$("tw").textContent=fmt2(r.takeHome/52);
$("bg").textContent=fmt(r.gross);$("bt").textContent=fmt(r.incomeTax);$("bm").textContent=fmt(r.medicare);$("bh").textContent=fmt(r.hecs);$("bs").textContent=fmt(r.superAmount);
size();
}
function size(){try{parent.postMessage({type:"${EMBED_RESIZE_MESSAGE}",height:document.documentElement.scrollHeight},"*")}catch(e){}}
["input","change"].forEach(function(ev){$("f").addEventListener(ev,run)});
window.addEventListener("resize",size);
run();
})();
</script>
</body>
</html>
`;
}

/** Copy-paste embed code: iframe plus a visible, crawlable credit link outside it. */
export function embedCode(options: { height?: number; salary?: number } = {}): string {
  const height = options.height ?? EMBED_DEFAULT_HEIGHT;
  const src = options.salary ? `${EMBED_URL}?salary=${options.salary}` : EMBED_URL;
  return `<iframe src="${src}" title="Australian take-home pay calculator" width="100%" height="${height}" style="border:0;max-width:640px;width:100%" loading="lazy"></iframe>
<p style="font-size:13px;margin:4px 0 0">Take-home pay calculator by <a href="${EMBED_CANONICAL}">${SITE_CONFIG.name}</a></p>`;
}

/** Optional snippet: resizes the iframe to its content via postMessage. */
export function autoResizeSnippet(): string {
  return `<script>
window.addEventListener("message",function(e){
  if(e.origin!=="${SITE_CONFIG.baseUrl}"||!e.data||e.data.type!=="${EMBED_RESIZE_MESSAGE}")return;
  document.querySelectorAll('iframe[src^="${EMBED_URL}"]').forEach(function(f){if(f.contentWindow===e.source)f.style.height=e.data.height+"px"});
});
</script>`;
}
