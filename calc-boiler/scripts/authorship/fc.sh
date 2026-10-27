#!/usr/bin/env bash
# Shared Firecrawl REST helper for the fact-fix pass. Global limit: 1 request every 9 s
# (about 7 a minute) across all agents, via a lock file. Results cached by URL/query.
#   bash scripts/authorship/fc.sh scrape <url>
#   bash scripts/authorship/fc.sh search "<query>"
set -euo pipefail
MODE="$1"; ARG="$2"
CACHE="$(cd "$(dirname "$0")/../../.." && pwd)/docs/fact-fix-2026-10-27/web-cache"
mkdir -p "$CACHE"
KEY=$(printf '%s:%s' "$MODE" "$ARG" | shasum | cut -c1-16)
OUT="$CACHE/$KEY.json"
if [ -s "$OUT" ]; then cat "$OUT"; exit 0; fi
. ~/.config/firecrawl/env
LOCK=/tmp/pca-fc.lock; STAMP=/tmp/pca-fc.last
while ! mkdir "$LOCK" 2>/dev/null; do sleep 1; done
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT
last=$(cat "$STAMP" 2>/dev/null || echo 0); now=$(date +%s); wait=$(( last + 9 - now ))
[ "$wait" -gt 0 ] && sleep "$wait"
date +%s > "$STAMP"
rmdir "$LOCK"; trap - EXIT
if [ "$MODE" = scrape ]; then
  BODY=$(python3 -I -c 'import json,sys; print(json.dumps({"url":sys.argv[1],"formats":["markdown"],"onlyMainContent":True,"maxAge":0}))' "$ARG")
  EP=scrape
else
  BODY=$(python3 -I -c 'import json,sys; print(json.dumps({"query":sys.argv[1],"limit":8}))' "$ARG")
  EP=search
fi
curl -s -m 120 -X POST "https://api.firecrawl.dev/v2/$EP" -H "Authorization: Bearer $FIRECRAWL_API_KEY" -H "Content-Type: application/json" -d "$BODY" > "$OUT.tmp"
if python3 -I -c 'import json,sys; d=json.load(open(sys.argv[1])); sys.exit(0 if d.get("success") else 1)' "$OUT.tmp"; then mv "$OUT.tmp" "$OUT"; cat "$OUT"; else cat "$OUT.tmp"; rm -f "$OUT.tmp"; exit 1; fi
