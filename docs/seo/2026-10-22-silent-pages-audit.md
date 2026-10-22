# Silent Pages Audit: 79 URLs with Zero Impressions (22 Oct 2026)

**Problem.** Google Search Console for the 28 days to 20 October 2026 shows 79 published pages with zero impressions; the Pages report lists 80 URLs as "Discovered, currently not indexed" and 6 as "Crawled, currently not indexed". The list is `docs/seo/data/2026-10-22-silent-urls.txt`.

**Method.** Static export (`npx next build --webpack`), then every `out/**/index.html` is parsed by `docs/seo/scripts/internal-link-audit/silent_pages.py`. For each silent URL it records whether the page exists in `out/` and in `out/sitemap.xml`; the number of OTHER pages whose `<main>` or `<footer>` carries an `<a href>` to it ("body"), split into links in article prose, tables and lists ("prose") and links that sit only in the related-link cards, the in-page sidebar `<aside>` or the footer ("cards"); the number of those body links that come from pages outside the silent page's own sibling set ("outside"); the number of pages linking only from the fixed site header and its navigation ("header"), which is on every page and counted separately; and the difflib `SequenceMatcher` ratio of the page's `<main>` visible words (digits masked to `#`) against its closest sibling, flagged in bold above 0.75. Breadcrumb `<nav>`s inside `<main>` and the `/site-directory/` HTML sitemap are not counted as sources.

**Sibling sets.** `/job-pay-rates/*` pages are siblings of each other, as are `/apprentice-pay/*`, `/prison-officer-pay/*`, the two financial-year pages of each tax-table cycle, every `*-award-rates/` page (plus `/schads-award-pay-rates/`), and the public holiday guide set together with `/public-holiday-pay/`. A page with no family (for example `/allowances-guide/`) has no sibling set for the link count, and its similarity is measured against the closest page on the whole site.

## Before (695 pages in the export)

