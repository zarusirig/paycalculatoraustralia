# Internal Link Audit and Cannibalisation Pass (23 Sep 2026)

**Method.** Static export (`npx next build --webpack`), then every `out/**/index.html` parsed for internal `<a href>`. **Contextual** links are everything in the page body plus the "What to check next" block. Excluded: the top-level site `<header>`/`<footer>`, the main navigation, breadcrumb `<nav>`s and table-of-contents `<nav>`s. `/site-directory/` (the HTML sitemap) is not counted as a source.

Note: Next streams the page body into hidden `<div id="S:n">` nodes after the footer, so `<main>` is an empty shell in the raw HTML. The parser handles this.

Scripts are in `docs/seo/scripts/internal-link-audit/` (`linkgraph.py`, `analyze.py`, `weave.py`, `cannibal.py`). Per-URL data is in `docs/seo/data/2026-09-23-internal-link-audit-{before,after}.csv`, with columns: contextual inlinks, body-only inlinks, inlinks including nav, contextual outlinks and distinct anchors.

## Before → after

| Metric | Before (850 URLs) | After (853 URLs, main merged) |
|---|---|---|
| Orphans (0 contextual inlinks) | 9 (5 content pages) | 6 (**0 content pages**; the rest are /about/, /privacy/, /terms/, /site-directory/, /_not-found/ and /embed/take-home-pay/, all reachable from the footer) |
| Weak (1–2 contextual inlinks) | 19 (18 content pages) | 6 (4 content pages at 2: /new-job-checklist/, /news/victorian-teachers-pay-rise-2026/, /pension-age-australia/, /salary-sacrifice-vs-mortgage/) |
| Contextual edges | 16,383 | 18,331 |
| Mean contextual inlinks per page | 19.3 | 21.5 |
| Broken internal links | 0 | 0 |
| Hubs missing a spoke | /centrelink-income-test/ (working credit) | none |
| Spokes not linking back to their hub | 0 | 0 |

The before-orphans were /centrelink-working-credit-calculator/, /news/, /pension-age-australia/, /salary-sacrifice-vs-mortgage/ and /super-co-contribution/. Each of these was reachable only through the navigation.

There are two families with no index page. `/minimum-wage-by-age/` has none, so /junior-pay-rates/ acts as its hub. `/hourly-to-salary/` has none either: its spokes cross-link each other and the salary-to-hourly pages. These are reported here and not built.

### Cross-cluster weave (source pages with no link into the target cluster)

| Pair | Before | After |
|---|---|---|
| awards → jobs | 14/15 | 0/15 (23/42 jobs reached) |
| jobs → awards | 17/42 | 0/42 (15/15 awards reached; /road-transport-award-rates/ was unreached) |
| jobs → employers | 41/42 | 0/42 |
| employers → jobs | 8/8 | 0/8 |
| minimum wage/junior → jobs | 10/10 | 5/10 |
| minimum wage/junior → employers | 10/10 | 1/10 |
| jobs → minimum wage/junior | 34/42 | 0/42 |
| employer cost → payroll tax (targets reached) | 1/10 | 2/10 (hub + calculator; the state pages link back) |
| Centrelink hub → spokes (reached) | 13/15 | 14/15 |
| pay calculators → Centrelink | 8/8 | 7/8 (fortnightly pay → working credit; the other head-term pages were left alone) |
| payslip/leave/overtime → entitlements | 5/6 | 0/6 |
| entitlements → payslip/leave/overtime | 2/7 | 1/7 (working credit, by design: it links to Centrelink and fortnightly pay) |
| tax core → salary tables | 6/7 | 1/7 |
| salary tables → tax core (targets reached) | 2/7 | 7/7 (every take-home/tax-on page now links LITO, the tax-free threshold or the MLS calculator, depending on income, plus the tax withheld calculator) |
| pay calculators → salary hubs | 3/7 | 0/7 |

### Inlinks on key pages (contextual)

| URL | Before | After | Distinct anchors |
|---|---|---|---|
| `/tax-withheld-calculator/` | 2 | 288 | 1 → 2 |
| `/medicare-levy-surcharge-calculator/` | 5 | 154 | 3 → 4 |
| `/minimum-wage-australia/` | 23 | 235 | 7 → 9 |
| `/low-income-tax-offset/` | 17 | 79 | 6 → 7 |
| `/tax-free-threshold/` | 4 | 70 | 2 → 3 |
| `/enterprise-agreement/` | 2 | 50 | 3 → 4 |
| `/pay-rates/` | 10 | 59 | 2 → 3 |
| `/centrelink-working-credit-calculator/` | 0 | 14 | 0 → 1 |
| `/time-in-lieu/` | 2 | 13 | 3 → 4 |
| `/leave-loading-calculator/` | 4 | 9 | 2 → 3 |
| `/tax-return-2026/` | 2 | 8 | 4 → 5 |
| `/gross-vs-net-pay/` | 3 | 6 | 1 → 2 |
| `/annual-leave-guide/` | 2 | 5 | 2 → 4 |
| `/travel-allowance/`, `/cents-per-km/` | 2 | 3 | +2 anchors each |
| `/news/` | 0 | 12 | 0 → 1 |
| `/australian-pay-report-2026/` | new | 16 | 4 |
| `/income-tax-calculator/` | 775 | 669 | 20 → 20 |
| `/tax-brackets/` | 737 | 633 | 19 → 19 |

