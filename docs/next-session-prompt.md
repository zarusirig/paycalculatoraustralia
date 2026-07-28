# Next session prompt

Copy everything below the line.

---

Continue SEO/correctness work on pay-calculator-australia.com (repo at
/Users/surajgiri/Desktop/paycalculatoraustralia, Next.js app in calc-boiler/).

READ FIRST, before touching anything:
  docs/superpowers/specs/2026-07-28-fy2026-27-migration-and-serp-recovery-design.md
  docs/superpowers/specs/2026-07-28-zone-tax-offset-calculator-design.md
  docs/seo/2026-07-28-keyword-and-content-gap-analysis.md

The gap doc's §8 is an evidenced "do NOT build" list — read it before proposing
anything. §10 is the roadmap with current status.

STATE: everything is on `main`, pushed, and DEPLOYED to production. Working tree
clean. `npm test` = 196/196. `npm run build` = 245 pages. There is no
outstanding unshipped work.

Deploy that works, from calc-boiler/:
  npx firebase deploy --only hosting --project paycalculatoraustralia-965d5
The aceroukteam@gmail.com account has access. A first attempt once failed with a
permissions error and succeeded on immediate retry — if you see that, retry once
before concluding anything.

Already done — do not redo:
- ATO Schedule 1 (NAT 1006) coefficient engine, and ATO Schedule 8 for the STSL
  component. Both replaced an "annualise and divide" shortcut. Anchored on the
  ATO's published worked examples.
- FY2026-27 migration sitewide; title sweep; /site-directory/ (158 crawlable
  links); 52-week hourly basis.
- /zone-tax-offset/ — calculator + 4,536-location ATO zone lookup, 15 defects
  fixed. The audit found 13 of 23 towns the page named were in the wrong zone.
- /sapto-calculator/ — new page, ATO's nine worked examples as tests.
- /hourly-to-salary/[rate]/ — 30 rate pages, cross-linked with /salary-to-hourly/.
- SGC rules corrected across three modules for Payday Super (in force 1 Jul 2026).
  The site had been saying the SGC is not tax-deductible; it now is.
- VERIFIED AWARD CONSTANTS EXIST BUT HAVE NO PAGES YET:
    lib/constants/schads-award.ts       SCHADS MA000100, 27 SACS classifications
                                        + both home-care streams
    lib/constants/hospitality-award.ts  Hospitality MA000009 + Retail MA000004
    lib/constants/junior-rates.ts       NMW junior scale + per-award scales
  All three are tested against Fair Work's published figures.

NEXT TASK — build the award rate pages on top of those constants. The data work
is done and verified; this is now page-building only. Targets from gap doc §D3:
schads award pay rates (2,900, KD 1), hospitality award rates (1,400, KD 0),
penalty rates (1,100, KD 2), junior rates (~4,300 combined, unclaimed by anyone).

Five traps are already encoded in the constants and must survive onto the page:
1. SCHADS Equal Remuneration Order — clause 15 says Level 4 pp1 is $1,344.50;
   the operative rate is $1,774.74. The clause figure understates SACS pay 45%.
2. The 4.75% increase is NOT uniform — Hospitality Introductory and Level 1 sit
   exactly on the AWR floors. Never inflate last year's figures.
3. Hospitality evening/night are FLAT CASH ($2.95/$4.42 per hour), not multipliers.
4. Casual penalties are ADDITIVE — Sunday casual is 175%, not 150% x 1.25.
5. Casual overtime DIVERGES — hospitality excludes the loading, retail includes it.

Each constants file has an `_UNVERIFIED` export listing what was deliberately
not filled in (trainee/apprentice rates, Schedule G translations, Queensland
transitional orders, retail shiftworker detail, loaded-rate arrangements, retail
junior rates for levels 4-8). Publish those as gaps with a Fair Work link, not
as interpolations.

THEN, in this order (gap doc §10):
- Payday Super + SGC content page — constants in australian-tax.ts
  (SUPER_GUARANTEE_CHARGE) are verified and unused by any page. ~1,700 vol at KD 0-1.