| Path | Exists | Sitemap | Body | Prose | Cards | Outside siblings | Header | Similarity | Closest sibling |
|---|---|---|---|---|---|---|---|---|---|
| /allowances-guide/ | yes | yes | 5 | 1 | 4 | 5 | 0 | 0.134 | /fair-work-pay-calculator/ |
| /apprentice-pay/boilermaker/ | yes | yes | 16 | 15 | 1 | 8 | 0 | 0.731 | /apprentice-pay/mechanic/ |
| /apprentice-pay/bricklayer/ | yes | yes | 11 | 9 | 2 | 3 | 0 | **0.857** | /apprentice-pay/painter/ |
| /apprentice-pay/butcher/ | yes | yes | 15 | 15 | 0 | 7 | 0 | **0.765** | /apprentice-pay/mechanic/ |
| /apprentice-pay/carpenter/ | yes | yes | 16 | 14 | 2 | 8 | 0 | **0.854** | /apprentice-pay/bricklayer/ |
| /apprentice-pay/chef/ | yes | yes | 14 | 13 | 1 | 6 | 0 | 0.726 | /apprentice-pay/hairdresser/ |
| /apprentice-pay/hairdresser/ | yes | yes | 15 | 14 | 1 | 7 | 0 | 0.750 | /apprentice-pay/butcher/ |
| /apprentice-pay/mechanic/ | yes | yes | 16 | 15 | 1 | 8 | 0 | **0.762** | /apprentice-pay/butcher/ |
| /apprentice-pay/painter/ | yes | yes | 9 | 9 | 0 | 1 | 0 | **0.854** | /apprentice-pay/bricklayer/ |
| /apprentice-pay/plumber/ | yes | yes | 14 | 13 | 1 | 6 | 0 | 0.708 | /apprentice-pay/mechanic/ |
| /australia-day-public-holiday-pay/ | yes | yes | 8 | 6 | 2 | 0 | 0 | 0.647 | /easter-public-holiday-pay/ |
| /australian-tax-and-pay-data/ | yes | yes | 6 | 5 | 1 | 6 | 0 | 0.186 | /pay-and-tax-changes-calendar/ |
| /boxing-day-pay-rates/ | yes | yes | 16 | 8 | 8 | 8 | 0 | 0.607 | /australia-day-public-holiday-pay/ |
| /christmas-day-pay-rates/ | yes | yes | 16 | 8 | 8 | 8 | 0 | 0.563 | /australia-day-public-holiday-pay/ |
| /christmas-shutdown-annual-leave/ | yes | yes | 17 | 6 | 11 | 9 | 0 | 0.429 | /australia-day-public-holiday-pay/ |
| /commercial-sales-award-rates/ | yes | yes | 43 | 14 | 29 | 14 | 0 | 0.587 | /miscellaneous-award-rates/ |
| /easter-public-holiday-pay/ | yes | yes | 16 | 8 | 8 | 8 | 0 | 0.652 | /australia-day-public-holiday-pay/ |
| /electrical-award-rates/ | yes | yes | 45 | 15 | 30 | 16 | 0 | 0.535 | /building-and-construction-award-rates/ |
| /fitness-industry-award-rates/ | yes | yes | 52 | 23 | 29 | 23 | 0 | 0.579 | /miscellaneous-award-rates/ |
| /fortnightly-tax-table/2025-26/ | yes | yes | 5 | 5 | 0 | 4 | 0 | **0.778** | /fortnightly-tax-table/2026-27/ |
| /fortnightly-tax-table/2026-27/ | yes | yes | 5 | 5 | 0 | 4 | 0 | **0.778** | /fortnightly-tax-table/2025-26/ |
| /health-professionals-award-rates/ | yes | yes | 73 | 41 | 32 | 44 | 0 | 0.376 | /timber-award-rates/ |
| /highest-paying-jobs-australia/ | yes | yes | 4 | 0 | 4 | 4 | 0 | 0.141 | /graduate-salary-australia/ |
| /horticulture-award-rates/ | yes | yes | 44 | 14 | 30 | 15 | 0 | 0.573 | /miscellaneous-award-rates/ |
| /job-pay-rates/actuary/ | yes | yes | 11 | 11 | 0 | 4 | 0 | 0.699 | /job-pay-rates/business-analyst/ |
| /job-pay-rates/anaesthetist/ | yes | yes | 14 | 13 | 1 | 8 | 0 | **0.804** | /job-pay-rates/surgeon/ |
| /job-pay-rates/boilermaker/ | yes | yes | 16 | 15 | 1 | 11 | 0 | **0.852** | /job-pay-rates/welder/ |
| /job-pay-rates/bricklayer/ | yes | yes | 15 | 14 | 1 | 7 | 0 | 0.722 | /job-pay-rates/carpenter/ |
| /job-pay-rates/business-analyst/ | yes | yes | 11 | 11 | 0 | 5 | 0 | 0.699 | /job-pay-rates/actuary/ |
| /job-pay-rates/civil-engineer/ | yes | yes | 13 | 12 | 1 | 4 | 0 | 0.710 | /job-pay-rates/mechanical-engineer/ |
| /job-pay-rates/cyber-security/ | yes | yes | 13 | 13 | 0 | 5 | 0 | 0.693 | /job-pay-rates/software-engineer/ |
| /job-pay-rates/data-analyst/ | yes | yes | 11 | 11 | 0 | 2 | 0 | 0.665 | /job-pay-rates/actuary/ |
| /job-pay-rates/dentist/ | yes | yes | 26 | 26 | 0 | 21 | 0 | 0.685 | /job-pay-rates/optometrist/ |
| /job-pay-rates/electrical-engineer/ | yes | yes | 10 | 10 | 0 | 4 | 0 | 0.720 | /job-pay-rates/mechanical-engineer/ |
| /job-pay-rates/excavator-operator/ | yes | yes | 10 | 9 | 1 | 6 | 0 | 0.636 | /job-pay-rates/bricklayer/ |
| /job-pay-rates/fitter-and-turner/ | yes | yes | 17 | 14 | 3 | 9 | 0 | 0.715 | /job-pay-rates/boilermaker/ |
| /job-pay-rates/flight-attendant/ | yes | yes | 10 | 8 | 2 | 3 | 0 | 0.446 | /job-pay-rates/welder/ |
| /job-pay-rates/forklift-operator/ | yes | yes | 15 | 12 | 3 | 8 | 0 | 0.506 | /job-pay-rates/hairdresser/ |
| /job-pay-rates/gp/ | yes | yes | 15 | 14 | 1 | 9 | 0 | 0.610 | /job-pay-rates/dentist/ |
| /job-pay-rates/landscaper/ | yes | yes | 9 | 9 | 0 | 4 | 0 | 0.555 | /job-pay-rates/vet-nurse/ |
| /job-pay-rates/mechanical-engineer/ | yes | yes | 11 | 11 | 0 | 4 | 0 | 0.720 | /job-pay-rates/electrical-engineer/ |
| /job-pay-rates/mortgage-broker/ | yes | yes | 10 | 10 | 0 | 4 | 0 | 0.682 | /job-pay-rates/actuary/ |
| /job-pay-rates/optometrist/ | yes | yes | 17 | 17 | 0 | 12 | 0 | 0.687 | /job-pay-rates/dentist/ |
| /job-pay-rates/paralegal/ | yes | yes | 16 | 15 | 1 | 10 | 0 | 0.537 | /job-pay-rates/surveyor/ |
| /job-pay-rates/payroll-officer/ | yes | yes | 10 | 9 | 1 | 8 | 0 | **0.799** | /job-pay-rates/bookkeeper/ |
| /job-pay-rates/personal-trainer/ | yes | yes | 8 | 7 | 1 | 8 | 0 | 0.575 | /job-pay-rates/bookkeeper/ |
| /job-pay-rates/project-manager/ | yes | yes | 12 | 12 | 0 | 2 | 0 | 0.647 | /job-pay-rates/data-analyst/ |
| /job-pay-rates/radiologist/ | yes | yes | 15 | 14 | 1 | 9 | 0 | **0.796** | /job-pay-rates/anaesthetist/ |
| /job-pay-rates/retail-manager/ | yes | yes | 13 | 12 | 1 | 8 | 0 | 0.587 | /job-pay-rates/retail-worker/ |
| /job-pay-rates/software-engineer/ | yes | yes | 14 | 13 | 1 | 5 | 0 | 0.689 | /job-pay-rates/cyber-security/ |
| /job-pay-rates/surgeon/ | yes | yes | 21 | 20 | 1 | 15 | 0 | **0.804** | /job-pay-rates/anaesthetist/ |
| /job-pay-rates/surveyor/ | yes | yes | 13 | 12 | 1 | 8 | 0 | 0.543 | /job-pay-rates/paralegal/ |
| /job-pay-rates/vet-nurse/ | yes | yes | 7 | 7 | 0 | 6 | 0 | 0.568 | /job-pay-rates/hairdresser/ |
| /job-pay-rates/welder/ | yes | yes | 13 | 12 | 1 | 8 | 0 | **0.852** | /job-pay-rates/boilermaker/ |
| /job-pay-rates/youth-worker/ | yes | yes | 23 | 22 | 1 | 19 | 0 | 0.610 | /job-pay-rates/disability-support-worker/ |
| /late-tax-return-penalty/ | yes | yes | 10 | 3 | 7 | 10 | 0 | 0.164 | /tax-return-2026/ |
| /legal-services-award-rates/ | yes | yes | 49 | 20 | 29 | 20 | 0 | 0.631 | /clerks-award-rates/ |
| /live-performance-award-rates/ | yes | yes | 42 | 13 | 29 | 13 | 0 | 0.554 | /clerks-award-rates/ |
| /local-government-award-rates/ | yes | yes | 57 | 28 | 29 | 28 | 0 | 0.641 | /miscellaneous-award-rates/ |
| /meat-industry-award-rates/ | yes | yes | 44 | 15 | 29 | 15 | 0 | 0.552 | /pastoral-award-rates/ |
| /mining-award-rates/ | yes | yes | 44 | 14 | 30 | 15 | 0 | 0.507 | /building-and-construction-award-rates/ |
| /miscellaneous-award-rates/ | yes | yes | 46 | 17 | 29 | 17 | 0 | 0.635 | /local-government-award-rates/ |
| /monthly-tax-table/2025-26/ | yes | yes | 5 | 5 | 0 | 4 | 0 | **0.757** | /monthly-tax-table/2026-27/ |
| /monthly-tax-table/2026-27/ | yes | yes | 5 | 5 | 0 | 4 | 0 | **0.757** | /monthly-tax-table/2025-26/ |
| /new-years-day-pay-rates/ | yes | yes | 8 | 8 | 0 | 0 | 0 | 0.591 | /australia-day-public-holiday-pay/ |
| /pastoral-award-rates/ | yes | yes | 45 | 16 | 29 | 16 | 0 | 0.548 | /meat-industry-award-rates/ |
| /pay-and-tax-changes-calendar/ | yes | yes | 5 | 5 | 0 | 5 | 0 | 0.182 | /australian-tax-and-pay-data/ |
| /plumbing-award-rates/ | yes | yes | 47 | 17 | 30 | 18 | 0 | 0.506 | /building-and-construction-award-rates/ |
| /prison-officer-pay/act/ | yes | yes | 22 | 22 | 0 | 16 | 0 | 0.450 | /prison-officer-pay/nt/ |
| /prison-officer-pay/nt/ | yes | yes | 15 | 15 | 0 | 9 | 0 | 0.496 | /prison-officer-pay/tas/ |
| /prison-officer-pay/sa/ | yes | yes | 24 | 24 | 0 | 18 | 0 | 0.460 | /prison-officer-pay/tas/ |
| /prison-officer-pay/tas/ | yes | yes | 21 | 21 | 0 | 15 | 0 | 0.495 | /prison-officer-pay/nt/ |
| /prison-officer-pay/vic/ | yes | yes | 23 | 23 | 0 | 17 | 0 | 0.442 | /prison-officer-pay/act/ |
| /prison-officer-pay/wa/ | yes | yes | 16 | 16 | 0 | 10 | 0 | 0.448 | /prison-officer-pay/tas/ |
| /real-estate-award-rates/ | yes | yes | 49 | 18 | 31 | 20 | 0 | 0.548 | /miscellaneous-award-rates/ |
| /timber-award-rates/ | yes | yes | 42 | 13 | 29 | 13 | 0 | 0.469 | /meat-industry-award-rates/ |
| /weekly-tax-table/2025-26/ | yes | yes | 5 | 5 | 0 | 4 | 0 | 0.732 | /weekly-tax-table/2026-27/ |
| /weekly-tax-table/2026-27/ | yes | yes | 5 | 5 | 0 | 4 | 0 | 0.732 | /weekly-tax-table/2025-26/ |
| /working-australians-tax-offset/ | yes | yes | 3 | 3 | 0 | 3 | 0 | 0.173 | /listo-calculator/ |