About the drop on the two tax head pages: before this pass, about 100 job, employer, award and payroll pages fell through to the default "what next" cards (take-home, income tax, tax brackets). Those cards now carry topical links. The ~300 hourly/salary conversion pages keep income tax and tax brackets (commit `8ecfaf2`). Every take-home-pay-on and tax-on page still links both pages in its body.

## What changed

Most of the work is in `calc-boiler/lib/related-links.ts`, the shared "What to check next" block, which ships in static HTML. No layout or navigation files were touched.

- **Structure.** Exact-path overrides (`PAGE_LINKS`) now run first. Clusters can compute links from the path. Bridge pages can show up to 6 cards, and the grid is kept even.
- **Awards ↔ jobs ↔ employers ↔ minimum wage/junior.** `AWARD_LINKS` sends each award to the jobs and employers it covers; for example, retail links to the retail-worker job, Coles, Woolworths and Kmart. `JOB_LINKS` sends each job to its employer or award, and every job page also gets minimum wage, the employer hub and the EA explainer. `EMPLOYER_LINKS` sends each employer to its award, job, junior rates and the EA page. `AGE_LINKS` sends each `/minimum-wage-by-age/{n}/` page to the employers that hire at that age.
- **Payroll tax ↔ employer cost ↔ state pay.** Each state payroll-tax page links the calculator, the employer cost calculator, that state's pay calculator and payday super. Each state pay calculator links that state's payroll tax and long service leave pages. The employer cost calculator links the payroll-tax calculator and hub.
- **Centrelink.** One cluster covers all spokes and links the hub, JobSeeker, Austudy, working credit, parenting payment and fortnightly pay.
- **Entitlements ↔ payslip, leave and overtime.** The payslip guide, payslip generator, overtime calculator, penalty guide and leave cluster link time in lieu, leave loading, gross vs net, travel allowance and the tax withheld calculator. The reverse links are in place too.
- **Tax core ↔ salary tables.** Take-home-pay-on and tax-on pages pick LITO (≤$66k), the tax-free threshold, or the MLS calculator (≥$100k), and also link the tax withheld calculator and PAYG tables. The tax core pages link down to salary pages such as $45k, $120k and $20k, and to the salary hubs.
- **Salary hubs ↔ calculators.** The hubs link the weekly, fortnightly and pay rise calculators, and those calculators link the hubs.
- **Anchor variety.** Card titles and blurbs are the anchor text, and wording for the same target varies across the site, following `lexical-relationship-map.md`. Examples: "Leave Payout Calculator" and "Annual leave payout"; "Nurse Pay Rates in Australia" replaced "Healthcare Worker Pay" on the state spokes.
- **Test.** `lib/__tests__/related-links.test.ts` checks that every card on every static route, and on a sample of every dynamic family, resolves to a prerendered route. It also checks for no self-links, no duplicates, 3–6 cards and the key cross-links.

## Cannibalisation

Method: `our-ranked-keywords.csv` has one URL per keyword. Keywords were normalised to a sorted token key (stop words, years, "calculator" and "australia" dropped; plurals and synonyms folded), and groups where 2+ URLs rank were flagged. That gave 231 groups. `gsc-queries-28d.csv` has no URL column, so it was used only to confirm demand for the minimum-wage-by-age and tax-table queries.

