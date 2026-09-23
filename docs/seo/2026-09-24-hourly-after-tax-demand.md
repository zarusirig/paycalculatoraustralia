# Hourly rate after tax: demand check and decision (G5, 24 Sep 2026)

**Question:** should `pay-calculator-australia.com` add a `/hourly-after-tax/[rate]/` page family for queries like "$30 an hour after tax", or extend the existing `/hourly-to-salary/[rate]/` pages (166 URLs)?

**Answer:** extend the existing pages. Don't add a new URL family. People search the after-tax phrasing about 170 times a month across $20–$80, which is about 3% of the "is how much a year" family those pages already serve. Google also ranks the same rate URL for both phrasings.

## Data pulled (DataForSEO, Australia `location_code 2036`, en). Total spend was about $0.15

| Call | Keywords | Cost |
|---|---|---|
| `dataforseo_labs/google/keyword_overview/live` | 338 (26 rates × 13 patterns, "$" stripped) | ~$0.04 |
| `keywords_data/google_ads/search_volume/live` | 118 after-tax variants + 8 generic | $0.09 |
| `serp/google/organic/live/regular` × 3 | "35 / 40 / 30 an hour after tax" | ~$0.006 |

Rates checked: $20, 22, 25–30, 32–38, 40, 42, 45, 48, 50, 55, 60, 65, 70, 75, 80.

Patterns checked for each rate:

- "N an hour after tax" (plus "australia")
- "N dollars an hour after tax"
- "N per hour after tax" (plus "australia")
- "how much is N an hour after tax"
- "N an hour is how much a week after tax"
- "N an hour fortnightly after tax"
- "N an hour is how much a year after tax"
- "N casual rate after tax"
- the "a year" controls: "N an hour is how much a year", "N dollars an hour is how much a year", "N per hour annual salary"

## Demand: the after-tax phrasing

**DataForSEO Labs:** only one after-tax keyword out of 338 is in the Labs database: "30 an hour after tax" at 10/mo. None of the other after-tax variants are indexed.

**Google Ads search volume:** this endpoint returns a figure for any keyword it is sent. Only 17 of the 126 keywords returned a volume, and each of those is 10/mo, the lowest bucket Ads reports:

| Keyword | Vol/mo |
|---|---|
| 20 an hour after tax, 20 per hour after tax | 10, 10 |
| 22 an hour after tax | 10 |
| 25 an hour after tax, 25 per hour after tax | 10, 10 |
| 27 per hour after tax | 10 |
| 30 an hour after tax | 10 |
| 35 an hour after tax, 35 per hour after tax | 10, 10 |
| 40 an hour after tax, 40 per hour after tax | 10, 10 |
| 50 per hour after tax | 10 |
| hourly rate after tax, hourly pay after tax | 10, 10 |
| hourly rate after tax calculator, hourly after tax calculator, per hour after tax calculator | 10 each |

Every "is how much a week after tax", "fortnightly after tax", "how much is … after tax", "… after tax australia", "dollars an hour after tax" and "casual rate after tax" variant returned no volume.

**Total after-tax demand: about 170/mo.** That includes the generic "hourly rate after tax" terms. It is far below the ~1,500/mo threshold for a new family.

**GSC (28 days to 23 Sep, `data/2026-09-23-dataforseo/gsc-queries-28d.csv`):** the after-tax hourly long tail already reaches the existing pages. Examples:

- "41 per hour annual salary after tax": pos 2.6
- "what is $35 an hour annually after taxes": pos 1

## Demand: "N an hour is how much a year" (already served by /hourly-to-salary/)

Labs volumes across the same 26 rates:

| Pattern | Vol/mo |
|---|---|
| "N an hour is how much a year" + "N dollars an hour is how much a year" | 3,260 |
| "N per hour annual salary" | 2,060 |
| **Total** | **5,320** |

The biggest rates by combined volume:

| Rate | Vol/mo |
|---|---|
| $40 | 610 |
| $45 | 540 |
| $50 | 470 |
| $35 | 430 |
| $30 | 360 |
| $38 | 330 |
| $55 | 300 |
| $32 | 270 |
| $60 | 240 |
| $33 | 220 |

These pages rank (`our-ranked-keywords.csv`, 23 Sep): 12 hourly keywords, for example:

- "34 an hour is how much a year": #10
- "32 dollars an hour is how much a year": #9
- "25 an hour is how much a year": #10
- "45 dollars an hour is how much a year": #14
- "55 an hour is how much a year": #24

GSC pages file: `/hourly-to-salary/45/` has 4,267 impressions at avg pos 6.5, `/35/` has 4,798 at 6.2 and `/30/` has 3,174 at 6.9. The family is getting impressions but few clicks (CTR 0.1–3%).

## SERPs: does a different page type win "after tax"?

Positions are absolute: they count SERP features, so a #2 organic result can show as #3.

| Query | What ranks |
|---|---|
| 35 an hour after tax | au.talent.com salary-tax page (#2), wagecalculator.com.au home (#4), loanmetric.com.au `/pay/35-an-hour-after-tax` (#8), wagecalculator.com.au `/hourly-to-salary/35` (#9), **ours `/hourly-to-salary/35/` (#10)** |
| 40 an hour after tax | salaryadviser.com `/pay-calculator/40-Hourly` (#2), au.talent.com (#3), then generic calculator home pages (wagecalculator, paycalculator.com.au, money.com.au, ATO) |
| 30 an hour after tax | paycalculator.com.au home (#2), aussalarycalculator home (#4), wagecalculator `/hourly-to-salary/30` (#5, the "is how much a year" page), salaryadviser `/30-Hourly` (#7) |

Only one dedicated after-tax URL appears (loanmetric). The rate-specific pages that rank are "how much a year" pages that also show after-tax figures, both ours and wagecalculator's. The rest are generic calculators. Google treats "after tax" and "a year" as the same intent for a rate, so a separate `/hourly-after-tax/` family would compete with `/hourly-to-salary/` for the same queries.

## Decision

Option (a): extend `/hourly-to-salary/[rate]/`, with no new URLs.

- **Title and H1 are unchanged.** They lead with "is how much a year", which carries about 30× the demand. Adding "after tax" to a title that is already ~55 characters would push it past the display limit. The meta description now carries the weekly after-tax figure, which is the phrasing people type.
- **New "$N an Hour After Tax" H2 section on every page:**
  - Tax, Medicare, take-home and employer-super lines per hour, week, fortnight, month and year at 38 hours. SG comes from the engine, capped at the maximum contribution base.
  - Part-time (20 h, 25 h) and casual (base × 1.25, flagged as award-dependent) after-tax rows.
  - Copy that changes by income: the 25-hour gross-vs-net comparison, or the no-tax case where it applies.
  - The shared `SalaryBandNotes`: bracket, LITO stage, Medicare shade-in, MLS, HECS band, super cap and Division 293, all at the rate's annual gross.
- **FAQ (visible and FAQPage markup):** two new questions, "N an hour is how much a week after tax?" and "What is N an hour casual after tax?"
- **Links:** prev/next rate links (`rel=prev/next`), plus links to the `/take-home-pay-on/`, `/tax-on/` and `/salary-to-hourly/` hubs.

**Revisit if** Google Ads volumes for "N an hour after tax" grow past 50/mo on several rates, or if GSC shows a rate page earning after-tax impressions without clicks. Then test "(… After Tax)" in the title of the top 10 rates first.
