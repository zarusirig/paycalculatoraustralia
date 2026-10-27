# Fact-fix brief (Step 7, layer C), pay-calculator-australia.com

Date: 27 Oct 2026. Worktree `~/Desktop/pca-authorship` (branch `feat/authorship-humanize-2026-10-27`). Run commands from `~/Desktop/pca-authorship/calc-boiler`. Today is 27 October 2026. Financial year 2026-27 started 1 July 2026.

The layer A/B wording pass is already committed. This pass makes every figure, date, rule and source correct and current. YMYL finance: a wrong figure costs a reader real money.

## Your job

You own a list of files and the fact questions raised on them. For each question:

1. Read the claim in the real file (the line number is a hint; it may have moved a few lines).
2. Decide what is true, using the site's own code first and primary sources second.
3. Fix it if, and only if, you can prove the correct value. Else leave it and report it.
4. Return a result for EVERY question.

## Sources

- Site code is the single source of truth for figures: `lib/constants/*.ts` and `lib/data/**`. Prose must never retype a figure the code already provides. If prose types a figure that a constant holds, the fix is to render the constant (import it, use the existing format helpers such as `formatAUD`, `pct`) or, when that is not practical in that string, to remove the typed figure.
- Primary sources only for facts from outside: ato.gov.au, fairwork.gov.au, fwc.gov.au (awards, decisions, agreements), servicesaustralia.gov.au, dss.gov.au, legislation.gov.au, treasury.gov.au, state and territory government sites (revenue offices, public sector commissions, industrial relations commissions and their published agreements, awards and determinations), the employer's agreement as approved by the FWC. A secondary site may help you find the primary page; it never proves a fact by itself.
- Web access: ONLY through `bash scripts/authorship/fc.sh search "<query>"` and `bash scripts/authorship/fc.sh scrape <url>`. It is shared by all agents (about 7 requests a minute in total, so it may wait) and caches results. Never use WebFetch or WebSearch. Do as few requests as you need. Search first, then scrape only the one or two pages that matter.
- Already verified on 27 Oct 2026 (do not research again): `docs/fact-fix-2026-10-27/research-staling.json` (GIC, Medicare/SAPTO/zone offsets, CGT, Payday Super status, junior rates phase-in, VGSA 2026, Bunnings, NSW radiographers, Woolworths shiftwork clause, FWCFB 3500 citations). Read it if your files touch these topics, and apply its findings.
- Known correct, do not flag: the National Minimum Wage rose 5.97% in the 2026 Annual Wage Review while modern award minimums rose 4.75% ($26.44/hr, $1,004.90/wk from 1 July 2026, FWO). Fair Work publishes no weekly junior figures, so weekly junior amounts are the site's own derivation.

## What you may change

- Prose in your own files (any string a reader sees, JSX text, FAQ answers, notes).
- Constants and data values in your own files, ONLY when a primary source proves the new value and its effective date. When you change a constant or data value, update the test that checks it (in `__tests__`, even if the test file is not in your list) and any period label ("2025-26", "from 1 July 2026") that goes with it. Say so in your result.
- Meta descriptions ONLY if a fact in them is wrong. Keep them at 165 characters or less.

## What you must never change

- Titles (all locked). H1s and headings unless the heading itself states a wrong fact (then report it, do not change it).
- Lookup-key strings, byte for byte: award and instrument names ("Clerks—Private Sector"), ADF PACMAN names, classification, level, penalty and allowance labels, lone "—" table placeholders, anything `findAwardRate`, `peaRow`, `allowances.find`, `split(" — ")` or a test matches.
- Engine code (calculation logic). Change values, not logic. If the logic is wrong, report it as needs-decision.
- Files you do not own, except the test file for a constant you changed. If the right fix sits in a file you do not own, report it as `cross-file` with the exact change.
- Ads, layout, CSP, ads.txt, `.mv-*` classes, components.
- URLs: never add, remove or redirect a page.

## Writing rules for any text you change

- Factual modality. No new hedging ("may", "generally", "usually") on a rule. State the rule and its condition.
- No invented figures, examples, quotes or "many people". If a population claim ("most workers", "many employers") has no primary source, delete the claim or replace it with the sourced rule. Never replace it with a made-up figure.
- Australian English. No em dashes or en dashes in prose you write (use "to", a comma, a colon or brackets). Ranges: "7am to 11pm", financial years "2025-26".
- Brand voice: plain, Grade 8-10, second person, lead with the number.
- Keep the edit as small as the fix needs.
- Do not run `npm test`, `next build` or `npm run check:*`: other agents share the folder and the build output. You may run `npx tsc --noEmit -p . 2>&1 | grep <your file>` once at the end if you changed code.

## Result statuses

- `fixed`: you changed the file(s); give source URL and a short quote that proves the new value (or the constant you now render).
- `already-correct`: the claim is right; give the proof.
- `unverified`: you could not prove the right value from a primary source; say what you tried. Leave the text as it is.
- `locked`: the wrong text is a title, heading or lookup key; give the exact proposed fix.
- `needs-decision`: the fix needs an owner choice (drop a claim with business value, change scope, change engine logic, a source conflict).
- `cross-file`: the fix belongs in a file you do not own; give file, line and exact change.