Outside-sibling body inbound links before: **2 pages with 0, 3 with 1 to 2, 74 with 3 or more.**

Sibling similarity above 0.75 before: **15 pages** (/apprentice-pay/bricklayer/, /apprentice-pay/butcher/, /apprentice-pay/carpenter/, /apprentice-pay/mechanic/, /apprentice-pay/painter/, /fortnightly-tax-table/2025-26/, /fortnightly-tax-table/2026-27/, /job-pay-rates/anaesthetist/, /job-pay-rates/boilermaker/, /job-pay-rates/payroll-officer/, /job-pay-rates/radiologist/, /job-pay-rates/surgeon/, /job-pay-rates/welder/, /monthly-tax-table/2025-26/, /monthly-tax-table/2026-27/).

## Before and after (695 pages in the export after the change)

| Path | Body before | Body after | Outside siblings before | Outside siblings after | Prose after | Similarity before | Similarity after |
|---|---|---|---|---|---|---|---|
| /allowances-guide/ | 5 | 105 | 5 | 105 | 100 | 0.134 | 0.134 |
| /apprentice-pay/boilermaker/ | 16 | 20 | 8 | 12 | 19 | 0.731 | 0.682 |
| /apprentice-pay/bricklayer/ | 11 | 15 | 3 | 7 | 13 | **0.857** | 0.723 |
| /apprentice-pay/butcher/ | 15 | 19 | 7 | 11 | 19 | **0.765** | 0.661 |
| /apprentice-pay/carpenter/ | 16 | 20 | 8 | 12 | 18 | **0.854** | 0.716 |
| /apprentice-pay/chef/ | 14 | 18 | 6 | 10 | 17 | 0.726 | 0.727 |
| /apprentice-pay/hairdresser/ | 15 | 19 | 7 | 11 | 18 | 0.750 | 0.733 |
| /apprentice-pay/mechanic/ | 16 | 20 | 8 | 12 | 19 | **0.762** | 0.668 |
| /apprentice-pay/painter/ | 9 | 14 | 1 | 6 | 13 | **0.854** | 0.719 |
| /apprentice-pay/plumber/ | 14 | 18 | 6 | 10 | 16 | 0.708 | 0.708 |
| /australia-day-public-holiday-pay/ | 8 | 77 | 0 | 69 | 69 | 0.647 | 0.647 |
| /australian-tax-and-pay-data/ | 6 | 15 | 6 | 15 | 7 | 0.186 | 0.186 |
| /boxing-day-pay-rates/ | 16 | 77 | 8 | 69 | 71 | 0.607 | 0.607 |
| /christmas-day-pay-rates/ | 16 | 78 | 8 | 70 | 71 | 0.563 | 0.563 |
| /christmas-shutdown-annual-leave/ | 17 | 51 | 9 | 43 | 43 | 0.429 | 0.429 |
| /commercial-sales-award-rates/ | 43 | 47 | 14 | 18 | 17 | 0.587 | 0.593 |
| /easter-public-holiday-pay/ | 16 | 77 | 8 | 69 | 71 | 0.652 | 0.652 |
| /electrical-award-rates/ | 45 | 48 | 16 | 19 | 16 | 0.535 | 0.532 |
| /fitness-industry-award-rates/ | 52 | 54 | 23 | 25 | 25 | 0.579 | 0.585 |
| /fortnightly-tax-table/2025-26/ | 5 | 6 | 4 | 5 | 6 | **0.778** | 0.676 |
| /fortnightly-tax-table/2026-27/ | 5 | 9 | 4 | 8 | 7 | **0.778** | 0.670 |
| /health-professionals-award-rates/ | 73 | 83 | 44 | 54 | 42 | 0.376 | 0.382 |
| /highest-paying-jobs-australia/ | 4 | 94 | 4 | 94 | 90 | 0.141 | 0.140 |
| /horticulture-award-rates/ | 44 | 47 | 15 | 18 | 16 | 0.573 | 0.579 |
| /job-pay-rates/actuary/ | 11 | 14 | 4 | 7 | 14 | 0.699 | 0.703 |
| /job-pay-rates/anaesthetist/ | 14 | 16 | 8 | 10 | 15 | **0.804** | 0.736 |
| /job-pay-rates/boilermaker/ | 16 | 17 | 11 | 12 | 17 | **0.852** | 0.644 |
| /job-pay-rates/bricklayer/ | 15 | 16 | 7 | 8 | 16 | 0.722 | 0.729 |
| /job-pay-rates/business-analyst/ | 11 | 23 | 5 | 17 | 23 | 0.699 | 0.703 |
| /job-pay-rates/civil-engineer/ | 13 | 24 | 4 | 15 | 23 | 0.710 | 0.715 |
| /job-pay-rates/cyber-security/ | 13 | 26 | 5 | 18 | 26 | 0.693 | 0.698 |
| /job-pay-rates/data-analyst/ | 11 | 23 | 2 | 14 | 23 | 0.665 | 0.670 |
| /job-pay-rates/dentist/ | 26 | 28 | 21 | 23 | 28 | 0.685 | 0.689 |
| /job-pay-rates/electrical-engineer/ | 10 | 12 | 4 | 6 | 12 | 0.720 | 0.725 |
| /job-pay-rates/excavator-operator/ | 10 | 12 | 6 | 8 | 11 | 0.636 | 0.634 |
| /job-pay-rates/fitter-and-turner/ | 17 | 20 | 9 | 12 | 16 | 0.715 | 0.592 |
| /job-pay-rates/flight-attendant/ | 10 | 12 | 3 | 5 | 10 | 0.446 | 0.469 |
| /job-pay-rates/forklift-operator/ | 15 | 35 | 8 | 28 | 32 | 0.506 | 0.510 |
| /job-pay-rates/gp/ | 15 | 17 | 9 | 11 | 16 | 0.610 | 0.615 |
| /job-pay-rates/landscaper/ | 9 | 10 | 4 | 5 | 10 | 0.555 | 0.563 |
| /job-pay-rates/mechanical-engineer/ | 11 | 13 | 4 | 6 | 13 | 0.720 | 0.725 |
| /job-pay-rates/mortgage-broker/ | 10 | 14 | 4 | 8 | 13 | 0.682 | 0.687 |
| /job-pay-rates/optometrist/ | 17 | 18 | 12 | 13 | 18 | 0.687 | 0.691 |
| /job-pay-rates/paralegal/ | 16 | 27 | 10 | 21 | 26 | 0.537 | 0.545 |
| /job-pay-rates/payroll-officer/ | 10 | 21 | 8 | 19 | 20 | **0.799** | 0.622 |
| /job-pay-rates/personal-trainer/ | 8 | 9 | 8 | 9 | 8 | 0.575 | 0.584 |
| /job-pay-rates/project-manager/ | 12 | 24 | 2 | 14 | 24 | 0.647 | 0.652 |
| /job-pay-rates/radiologist/ | 15 | 17 | 9 | 11 | 16 | **0.796** | 0.716 |
| /job-pay-rates/retail-manager/ | 13 | 32 | 8 | 27 | 32 | 0.587 | 0.595 |
| /job-pay-rates/software-engineer/ | 14 | 26 | 5 | 17 | 25 | 0.689 | 0.695 |
| /job-pay-rates/surgeon/ | 21 | 23 | 15 | 17 | 22 | **0.804** | 0.735 |
| /job-pay-rates/surveyor/ | 13 | 24 | 8 | 19 | 23 | 0.543 | 0.551 |
| /job-pay-rates/vet-nurse/ | 7 | 8 | 6 | 7 | 8 | 0.568 | 0.576 |
| /job-pay-rates/welder/ | 13 | 14 | 8 | 9 | 14 | **0.852** | 0.647 |
| /job-pay-rates/youth-worker/ | 23 | 37 | 19 | 33 | 36 | 0.610 | 0.617 |
| /late-tax-return-penalty/ | 10 | 10 | 10 | 10 | 4 | 0.164 | 0.162 |
| /legal-services-award-rates/ | 49 | 52 | 20 | 23 | 22 | 0.631 | 0.636 |
| /live-performance-award-rates/ | 42 | 43 | 13 | 14 | 15 | 0.554 | 0.561 |
| /local-government-award-rates/ | 57 | 68 | 28 | 39 | 38 | 0.641 | 0.646 |
| /meat-industry-award-rates/ | 44 | 47 | 15 | 18 | 17 | 0.552 | 0.545 |
| /mining-award-rates/ | 44 | 49 | 15 | 20 | 16 | 0.507 | 0.508 |
| /miscellaneous-award-rates/ | 46 | 48 | 17 | 19 | 19 | 0.635 | 0.640 |
| /monthly-tax-table/2025-26/ | 5 | 6 | 4 | 5 | 5 | **0.757** | 0.657 |
| /monthly-tax-table/2026-27/ | 5 | 7 | 4 | 6 | 6 | **0.757** | 0.651 |
| /new-years-day-pay-rates/ | 8 | 77 | 0 | 69 | 71 | 0.591 | 0.591 |
| /pastoral-award-rates/ | 45 | 48 | 16 | 19 | 19 | 0.548 | 0.552 |
| /pay-and-tax-changes-calendar/ | 5 | 15 | 5 | 15 | 15 | 0.182 | 0.182 |
| /plumbing-award-rates/ | 47 | 49 | 18 | 20 | 19 | 0.506 | 0.503 |
| /prison-officer-pay/act/ | 22 | 26 | 16 | 20 | 26 | 0.450 | 0.486 |
| /prison-officer-pay/nt/ | 15 | 19 | 9 | 13 | 19 | 0.496 | 0.542 |
| /prison-officer-pay/sa/ | 24 | 27 | 18 | 21 | 27 | 0.460 | 0.499 |
| /prison-officer-pay/tas/ | 21 | 25 | 15 | 19 | 25 | 0.495 | 0.541 |
| /prison-officer-pay/vic/ | 23 | 27 | 17 | 21 | 27 | 0.442 | 0.472 |
| /prison-officer-pay/wa/ | 16 | 19 | 10 | 13 | 19 | 0.448 | 0.483 |
| /real-estate-award-rates/ | 49 | 52 | 20 | 23 | 20 | 0.548 | 0.554 |
| /timber-award-rates/ | 42 | 45 | 13 | 16 | 14 | 0.469 | 0.472 |
| /weekly-tax-table/2025-26/ | 5 | 5 | 4 | 4 | 5 | 0.732 | 0.638 |
| /weekly-tax-table/2026-27/ | 5 | 10 | 4 | 9 | 7 | 0.732 | 0.631 |
| /working-australians-tax-offset/ | 3 | 12 | 3 | 12 | 10 | 0.173 | 0.173 |

