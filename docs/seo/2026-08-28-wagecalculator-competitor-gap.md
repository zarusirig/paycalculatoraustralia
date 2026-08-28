# wagecalculator.com.au — competitor gap analysis

Date: 28 Aug 2026.
Source: Ahrefs organic-keywords export for `www.wagecalculator.com.au` (AU), 4,574 keywords, 147 URLs, est. **15,718 visits/month**.
Our baseline: **5,660 clicks / 28 days** (GSC, to 27 Aug 2026). The two numbers are not the same metric, but they say the competitor is roughly 2–3× our size.

Caveats: our GSC `by_query.csv` export is not on disk and Ahrefs units are at 0, so "we both rank" is judged by whether a route exists in `calc-boiler/app/`, not by position. Backlink/DR comparison was not possible for the same reason.

---

## 1. Where their traffic comes from

62% of their traffic is the homepage ranking for head terms (`tax calculator` 84k vol pos 11, `salary calculator` 33k pos 6, `payg calculator` 17k pos 7, `wage calculator` 7.2k pos 3). That is authority, not topical map — nothing below fixes it.

The other 38% (~6,000 visits) is spread across 146 URLs. Grouped:

| Cluster | Traffic | Volume | Kws | URLs | We have it? |
|---|---:|---:|---:|---:|---|
| `/salary/N` (tax on / after tax, 8 amounts) | 1,349 | 55,630 | 365 | 9 | Yes — `/tax-on/N` + `/take-home-pay-on/N` (70 pages) |
| **Public-service pay scales** (APS, VPS, QLD, NSW, NT, SA, WA, TAS) | **1,034** | 37,740 | 580 | 28 | **No** |
| `/hourly-to-salary/N` | 853 | 13,840 | 277 | 26 | Yes — P1 in current plan |
| **Teacher salaries by state** | **642** | 19,510 | 259 | 9 | One page only (`/teacher-pay-australia/`) |
| `/payslip-generator` | 461 | 6,180 | 25 | 1 | Yes |
| **Salary sacrifice + novated lease calculators** | **270** | 11,920 | 38 | 5 | Sacrifice yes; **novated is a guide, not a calculator** |
| **Long service leave calculator by state** | **260** | 14,800 | 68 | 8 | **No** (`/leave-calculator/` is annual leave only) |
| `/work-hours-calculator` | 240 | 17,850 | 74 | 1 | Yes |
| Tax rates + PAYG tables | 214 | 84,340 | 93 | 7 | Yes (NAT 1006 accuracy defect still open) |
| **Nursing salaries by state** | **169** | 7,280 | 147 | 8 | One page only (`/healthcare-worker-pay/`) |
| `/compare` salary comparison | 80 | 370 | 10 | 1 | No — tiny |
| `/awards` + `/awards/schads` | 76 | 14,940 | 56 | 2 | Yes |
| `/bonus-tax-calculator` | 54 | 1,960 | 40 | 1 | Yes |
| ADF pay (army/navy/air force ranks + pay) | 40 | 3,530 | 54 | 5 | No — small |
| `/reverse-salary-calculator` | 30 | 4,280 | 39 | 1 | Yes (`/gross-pay-calculator/`) |
| `/redundancy-payout-calculator` | 25 | 5,710 | 27 | 1 | Yes |
| `/pro-rata-salary-calculator` | 12 | 320 | 13 | 1 | Planned (§5 of current plan) |
| Land tax + stamp duty calculators | 10 | 17,550 | 30 | 12 | No — outside border, and it earns them nothing |
| Investment / debt-recycling / budget / GST | 44 | 7,340 | 13 | 5 | No — outside border |

Bold rows are the gap. Together they are **~2,375 visits/month** for the competitor at KD 0–10. They are all "what does this job/grade/state pay" or "what am I owed" — the same contextual border as `/teacher-pay-australia/`, `/healthcare-worker-pay/`, `/mining-fifo-pay-guide/` which we already publish. This is an extension of the map, not a widening.

---

## 2. Gaps, ranked

Ranking = competitor traffic × ease (KD) × fit with existing sections ÷ data-maintenance cost.

### G1. Long service leave calculator — hub + 8 state spokes

