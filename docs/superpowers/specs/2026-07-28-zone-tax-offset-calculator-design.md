# Zone Tax Offset Calculator — Design

**Date:** 28 July 2026
**Status:** Implemented in full. See §8.
**Branch:** `seo/fy2026-27-recovery`
**Site:** pay-calculator-australia.com (`calc-boiler/`, Next.js App Router, `output: "export"`)
**Companion docs:**
`docs/seo/2026-07-28-keyword-and-content-gap-analysis.md` §5.1, §10 item 6
`docs/superpowers/specs/2026-07-28-fy2026-27-migration-and-serp-recovery-design.md`

---

## 1. Why this page

From the gap analysis (§5.1), the best-evidenced opportunity on the site:

| Signal | Value |
|---|---|
| `zone offset calculator` | 440 impressions, 1 click, position 7.3 |
| KD | **0** |
| CPC | $1.20 |
| SERP features | **none** — no AI Overview, no snippet, no PAA |
| #4 result | a DR-2 page that only links to the ATO |
| #9 result | a DR-1 static `.htm` file |
| ATO's own tool | self-describes as taking **5–20 minutes** |
| Instant calculators in the top 10 | **zero** |

We already rank 7.3 with a guide and no calculator. This is an "add the tool to the
page that already ranks" play, not a new-URL play. **No new route.**

---

## 2. What the ATO actually specifies

Every figure below was retrieved from ato.gov.au via firecrawl on 28 July 2026.

**Primary source:** `T4 Zone or overseas forces 2026` (QC106871, last updated 30 May 2026)
**Secondary:** `Zone tax offset` (QC105018, last updated 8 June 2026)
**Dependant offset input:** `T5 Invalid and invalid carer 2026` (QC106872, last updated 30 May 2026)
**Zone list:** `Australian zone list` (QC17311, last updated 1 July 2026)

### 2.1 Table 3 — fixed amount and percentage of base amount

| Zone or area | Fixed amount | % of base amount |
|---|---|---|
| Zone A | $338 | 50% |
| Zone B | $57 | 20% |
| Special area | $1,173 | 50% |
| Overseas forces | $338 | 50% |

**Special area replaces the zone fixed amount. It is not added to it.** The maximum
offset with no dependants is **$1,173**, not $1,511.

### 2.2 Table 2 — dependant child or student base amounts

| Dependant | Base amount |
|---|---|
| Each student under 25 | $376 |
| Oldest non-student child under 21 | $376 |
| Other non-student children under 21 | $282 each |

Additional base components:
- **Sole parent:** $1,607 full year; part-year = days × $4.40
- **Invalid / invalid carer:** the amount claimed at T5 label B — max $3,396 full year,
  $9.30/day part-year

### 2.3 Base amount reduction

A dependant's base amount reduces by **$1 for every $4** of that dependant's adjusted
taxable income (ATI) over **$282**. Full base amount requires ATI under **$286**.

Cut-out points: `$282 + $4.12/day` (student under 25, or oldest child under 21);
`$282 + $3.09/day` (other children under 21).

### 2.4 The algorithm

Eligibility test is **"183 days or more"** — not "more than 183 days".

**Worksheet 4** — total base amount = sum of dependant base amounts + sole parent
amount + invalid/carer offset.

**Category 1** (usual place of residence in one zone, ≥183 days), Worksheet 5:

```
offset = fixed + (totalBase × pct) − remoteAreaAllowance      floor 0
```

**Category 2** (more than one zone, or overseas service under 183 days), Worksheets 6–7:

```
per place:  (fixed + totalBase × pct) × min(days, 183) / 183
offset   =  Σ(per place) − remoteAreaAllowance                 floor 0
```

Order places by fixed amount descending; total days claimed capped at 183.

**Multi-zone shortcut:** if one place had ≥183 days and its fixed amount is the highest
of the places involved, use Category 1 with that place and ignore the others (the ATO's
"Neil" example).

### 2.5 Carry-forward provisions (currently absent from our guide)

A taxpayer under 183 days in the current year may still qualify if residence in the zone
was a continuous period of under 5 years and the first year's days plus the current
year's days total 183+, with the current-year period including 1 July.

### 2.6 Which financial year