### Summary

| Outside-sibling body inbound links | Before | After |
|---|---|---|
| 0 | 2 | 0 |
| 1 to 2 | 3 | 0 |
| 3+ | 74 | 79 |

Sibling similarity above 0.75 after: **0 pages**.

Every silent page has at least 3 body inbound links from outside its sibling set after the change.

## What changed (22 Oct 2026)

All work is on the worktree branch, not pushed and not deployed. `npm test` (1715 tests) and `npx next build --webpack` pass; `npm run check:faq` reports 0 mismatches on 697 pages.

### Shared mechanism: `calc-boiler/lib/related-links.ts`

The "What to check next" cards and the calculator-page sidebar are rendered inside `<main>` by `components/common/page-end.tsx`, so a card is an in-body link. Changes:

- Public holiday cluster: the hub and its eight state pages now rotate through all seven holiday guides (`HOLIDAY_GUIDE_LINKS`), five per state page, so New Year's Day and Australia Day are no longer squeezed out by the six-card limit.
- `AWARD_LINKS`: the hospitality, hair and beauty, plumbing and meat industry cards now point at the trade's own `/apprentice-pay/<trade>/` page instead of the apprentice hub; hair and beauty also carries the allowances guide.
- `JOB_LINKS`: new or extended entries for carpenter (timber award), plumber (plumbing award), electrician and apprentice electrician (electrical award), real estate agent and property manager (real estate award), youth worker (local government award), welder and excavator operator (mining award), forklift operator (timber award), and every allied health occupation (health professionals award, healthcare worker pay).
- `PAGE_LINKS`: new card lists for `/income-tax-calculator/`, `/tax-bracket-history/`, `/tax-calendar/`, `/commission-tax-calculator/`, `/schedule-5-tax-table/`, `/monthly-pay-calculator/`, `/second-job-tax-calculator/`, `/working-holiday-tax/`, `/mining-fifo-pay-guide/`, `/fifo-pay-calculator/` and `/super-guarantee-rate-history/`; one card added or swapped on `/low-income-tax-offset/`, `/medicare-levy/`, `/take-home-pay-on/`, `/graduate-salary-australia/`, `/tax-changes-2026-27/`, `/tax-withheld-calculator/`, `/construction-trades-pay/`, `/healthcare-worker-pay/`, `/overtime-pay-calculator/`, `/overtime-penalty-rates-guide/` and the HECS cluster. Every list stays at six cards or fewer.
- `lib/__tests__/related-links.test.ts`: the route resolver now knows the `/<cycle>-tax-table/[fy]/` family and samples every public holiday state page and year-locked tax-table page.

