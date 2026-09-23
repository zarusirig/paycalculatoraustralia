# Authority plan (Lever D): link prospects, assets, outreach

**Date:** 2026-09-23 · **Site:** pay-calculator-australia.com · **Data:** DataForSEO Backlinks API (live index, pulled 2026-09-23)
**Companion file:** `docs/seo/2026-09-23-link-prospects.csv` (184 qualified prospects, one row per referring domain)
**Status:** research only. No emails have been sent. The user runs all outreach.

---

## 1. Situation

Live referring domains, from DataForSEO `referring_domains/live` with internal links excluded:

| Site | Live RDs (DataForSEO) | Quoted elsewhere (Ahrefs) | What the profile actually is |
|---|---|---|---|
| paycalculator.com.au | **843** | 944 | About 15 years of legacy links: accountant and planner "useful links" pages, old forum threads, a few editorial citations (ABC, Morningstar, Compare the Market). Roughly two thirds of it is spam (Telegram link-dealer pages, "seo-anomaly" .xyz farms, site-stat scrapers). |
| paycal.com.au | 134 | 136 | Mostly spam. Real links: Product Hunt, Aquent, indie directories. |
| fairworkmate.com.au | 64 | — | New site (2026). It gets a steady stream of **editorial citations from AU SMB/HR blogs that quote its blog statistics** (Smile, NextClinic, workit, Evisory, FlexHR, Fine Food Australia, Aussie Childcare Network, Yahoo Lifestyle). Its sister sites rulesmate.com.au and savingsmate.com.au also link to it. |
| wagecalculator.com.au | 60 | 194 | Only **5** links have a spam score of 30 or less. Its authority does not come from links: the 15.7k/mo is content and on-page. |
| australiapaycalculator.com.au | 33 | — | 100% spam. Nothing to replicate. |
| **pay-calculator-australia.com (us)** | **43** | 42 | — |

**The main finding:** a classic "link gap" (domains that link to 2+ competitors but not to us) is almost empty. The domain-intersection pulls and the local merge of all five profiles found **27** domains that link to 2+ competitors. **25 of them are spam** (the same Telegram/PBN networks hit every AU pay site). The 2 clean ones are nofollow AI-content blogs (lifetimes.co.nz / lifetimesaustralia.com). So we are not chasing a shared pool of resource links. There are two replicable patterns:

1. **paycalculator.com.au's legacy "resource page" moat.** About 50 accountant, adviser and payroll-bureau "Tools/Links/Resources" pages plus about 40 finance-blog in-content links. Many date from 2015-2022 and point to `/classic/`, `/old.html` or `/info.html` URLs. That makes them good candidates for an "update your resource list" angle. They are winnable one at a time, slowly (conversion ~3-8%).
2. **fairworkmate.com.au's citation magnet.** Original, dated, quotable statistics on its blog get cited by AU SMB/HR/industry blogs. This is exactly what `/australian-pay-report-2026/` is for. The best version is **passive**: build the citable asset, then seed it to people who already cite pay statistics.

## 2. Method and spend

| Step | Endpoint | Calls | Cost (USD) |
|---|---|---|---|
| Balance before | `/v3/appendix/user_data` | 1 | 0 (balance $23.298) |
| Referring domains, 5 competitors + us (limit 500, rank desc; paycalculator paged to 843) | `/v3/backlinks/referring_domains/live` | 7 | 0.211 |
| Link-gap intersections (paycalculator∩paycal, paycalculator∩wagecalculator, paycal∩fairworkmate; exclude us) | `/v3/backlinks/domain_intersection/live` | 3 | 0.074 |
| Backlink context (url_from, url_to, anchor, text_pre/post, dofollow, domain_from_rank), `one_per_domain`, `backlink_spam_score <= 30`, 4 competitors | `/v3/backlinks/backlinks/live` | 4 | 0.108 |
| Balance after | `/v3/appendix/user_data` | 1 | balance $22.839 |
| **Total** | | **16** | **$0.46** (well under the $8 cap) |