The verified amounts come from the **2026 instructions**, which govern the **2025–26
income year** — the return being lodged now (due 31 October 2026). FY2026-27 zone
amounts are not published and will not be until the 2027 instructions.

**Decision:** the calculator computes and is labelled **2025–26 income year**. The
amounts have been unchanged since FY2015-16, but that continuity is *not* asserted as
verified for FY2026-27. This follows the standing rule: if a figure cannot be verified,
say so and leave it.

---

## 3. Defects in the existing page

`modules/guide/zone-tax-offset.tsx` and `app/zone-tax-offset/page.tsx`.

| # | Defect | Evidence |
|---|---|---|
| 1 | **`$1,511` presented as the maximum offset** — in H1 intro, two tables, worked example, FAQ, and the meta description | Special area replaces the zone amount (Table 3). Max is $1,173 |
| 2 | **`$1,230` for "Zone B + Special Area"** | Same cause. Not a real combination |
| 3 | **Dependant add-on stated as "$130 Zone A / $22 Zone B"** | Corresponds to nothing in ATO material. Real rule is 50%/20% of a base built from $376/$282/$1,607/T5 |
| 4 | **Darwin classified Zone B** | NT zone list: `Darwin \| A`. ATO worked example: "Louise lived in Darwin (a Zone A location)" |
| 5 | **Palmerston, Humpty Doo classified Zone B** | Both `A` in the NT list |
| 6 | **Longreach classified Zone A** | QLD list: `Longreach \| B` |
| 7 | **Tennant Creek classified plain Zone A** | QLD/NT list: `A (special area)` |
| 8 | **"more than 183 days"** stated 4× | ATO: "183 days or more" |
| 9 | **FAQ: "not pro-rated… you either qualify for the full offset or nothing"** | Contradicted by Worksheet 6 (`days ÷ 183`) |
| 10 | **FAQ: "cannot combine days from different zones"** | Contradicted by Category 2 and the ATO's "Sharon" example |
| 11 | **Carry-forward provisions absent entirely** | §2.5 |
| 12 | **Broken comparison sentence** at `:160` — "the 37% bracket was lowered to **37%**" | The find-replace class of bug called out in the companion doc |
| 13 | **Title and body labelled FY2025-26**, worked example on FY2025-26 brackets | Site is on FY2026-27 |
| 14 | **SAPTO max stated as $2,230** | Unverified. Either verify or remove |
| 15 | **"2.4 million Australians"**, **"since the 1945 income tax assessment regime"** | Unverified claims on a YMYL page carrying a CPA byline |

Items 1–3 are the serious ones: the page's single most prominent number is wrong, and it
is wrong in the meta description too, which is what Google indexes.

---

## 4. Architecture

Three units, each independently testable.

### 4.1 `lib/constants/zone-tax-offset.ts` — data + engine

Pure, no React. Exports the constants transcribed from Tables 1–3 and the worksheets,
plus one function:

```ts
export type ZoneArea = "zoneA" | "zoneB" | "specialArea" | "overseasForces";

export interface ZonePlace { area: ZoneArea; days: number }

export interface ZoneOffsetInput {
  places: ZonePlace[];
  students: number;            // full-time students under 25
  otherChildren: number;       // non-student children under 21
  soleParentDays: number;      // 0–365
  invalidCarerOffset: number;  // amount claimed at T5 label B
  remoteAreaAllowance: number;
}

export interface ZoneOffsetResult {
  offset: number;
  category: 1 | 2;
  fixedAmount: number;
  totalBaseAmount: number;
  basePercentage: number;
  baseContribution: number;
  perPlace: { area: ZoneArea; days: number; claimable: number }[];
  remoteAreaAllowanceApplied: number;
}

export function calculateZoneTaxOffset(input: ZoneOffsetInput): ZoneOffsetResult;
```

Design notes:
- The invalid/carer offset is an **input**, not computed. This mirrors ATO Worksheet 4
  row f ("Amount claimed at question T5 – label B"). Computing it would require
  implementing nine further worksheets for a small minority of users.
- Dependant ATI reduction is exposed but defaults to the full base amount, matching the
  ATO's own "simple circumstances" path.
