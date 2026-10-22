# GSC analysis, 22 Oct 2026

Source: three GSC exports (Performance, Coverage, Crawl stats) dated 22 Oct 2026, domain property, 28 days 23 Sep to 20 Oct 2026 (19 and 20 Oct are partial). Plus CrUX API (origin), live curl checks and the build output in `calc-boiler/out/`. All figures retrieved 22 Oct 2026.

## 1. Headline vs the 21 Sep baseline

| Metric | 28d to 27 Aug | 28d to 21 Sep | **28d to 20 Oct** |
|---|---|---|---|
| Clicks | 5,660 | 10,505 | **20,220** (+92%) |
| Impressions | 582k | 1.01M | **1.92M** |
| CTR | 0.97% | 1.04% | 1.05% |
| Avg position | 8.35 | ~7 | 6.5 |

- Weekdays run 950 to 1,100 clicks; weekends 470 to 530. Average over the 26 full days = ~775/day. The 1,000/day goal (28,000 per 28 days) is 72% reached.
- Australia = 96% of clicks (19,359). Mobile 61%.
- Inside the window the average position got worse: 5.9 in late Sep, 6.8 to 7.5 in mid Oct. Daily CTR went 1.2% to 0.9%. Weekday clicks stayed flat at ~950. Reading: the new October pages add impressions at low positions, and the 10 Oct prune removed 345 pages that still showed. Not a drop. Watch it for two more weeks.
- Only 25 brand clicks ("pay calculator australia"). Head term "pay calculator" sits at position 11.8. Authority is still the ceiling.

## 2. What earns the clicks

Top-1000 pages export, grouped by cluster:

| Cluster | Pages | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|---|
| /pay-rates/ (employers) | 37 | 3,696 | 210k | 1.76% | 4.8 |
| /public-service-pay-scales/ | 16 | 1,537 | 98k | 1.56% | 6.4 |
| /school-support-staff-pay/ | 6 | 1,521 | 36k | 4.19% | 5.0 |
| /teacher-pay-australia/ | 11 | 1,030 | 74k | 1.39% | 6.9 |
| /bonus-tax-calculator/ | 1 | 1,015 | 15k | 6.83% | 3.8 |
| /news/ | 37 | 940 | 24k | 3.96% | 6.3 |
| /adf-pay-scales/ | 8 | 756 | 39k | 1.94% | 5.9 |
| /job-pay-rates/ | 51 | 673 | 84k | 0.80% | 7.3 |
| /salary-to-hourly/ | 123 | 621 | 82k | 0.76% | 4.3 |
| /take-home-pay-on/ | 130 | 433 | 127k | 0.34% | 6.5 |
| /tax-on/ | 134 | 326 | 116k | 0.28% | 6.0 |
| /hourly-to-salary/ | 166 | 222 | 66k | 0.34% | 6.1 |

- About 120 pages (employers, public sector, school support, teachers, ADF, bonus calculator, news) earn 52% of all clicks.
- The 553 numbered calculator pages earn 1,602 clicks (8%) at 0.3 to 0.8% CTR. 276 of the top-1000 pages have zero clicks; 427 have one or fewer.
- Single-page winners: bonus-tax-calculator 1,015, school-support-staff-pay/vic 939, pay-rates/woolworths 609, pay-rates/coles 605, adf-pay-scales 574, teacher-pay-australia/vic 540, public-service-pay-scales/qld 481, news/queensland-state-wage-case-2026 425 (9.5% CTR).

## 3. Lever A (title rewrites) verdict: did not work

The 23 Sep plan retitled five page-one pages. Titles are live. CTR did not move:

| Page | CTR Sep | CTR Oct | Pos Oct |
|---|---|---|---|
| /junior-pay-rates/ | 0.43% | 0.39% | 6.4 |
| /hourly-to-annual-salary-calculator/ | 0.59% | 0.61% | 6.0 |
| /fortnightly-pay-calculator/ | 0.85% | 0.70% | 5.3 |
| /weekly-pay-calculator/ | 0.48% | 0.29% | 6.6 |
| / (home) | 0.67% | 0.43% | 8.9 |

