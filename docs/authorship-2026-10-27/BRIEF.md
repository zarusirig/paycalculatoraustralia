# Writer brief: authorship + humanizer pass (A + B), pay-calculator-australia.com

Date: 27 Oct 2026. Worktree: `~/Desktop/pca-authorship` (branch `feat/authorship-humanize-2026-10-27`). Run every command from `~/Desktop/pca-authorship/calc-boiler`.

## Why this pass exists

On 19 Oct 2026 Google cut the site's search impressions by 97% overnight. There was no manual action. The owner's diagnosis: Google classed the site as **scaled AI content**. This pass is the recovery work. Its job is to make every page read like it was written by a careful Australian payroll writer for this one page, and to make each page answer its query faster and more precisely than any rival. A sentence that could sit on any pay site, or on all 40 sibling pages, is the problem we are fixing.

## Your job, in order

1. Run `node scripts/authorship/job.mjs <unit-id>` for every unit in your job. It prints the file, line range, the pages that use it, their pre-crash Google queries and their AUDIT row (intent, format_fit, centerpiece, serp_answered, deserves_page, factual_vs_opinion).
2. Read the unit's chunk file and enough of the real source file around it to understand how the strings render (a data field may render on 1 page or 80).
3. Edit ONLY `docs/authorship-2026-10-27/work/chunks/<unit-id>.txt`, with the Edit tool. Never edit the source files, the `.orig.txt` files, or anything else.
4. Run `node scripts/authorship/check.mjs <unit-id>` after each batch of edits. It must print PASS. Read every warning. Fix every FAIL. Never try to "work around" the checker: if a rule blocks a good edit, leave that string as it is.
5. Return the JSON your task asks for, including `factQuestions`.

## What you may change

Only reader-facing prose that the checker classes as editable: JSX text, and string or template-literal text in prose fields (intros, summaries, notes, FAQ **answers**, paragraphs). The checker locks everything else: code, JSX attributes (all of them), headings h1-h6, link text, button text, table cells and headers, captions, FAQ questions (`q`, `question`), titles, descriptions, metadata, schema, labels, names, award/instrument/classification/level names, sources, dates, slugs, hrefs, any string with a dash in it (lookup keys), short strings under 4 words, and any string a test or lookup matches.

Inside an editable string, the `${...}` and `{...}` expressions are code. Keep them all, in the same order, unchanged. You may rewrite the words around them.

## Hard rules (YMYL finance, from the project memory)

- **No new numbers. No removed numbers.** A figure must come from code. Never type a rate, amount, year, age, count or percentage. If you need a figure that is not already in your text, you cannot add it in this pass: write it in `structureRequests` instead. Moving a number between two strings in the same unit is allowed but avoid it.
- **Factual modality.** Tax and pay rules stay definitive. Never add "may", "might", "could", "generally", "typically", "usually", "it depends" to a rule. Never soften "is" into "can be".
- **No invention.** No examples, quotes, "users say", "many workers", "experts", stories, or experiences that are not already in the text. Name an existing source (ATO, Fair Work Ombudsman, Fair Work Commission, Services Australia, the agreement) only if the page already cites it.
- **Opinion only when the AUDIT says `needs labelled editorial judgment`.** Then write it as labelled guidance with the reason ("Our view: ... because ..."), never as a rule.
- **Wrong-looking facts: never change them.** List each in `factQuestions` with page, claim, why it looks wrong, and which constant or data file should hold it.
- **Australian English.** -ise not -ize, labour, centre, licence (noun), program is fine. No em or en dashes. No spaced hyphens or "--" as dashes. Use a full stop, comma, colon or brackets.
- **Brand voice** (`brand-identity.md`): Grade 8-10, formality 4/9, second person ("you", "your") for guides and tools, "we" only for about/trust copy. Mix short (8-12 word) and medium (15-22 word) sentences; none over 30 words. Lead with the number, then explain. Forbidden: guarantee, always/never (for tax advice), hack, guru, synergy, utilise, leverage, best-in-class, cutting-edge, revolutionary, seamlessly, actionable.
- Keep the brand CTA wording where it exists ("Calculate Your Take-Home Pay"). Add no new CTAs, links, sections or components.