| Query group (AU vol) | URLs ranking (best pos) | Primary | Action |
|---|---|---|---|
| weekly / fortnightly / monthly tax table (131k / 102k / 11.6k) | /payg-withholding-tables/ (16 / 8–12 / 9) vs /weekly-tax-table/ (29), /fortnightly-tax-table/ (8), /monthly-tax-table/ (16) | the cycle page | The hub already links each cycle page with "weekly/fortnightly/monthly tax table 2026-27" anchors, and the cycle pages link back with "PAYG withholding tables". No change needed. The tax-withheld calculator was added to the tax-table cluster. |
| weekly/fortnightly **tax calculator** | tax-table pages vs pay calculators | /weekly-pay-calculator/, /fortnightly-pay-calculator/ (head-term map) | The tax-table pages now link them with the anchors "weekly tax calculator" and "fortnightly tax calculator". |
| salary calculator / net pay / salary after tax (92.8k / 9.3k / 9.5k) | /monthly-pay-calculator/ (38–46), /, /gross-pay-calculator/, /annual-pay-calculator/ | / ; /take-home-pay-calculator/ ; /annual-pay-calculator/ | /monthly-pay-calculator/ now links the three primaries with exact-match anchors from `HEAD_TERM_PRIMARY`. Page titles were not changed; the head-term agent owns them. |
| medicare levy surcharge calculator (2.9k) | /medicare-levy/ (23–33) | /medicare-levy-surcharge-calculator/ | /medicare-levy/ already links it 5 times. The commission page's "Medicare levy surcharge" anchor now points at the MLS calculator, which has 154 inlinks (up from 5). **Report only:** `/` and `/income-tax-calculator/` still send "Medicare Levy Surcharge" anchors to /medicare-levy/; the head-term agent should repoint them. |
| leave calculator vs leave loading | /leave-calculator/ (annual leave calculator 49–71) | /leave-calculator/ for payout/accrual; /leave-loading-calculator/ for "leave loading" | Every "leave loading" anchor now points at /leave-loading-calculator/. The LSL spokes' card that said "annual leave balance and loading" was renamed "Leave Payout Calculator". The leave cluster leads with the leave loading calculator. |
| tax return calculator vs tax return 2026 | /tax-return-calculator/ (45–89) | calculator for "calculate/estimate tax return"; /tax-return-2026/ for dates and what's new | The two pages already cross-link with clean anchors. /tax-return-2026/ now gets cards from the whole tax-return cluster (2 → 8 inlinks). /tax-calendar/ ranks for "tax return dates 2026" (67–91); it is left as is, since it is the dates page. |
| minimum wage (51k) | /minimum-wage-history-australia/ (38–96 for "minimum wage rate australia" 49.5k), /award-rates/ and /pay-calculator-wa/ ("minimum wage calculator") | /minimum-wage-australia/ | The history, award-rates and junior pages already link it as "minimum wage Australia". It now has 235 contextual inlinks (up from 23), from all job pages and hourly-to-salary pages. **Report:** `/` ranks 13–16 for "minimum wage after tax"; that is head-term owned. |
| minimum wage for 14–17 year olds (GSC: 15+ variants) | /junior-pay-rates/ (13 for "…15 year olds") | /minimum-wage-by-age/{n}/ | The junior page links each age page. The age pages now also get cards from employer and award pages ("Minimum Wage for 15 Year Olds"). |
| super rate australia (20k+30k) | /super-guarantee-rate-history/ (27–45) vs /superannuation-guide/ (42–75) | /super-guarantee-rate-history/ | The guide already links it as "superannuation guarantee rate". No change. |
| nurse pay / nursing salary (≈40k combined) | /healthcare-worker-pay/nsw/ (23–66) beats the hub /healthcare-worker-pay/ (47–62) for national queries | /healthcare-worker-pay/ for national; /nsw/ for NSW | The spokes' hub card was retitled "Nurse Pay Rates in Australia". Watch /job-pay-rates/nurse/ and /nurses-award-rates/ as further splits; both link the hub. |
| teacher salary victoria / WA | hub (32/35) vs /vic/ (39), /wa/ (51) | state pages | The hub already links each state as "VIC/WA teacher salary". The VIC spoke now also links the VIC pay-rise news post. Nothing else changed; this needs a title/H1 review by the owner. |
| tax brackets / tax rates / tax threshold | /tax-brackets/ vs /tax-changes-2026-27/, /income-tax-calculator/, / | /tax-brackets/ (the tax-free threshold goes to /tax-free-threshold/) | /tax-changes-2026-27/ already links "current tax brackets". /tax-brackets/ already links the /tax-free-threshold/ anchor. **Report:** /income-tax-calculator/ and / rank 55–67 for "tax rates", which is head-term owned. |
| HECS repayment/threshold, redundancy pay, bonus tax, salary sacrifice | guide URLs in the snapshot | — | Already resolved: the old guide URLs 301 to the calculators (firebase.json). The DataForSEO snapshot predates the merges. |

## Open items

- /new-job-checklist/, /pension-age-australia/, /salary-sacrifice-vs-mortgage/ and the VIC teachers news post sit at 2 contextual inlinks. Each has a card on 2 topical pages. A prose mention from /first-job-pay-guide/, /age-pension-income-test-calculator/ or /salary-sacrifice-calculator/ would lift them, but those bodies are being edited by the figures agents.
- Head-term pages (/, /income-tax-calculator/): repoint their "Medicare levy surcharge" anchors to /medicare-levy-surcharge-calculator/.
- Rebuild the cannibalisation check once the next DataForSEO ranked-keywords pull includes today's pages (leave loading, MLS calculator, tax withheld, payroll tax, awards batch 3).