Query proof: "how many fortnights in a year" 11,279 impressions, position 4.1, CTR 0.06%. "fortnightly tax table 2026" 8,088 impressions, position 9.3, 0.27%. The SERP answers these itself (AI Overview, snippet). More title work on these pages is wasted. Same pattern on /minimum-wage-by-age/{14..19}/ (0.2 to 0.3% CTR at position 6).

## 4. Indexing

- Sitemap 692 URLs. Indexed 606. Not indexed 86: 80 "Discovered, currently not indexed", 6 "Crawled, currently not indexed".
- 79 sitemap URLs have no row at all in the pages export: 31 /job-pay-rates/, 9 /apprentice-pay/, 6 /prison-officer-pay/, the holiday-pay pages, ~20 single award-rate pages, 6 FY tax-table pages.
- 19 Oct Indexing API push of 104 URLs: 25 now get impressions (2,282 impr, 15 clicks). 79 still silent.
- The 345 pruned numbered URLs still earned 416 clicks and 82k impressions through their 301s. Expected; it fades.

## 5. Crawl

- 31,059 Googlebot requests on the apex in the window. 46% are "Other file type". The build writes 5,329 React Server Component payload files (`__next.*.txt`, `index.txt`) beside 697 HTML pages, and Google crawls them as URLs. Download volume went from ~2 MB/day (Aug) to 15 to 36 MB/day (Oct). Average response time went from 50 to 80 ms to 150 to 200 ms.
- Fix applied 22 Oct in `calc-boiler/public/robots.txt`: `Disallow: /*.txt$` with `Allow: /ads.txt` and `Allow: /robots.txt`. Deploy pending Firebase login.
- Crawl purpose 91% refresh, 9% discovery. Responses: 82% 200, 14.5% 304, 2.4% 301, 0.5% DNS error, 0.26% robots.txt unavailable, 0.2% 404, 0.18% 5xx.
- **www.pay-calculator-australia.com has no DNS record** (no A, no CNAME). That is the DNS error line and the 155 www requests. Host shows "Problems in the past". Needs a Cloudflare record plus a 301 to the apex.

## 6. Page weight and links

- HTML per page is 320 to 600 KB. Home page 589 KB, of which 324 KB is the inline RSC data (`self.__next_f`) and 11 KB is JSON-LD. 7,031 visible words, 578 links: 388 in header/nav, 125 in main, 64 in footer. A normal page (/pay-rates/woolworths/) carries 482 links.
- CrUX origin, phone, p75: LCP 1,195 ms, INP 94 ms, CLS 0.00, TTFB 497 ms. All Good. Per-URL CrUX has no data (traffic per URL too thin). So the weight costs crawl bytes, not users.
- CrUX experimental ad density p75 = 37%. The Better Ads mobile limit is 30%. Re-check once Mediavine is live.

## 7. Human tasks

1. `! npx firebase-tools login --reauth`, then deploy hosting (robots.txt).
2. Cloudflare DNS: add `www` (A 192.0.2.1 or CNAME to apex, Proxied) and a Redirect Rule `www.pay-calculator-australia.com/*` → `https://pay-calculator-australia.com/${1}` 301.
3. GSC domain property → Settings → Users and permissions → add `indexing-bot@paycalculatoraustralia-965d5.iam.gserviceaccount.com` (Full). The Search Console API is now enabled in the project; the URL-prefix property only holds data from 18 Oct, so API before/after pulls need the domain property.

## 8. Next work, in order

1. More pages in the clusters that convert: employer pay rates (1.8% CTR, position 4.8), state public-sector scales, school support staff (4.2%). These beat every numbered page by 5 to 10x per page.
2. Internal links from the winners to the 79 silent pages, then resubmit them through the Indexing API (200/day, `docs/seo/scripts/indexing-api-submit.sh`).
3. Stop title work on pages where the SERP answers the query (section 3). Put that effort into links (`docs/seo/2026-10-17-homepage-backlink-order.md`).
4. Re-measure 28 days to ~18 Nov; compare with this doc.

API key for CrUX and PageSpeed (restricted to those two APIs): `~/.config/google-crux-psi.key`.