## Layer A: algorithmic authorship

### Centerpiece (only for pages whose AUDIT `centerpiece` <= 3, and only if your unit holds that page's opening)

The opening prose (first 6-7 sentences after the H1) must:
1. name the exact entity ("The Victorian Public Service (VPS) Grade 4 salary", "Woolworths supermarket pay under the Woolworths Australian Food Group Agreement 2024");
2. give the direct answer using the figure ALREADY rendered by an expression in that text (keep the expression, never type the number);
3. state the defining attributes that apply: instrument or agreement, effective date, financial year, state, pay period, who it covers;
4. say what the calculator or table on the page does for the reader;
5. end with what the rest of the page covers.

The H1 and the page title are locked. If the opening cannot meet 1-3 without a figure or expression that is not already there, do what you can and write the gap in `structureRequests`.

### Micro-semantics

- Replace generic words with the attribute the reader needs. "Competitive pay" -> "the Level 3 base rate under the General Retail Industry Award". "Tax may vary" -> name the variable: tax-free threshold claimed, Medicare levy, HELP debt, pay period.
- Use the exact terms in `lexical-relationship-map.md` and `entity-attribute-analysis.md` (repo root). Do not swap a mapped term for a synonym, and do not remove mapped synonyms that are already placed.
- Keep query terms together. If a sentence holds "fortnightly" + "tax" + "2026", the rewrite keeps all three in that sentence.
- Repeat the clearest entity name instead of cycling synonyms ("the agreement" -> "the Woolworths agreement" when it helps).

### Scaled-content rule (the reason for this pass)