- Revive dormant pages (§11.8) — medicare levy calculator KD 4, monthly tax
  table KD 3, salary sacrifice calculator KD 7. Pages exist and rank for nothing.
- Thicken the four tax-table pages — NAT numbers in titles, ATO PDF links,
  Dataset schema. 43,300 volume at KD 3-13.
- Consolidate HECS (§11.4) — ~28,500 volume split across 4 pages, none above #34.
- Work hours / timesheet calculator; CGT calculator.
- Holidays/calendar cluster (~655,000 vol at low KD) — needs a strategic call
  from me first, it is adjacent traffic not pay-calculator intent.

HOW I WANT YOU TO WORK:
- Always use firecrawl for web access. firecrawl_search location must be
  "Australia", not "AU". ato.gov.au and some Fair Work URLs return 403 to plain
  curl — firecrawl proxies correctly.
- Verify every figure at the primary source. These are YMYL pages with a CPA
  byline and a Registered Tax Agent number.
- DO NOT trust LLM/JSON extraction for award or tax figures. Two separate agents
  last session had firecrawl's structured extraction return FABRICATED award
  data — an invented SCHADS junior table with a plausible clause number, and
  shifted hospitality junior age bands. Both were caught only by grepping raw
  award text. Go to the published table.
- If you cannot verify a figure, say so and leave it. Ship gaps as gaps.
- Derive from constants; never hardcode a rate. Three separate defects in this
  codebase came from hardcoded figures drifting from their own constants.
- Watch for blanket find-replace breaking comparison sentences.
- Run `npm test` and `npm run build` before every commit. Verify against the
  rendered HTML in out/, and against production after deploying — the Schedule 8
  defect was only found by checking production, not the build.
- Commit per logical unit with the measured before/after in the message.
- You may fan out subagents for verification work. Have them return findings,
  not write code — parallel writes collide on sitemap.ts and navigation.ts, and
  award data needs one pair of hands.

CONTEXT YOU'LL NEED:
- Traffic is GROWING. GSC 28 Jul: 4,958 -> 6,873 clicks (+39%).
- Baseline to measure against: 6,894 clicks / 698,124 impressions / 0.99% CTR
  in the 28 days to ~25 Jul 2026. Re-export the same comparison. ASK ME for
  fresh GSC data — Ahrefs understates this site ~8x and there is no Ahrefs
  project for the domain, so gsc-* MCP tools do not work.
- Sitewide CTR 0.99% with 69% of impressions on sub-1% pages is still the
  biggest recoverable pool.
- Content depth is NOT the constraint. DR 0.1 competitors outrank us.

DIARY / WATCH ITEMS:
- ATO concessional-cap relief for Payday Super changeover contributions is
  ANNOUNCED BUT NOT LAW. Recorded as such; do not assert it.
- FWC [2026] FWCFB 75 may give 18-20 year olds the adult rate in retail, fast
  food and pharmacy, possibly from 1 DECEMBER 2026. Recorded inForce: false.
- The GIC rate feeding SGC notional earnings resets QUARTERLY. 11.43% for
  Jul-Sep 2026. Anything hardcoded goes stale in October.
- Zone and SAPTO amounts are for the 2025-26 income year, the one being lodged.
  The ATO had not published FY2026-27 figures. Check again after they do.
- The zone dataset CANNOT be refreshed by script (403). It needs firecrawl plus
  re-transcription. ATO updates the lists around 1 July annually.

STILL OPEN / NEEDS ME:
- /leave-calculator/ lost 62 clicks with a real position drop (6.4 -> 7.3),
  still undiagnosed.
- DR 0.8 against 367 referring domains — abnormal ratio, caps everything.
- The navbar still emits no crawlable links; /site-directory/ works around it
  rather than fixing it.
- Trailing slash is RESOLVED — production 301s cleanly to the slashed form,
  one canonical URL each, no duplicate-content problem. No action needed.