- `long service leave calculator` 3,800 vol, **KD 3**, competitor pos 10. Plus `long service leave calculator nsw` 600 (pos 3), `…wa` 600 (pos 3), `…vic` 900 (pos 10), `…qld` 350 (pos 4), `nsw lsl calculator` 350, `act long service leave` 700.
- Competitor earns 260/month with per-state pages that are thin. The head term at pos 10 means nobody has a good calculator.
- LSL rules differ by state (qualifying years, weeks per year, pro-rata triggers), so state spokes are real pages, not doorways.
- Build: `/long-service-leave-calculator/` (hub, picks state) + `/long-service-leave-calculator/{nsw,vic,qld,wa,sa,tas,act,nt}/`. Keep `/leave-calculator/` as annual leave; link both ways. Add "tax on long service leave" H2 (competitor pos 1 for it).
- Data: state LSL Acts (public, changes rarely). Effort: one calculator module + 8 constants files.

### G2. Teacher salary by state — split the one page into 8

- `teacher salary vic` **3,000 vol KD 0** (competitor pos 9), `nsw teacher salary` 1,000 (pos 14), `teacher salary nsw` 900 (pos 9), `teacher salary qld` 700 (pos 8), `qld teacher salary` 600 (pos 1), `victorian teacher salary` 800 (pos 8), `teacher salary wa` 400 (pos 6), `teacher pay scale victoria` 400, `principal salary victoria` 250, `graduate teacher salary victoria` 200. Cluster: 19.5k vol, 259 keywords, KD 0–5.
- Competitor earns 642/month from 8 state pages. We hold one national page.
- Build: keep `/teacher-pay-australia/` as hub; add `/teacher-pay-australia/{nsw,vic,qld,wa,sa,tas,act,nt}/` with the state EA pay scale table (graduate → top step → leadership), a "which step am I" picker, and a link to `/take-home-pay-on/N/` for each step.
- Data: each state education department publishes its scale. Update once a year per state EA.

### G3. Public-service pay scales — new section

- Biggest gap by volume: 37.7k vol, 580 keywords, 28 competitor URLs, 1,034 visits/month. KD 0–5 almost everywhere.
- Three sub-clusters hold ~80% of it:
  - **APS** (federal): `aps5` 450 (pos 1), `aps6 salary` 300 (pos 1), `el1 salary` 300 (pos 1), `el2 salary` 250 (pos 1), `ses band 1 salary` 300 (pos 1), `aps levels` 500 (pos 12). Competitor 203 + 16 + 12 = ~230/month.
  - **VPS** (Victoria): `vps salary 2026` 1,500 (pos 5), `vps salary bands` 500, `vps5 salary range` 150 (pos 1), `vps3 salary` 200. Competitor 508 + 25 = ~530/month from one page.
  - **QLD**: `ao3 salary queensland government` 150, `qld health pay rates` 350 (pos 6), `po4` 800 (pos 22). Competitor ~100/month.
  - Then NT (`ntg pay scales` 250, pos 3 — 81/month from a small page), NSW clerk grades, SA ASO levels, WA, TAS.
