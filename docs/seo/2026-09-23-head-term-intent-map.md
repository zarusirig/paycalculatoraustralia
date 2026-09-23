# Head-term intent map: core calculators (23 Sep 2026)

**The problem.** Our core calculators don't show up for their own head terms. Together these terms are worth about 290k searches a month in AU. Only the homepage appears in any live top 20, at #12 to #18 on page 2. The dedicated tool pages don't appear for any head term.

**Sources.** Live Google AU SERPs from DataForSEO (`/v3/serp/google/organic/live/regular`, location 2036, depth 20), pulled 23 Sep 2026. Also `docs/seo/data/2026-09-23-dataforseo/` (`our-ranked-keywords.csv`, `gsc-pages-28d.csv`, `gsc-queries-28d.csv`, `competitor-gap.csv`). Competitor above-the-fold content comes from Firecrawl REST scrapes of paycalculator.com.au, moneysmart and wagecalculator.com.au.

---

## 1. Live SERPs: who wins, and where we are

| Head term | Vol (AU) | KD | Our best URL in live top 20 | Winning page type (top 5) |
|---|---|---|---|---|
| salary calculator | 60,500 | 14 | — | **Homepage pay calculators**: paycalculator.com.au/ #1, emumoney pay-calculator #2, 2× salary-packaging, wagecalculator/ #5, moneysmart #6 |
| salary calculator australia | 40,500 | 39 | `/` **#14** | Homepage pay calculators: paycalculator/, seek, emumoney, moneysmart, wagecalculator/ |
| pay calculator australia | 40,500 | 34 | `/` **#14** | Homepage pay calculators + Fair Work PACT: paycalculator/, fairwork, wagecalculator/, emumoney, moneysmart |
| pay calculator | 301,000* | 33 | `/` **#13** | Same set as above (plus Fair Work home) |
| income tax calculator | 49,500 | 10 | — | **Dedicated tax-calculator pages**: moneysmart income-tax-calculator #1, ATO simple tax #2, paycalculator/ #3, Suncorp, ATO estimator, bank "Income tax calculator" pages |
| income tax calculator australia | 14,800 | 13 | — | Same set: moneysmart #1, ATO #2, paycalculator #3, Suncorp, ATO, BCU |
| tax calculator australia | 40,500 | 15 | — | ATO simple tax #1, moneysmart #2, paycalculator #3, ATO tax-withheld, Suncorp; H&R Block, bank pages |
| simple tax calculator | 14,800 | 28 | — | ATO simple tax ×2, moneysmart, ATO hub, paycalculator/, BCU, H&R Block, simpletaxcalculators.com.au |
| take home pay calculator | 14,800 | 4 | `/` **#12** | Mixed: paycalculator/ #1, industrysuper "Take Home Net Pay" #2, moneysmart #3, emumoney #4, wagecalculator/ #5 |
| net pay calculator | 5,400 | 3 | — (DataForSEO has `/gross-pay-calculator/` at #40) | paycalculator/, industrysuper pay-calculator, moneysmart, ATO withheld, BCU, risehigh net-to-gross |
| after tax income calculator | 6,600 | 7 | `/` **#18** | moneysmart #1, paycalculator #2, ATO simple, BCU/Suncorp "income tax calculator" pages |
| weekly tax calculator | 18,100 | 9 | — | **ATO withholding tools + tax tables**: ATO tax-withheld #1, paycalculator/ #2, ATO SPA, moneysmart, taxstore, ATO weekly tax table PDF |
| fortnightly tax calculator | 5,400 | 23 | — (DataForSEO: `/fortnightly-pay-calculator/` #34) | ATO tax-withheld #1, taxstore, ATO fortnightly tax table, PN Bank, paycalculator/ |
| weekly pay calculator (control) | 1,900 | 11 | — (DataForSEO: `/weekly-pay-calculator/` #26) | paycalculator/, wagecalculator/, ATO, industrysuper; paycal.com.au/weekly-pay-calculator/ #10 |

*"pay calculator" volume is from `competitor-gap.csv`. GSC shows 987 impressions a month at position 12.2.

**What the SERPs tell us**

1. **Google treats "salary calculator", "pay calculator (australia)", "take home pay calculator" and "net pay calculator" as one intent.** They all get the same short list of URLs, and that list is dominated by all-in-one **homepage** calculators (paycalculator.com.au/, wagecalculator.com.au/, emumoney/industrysuper pay-calculator). Our homepage is the only URL of ours that Google puts in any of these SERPs.
2. **"income tax calculator", "tax calculator australia" and "simple tax calculator" are a different SERP.** Dedicated *income tax calculator* pages win there (moneysmart, ATO, Suncorp, BCU, PN Bank, Beyond Bank, H&R Block). That's the page type of `/income-tax-calculator/`, yet it ranks for **no** head term. It has 47 keywords in total, all at positions 50 to 94, and 1,167 impressions in 28 days.
3. **"weekly/fortnightly tax calculator" are withholding SERPs.** The winners are the ATO tax-withheld calculator, tax tables and taxstore. The winning intent is "tax on my weekly/fortnightly pay". Our weekly and fortnightly calculators only accepted an *annual salary*.
4. **paycalculator.com.au appears in every one of the 13 SERPs** (#1 to #6), always with its homepage.

## 2. Cannibalisation found

| Term cluster | Our URLs splitting it (DataForSEO position) | Resolution |
|---|---|---|
| salary calculator / pay calculator australia | `/` (australia salary calculator #55), `/monthly-pay-calculator/` (aus salary calculator #42, au pay calculator #38), `/pay-calculator-wa/` (aus pay calculator #67) | Primary = `/`. Monthly and state pages should link to `/` with "salary calculator" / "pay calculator Australia" (**not done: outside this task's page set**, see §6) |
| net pay / after tax income / take home | `/` (after tax income #44, salary take home #30, take home #12 live), `/gross-pay-calculator/` (net pay #40, net income #54, net wages AU #41), `/monthly-pay-calculator/` (net pay AU #42, pay after tax #44), `/annual-pay-calculator/` (salary after tax #44). **`/take-home-pay-calculator/` ranks for only 4 keywords** | Primary = `/take-home-pay-calculator/`. `/gross-pay-calculator/` now links to it as "net pay calculator" and keeps net-to-gross. `/` stops using "Take-Home" in its title and links out with "take home pay calculator" |
| salary after tax | `/annual-pay-calculator/` (#44), `/monthly-pay-calculator/` (salary after tax calculator #71) | Primary = `/annual-pay-calculator/` |
| annual / yearly salary calculator | `/hourly-to-annual-salary-calculator/` (#20, #24) vs `/annual-pay-calculator/` (title said "Annual Salary Calculator") | Left with hourly-to-annual (it ranks). Annual page retitled to "salary after tax" |
| weekly / fortnightly **tax** | `/weekly-pay-calculator/` and `/fortnightly-pay-calculator/` (calculator) vs `/weekly-tax-table/` and `/fortnightly-tax-table/` (#15 to #34 on "tax table" terms) | Calculators own "… tax calculator". Tables keep "… tax table". The table pages should link to the calculators with the calculator anchor (**not done**, see §6) |

## 3. Intent map: one primary URL per head term

| Head term | Vol | **Primary URL** | Secondary pages that now link to it (exact anchor) |
|---|---|---|---|
| pay calculator australia / pay calculator | 40.5k / 301k | **`/`** | take-home, income-tax, weekly, fortnightly ("pay calculator Australia") |
| salary calculator / salary calculator australia | 60.5k / 40.5k | **`/`** | take-home, income-tax, weekly, fortnightly, gross, annual ("salary calculator") |
| take home pay calculator (+ australia) | 14.8k / 5.4k | **`/take-home-pay-calculator/`** | `/` quick links, income-tax, weekly, fortnightly ("take home pay calculator") |
| net pay calculator | 5.4k | **`/take-home-pay-calculator/`** | gross (intro and link row: "net pay calculator") |
| after tax income calculator | 6.6k | **`/take-home-pay-calculator/`** | annual ("after tax income calculator") |
| income tax calculator / income tax calculator australia | 49.5k / 14.8k | **`/income-tax-calculator/`** | `/` quick links, take-home, weekly, fortnightly, gross, annual ("income tax calculator") |
| tax calculator australia | 40.5k | **`/income-tax-calculator/`** | Covered by the title/H1 string "Income Tax Calculator Australia" |
| simple tax calculator | 14.8k | **`/income-tax-calculator/`** | Title/H1 suffix |
| weekly tax calculator | 18.1k | **`/weekly-pay-calculator/`** | `/` quick links, take-home, income-tax, fortnightly, gross, annual ("weekly tax calculator") |
| fortnightly tax calculator | 5.4k | **`/fortnightly-pay-calculator/`** | `/` quick links, take-home, income-tax, weekly, gross, annual ("fortnightly tax calculator") |
| gross pay / net to gross calculator | 1.3k | **`/gross-pay-calculator/`** | (unchanged) |
| salary after tax calculator / salary after tax | 6.6k / 2.9k | **`/annual-pay-calculator/`** | (anchor defined in `HEAD_TERM_PRIMARY.salaryAfterTaxCalculator`, for future use) |

The map lives in code as `HEAD_TERM_PRIMARY` in `calc-boiler/modules/calculator/head-term-ui.tsx`. Every link row renders from it, so anchor text and target can't drift apart.

**Judgement call: "take home pay calculator".** The live SERP puts our **homepage** at #12, and Google serves this term the same homepage-calculator set as "pay calculator". The case for consolidating on `/` is real. We still chose `/take-home-pay-calculator/` for these reasons:

- (a) Dedicated take-home pages do win this SERP: industrysuper "Take Home Net Pay" #2 and moneysmart #3.
- (b) The homepage title can't carry pay calculator, salary calculator, take-home and tax all at once.
- (c) The homepage is only on page 2 (about 0 clicks), so we give up very little.

**Review rule:** re-pull the SERP around 4 Nov 2026 (6 weeks). If `/take-home-pay-calculator/` isn't in the top 20 and `/` has dropped below #20, put "Take-Home Pay" back in the homepage title and make `/` primary.

## 4. Title / H1 changes (old → new)

All titles still carry `SITE_CONFIG.financialYear`. Descriptions still lead with an answer, computed by the engine.

| URL | Old title | New title | H1 |
|---|---|---|---|
| `/` | Pay Calculator Australia {FY} — Salary, Tax & Take-Home Pay | **Pay Calculator Australia {FY} — Salary Calculator After Tax** | Same as title |
| `/take-home-pay-calculator/` | Take-Home Pay Calculator Australia {FY}: Pay After Tax | **Take Home Pay Calculator Australia {FY}: Net Pay After Tax** | "Take Home Pay Calculator Australia {FY} — Net Pay After Tax" |
| `/income-tax-calculator/` | Income Tax Calculator Australia {FY} — ATO Tax Brackets | **Income Tax Calculator Australia {FY} — Simple Tax Calculator** | Same as title (OG/Twitter titles now use the same string) |
| `/weekly-pay-calculator/` | Weekly Pay Calculator Australia {FY}: Take-Home Pay | **Weekly Pay & Tax Calculator Australia {FY}: Take-Home Pay** | "Weekly Pay & Tax Calculator Australia {FY}" |
| `/fortnightly-pay-calculator/` | Fortnightly Pay Calculator Australia {FY}: Take-Home Pay | **Fortnightly Pay & Tax Calculator Australia {FY}: Take-Home Pay** | "Fortnightly Pay & Tax Calculator Australia {FY}" |
| `/gross-pay-calculator/` | Net to Gross Pay Calculator Australia {FY} (Reverse Tax) | *unchanged* | *unchanged* |
| `/annual-pay-calculator/` | Annual Salary Calculator Australia — Yearly Take-Home Pay (no FY; description hardcoded "FY2026-27") | **Annual Salary After Tax Calculator Australia {FY}** (description now from the engine) | Same as title |

Every existing token in the fortnightly title was kept, with only "& Tax" added, because it's the site's top page by impressions (53.5k in 28 days, position 5.4). The WebApplication JSON-LD `name` fields were updated to match each new title.

## 5. Above-the-fold UX: before vs. SERP winners

**What the winners do (Firecrawl scrapes):**
- **paycalculator.com.au** (#1 to #6 on all 13 terms). The page opens directly on the form ("INCOME: Enter your salary, adjust the settings and see the results in the summary below"). There's no hero copy. There's a pay-cycle selector (Annually/Monthly/Fortnightly/Weekly/Daily/Hourly) and a results summary.
- **moneysmart**. H1, then 3 bullets, then the calculator. Income has a frequency selector. The result opens with one headline sentence, "The estimated tax on your taxable income is $X", then a summary table and a bracket-by-bracket breakdown.
- **wagecalculator.com.au**. The live **"Take-home pay $60,480 Annual"** result is pinned *above* the inputs. It also has salary preset chips ($50k/$75k/$100k/$150k), an FY switch and a period switch.

**What we had:** a large padded hero on every page (`p-8 md:p-12`, H1, 1 to 2 paragraphs, TrustBar). On `/income-tax-calculator/` there was also a boxed bracket paragraph. On `/` the intro was a 70-word paragraph under a `text-6xl` H1. On mobile this pushed the calculator below the fold. The inputs took **annual salary only**, even on the weekly and fortnightly "tax calculator" pages. There were no presets. The result appeared as a breakdown list with no headline answer.

**What changed (metadata, H1, intro and above the fold only; body copy and figures not touched):**

| Page | Changes |
|---|---|
| `/` | Intro cut to one sentence and H1 made smaller on mobile, with less hero padding. **Live take-home summary strip (year / fortnight / week) sits directly under the amount input**, so the answer is visible before any toggle (wagecalculator pattern). Salary presets $50k/$75k/$100k/$150k added. Quick links under the card now use exact anchors: take home pay calculator, income tax calculator, weekly tax calculator, fortnightly tax calculator. |
| `/take-home-pay-calculator/` | Compact hero with one answer-first paragraph that names "after tax income calculator". **Period toggle added (Annual/Monthly/Fortnightly/Weekly)** with presets for each period. Headline "You take home $X per {period}" card now comes before the breakdown. Link row: pay calculator Australia, salary calculator, income tax calculator, weekly and fortnightly tax calculators. |
| `/income-tax-calculator/` | Compact hero. The 5-bracket summary box moved from the hero to directly under the calculator (content kept). **Income frequency toggle** added (moneysmart pattern) with presets. Headline "Estimated tax on $X a year: $Y" (plus per-period figure) now comes before the breakdown. Link row added. |
| `/weekly-pay-calculator/`, `/fortnightly-pay-calculator/` | Compact hero. Intro names "weekly/fortnightly tax calculator". **Weekly/Fortnightly vs Annual entry toggle**, so searchers can type the pay they actually know, matching the ATO tax-withheld calculator's intent. Presets and a gross conversion hint added. Link rows added. |
| `/gross-pay-calculator/` | Compact hero. Intro links to the take-home page with the anchor "net pay calculator", which removes the net-pay cannibalisation. Link row added. |
| `/annual-pay-calculator/` | Compact hero. The **stale hardcoded FY2025-26 "quick answer" ($63,933 etc.) was replaced with engine-computed figures**. Presets and link row added. |

Defaults stay at $80,000 annual everywhere, so the hero answer and the calculator's first render always agree.

## 6. Not done here (owned elsewhere or needs a decision)

1. **`/monthly-pay-calculator/` cannibalises the salary/net-pay heads.** It holds 37 keywords, including au pay calculator #38, aus salary calculator #42, net pay calculator australia #42 and pay after tax calculator #44. Its intro should link to `/` ("salary calculator") and `/take-home-pay-calculator/` ("net pay calculator"), and its title should stay monthly-specific.
2. **`/weekly-tax-table/` and `/fortnightly-tax-table/`** should link to the calculators with the anchors "weekly tax calculator" and "fortnightly tax calculator".
3. **`/annual-pay-calculator/` FAQ JSON-LD still hardcodes FY2025-26 figures** ($63,933, $14,367, $76,633). These now disagree with the engine-driven hero on the same page. This belongs to the stale-figures agent.
4. **`/pay-calculator-{state}/`** pages should link to `/` with "pay calculator Australia" (the nav/footer agent owns the site-wide links).
5. **Existing lint errors** in `weekly-pay-calculator.tsx`, `gross-pay-calculator.tsx` (unescaped `"` in body copy) and `fortnightly-pay-calculator.tsx` (a `useMemo` with `[]` deps that React Compiler can't preserve). These were all present on `main` before this change. None of them is in code this change touched.
6. **Measure:** re-pull the 13 SERPs and GSC page and query data about 4 Nov 2026, and apply the review rule in §3.
