# seo-brain — typed SEO decisions (TypeSafe Jev + code policy)

Every SEO change on the site now passes through a typed pipeline. Code owns the
workflow and the thresholds; **Jev** (TypeSafe's System One model, `jev-1.13.0`)
answers narrow, calibrated questions; LLM agents only *generate candidates*, which
Jev then selects among and zod schemas gate. Nothing reaches a page without
passing `validate.mts`, and nothing is called done until `verify.mts` finds it in
the rebuilt export.

```
out/ + GSC + DataForSEO ──collect──▶ signals.json, opportunities.json (ranked, 7 levels)
                                          │
                                        judge  (Jev: ~370 requests, ~$0.07)
                                          ▼
                                   judgments.json
                                          │
                                        decide (thresholds in code)
                          ┌───────────────┴───────────────┐
                    decisions.json                  workorders.json
              (links, schema, technical,      (title/description, section,
               consolidate, expansion          citation lead, new page —
               verdicts, no-actions)           need generated text)
                          │                            │  agents write candidates/*.json
                          │                          rank (Jev picks + code gates)
                          │                            ▼
                          │                   decisions-ranked.json
                          └──────────┬─────────────────┘
                                  validate  ──▶ agents apply in code
                                  next build
                                  verify    ──▶ every decision found in out/, or FAIL
```

## Levels

| level | question the collector asks | Jev judges |
|---|---|---|
| technical | lengths, duplicates, orphans, thin pages, og:image | nothing — code facts |
| ctr | impressions × (expected CTR at position − actual) | does the title read as answering each top query; what kind of page the title promises vs what the query wants; is the description a concrete answer |
| striking | keywords at 4–20 × volume × CTR lift to #3 | does a heading / the opening / the page type cover each keyword; does the searcher expect a table |
| cannibal | title/H1 token overlap between demanded pages | same intent? which page is the better landing page per query |
| links | striking + ctr targets × lexically close source pages | would a reader of the source plausibly want the target next; which anchor reads naturally |
| schema | template-level JSON-LD gaps + citation readiness | how quotable the opening is (0–3), does it define the subject first |
| expansion | competitor-gap keywords we don't rank for | the three contextual-border rules as nouls; is it already covered by an existing page (Choice over lexical neighbours + none) |

## Commands (from `calc-boiler/`)

```
npm run seo:collect                    # needs a fresh `next build` in ./out
npm run seo:judge -- [--levels=ctr,links] [--limit=N]
npm run seo:decide
#   agents fill docs/seo/seo-brain/<date>/candidates/*.json from workorders.json
npm run seo:rank                       # → decisions-ranked.json + rejected.json
npm run seo:validate -- ../docs/seo/seo-brain/<date>/decisions-ranked.json
#   agents apply, then `next build`
npm run seo:verify -- ../docs/seo/seo-brain/<date>/decisions.json ../docs/seo/seo-brain/<date>/decisions-ranked.json
```

Jev responses are cached in `docs/seo/seo-brain/.cache/` (git-ignored) by a hash
of `{model, state, questions}`; re-runs are free. Delete the cache to re-judge.
Key: `TYPESAFE_API_KEY` in the environment or `~/.config/typesafe/env`.

## Candidate file format (what generating agents write)

`docs/seo/seo-brain/<date>/candidates/<orderId>.json`

```jsonc
// kind "title_description" — 3–4 candidates, each a pair
{ "orderId": "ctr-superannuation-calculator-1", "kind": "title_description", "route": "/superannuation-calculator/",
  "candidates": [ { "title": "…≤65 chars…", "description": "…≤165 chars, contains a figure…", "figureSource": "calculatePayBreakdown / SUPER_GUARANTEE_RATE" } ] }

// kind "citation_lead" — 3 candidates; figures as [[CONSTANT_NAME]] placeholders or rendered from constants
{ "orderId": "schema-fortnightly-tax-table", "kind": "citation_lead", "route": "/fortnightly-tax-table/",
  "candidates": [ { "lead": "The fortnightly tax table is …", "source": "https://www.ato.gov.au/…" } ] }
```

Sections and new pages are written directly as a `DecisionBatch` (see
`schema.mts`: `AddSection`, `NewPage`, `NoAction`) and go through `validate.mts`.

## Rules that the schema cannot enforce

- Figures are never typed into titles, descriptions or leads: render them from
  `lib/constants` at build time (`formatAUD(calculatePayBreakdown(...))`, award
  constants, etc.). `[[CONSTANT]]` placeholders in candidates mark where.
- YMYL: no advice, no guarantees, no superlatives. Jev gates `promise`/`claims`.
- A programmatic template (`/tax-on/N/`, `/salary-to-hourly/N/`, …) is changed
  once, in the template; never a single slug.
- Keep tokens (`keepTokens`) from the current title survive the rewrite — they
  hold existing rankings.
- The three contextual-border rules (`contextual-borders-and-audience-map.md`)
  are literal `true` in `NewPage.border`; Jev's nouls feed the decision but the
  agent must still say why each holds.