- Build: `/public-service-pay-scales/` hub + `/public-service-pay-scales/{aps,vic,qld,nsw,wa,sa,tas,act,nt}/`. Each page: grade → salary band table, "what's my take-home at this grade" links to `/take-home-pay-on/N/`. Start with APS, VIC, QLD (~85% of the cluster's traffic).
- Cost: this is the heaviest data upkeep of the list. APS has no single scale — each agency EA differs; the competitor publishes ranges. Use APSC's published APS-wide min/max per classification and say so.

### G4. Novated lease calculator — turn the guide into a calculator

- `salary sacrifice novated lease calculator ato` 400 vol (competitor pos 1, KD 5), `novated lease electric car calculator` 450 (pos 5, KD 0), `ev salary sacrifice calculator` 150 (pos 1), `phev novated lease calculator` 250, `salary sacrifice calculator` 4,400 (pos 14, KD 0). Competitor 165/month on `/novated-lease-calculator` + 7 on the EV page.
- We have `/novated-lease-guide/` (prose only). Same fix as P2/P8 in the current plan: make the node calculator-first and keep the guide sections below it.
- Inputs: car price, lease term, salary, EV/PHEV/ICE (EV FBT exemption; PHEV exemption ended 1 Apr 2025), ECM vs statutory. Effort: medium — the FBT statutory formula and ECM need tests.

### G5. Nursing salary by state — same template as G2

- 7.3k vol, 147 keywords, KD 0. `nurse wage qld` 150 (pos 9), `nursing salary qld` 100 (pos 6), `qld health wages` 80, `nursing pay rates victoria` 80 (pos 1), `nurses award` 1,800 (pos 21). Competitor 169/month.
- Build after G2 with the same state-spoke component: `/healthcare-worker-pay/{qld,vic,nsw,wa,sa,tas}/`. Lower volume than teachers, so second.

### G6. State pay-calculator pages have the wrong intent

- Competitor's **homepage** takes `pay calculator qld` 600 (pos 3), `pay calculator vic` 700 (pos 6), `pay calculator wa` 400 (pos 4), `salary calculator nsw` 600 (pos 6), `wage calculator nsw` 400 (pos 3), `nsw pay calculator` 250 (pos 3). ~3,000 vol combined.
- Our `/pay-calculator-{state}/` pages are about payroll tax, WorkSafe premiums and levies (employer-side). Someone typing "pay calculator qld" wants their take-home pay. Intent mismatch.
- Fix: put the take-home calculator at the top of each state page (state pre-selected), keep the payroll-tax content below as "for employers". No new pages.

### G7. Checks on nodes we both have (needs our GSC export)

- `/salary/N`: competitor ranks **one** page per amount for both `tax on 120k australia` and `120k after tax australia`. We split each amount across `/tax-on/N/` and `/take-home-pay-on/N/`. If GSC shows both of ours at pos 5–15 for the same query, that is the same cannibalisation P8 fixed elsewhere. Check before merging — 70 pages.
- `/payslip-generator`: competitor pos 1 for `create payslips online free` 600, `australian payslip generator` 150; pos 15 for `free payslip template australia` 500. Confirm our positions; add a "payslip template" H2 if we are absent.
- `/work-hours-calculator`: competitor pos 1 for `how much is casual loading` 500 KD 1. Add that H2 if missing.
- `/hecs-help-calculator/`: competitor pos 12–14 for `hecs indexation` 2,900 and `hecs repayment rates` 2,600. Make sure both are H2s in the merged node (P2).
- `/award-rates/`: competitor pos 7 for `pact calculator` 900 KD 8 (Fair Work's tool name). One sentence naming PACT and linking to it would qualify us.

---

## 3. Do not chase

- Land tax, stamp duty (12 competitor URLs, 17.5k vol, **10 visits/month**). Outside the "your pay" border and it does not work for them either.
- Investment, debt recycling, invest-vs-offset, budget planner, GST calculator. Same.
- ADF pay (40/month). Real but small; revisit after G3 if the pay-scales section works.
- `/compare` salary comparison (80/month). A feature for the homepage later, not a node.
- Homepage head terms. That is links and age, not content.

---

## 4. Topical map change

The competitor's map has a layer ours lacks: **pay-scale lookup by employer/state**. We have the occupation guides (teacher, healthcare, tech, trades, FIFO) but not the state split or the public-service grades. Add one section:

```
Pay scales (reference, links into the calculators)
├── /public-service-pay-scales/            hub
│   ├── /aps/  /vic/  /qld/  /nsw/  /wa/  /sa/  /tas/  /act/  /nt/
├── /teacher-pay-australia/                existing hub
│   ├── /nsw/  /vic/  /qld/  /wa/  /sa/  /tas/  /act/  /nt/
└── /healthcare-worker-pay/                existing hub
    ├── /qld/  /vic/  /nsw/  /wa/  /sa/  /tas/
```

And one calculator in the leave sub-cluster:

```
/long-service-leave-calculator/            hub
├── /nsw/  /vic/  /qld/  /wa/  /sa/  /tas/  /act/  /nt/
```

Every pay-scale row links to `/take-home-pay-on/N/` for its salary. That is the contextual bridge that makes these reference pages feed the core calculators instead of sitting alone.

---

## 4b. Border check (rules from `contextual-borders-and-audience-map.md`)

Rule 1: every page links to a calculator. Rule 2: ≤3 degrees from "Australian Pay Calculation". Rule 3: reader can check their next payslip with it.

| Gap | Links to calculator | Degrees | Payslip test | Verdict |
|---|---|---|---|---|
| G1 LSL calculator | Is one | Pay → Leave → LSL (2) | LSL balance/payout is on the payslip | Inside |
| G2 Teacher by state | Each step → `/take-home-pay-on/N/` | Pay → Award/EA rates → state scale (2) | Checks their step against the payslip | Inside — extends existing `/teacher-pay-australia/` |
| G3 Public-service scales | Each band → `/take-home-pay-on/N/` | Pay → Award/EA rates → grade band (2) | Checks their band against the payslip | Inside — same node type as award rates |
| G4 Novated lease calculator | Is one | Pay → Salary sacrifice → car (2) | Pre-/post-tax deduction lines on the payslip | Inside — salary sacrifice is core |
| G5 Nursing by state | Each step → `/take-home-pay-on/N/` | Same as G2 | Same as G2 | Inside — extends `/healthcare-worker-pay/` |
| G6 State page intent | Calculator on page | 1 | Yes | Inside |
| Land tax, stamp duty | No natural link | Property tax (out-of-scope list) | No | **Outside** |
| Investment, debt recycling, budget planner | No | Financial planning (out-of-scope list) | No | **Outside** |
| GST calculator | No | Business tax (out-of-scope list) | No | **Outside** |
| ADF "ranks" queries | Weak | Rank structure is not pay | No | **Outside** (ADF *pay scales* alone would be inside, but the traffic is rank queries) |

Drift risk inside the pay-scale pages: keep them to "what this grade/step pays and what you take home". No "how to become a teacher", no career-progression advice, no job reviews, no lease-provider or car comparison on G4. Those are 3+ degrees.

---

## 5. Order of work against the current P1–P12 plan

The current plan says A (P1 + P2 + P8) then B (P3 + P5 + P6). Nothing here should jump ahead of A, because these new nodes need the hub/spoke wiring A builds.

After A:

| Step | Work | Pages | Competitor evidence | Why this order |
|---|---|---:|---:|---|
| 1 | G1 long service leave calculator | 9 | 260/mo, KD 3, head term at pos 10 | One module, public data, the head term is open |
| 2 | G2 teacher by state | 8 | 642/mo, KD 0–5 | Split an existing page; we already own the hub |
| 3 | G6 state pay-calculator intent fix | 0 | ~3,000 vol at competitor pos 3–6 | No new pages |
| 4 | G4 novated lease calculator | 0 | 172/mo, KD 0–5 | Same convert-guide-to-calculator move as P2 |
| 5 | G3 public-service pay scales (APS, VIC, QLD first) | 4 | 1,034/mo, KD 0–5 | Biggest but heaviest upkeep; do it once the state-spoke component exists |
| 6 | G5 nursing by state | 6 | 169/mo, KD 0 | Reuses G2's component |

### Addressable search volume (in-border gaps only, from the competitor's keyword set)

| Gap | Keywords | Volume/mo | KD 0 | KD 1–10 | KD 11–20 | KD >20 | Competitor gets |
|---|---:|---:|---:|---:|---:|---:|---:|
| G1 Long service leave | 78 | 21,010 | 2,210 | 9,190 | 5,750 | 3,860 | 274 |
| G2 Teacher by state | 240 | 21,640 | 10,820 | 7,720 | 2,170 | 930 | 612 |
| G3 Public-service scales | 569 | 26,090 | 6,820 | 4,930 | 1,860 | 12,480 | 1,000 |
| G4 Novated lease calc | 15 | 2,860 | 2,070 | 790 | 0 | 0 | 170 |
| G5 Nursing by state | 140 | 6,930 | 3,030 | 3,900 | 0 | 0 | 161 |
| G6 State page intent | 74 | 7,030 | 0 | 0 | 0 | 7,030 | 414 |
| **Total** | **1,116** | **85,560** | **24,950** | **26,530** | **9,780** | **24,300** | **2,631** |

- **~51,500/mo of that is KD ≤ 10.** That is the part we can expect to rank for with new pages and no new links.
- G3's KD >20 block is mostly `vps salary` / `vps pay scale` (KD 36–40) — the competitor still holds pos 3–5 there, so it is winnable but slower.
- G6 is all KD 53–64 head-style queries. The fix is free (no new pages) but expect it to move last.
- Volumes are per keyword and overlap ("teacher salary vic" and "vic teacher salary" are largely the same people). Treat the totals as ceilings, not searchers.
- For scale: the competitor's whole site sums to 784k vol on the homepage alone and 27.7k vol on out-of-border pages (land tax etc.) that earn them ~50 visits. We are not counting any of that.

Estimated reach: **floor ~2,600 visits/month** (match the competitor's thin pages). **Fair target ~4,000–6,000/month** if we take pos 1–3 on the KD ≤ 10 terms with real calculators. Today's baseline is 5,660/28d, so the fair target roughly doubles the site — and 2× is the threshold noted in §9 of the traffic plan where the ad-network switch becomes viable.

---

## 6. Artefacts

- Source export: `~/Downloads/www.wagecalculator.com.au-organic-keywords_2026-08-28_14-46-09.csv` (UTF-16, tab-separated).
- To re-run the cluster table: convert with `iconv -f UTF-16 -t UTF-8`, then group `Current URL` by first path segment and sum `Organic traffic`.
- Re-check G7 once the GSC `by_query_page.csv` export is placed at `docs/seo/scripts/gsc-query-network/data/Pay AU Calc Data/`.
