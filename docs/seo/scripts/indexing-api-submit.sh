#!/usr/bin/env bash
# Send URL_UPDATED notifications to the Google Indexing API.
# Auth: impersonates the indexing-bot service account (no key file).
# The service account must be an Owner of https://pay-calculator-australia.com/ in Search Console.
# Usage: indexing-api-submit.sh <url-list.txt>   (quota: 200 URLs/day)
set -euo pipefail

LIST="${1:?usage: $0 <url-list.txt>}"
SA="indexing-bot@paycalculatoraustralia-965d5.iam.gserviceaccount.com"
TOKEN=$(gcloud auth print-access-token --impersonate-service-account="$SA" \
  --scopes=https://www.googleapis.com/auth/indexing 2>/dev/null)

ok=0; fail=0
while IFS= read -r url; do
  [ -z "$url" ] && continue
  code=$(curl -s -o /tmp/indexing-resp.json -w '%{http_code}' \
    -X POST https://indexing.googleapis.com/v3/urlNotifications:publish \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "{\"url\":\"$url\",\"type\":\"URL_UPDATED\"}")
  if [ "$code" = "200" ]; then
    ok=$((ok+1)); echo "200 $url"
  else
    fail=$((fail+1)); echo "$code $url $(tr -d '\n' < /tmp/indexing-resp.json | cut -c1-200)"
  fi
done < "$LIST"
echo "done: $ok ok, $fail failed"