- **Every figure derives from the exported constants.** No literal rates in the engine or
  the component — this is the defect class that produced the hardcoded `$125,000` in
  `calculateHECS` and the drifted hourly constant.
- Result returns the intermediate worksheet rows so the UI can render an auditable
  breakdown rather than a bare number.

### 4.2 `modules/calculator/zone-tax-offset-calculator.tsx` — UI

`"use client"`, embedded near the top of the existing guide page, above the current
Section 1. Follows the established calculator module pattern
(`useState` + `useMemo`, `Card`/`CardContent`, `formatAUD`).

Inputs: zone selector · days in zone · optional second zone · students under 25 ·
other children under 21 · sole-parent days · invalid/carer offset · remote area
allowance. Advanced inputs collapsed by default so the common case is two fields.

Output: the offset, plus a line-by-line breakdown mirroring ATO worksheet rows, so a
user can reconcile it against the ATO's own tool.

**FAQ answers must be present in rendered HTML**, not only in the Radix accordion —
gap analysis §A4 records that 94 modules currently hide answers from crawlers.

### 4.3 `lib/constants/__tests__/zone-tax-offset.test.ts`

Anchored on ATO-published values, following the NAT 1006 precedent:

| Test | Expectation | Source |
|---|---|---|
| Zone A, no base | $338 | Table 1 |
| Zone B, no base | $57 | Table 1 |
| Special area, no base | $1,173 | Table 1 |
| Overseas forces, no base | $338 | Table 1 |
| "Neil": Zone A 190d + Zone B 40d | Category 1, $338 | ATO example |
| "Sharon": Zone A 100d + Zone B 120d | `338×100/183 + 57×83/183` | ATO example |
| "Sharon special": special 185d + overseas 100d | $1,173, overseas ignored | ATO example |
| Zone A + 1 student | `338 + 376×0.50` = $526 | Tables 2–3 |
| Zone B + 1 student | `57 + 376×0.20` = $132.20 | Tables 2–3 |
| Remote area allowance exceeds offset | 0, never negative | Worksheet 5 row f |
| Special area never additive to zone fixed | no result exceeds $1,173 + base×50% | Table 3 |

---

## 5. Zone list ingestion

**Decision: ingest the full ATO zone list** (user call, 28 July 2026).

### 5.1 Constraint discovered during design

`curl` against ato.gov.au returns **HTTP 403**. The data cannot be scripted to disk; it
must be retrieved via firecrawl's proxy, pass through model context, and be re-emitted
into a data file. For roughly 6,000 rows of YMYL data that is the highest-risk step in
this work.

### 5.2 Consequent sequencing

The zone list ships **after** the engine, calculator and guide corrections, as its own
commit series — one commit per state. If ingestion is interrupted, the verified,
high-value work is already committed and deployable.

### 5.3 Mitigations

- One state per commit, with the row count recorded in the commit message.
- A schema test asserting every `zone` value is in the allowed enum
  (`A`, `B`, `A (special area)`, `B (special area)`, `Not in a zone`) and that no
  location name is duplicated within a state.
- Spot-check assertions in the test file for locations verified independently during
  research: Darwin `A`, Alice Springs `A`, Tennant Creek `A (special area)`,
  Longreach `B`, Townsville `B`, Thursday Island `A (special area)`,
  Normanton `A (special area)`.
- The dataset carries a `sourceUrl` and `lastUpdated` ("1 July 2026") per state, surfaced
  in the UI, so staleness is visible rather than assumed.

### 5.4 Scope boundary

Lookup is by **location name**, matching how the ATO publishes it. **Not** by postcode —
the ATO does not publish a postcode mapping and deriving one would mean inventing data
on a YMYL page. Search is client-side over a static JSON dataset; no new route.

Where a location is absent, the UI states that the ATO list is not exhaustive (the ATO
says so itself) and links to the relevant state page and the special-area criteria
(>250 km by shortest practicable surface route from a population centre of 2,500+).

---

## 6. Out of scope

- **Postcode lookup** — §5.4.
- **Computing the invalid/invalid carer offset** — §4.1; taken as an input.
- **`/fringe-benefits-tax/`** and anything else outside this page.
- **A new URL.** The existing `/zone-tax-offset/` already ranks 7.3; the tool goes there.

---