### Shared data: `calc-boiler/lib/data/job-pay-rates/glance.ts` (new)

`payGlance(slug)` returns the figure a job page leads with (award hourly minimum, ATO median salary or Jobs and Skills Australia median), read from the same data the page renders, plus `JOB_GROUPS` (trades, award-free professions, bonus earners, public service roles, ADF professions, salaried professions, retail jobs). Every new link block on a high-traffic page is built from it, so an anchor cannot quote a number the destination does not show.

### Template-level prose links (one edit, many pages)

- `modules/guide/public-holiday-shared.tsx`: the link under every award page's public holiday row now names Christmas Day, Boxing Day, New Year's Day, Australia Day and Easter (about 30 award pages).
- `modules/guide/modern-award-rates.tsx`: the allowances section links the allowances guide; the junior phase-in note links the pay and tax changes calendar.
- `modules/guide/job-pay-rates-occupation.tsx` (70+ job pages): the allowances section links the allowances guide; the related-jobs section links the highest paying jobs ranking.
- `modules/guide/job-pay-rates-health-salary.tsx`: links the highest paying jobs ranking; renders the new per-page `sections`.
- `modules/guide/service-pay-state.tsx` (29 state pages): new "Other uniformed services in {state}" section, so every police, firefighter and paramedic state page links the same state's prison officer page where one exists.
- `modules/guide/public-service-pay-jurisdiction.tsx` (9 pages): new "Pay set outside the scale" section linking the state's uniformed services, the local government award and the professional roles in `JOB_GROUPS.publicServiceRoles`.
- `modules/guide/employer-pay-rates.tsx` (every employer page): holiday guides and the Christmas shutdown guide under the penalty table, the allowances guide under allowances, and for supermarkets and retailers a block linking retail manager, forklift operator and retail worker.
- `modules/guide/apprentice-pay-trade.tsx`: the payslip step links the allowances guide; renders the new per-trade `sections`.
- `modules/guide/teacher-pay-state.tsx` (8 pages) and `modules/guide/school-support-pay.tsx` (5 pages): highest paying jobs, youth worker.
- Award copy `related` blocks added for the building, manufacturing, hair and beauty and meat industry awards (`modern-award-content*.ts`), each listing the apprentice and job pages under that award.