- **Template copy** (a file used by many pages, see "used by N pages" in job.mjs): every sentence renders on every one of those pages. A sentence that says nothing specific to the page's entity is the scaled-content signal. Cut filler. Make generic sentences specific by building them around the expressions already in them (the entity name, the instrument, the state, the figure). Prefer shorter. Never cut a sentence that carries a fact, a figure, a condition or a source.
- **Per-entity data prose** (an employer's, occupation's or state's own intro, notes, FAQ answers): make it say what is true for THIS entity and no other, using only facts already in the entity's data. Never copy the same sentence shape across sibling entries.

## Layer B: semantic humanizer (all 33 patterns, with guardrails)

Remove: significance inflation, promotional words, superficial trailing "-ing" clauses ("ensuring...", "highlighting..."), rhetorical triads (three interchangeable vibe words; three checkable facts are evidence and stay), signposting ("Here's what you need to know", "Let's break it down", "In this guide"), generic positive endings, "not just X, it's Y" frames, aphorisms, staccato fragment runs, fake-candid openers ("Honestly?"), chatbot leftovers, knowledge-cutoff hedges, filler ("in order to" -> "to", "it is important to note that" -> delete), excess hedging, vague attributions ("experts say": name the ATO/FWO/FWC only if the page cites it, else cut the attribution), copula avoidance ("serves as" -> "is"), diff-anchored text ("this section was updated to reflect..." -> describe the current state; dated "Updated" lines stay), curly quotes -> straight, decorative bold (only when the bold is a separate JSX text you can change; you cannot remove `<strong>` tags).

The checker FAILS if you ADD any of: delve, crucial, pivotal, seamless, robust, navigate, landscape, in today's, whether you're, additionally, furthermore, moreover, in order to, it is important to note, rest assured, unlock, empower, game-changer, peace of mind, tapestry, testament, vibrant, showcase, underscore, foster, garner, leverage, streamline, elevate, dive into, here's what you need to know, in conclusion, embark, realm, harness, boasts, nestled, stands as, serves as a, worth noting, plethora, hassle-free, unleash, plus the brand forbidden words. Remove existing ones when the edit is safe (literal uses such as "navigate the menu" may stay).

### Protected (do not touch, even though the checker may allow it)

- The first sentence of an FAQ answer and the first answer sentence after a heading: it must stay a direct, definitive answer with the entity as subject. You may polish wording; never delay or soften the answer, never drop its figure.
- Lists and tables: keep them lists and tables (the checker already blocks structure changes). Item prose may be tightened; keep parallel grammar.
- The one bold answer value per passage.
- Proximity of query terms (see above).
- CTA wording from `brand-identity.md`.
- Legal and independence notices ("Pay Calculator Australia is independent and not affiliated with ...", "general information, not financial advice"): keep the meaning exactly.

## Conversion (words only)

Inside existing next-step and "what to check next" prose, point the reader to the calculator on the page and to the result links ("Enter your hourly rate above to see your fortnightly pay after tax"). Add no links, CTAs, sections or components.

## Churn rule

Change a string only when the change fixes a pattern above, sharpens the centerpiece, or adds micro-semantic precision. A clean, specific sentence stays as it is. No synonym swaps for their own sake. A reviewer will revert churn.

## Lessons from the pilot (27 Oct 2026)

- The 20 Oct 2026 pass already removed most dashes and stock AI phrases. Your value now is the centerpiece, micro-semantic precision, full sentences with the entity as subject, and the scaled-content rule. If a unit is already clean and specific, return it unchanged quickly. Do not read more of the codebase than you need to see how its strings render.
- A field that renders as its own paragraph (statusNote, note, notes, intro, coverage) must be a full sentence. Turn bare fragments ("Inside its nominal term...", "From 1 July 2027.") into sentences with the entity as subject ("The Woolworths agreement is inside its nominal term...").
- Coordinated conditions: when you reorder a sentence, a time, day, age or service condition must still cover every subject it covered before ("permanent staff are paid base + 50% and casuals base + 75% between 9am and 11pm on a Sunday", not a version where the window only attaches to the first group).
- Link and table descriptions must match what the code really does. If a link goes to the nearest $5,000 page, do not say it goes to "your" exact figure. Narrowing a scope that was too wide ("every figure" -> "each salary in the table") is wanted: say so in `notes`.
- A bare en dash in a range ("7am–11pm", "2025–26") inside a long prose string is now editable. Replace it with "to" (times, dates) or a hyphen (financial years "2025-26"), keeping every number.
- Population claims with no figure ("most early-career teachers", "many workers") go to `factQuestions` unless the page cites a source for them.
- Known correct, do not flag: the National Minimum Wage rose 5.97% in the 2026 Annual Wage Review while modern award minimums rose 4.75% ($26.44/hr, $1,004.90/wk from 1 July 2026, FWO). Fair Work publishes no weekly junior figures, so weekly junior amounts are the site's own derivation.
- In `factQuestions`, give the SOURCE file line (from the real file, not the chunk).
- Same decision number used for two different years (for example "[2025] FWCFB 3500" and "[2026] FWCFB 3500") is a citation question for `factQuestions`.

## Output JSON (what you return)

- `units`: for each unit id: `{ id, status: "edited" | "unchanged" | "partial", changedStrings, centerpieceRewritten: true|false, check: "PASS" }`.
- `factQuestions`: `[{ page, file, line, claim, why, constant }]` for anything that looks wrong or stale.
- `structureRequests`: `[{ page, need }]` for format changes this pass cannot make (calculator below the fold, a figure the opening needs but the text lacks, steps that should be an `<ol>`, a table that is prose).
- `mergeNotes`: anything that suggests a page is a near-duplicate of another URL.
- `notes`: one or two lines on what you changed and anything the reviewer should check.

## Web research

Not needed for this pass. If you must look something up, use the Firecrawl REST API (`. ~/.config/firecrawl/env`, then `curl -s -X POST https://api.firecrawl.dev/v2/scrape -H "Authorization: Bearer $FIRECRAWL_API_KEY" ...`), about 7 requests per minute for the whole run. Never WebFetch.
