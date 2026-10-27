# Structure brief (Step 6), pay-calculator-australia.com

Date: 27 Oct 2026. Worktree `~/Desktop/pca-authorship`, branch `feat/structure-2026-10-27` (based on the live site, main 6266d8c). Run commands from `~/Desktop/pca-authorship/calc-boiler`.

The wording pass and the fact-fix pass are live. This pass fixes FORMAT: the thing a searcher needs first must come first, in the right form. YMYL finance site; the 19 Oct 2026 crash was judged to be scaled AI content, so every change must make the page more useful for its own query, not just different.

## Your job

You own a job file (`docs/structure-2026-10-27/jobs/<name>.json`) with:
- `files`: the only source files you may edit.
- `pages`: each page with its AUDIT row (intent, format_fit 1-5, centerpiece 1-5, main_query, pre-crash clicks and impressions) and `requests` from the wording-pass writers.
- `lockedSharedFiles`: shared templates used by 100+ pages. Never edit them; report what they need.

For each page:
1. Look at the live page layout: `python3 -I scripts/authorship/page-diff.py <path> --outline` (prints the block order of the built page: headings, paragraphs, tables, lists, calculator inputs, FAQ).
2. Read its top queries in `docs/authorship-2026-10-27/BASELINE-gsc.tsv` (column top5). The AUDIT `main_query` is sometimes noise ("yes please", "site:...", "adf pay scales" on a lawyer page). Judge the real intent from all top queries and the page's purpose.
3. Decide if a format change clearly helps that intent. If not, make no change and say why. "No change" is a good result.
4. Make the change in your files, reusing what exists.
5. Return the result for every page.

## Format targets

- Calculate intent: the calculator (first input) appears before long prose. At most one short answer paragraph (and the key figure) before it.
- Rate or table lookup: a real `<table>` with the rates appears early, right after the opening answer. If the data exists in `lib/constants` or `lib/data` and a table component already renders it lower down, move that section up.
- How-to: ordered steps as `<ol>`, built from the existing step text.
- Definition: one short direct paragraph first; detail after.
- Comparison: a comparison table built from figures the code already provides.
- News: the answer (what changed, the figure, the date) in the first paragraph, then detail.

## Allowed changes

- Move sections (with their headings) up or down. Move the calculator component up.
- Turn prose that is really a list into `<ul>`/`<ol>`, keeping the same words.
- Turn prose that is really a table into a `<table>`, keeping the same facts. Copy the table markup and classes from an existing table in the same file or module.
- Render a figure from an existing constant or engine call where a writer request asks for it. Never type a figure.
- Merge two paragraphs that repeat the same answer into one, keeping every fact, condition and source.

## Never

- Never remove a link, a FAQ item, JSON-LD, a section's facts, or a heading's text. Moving is fine; deleting is not (except an exact duplicate sentence, which you must name in your result).
- Never change titles, meta descriptions, H1, lookup-key strings, engine logic, constants or data values.
- Never touch ads: `.mv-sidebar`, `.mv-content`, ad components, layout wrappers, CSP, ads.txt.
- Never add pages, URLs, redirects, new components in `components/`, or new npm packages.
- Never add new prose beyond a short lead-in sentence a table or list needs. Same writing rules as before: Australian English, no em or en dashes, no hedging, no invented figures or claims, no AI stock phrases.
- Never edit a file outside your `files` list. Never run git commands that change state.
- Do not run `npm test`, `next build` or `npm run check:*` (shared folder). You may run `npx tsc --noEmit -p .` once at the end and read only errors in your files.

## Templates

If a file renders many pages (a `[slug]` route or a shared module), your change applies to every one of them. Check two or three sibling pages with `page-diff.py --outline` before you change a template, and make the change only if it helps all of them.

## Result per page

`status`: `changed` | `no-change` | `needs-locked-template` | `needs-decision`; `what`: the change in one or two sentences; `why`: the intent it serves; `filesChanged`.