The pairwise intersections were cross-checked against a local merge of all five full RD lists (1,053 unique domains). The local merge is authoritative for the `competitors_linked` count. Raw JSON is in the session scratchpad, not the repo.

**Exclusion rules** (applied before classification). These took 1,053 unique RDs down to 184 qualified:
- `backlinks_spam_score` > 30 (removed 677 domains outright).
- Title or anchor matches link-selling or scraper patterns: "TELEGRAM @SEO_LINKK / @SEO_CARTEL / LINKS_DEALER / SALESOVEN", "Directory website list", "similar sites / alternatives / competitors / site analysis / technologies used / exit", site-status and urlm mirrors.
- Mirrors, clones and spun pages: libreddit/redlib Reddit proxies, 8kun/8ch boards, re-posted articles (tiatira, worldfreedomalliance, framework-viaduct), assignment-help mills, spun "calculator" doorway pages.
- Competitor-owned or self profiles: rulesmate/savingsmate (FairWork Mate network), ko-fi, indiepa.ge, publift case study, paycalculator.com.
- Sites already linking to us.

`domain_rank` in the CSV is DataForSEO `domain_from_rank` on a 0-1000 scale. Divide by 10 for a rough DR-like feel.

## 3. Prospect counts

| Type | A | B | C | Total |
|---|---|---|---|---|
| resource-page (accountant/adviser/bureau "useful links") | 2 | 46 | 0 | 48 |
| finance/accounting blog (in-content link) | 13 | 28 | 1 | 42 |
| forum/community | 0 | 0 | 22 | 22 |
| expat/migrant guide (mostly non-English) | 0 | 0 | 20 | 20 |
| HR/payroll software & SMB service blogs | 5 | 10 | 0 | 15 |
| news/media citation (incl. podcasts) | 14 | 0 | 1 | 15 |
| tool list/directory (quality) | 0 | 7 | 1 | 8 |
| union/association/community org | 6 | 0 | 0 | 6 |
| recruitment/job board | 2 | 2 | 0 | 4 |
| university/TAFE careers page | 3 | 0 | 0 | 3 |
| other | 0 | 0 | 1 | 1 |
| **Total** | **45** | **93** | **46** | **184** |

- By competitor linked: paycalculator.com.au 156, fairworkmate.com.au 22 (+2 shared with wagecalculator), paycal.com.au 2, wagecalculator.com.au 2.
- Dofollow: 147 of 184.
- Priority rules:
  - **A** = news/media, university, or association (English), or an AU/NZ dofollow blog/HR/recruitment page with rank ≥150.
  - **B** = the same types below the rank bar, plus quality directories.
  - **C** = forums, non-English expat guides, and other low-leverage pages.
  - Resource pages are mostly B only because small-firm sites have low rank. They are still the highest-volume, most repeatable win.

## 4. Top 30 (A-priority, by rank)

