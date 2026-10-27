# Step 8: measure plan

- Deployed: 2026-10-27T08:36:51Z (27 Oct 2026). Live version = main 9a9f3d6 (code e71429e).
- Changed URLs: CHANGED-URLS.txt (710 of 720 sitemap URLs), sorted by pre-crash impressions.
- Indexing API: batch 1 (top 200) sent 27 Oct 2026, 200/200 OK (indexing-batch-1.log).
  Batch 2 on 28 Oct, batch 3 on 29 Oct, batch 4 on 30 Oct:
  `bash docs/seo/scripts/indexing-api-submit.sh docs/authorship-2026-10-27/indexing-batch-N.txt > docs/authorship-2026-10-27/indexing-batch-N.log`
- IndexNow: not set up on this site (no key file). Not used.
- Re-measure: 24 Nov 2026 (deploy + 28 days). Compare post window 28 Oct to 24 Nov against BASELINE-gsc.tsv (pre28 21 Sep to 18 Oct, and post7 19 to 25 Oct crash level).
- Cohorts, kept separate in RESULTS.md:
  1. 23 Oct meta-intent pass pages (345 titles).
  2. 23 Oct health job pages.
  3. This pass: A/B wording (all 710) and fact fixes (files in docs/fact-fix-2026-10-27/1-CHANGES.md).
  Cohorts 1 and 2 also got this pass, so their 23 Oct effect is no longer isolated after 27 Oct.
- Not shipped yet: Step 6 structure pass (44 pages), merge proposals (95, need owner OK), 4-NEEDS-DECISION items.
