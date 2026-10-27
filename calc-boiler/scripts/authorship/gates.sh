#!/usr/bin/env bash
# All gates after an apply. Run from calc-boiler. Stops at the first failure.
#   bash scripts/authorship/gates.sh [base_out_dir]
set -euo pipefail
BASE_OUT="${1:-}"
step() { echo; echo "=== $1"; }
step "npm test";        npm test 2>&1 | tail -6
step "tsc --noEmit";    npx tsc --noEmit
step "check:lint";      npm run -s check:lint
step "next build";      npx next build --webpack > /tmp/pca-gates-build.log 2>&1 || { tail -40 /tmp/pca-gates-build.log; exit 1; }; tail -3 /tmp/pca-gates-build.log
step "check:meta";      npm run -s check:meta
step "check:nav";       npm run -s check:nav
step "check:faq";       npm run -s check:faq
if [ -n "$BASE_OUT" ]; then step "html compare vs base"; python3 -I scripts/authorship/compare-html.py "$BASE_OUT" out ../docs/authorship-2026-10-27/sitemap-urls.txt; fi
echo; echo "ALL GATES PASS"
