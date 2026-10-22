# Disavow refresh, 22 October 2026

Follows the 19 Oct 2026 upload (`disavow-2026-10-19.txt`, 1,838 domains, uploaded to the URL-prefix property `https://pay-calculator-australia.com/`). The attack has not stopped: 365 new referring domains arrived in the three days since. Google replaces the disavow file on every upload, so `disavow-2026-10-22.txt` is the full merged list, not a delta. Nothing has been uploaded yet; that is a human step (see "Next").

## Counts

| Measure | 19 Oct 2026 | 22 Oct 2026 |
|---|---|---|
| Referring domains in DataForSEO (`backlinks_status_type: all`) | 1,842 | 2,199 |
| Of which spam score 30 or more | 1,838 | 2,195 |
| Of which spam score 0 (the four real sites) | 4 | 4 |
| Domains in the disavow file | 1,838 | **2,203** |
| New domains added this run | | **365** |
| Old domains kept although DataForSEO no longer lists them | | 8 |
| New domains left out for human judgement | | 0 |

2,203 = 1,838 (old file, all kept) + 365 (new). The four real domains are not in either file.

Spam score of the 2,199 domains now: 75 (27), 70 (10), 65 (1), 60 (122), 55 (1,683), 50 (1), 45 (350), 30 (1), 0 (4). There is nothing between 1 and 29. The four at 0 are exactly katteb.com (rank 49), airswift.com, aussiestockforums.com and wealthcollective.co, so the score alone separates the attack from the real links.

## The 365 new domains

All 365 scored 45 or more (55: 260, 45: 100, 60: 2, 75: 3), so every one qualified on the spam-score rule; the first-seen-after-1-October pattern rule was not needed for any of them. First seen: 364 between 19 and 22 October 2026 (the days since the last pull: 36 on 19 Oct after that pull, 135 on 20 Oct, 119 on 21 Oct, 74 on 22 Oct so far), 1 on 2 October (`drchecker.online`, missed on 19 Oct). None is marked lost. Each has one or two backlinks and rank 0.

TLD breakdown of the new domains:

| TLD | New domains |
|---|---|
| .shop | 71 |
| .online | 60 |
| .site | 58 |
| .store | 57 |
| .space | 56 |
| .website | 50 |
| .com | 6 |
| .link | 3 |
| .info | 3 |
| .xyz | 1 |

352 of 365 (96%) sit on the six cheap TLDs from the 19 Oct pattern. The names are the same generator: SEO-tool and traffic-seller keywords (`backlinkgenerator.space`, `buyadultwebtraffic.site`, `dachecker.online`, `websitetrafficchecker.online`), plus a `link-legion-NNN.xyz` series and a handful of .com/.link/.info "backlinks" names.

Sample of 20 new domains:

```
activewebtraffic.shop
adulttrafficsources.website
aibacklinks.store
authoritybacklinkgenerator.website
backlinkindia.link
buyadultwebtraffic.site
dachecker.online
dbike-us.com
digitizeseo.com
drchecker.online
freebacklinkgenerator.shop
getfreebacklinks.store
keywordrankchecker.space
link-legion-332.xyz
newsbacklinks.com
seorocketmedia.com
serpchecker.store
sparkbacklinks.com
websitetrafficchecker.online
webtrafficgurus.site
```

## Left out for human judgement

None. Every new domain not on the real-site list scored 45 or more, and no new domain scored under 30. There was nothing with a plausible real-site look to hold back.

One domain went in on the rule but does not fit the keyword pattern, so it is worth a glance before upload: `dbike-us.com` (spam 60, first seen 20 Oct, 1 backlink, rank 0). The name looks like an e-bike shop rather than an SEO-tool domain, which usually means a hacked or expired site reused by the same network. It is in the file; remove the line if you know it to be a genuine mention.

The four real sites stay out, as on 19 Oct:

| Domain | Spam | Rank | First seen |
|---|---|---|---|
| katteb.com | 0 | 49 | 19 Sep 2026 |
| airswift.com | 0 | 0 | 27 Apr 2026 |
| aussiestockforums.com | 0 | 0 | 21 Aug 2026 |
| wealthcollective.co | 0 | 0 | 27 Sep 2026 |

## Old domains DataForSEO no longer lists

Eight domains from the 19 Oct file did not come back in this pull (dropped from the index, not marked lost): `backlinkservices.website`, `dadpchecker.site`, `domaindachecker.space`, `freerankchecker.shop`, `generatebacklink.site`, `seobacklink.shop`, `trustflowchecker.website`, `unlimitedbacklinkgenerator.space`. They stay in the file. Disavowing a domain that no longer links costs nothing, and the same network recycles names.

## Method

- Pull: DataForSEO `POST /v3/backlinks/referring_domains/live`, target `pay-calculator-australia.com`, `backlinks_status_type: all`, `order_by: ["backlinks_spam_score,desc", "domain,asc"]` (the second key keeps pages stable), limit 1,000, offsets 0 / 1,000 / 2,000. Three calls, 2,199 unique domains, equal to `total_count`, cost $0.15.
- Rules: add a domain if it is not in the 19 Oct file and (spam score 30 or more) or (first seen after 1 Oct 2026 and the name matches the attack pattern: keyword-stuffed name on .website/.store/.space/.site/.shop/.online/.xyz/.top/.icu/.cfd, or casino/betting/pharma/guest-post/backlink words). Never add katteb.com, airswift.com, aussiestockforums.com, wealthcollective.co. Keep every old domain.
- Output: `disavow-2026-10-22.txt`, one comment line then one `domain:` line per domain, lower-case, deduped, sorted, ASCII, 2,204 lines. Checked by script: header, every line `domain:`, no duplicates, sorted, no real domain present, every old domain present, 1,838 + 365 = 2,203.
- `disavow-2026-10-19.txt` is unchanged. Note that it was never committed; it lives only in the main checkout at the repo root.

## Next

1. Human: upload `disavow-2026-10-22.txt` in Search Console, URL-prefix property `https://pay-calculator-australia.com/` (Disavow links tool, replace the 19 Oct file). Not done by this run.
2. Re-pull before every upload. 135 new domains arrived on 20 Oct and 119 on 21 Oct, so a file is stale within days. Same endpoint, same rules, merge into the latest file.
3. Watch for the first new domain that scores under 30 or carries a real-looking name; that is when the pattern rule and the human list start to matter.
