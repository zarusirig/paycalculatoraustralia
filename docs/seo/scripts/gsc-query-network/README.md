# GSC query-network scripts

Used for `docs/seo/2026-08-28-gsc-query-network-traffic-opportunities.md`.

Usage: unzip the GSC export so that `data/Pay AU Calc Data/*.csv` sits next to
these scripts (or edit `D` at the top of each file), then

    python3 analyze.py   > analyze.out    # families, cannibalisation, dormant, trend
    python3 analyze2.py  > analyze2.out   # weak-page queries, hidden families, amount coverage

Both scripts read the live route list from `calc-boiler/app/` (absolute path in
`analyze.py`) and the page inventories hardcoded in `analyze2.py` (RATES,
SAL_HR, TAXON) — update those sets when the programmatic clusters change.