### High-traffic pages edited by hand

`/junior-pay-rates/` (every award with a junior scale, apprentice first-year rates, data CSV), `/minimum-wage-australia/` (entry rate in every award, award-free professions, apprentices, calendar and CSV), `/hourly-to-annual-salary-calculator/` (award hourly rates converted to annual, apprentice rates, weekly tax table 2026-27, highest paying jobs), `/fortnightly-pay-calculator/` (year-locked fortnightly tables, Working Australians Tax Offset, fortnightly take-home by profession), `/bonus-tax-calculator/` (offset, calendar, 2026-27 tables, which jobs pay bonuses, commercial sales award), `/retail-award-rates/` and `/hospitality-award-rates/` (related guides, allowances guide), `/adf-pay-scales/` (civilian comparison for ADF professions, uniformed service hubs), `/tax-brackets/`, `/payg-withholding-tables/`, `/annual-leave-calculator/`, `/tax-return-2026/`.

### Similarity fixes (15 pages flagged above 0.75)

Each flagged page gained page-specific sections and FAQs built only from facts read on 22 October 2026 from the Fair Work Commission award texts (MA000020, MA000010, MA000059, MA000089), Jobs and Skills Australia occupation profiles (2532, 2535, 2539, 3223, 5513) and ATO tax table pages (the tax tables overview, tax tables for 2025-26, and the 2026-27 study and training support loans tables), fetched through the Firecrawl REST API. The scraped text was searched locally; nothing was written from memory.

