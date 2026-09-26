# Adsterra revenue reports

pay-calculator-australia.com is monetised only through Adsterra (AdSense was
rejected and abandoned). This folder holds dated snapshots produced by
`calc-boiler/scripts/adsterra-report.mjs`, a dependency-free Node 18+ script
that reads the Adsterra Publisher API (GET-only, it cannot change anything in
the account) and prints a Markdown report.

**All figures are USD**, exactly as Adsterra reports them.

## Running it

From `calc-boiler/` (there is deliberately no npm script; `package.json` is
owned elsewhere):

```sh
node scripts/adsterra-report.mjs                        # last 28 days to stdout
node scripts/adsterra-report.mjs --days 7 --compare     # last 7 days vs the 7 before
node scripts/adsterra-report.mjs --from 2026-09-01 --to 2026-09-28
node scripts/adsterra-report.mjs --days 28 --compare --out auto
node scripts/adsterra-report.mjs --days 28 --out auto --note "Baseline before X"
```

- `--days N` (default 28): the window ends **yesterday (UTC)** because
  Adsterra's figure for the current day is partial.
- `--from`/`--to`: explicit inclusive window; overrides `--days`.
- `--compare`: also fetches the same-length window immediately before and
  adds a delta column to the totals and to every placement.
- `--out auto`: writes to `docs/revenue/YYYY-MM-DD-adsterra-<N>d.md` at the
  repo root. `--out <path>` writes anywhere else. Without `--out` the report
  goes to stdout.
- `--note "<text>"`: a bold line under the title, used to label baselines.

The token is read from `ADSTERRA_API_TOKEN` in the environment, else from
`~/.config/adsterra/env` (`ADSTERRA_API_TOKEN=...`). It is never printed and
must never be committed.

## What the report contains

- Totals: impressions, clicks, revenue, blended CPM, revenue/day, Social Bar
  revenue and share, estimated pageviews, revenue per 1k pageviews.
- Per-placement table with names, revenue share and (with `--compare`) prior
  revenue and delta.
- Per-day table for the last 14 days of the window, plus the daily standard
  deviation and the smallest before/after change that window size can detect.
- Top 5 countries by revenue.

## Reading it

- **The Social Bar (`SocialBar_1`, placement 29439537) is ~89% of revenue.**
  Every display banner combined earns a few dollars a month. Any change to
  `components/common/deferred-social-bar.tsx` is a change to nearly all of
  the site's income and should be judged with this script, not by feel.
- **Judge changes per 1k pageviews, not by absolute revenue.** Traffic swings
  hard with the Australian financial year and CPM moves independently, so
  "revenue before vs after" can score a traffic dip as an ad loss or a CPM
  spike as a win. The report estimates pageviews from 728x90 (desktop) +
  320x50 (mobile) impressions, which fire once per pageview on their
  breakpoint and are unaffected by what the Social Bar does.
- **Check the detectable-change line** before calling a test. Daily revenue
  is noisy; a 7-day window typically cannot detect changes smaller than
  ~20-30%.
- Adsterra's `cpm` is revenue per 1,000 impressions of that unit; the Social
  Bar's CPM is high because it fires on almost every pageview and counts a
  click on the fake notification as a click.

## Current test (from 26 Sep 2026)

`DELAY_MS` in `deferred-social-bar.tsx` went from `0` to `10_000`: the Social
Bar now loads 10 seconds after the page, or as soon as the visitor touches a
calculator input, whichever is first. Baseline is
`2026-09-26-adsterra-28d.md`. Judge one week after deploy with
`node scripts/adsterra-report.mjs --days 7 --compare`; revert to `0` if
Social Bar revenue per 1k pageviews drops more than 15% while sessions are
flat.