## 7. Success criteria

1. `npm test` passes, including the new ATO-anchored regression tests.
2. `npm run build` succeeds; the calculator is present in the **rendered HTML** in `out/`.
3. Zero occurrences of `$1,511` or `$1,230` as a zone offset anywhere in `out/`.
4. Darwin, Palmerston and Humpty Doo render as Zone A; Longreach as Zone B.
5. No occurrence of "more than 183 days" in the rendered page.
6. The broken "37% … 37%" sentence is gone.
7. The meta description states $1,173 as the maximum, not $1,511.
8. Every figure on the page traces to `lib/constants/zone-tax-offset.ts`; no literal
   offset amounts in the component.
9. FAQ answer text appears in rendered HTML.

**Measurement.** Baseline for `/zone-tax-offset/`: 440 impressions, 1 click, position
7.3 (GSC 28d to ~25 Jul 2026). Re-export the same comparison after deploy. Do not judge
by Ahrefs — it understates this site ~8×.

---

## 8. Implementation status (28 July 2026)

Six commits on `seo/fy2026-27-recovery`, `1b302da` → `ef85b7b`.

| Work | State | Commit |
|---|---|---|
| Offset engine, ATO worksheets 4–7 | **Done** | `1b302da` |
| Calculator UI + 15 guide defects fixed | **Done** | `c5c98bf` |
| Zone-list pipeline + Tasmania | **Done** | `252186e` |
| Northern Territory (522) | **Done** | `2dff0b3` |
| Town lookup wired into calculator | **Done** | `720a0d6` |
| NSW (206) + SA (444) | **Done** | `43d7557` |
| WA (1,515) + external territories (5) | **Done** | `c90e051` |
| Queensland (1,764) | **Done** | `ef85b7b` |

**Zone list complete: 4,536 locations across all seven ATO lists.**
By code: B 1,988 · AS 938 · BS 845 · A 763 · N 2.

`npm test` 11 → **123 passing**. Build clean, tsc clean, eslint clean.
Adds 38 KB gzipped to this route's chunk only.

### What the town-list audit found

The old page named 23 towns. **13 were wrong and 3 were not on the ATO list at all.**

| Town | Published | Actual | Effect on offset |
|---|---|---|---|
| Darwin, Palmerston, Humpty Doo | Zone B | **Zone A** | $57 → $338 |
| Broome, Carnarvon | Zone B | **Zone A** | $57 → $338 |
| Exmouth | Zone A | **A special area** | $338 → $1,173 |
| Birdsville | Zone A | **A special area** | $338 → $1,173 |
| Broken Hill | Zone A | **Zone B** | $338 → $57 |
| Longreach, Winton | Zone A | **Zone B** | $338 → $57 |
| Tibooburra, White Cliffs | Zone A | **B special area** | $338 → $1,173 |
| Coober Pedy, Roxby Downs, Leigh Creek | Zone A | **B special area** | $338 → $1,173 |
| Woomera | Zone A | **Zone B** | $338 → $57 |
| Tennant Creek | Zone A | **A special area** | $338 → $1,173 |
| Geraldton, Rockhampton, Gladstone | Zone B | **not on the ATO list** | no entitlement |

Errors ran in both directions, so this was not a systematic offset — it was a
list that had drifted from its source with no mechanism to detect it. Tests now
assert every corrected value, and absence assertions cover the three towns that
carry no entitlement so none can be reintroduced.

### Deliberately not done

- **Computing the invalid/invalid carer offset.** Taken as an input, exactly as
  ATO worksheet 4 row f does. Computing it means nine further worksheets for a
  small minority of claimants.
- **Postcode lookup.** The ATO publishes no postcode mapping; deriving one would
  mean inventing data on a YMYL page.
- **FY2026-27 amounts.** Not published by the ATO. The page is labelled 2025-26
  and says so explicitly.

### Known constraint for the next maintainer

`curl` against ato.gov.au returns **HTTP 403**, so this dataset cannot be
refreshed by script — it needs a proxied fetch (firecrawl) and re-transcription.
The ATO updates the lists annually around 1 July. `ZONE_LIST_LAST_UPDATED` in
`lib/data/zones/types.ts` is surfaced in the UI so staleness is visible.