- Apprentice carpenter, bricklayer and painter: the shared building-award rules are split between the three pages instead of repeated (fees and block release; stage progression and the competency test; overtime, absences and the extra-day rule), each with the trade's adult apprentice rates from the Fair Work Ombudsman pay guide and two new FAQs. Mechanic: the 21 apprenticeship trades on one table and the Schedule B penalty tables. Butcher: competency points, extensions and adult apprentice rules from clauses 16.4, 16.5 and 16.9.
- Boilermaker and welder: distinct ledes; the award's boilermaker and structural steel tradesperson definitions and the JSA 3223 workforce profile on one, the C13, C12 and C10 grading of welding work and the trade route on the other. Payroll officer: the 1 July 2026 payroll changes (Payday Super, reissued schedules, study loan thresholds) and the JSA 5513 profile.
- Anaesthetist, surgeon and radiologist: a workforce section each from the JSA unit group profile (size, full-time share, hours, age, gender, states), plus one FAQ each.
- Year-locked tax tables: the 2026-27 pages explain which other schedules moved on 1 July 2026 (the study loan thresholds for that cycle, Schedule 5, Payday Super); the 2024-25 and 2025-26 pages explain which schedules were reissued for 2025-26 and the two Schedule 8 editions, with a year-specific FAQ on each.

### Still to do by a person

Request indexing for the 79 URLs in Search Console after deploy (the request quota is per Google account), and re-run `silent_pages.py` against the next export to confirm the counts hold.