| # | Domain | DR* | Type | Links to | DF | Linking page | Best-fit asset |
|---|---|---|---|---|---|---|---|
| 1 | au.lifestyle.yahoo.com | 756 | news/media citation | fairworkmate | no | [Aussie expat's realisation after leaving the 'most gorg](https://au.lifestyle.yahoo.com/aussie-expats-realisation-after-leaving-the-most-gorgeous-city-in-the-world-230000237.html) | `/australian-pay-report-2026/` |
| 2 | iheart.com | 618 | news/media citation | paycalculator | yes | [EP 47 - How to Manage Your Money and Start Saving - Mor](https://www.iheart.com/podcast/263-more-than-money-29364997/episode/ep-47-how-to-manage-92936815/) | `/australian-pay-report-2026/` |
| 3 | abc.net.au | 573 | news/media citation | paycalculator | yes | [Understanding your payslip - ABC News](https://www.abc.net.au/news/2020-02-20/understanding-your-payslip/11923748) | `/understanding-your-payslip/` |
| 4 | ww3.rics.org | 513 | union/association/community | paycalculator | yes | [What does a building surveyor do in Australia? / Journa](https://ww3.rics.org/uk/en/journals/built-environment-journal/what-does-a-building-surveyor-do-in-australia-.html) | `/construction-trades-pay/` |
| 5 | latrobe.edu.au | 470 | university/TAFE careers page | paycalculator | yes | [Financial awareness, Help and Support, Wellbeing Servic](https://www.latrobe.edu.au/students/support/wellbeing/resource-hub/financial/awareness) | `/embed/` |
| 6 | morningstar.com.au | 460 | news/media citation | paycalculator | no | [4 steps to calculate how much you need to retire](https://www.morningstar.com.au/retirement/4-steps-to-calculate-how-much-you-need-to-retire) | `/australian-pay-report-2026/` |
| 7 | raizinvest.com.au | 418 | finance/accounting blog | paycalculator | yes | [Navigating cost of living pressures with Raiz - Raiz In](https://raizinvest.com.au/blog/navigating-cost-of-living-pressures-with-raiz/) | `/australian-pay-report-2026/` |
| 8 | raskmedia.com.au | 411 | news/media citation | paycalculator | yes | [Childcare payments & parental leave: here's what you ne](https://www.raskmedia.com.au/2024/06/07/childcare-payments-parental-leave-2024/) | `/parental-leave-pay/` |
| 9 | interest.co.nz | 391 | news/media citation | paycalculator | yes | [All hail the worker piñata, just give us a whack for mo](https://www.interest.co.nz/personal-finance/117501/workers-are-low-hanging-fruit-tax-world-nz-should-broaden-our-diet) | `/australian-pay-report-2026/` |
| 10 | macrobusiness.com.au | 361 | news/media citation | paycalculator | no | [Matt Barrie tears Albo's immigration "ponzi" to pieces ](https://www.macrobusiness.com.au/2023/05/matt-barrie-tears-albos-immigration-ponzi-to-pieces/) | `/australian-pay-report-2026/` |
| 11 | comparethemarket.com.au | 335 | news/media citation | paycalculator | yes | [How paying off a degree could make it harder to buy a h](https://www.comparethemarket.com.au/news/how-paying-off-a-degree-could-make-it-harder-to-buy-a-home/) | `/hecs-help-calculator/` |
| 12 | nucleuswealth.com | 330 | finance/accounting blog | paycalculator | yes | [Save on Tax: How to Make Concessional Contributions to ](https://nucleuswealth.com/blog/how-to-make-pre-tax-concessional-contributions-after-tax-non-concessional-contributions-to-super-including-catch-up-contributions) | `/concessional-contributions-cap/` |
| 13 | smile.com.au | 326 | HR/payroll software | fairworkmate | yes | [Presenteeism vs Absenteeism: Which Costs Employers More](https://www.smile.com.au/enterprise/dental-cover/article/absenteeism-vs-presenteeism) | `/leave-calculator/` |
| 14 | nextclinic.com.au | 320 | HR/payroll software | fairworkmate | yes | [Worried About Fake Sick Notes? The Real Facts](https://nextclinic.com.au/blog/worried-about-fake-sick-notes-the-real-facts) | `/leave-calculator/` |
| 15 | aquent.com.au | 311 | recruitment/job board | paycal | yes | [Contracting and Freelancing 101: Pros, Cons And How To ](https://aquent.com.au/blog/contracting-and-freelancing-101-pros-cons-and-how-to-get-started/) | `/contractor-pay-calculator/` |
| 16 | aussiechildcarenetwork.com.au | 301 | news/media citation | fairworkmate | yes | [NSW Workplace Bullying Reforms: $99K Fines and Stronger](https://aussiechildcarenetwork.com.au/news/childcare-news/nsw-workplace-bullying-reforms-99k-fines-and-stronger-mental-health-protections) | `/australian-pay-report-2026/` |
| 17 | insights.findex.com.au | 297 | finance/accounting blog | paycalculator | yes | [Young Money / Presented by Findex Community Fund](https://insights.findex.com.au/young-money/) | `/first-job-pay-guide/` |
| 18 | iped-editors.org | 294 | union/association/community | paycalculator | yes | [Tax tips for small business - Institute of Professional](https://www.iped-editors.org/august-2020/tax-tips-for-small-business/) | `/contractor-pay-calculator/` |
| 19 | finefoodaustralia.com.au | 284 | news/media citation | fairworkmate | yes | [Public Holidays Are a Test of How Well You Run Your Bus](https://finefoodaustralia.com.au/fine-food-australia-news/public-holidays-are-a-test-of-how-well-you-run-your-business/) | `/hospitality-award-rates/` |
| 20 | neurodiversityhub.org | 273 | union/association/community | paycalculator | yes | [NDH MoneyBasics Course for managing money — Neurodivers](https://www.neurodiversityhub.org/moneybasics) | `/embed/` |
| 21 | australianonlinecourses.com.au | 272 | university/TAFE careers page | fairworkmate | yes | [Occupations for introverts - Australian Online Courses](https://australianonlinecourses.com.au/tag/occupations-for-introverts/) | `/job-pay-rates/` |
| 22 | jacarandafinance.com.au | 269 | finance/accounting blog | paycalculator | yes | [Pay Calculator / Personal Loan Income Requirements](https://www.jacarandafinance.com.au/resources/calculators/pay-calculator-information/) | `/` |
| 23 | spirerecruitment.com.au | 268 | recruitment/job board | paycalculator | yes | [Moving to Melbourne to work in Real Estate? Here's some](https://www.spirerecruitment.com.au/post/moving-to-melbourne-to-work-in-real-estate-here-s-some-common-questions-answered) | `/pay-calculator-vic/` |
| 24 | workit.com.au | 261 | HR/payroll software | fairworkmate | yes | [Back pay explained: a guide for Australian employers - ](https://workit.com.au/back-pay-explained-a-guide-for-australian-employers) | `/backpay-calculator/` |
| 25 | mydailybusiness.com | 260 | news/media citation | paycalculator | yes | [Episode 187: How much do you need to pay yourself? — My](https://www.mydailybusiness.com/podcast/187) | `/employee-vs-sole-trader-vs-company/` |
| 26 | risingtidefinancial.com.au | 240 | finance/accounting blog | paycalculator | yes | [A Great Way to Reduce Tax! - Rising Tide Financial](https://risingtidefinancial.com.au/news/a-great-way-to-reduce-tax/) | `/salary-sacrifice-calculator/` |
| 27 | nzapps.co.nz | 228 | HR/payroll software | fairworkmate | yes | [App Development Cost Australia: 2026 Market Insights](https://nzapps.co.nz/app-development-cost-australia) | `/tech-salary-guide-australia/` |
| 28 | financialadviceforlawyers.com.au | 210 | resource-page | paycalculator | yes | [Calculators - Financial Advice for Lawyers](https://financialadviceforlawyers.com.au/calculators/) | `/ (+ /embed/)` |
| 29 | mybudget.com.au | 210 | finance/accounting blog | paycalculator | yes | [How to Pay Yourself as a Business Owner / MyBudget](https://www.mybudget.com.au/moneyhub/articles/career-advice/how-to-pay-yourself-as-a-business-owner-in-australia/) | `/employee-vs-sole-trader-vs-company/` |
| 30 | xtaspartners.com.au | 210 | resource-page | paycalculator | yes | [Accounting & Bookkeeping Services – XTAS Partners](https://xtaspartners.com.au/pages/accounting-bookkeeping-services) | `/ (+ /embed/)` |

*DR = DataForSEO `domain_from_rank`, 0-1000 scale.

Also worth a submission (B, low effort): Product Hunt (launch the `/embed/` widget as a product), SaaSHub "Best Personal Tax Calculator", phdeck, ailternative, conradpramboeck.com (world gross-net calculator list).

## 5. The two linkable assets (what outreach points at)

| Asset | What makes it linkable | Prospect types it serves |
|---|---|---|
| `/australian-pay-report-2026/`, the Australian Pay Report 2026 | Original, dated tables: take-home pay at every salary band for 2025-26 vs 2026-27 (the tax-cut effect in dollars/week); minimum vs median vs average wage and after-tax; 14 award minimums ranked; public-sector pay by state (teachers, nurses, VPS/APS); "hours of work to earn $X". CSV download, methodology, cite-this box with permalink, Dataset JSON-LD. | news/media, finance blogs, HR/SMB blogs, recruitment, industry associations (the fairworkmate citation pattern) |
| `/embed/`, the take-home pay widget | Copy-paste iframe with a visible credit link. Zero maintenance for the host: 2026-27 rates update automatically. | resource pages (48), universities/TAFE/colleges, community orgs, super funds, migrant guides |

Widget link hygiene: Google treats keyword-rich links baked into widely distributed widgets as a link scheme. The embed code's credit link therefore uses the brand anchor ("Pay Calculator Australia"), sits visibly outside the iframe, and hosts may edit it or add `rel="nofollow"` without breaking anything. Never ask a host to change the anchor to a keyword, and never add UTM parameters to it (robots.txt disallows `/*?*`, so a parameterised link would point at an uncrawlable URL).

Everything else in the CSV `best_fit_asset` column points at an existing money/content page that matches the linking context (e.g. HECS article → `/hecs-help-calculator/`, contractor post → `/contractor-pay-calculator/`).

## 6. Outreach angles by type

| Type | Angle | Ask | Expected reply rate |
|---|---|---|---|
| **Resource page** (48) | "Your Tools page links to paycalculator.com.au (and often a dead `/classic/` URL). Here's a no-signup 2026-27 calculator, plus a widget you can drop on the page so clients never leave your site." | Add a link, or embed the widget (credit link included) | 5-10% |
| **Finance/accounting blog** (42) | The post links a pay calculator for a specific scenario (salary sacrifice, contractor, paying yourself). Offer the matching specialised calculator and one fresh 2026-27 number they can drop into the post. | Add or swap the link during their next refresh | 3-6% |
| **News/media & podcasts** (15) | Never ask for a link. Offer data: "Stage 3 + 2026-27 cuts: a $75k earner takes home $X more per week than in 2024-25. Full table and CSV are free to use with attribution." Time it to news pegs: FWC Annual Wage Review (June), tax time (July-Oct), Budget (May), CPI releases. | Cite the report | 2-5%, but high value |
| **HR/payroll & SMB blogs** (15) | They already cite FairWork Mate statistics. Offer award minimums ranked across 14 awards and the employer-cost view. Suggest a co-branded "2026-27 pay rates" snippet. | Cite the report or an award page | 5-8% |
| **University/TAFE/colleges** (3 now; expand to all 40+ universities and TAFE student-money pages) | Student wellbeing and careers pages list budgeting tools. Offer the widget, the first-job pay guide, junior rates, and working-holiday tax for international students. | Add to resource hub | 5-10% |
| **Associations, unions, super funds** (6) | Member-benefit framing: a free, ad-light widget for members' take-home pay under their award. For unions, a link to the matching award page. | Link or embed | 5% |
| **Recruitment** (4) | Salary guides and relocation posts: offer the state take-home page and the report's public-sector table. | Link | 5% |
| **Forums/expat** (42, C) | No link-dropping. Only answer genuinely when a thread asks "what's my take-home". Low priority. | — | — |

**Prospecting beyond this list.** Competitor profiles only give about 184 clean domains. To scale, run the same patterns as footprint searches (Firecrawl search, not DataForSEO SERP, to save budget):
- `"useful links" accountant "pay calculator" site:.com.au`
- `"student" "budget" "tax calculator" site:edu.au`
- `inurl:resources "paycalculator.com.au"`
- `"according to" "take-home pay" 2026 site:.com.au`

## 7. Email templates (drafts only, not sent)

Merge fields are in `{{braces}}`. Keep each email under 120 words, one ask per email, plain text, sent from a real named person (the E-E-A-T author on the site).

### T1: Resource page (accountant / adviser / bureau)
> **Subject:** Quick fix for your {{page_title}} page
>
> Hi {{first_name}},
>
> I was on your {{page_title}} page ({{url_from}}). It still sends people to {{competitor_url}}, which now {{redirects to the homepage / shows 2023 rates}}.
>
> We built a free take-home pay calculator already on the 2026-27 tax rates, Medicare levy and 12% super. No sign-up, and it covers weekly, fortnightly and monthly pay: https://pay-calculator-australia.com/
>
> If you'd rather keep clients on your own site, there's also a copy-paste widget: https://pay-calculator-australia.com/embed/
>
> Either way, hope the heads-up on the old link helps.
> {{sender_name}}, {{sender_title}}

### T2: Journalist / editor data citation (Pay Report)
> **Subject:** 2026-27 take-home pay by salary: free data table
>
> Hi {{first_name}},
>
> You covered {{topic}} in "{{article_title}}". We've just published the Australian Pay Report 2026, which shows take-home pay at every salary band under 2025-26 vs 2026-27 rates. A few numbers:
> - The 1 July 2026 tax cut is worth at most $268 a year ($5.15 a week), reached by everyone earning $45,000+; the legislated 2027 cut doubles it to $536.
> - A full-time minimum-wage worker takes home $45,230 in 2026-27; the average full-time earner $83,159. A minimum-wage worker needs 43.7 hours to take home $1,000, an average earner 23.8.
> - Of 14 awards, the highest entry rate is aged care ($32.61/hr, 23.3% above minimum wage); hospitality and restaurant sit exactly on the minimum wage ($26.44).
>
> (Figures as published 24 Sep 2026; re-read the page's "Key findings" before sending, as they update when rates change.)
>
> Methodology, sources (ATO, FWC, ABS) and a CSV are on the page, free to use with attribution: https://pay-calculator-australia.com/australian-pay-report-2026/
>
> Happy to run a custom cut (by state or award) if useful.
> {{sender_name}}

### T3: University / TAFE / college student-support page (widget)
> **Subject:** Free take-home pay widget for your student money hub
>
> Hi {{team_name}} team,
>
> Your {{page_title}} page links students to a pay calculator. Many of your students are on first jobs, casual award rates or working-holiday/student visas, so they often ask "how much will I actually get paid?"
>
> We offer a free, embeddable take-home pay calculator (2026-27 ATO rates, no ads inside the widget, no tracking of your students). You paste one iframe snippet: https://pay-calculator-australia.com/embed/
>
> Related guides your students may find useful: first-job pay guide, junior pay rates, working-holiday tax.
>
> Glad to adjust anything for accessibility requirements.
> {{sender_name}}

### T4: Union / association / super fund / community org
> **Subject:** Member resource: award pay + take-home calculator
>
> Hi {{first_name}},
>
> {{org}} helps {{members}} understand their pay. We've published free, regularly updated pages for {{award_name}} minimum rates (updated for the 1 July 2026 increase) and a take-home pay calculator members can use on the spot: {{award_page_url}}
>
> If a widget suits your members' portal better, there's a copy-paste version: https://pay-calculator-australia.com/embed/
>
> No cost and no partnership needed. Just sharing in case it's useful for your {{resources page}}.
> {{sender_name}}

### T5: Broken / outdated competitor link replacement
> **Subject:** Broken link on "{{article_title}}"
>
> Hi {{first_name}},
>
> Small thing: in "{{article_title}}" the link to "{{anchor}}" ({{competitor_url}}) now {{404s / redirects to an unrelated page}}.
>
> If you want a replacement that matches the context, our {{asset_name}} covers the same thing on current 2026-27 rates: {{asset_url}}
>
> Thanks for a useful piece either way.
> {{sender_name}}

*Only send T5 when the link has been verified broken or out of date. Check with a HEAD request first; a number of paycalculator.com.au links point to `/classic/`, `/old.html` or `/info.html`.*

### T6: Blogger / creator embed (finance, HR, SMB blogs)
> **Subject:** Add a live pay calculator to "{{article_title}}"?
>
> Hi {{first_name}},
>
> Loved "{{article_title}}". Your readers get to {{scenario}} and then have to go elsewhere to run their own numbers.
>
> We've made a free take-home pay widget you can embed right in the post (iframe, mobile-friendly, 2026-27 rates, updates automatically each July): https://pay-calculator-australia.com/embed/
>
> If you'd rather cite a number, the Australian Pay Report 2026 has citable tables plus a CSV: https://pay-calculator-australia.com/australian-pay-report-2026/
> {{sender_name}}

**Follow-up (all templates):** one nudge after 5-7 business days ("Just bumping this in case it got buried. No worries if it's not a fit."). Then stop. Never send a third email.

## 8. Sequencing and cadence

| Week | Batch | Volume | Notes |
|---|---|---|---|
| 0 | **Pre-flight** | — | Ship `/australian-pay-report-2026/` and `/embed/`. Confirm `/embed/` framing headers work cross-origin. Check that the report's CSV downloads. Set up a Gmail label and a tracking sheet (copy of the CSV plus status columns). |
| 1 | Directories | 6-8 | Product Hunt (launch the widget), SaaSHub, phdeck, ailternative, conradpramboeck. Low risk, fast. |
| 1-2 | A: associations, universities, community (T3/T4) | 9 | latrobe, kingstoncollege, australianonlinecourses, neurodiversityhub, tnhub, iped-editors, electricsuper, assistsmallbiz, RICS. |
| 2-3 | A: media/podcasts (T2) | 14 | Stagger 3-4 per week. Hold ABC/Yahoo/Morningstar until there's a news peg (tax-time stories run until 31 Oct; Budget in May; FWC decision in June). |
| 2-4 | A: HR/SMB and finance blogs (T6/T5) | 20 | fairworkmate citers first (Smile, NextClinic, workit, Evisory, FlexHR, Fine Food, Aussie Childcare). They have already shown they link to data sources. |
| 3-8 | B: resource pages (T1) | 46 | About 10 per week. Personalise the first line using `example_page_title`. |
| 4-8 | B: remaining blogs, recruitment, HR | 40 | T5 where the competitor link is verified dead, otherwise T6. |
| Ongoing | Footprint prospecting | 20/week | Section 6 queries. Aim for 200+ net-new prospects per quarter. |

**Throughput target:** about 15-25 personalised emails per week, sustainable for one person. At a blended 5% reply-to-link rate over 150 emails, expect **~8-12 new referring domains in 8 weeks**, plus passive citations of the report once it ranks. Doubling RDs from 43 to ~85 by end of Q1 2027 is realistic. Matching paycalculator's 843 is not the goal; about 250 of its links are real, and that is the bar.

**Do not:** buy links, reply to "TELEGRAM @SEO_*" sellers, swap links with other calculator sites, or push exact-match "pay calculator" anchors. Let hosts choose the anchor; brand and URL anchors are fine.

## 9. Tracking

- Copy `2026-09-23-link-prospects.csv` to a working sheet and add these columns: `contact_name, contact_email, template, sent_1, sent_2, reply, outcome (linked/embedded/declined/no-reply), live_url, anchor_obtained, date_live`.
- Re-pull our RDs monthly with `/v3/backlinks/referring_domains/live` (target `pay-calculator-australia.com`, about $0.03 per pull). Diff against the last pull and tag which new RDs came from outreach.
- Watch `/embed/` usage: count referrer hostnames on `/embed/take-home-pay/` in GA4 (page_referrer). Each new host domain is a potential credit link.
- Watch the report's citations: set a Google Alert for "Australian Pay Report 2026" and "pay-calculator-australia.com". Run a DataForSEO backlinks pull filtered to `url_to` like `%australian-pay-report-2026%` quarterly.
- Re-run this prospect pull each quarter. paycalculator and fairworkmate add new editorial citers regularly (fairworkmate gained ~20 in six months).
