# PAA / SERP-feature optimisation of the top traffic pages — 24 Sep 2026

**Scope:** the 15 pages with the most GSC clicks over 28 days (`docs/seo/data/2026-09-23-dataforseo/gsc-pages-28d.csv`), excluding the homepage and programmatic `/salary-to-hourly/` pages.
**Method:** live Google AU SERPs via DataForSEO (`/v3/serp/google/organic/live/advanced`, location 2036, `en`, depth 20, PAA click depth 1), 2 queries per page (3 for bonus), 30 SERPs in total. For each SERP we recorded the People Also Ask (PAA) questions, any featured snippet, whether an AI overview appeared and what it cited, and the related searches.
**Spend:** DataForSEO balance went from $22.1046 to $21.9954, so **$0.11 at most** (the account is shared, so this is an upper bound). Firecrawl: 6 scrapes and 3 searches, used to check facts (see "Facts verified").

## What we found across the SERPs

- **No featured snippet on any of the 30 SERPs.** The answer box on these queries is now the **AI overview**, which appeared on 23 of 30. So "shaping for the snippet" here means answer-first paragraphs directly under an H2 that matches the question, plus compact tables. The AI overview lifts from both, and so does the snippet if it comes back.
- **AI overviews cite us on 6 SERPs:** "bonus tax calculator" and "how much tax on bonus australia" (both cite /bonus-tax-calculator/ twice), "minimum wage for 16 year olds australia" (/junior-pay-rates/), "hourly to annual salary calculator" (first citation), "back pay calculator" (first citation) and "redundancy pay calculator". wagecalculator.com.au is the competitor cited most often (bonus, QLD teachers, APS, contractor, HECS).
- **PAA boxes drift off-topic** after one click. Examples: the hospitality box drifts to retirement savings, and the APS box drifts to "How much does Anthony Albanese get paid?". Following the border rule, we answered only questions a pay page can own.

## Pattern used on every page

1. **One FAQ array per page.** New questions go into a single exported array that both the visible accordion and the FAQPage JSON-LD read from, following the `tax-return-calculator-faqs.ts` pattern. On 8 pages the visible FAQs and the JSON-LD held **different question sets** before this change. Each of those now has its own `*-faqs.ts` file holding the union of both sets plus the new PAA answers, with any hardcoded dollar figures replaced by values from `lib/constants`. Every accordion also got an `sr-only` mirror, because Radix unmounts closed answers.
2. **Answers put the number first,** in 40–60 words, with every figure interpolated from `lib/constants` or `lib/data`.
3. **One section shaped for the answer box:** an H2 worded as the question, the answer paragraph straight under it (usually the same FAQ string), then a compact table.
4. **A related-searches row:** a new `modules/seo/related-searches.tsx` (`<RelatedSearches items>`) shows Google's related searches as a row of links to our existing pages that answer them. Every href was checked against `app/`.

## Per page

### 1. /bonus-tax-calculator/ (3,107 clicks, #3–4) — additions only
- **Queries:** "bonus tax calculator" (#3 organic), "how much tax on bonus australia" (#3; the AI overview cites us for "17% to 47%").
- **PAA:** How much is a bonus taxed in Australia? · **How much tax will I pay on a $5000 bonus?** · How to calculate taxes taken out of a bonus? · How much tax will be taken off my bonus? · How much tax will be taken from a bonus? · Does everyone get the $1000 tax bonus? · How to minimise tax on bonus? · What is the most tax-efficient way to pay a bonus? · How much tax will I pay? · How do I calculate my income tax?
- **Related searches:** Monthly bonus tax calculator · Bonus tax calculator nsw · Weekly tax calculator · Tax on bonus ATO · Tax withheld calculator · Schedule 5 tax calculator · Back pay tax calculator Australia · Tax rate on commission australia · How to avoid tax on bonus Australia.
- **Added (nothing removed, reordered or retitled):**
  - A new H2, "How Much Tax Will I Pay on a $5,000 Bonus?", with an answer-first paragraph and a table of the tax on $5,000 at six salaries from $30k to $200k, computed by the engine ($1,600 at $90k, which matches the figure competitors quote).
  - Two FAQs appended to the end of `BONUS_TAX_FAQS`: "How much tax will I pay on a $5,000 bonus?" and "How do I calculate the tax taken out of my bonus?" (Schedule 5 method, $1,612 withheld on $3,461 a fortnight, 47% cap).
  - A related-searches row: Schedule 5, tax withheld, commission, back pay, weekly and monthly calculators.
- **Skipped:** "Does everyone get the $1000 tax bonus?" is about the $1,000 instant deduction, not bonuses, so it is off-border for this page. The news article already covers it.

### 2. /fortnightly-pay-calculator/ (455)
- **Queries:** "fortnightly pay calculator", "fortnightly tax calculator". **This URL is not in the top 20 for either; the homepage sits at #15.**
- **PAA:** **How to calculate fortnightly pay?** · How much tax do I pay on $4000 a week? · Is $2000 a week after tax good in Australia? · **How much is $80,000 a fortnight?** · How much do I take home if I earn $80,000? · Is $80k a good salary in Australia? · How much will I get taxed each fortnight? · **How much tax do I pay if I get paid fortnightly?** · **What are the PAYG fortnightly tax tables for 2026?** · What are the ATO tax rates for 2026?
- **Related searches:** Fortnightly tax table 2026/2027/PDF · Take home pay calculator Australia gov · Pay calculator hourly rate · Salary to fortnightly pay calculator · Monthly salary calculator · Fortnightly pay calculator nsw · Weekly tax calculator.
- **Added:**
  - A new `fortnightly-pay-faqs.ts`. The visible accordion had 8 questions and the JSON-LD a different 6; they now share 14.
  - New FAQs: "How much tax do I pay if I get paid fortnightly?", "How much is $80,000 a fortnight?" and "What is the fortnightly tax table for 2026-27?" (NAT 1006, published 17 June 2026).
  - A new H2, "How Much Tax Is Taken Out Each Fortnight?", with a withholding table from the ATO table for $1,000–$5,000 a fortnight (`calculatePAYGWithholding`).
  - A related-searches row.

### 3. /junior-pay-rates/ (402)
- **Queries:** "junior pay rates" (#8), "minimum wage for 16 year olds australia" (#10; the AI overview cites us for $15.64 casual).
- **PAA:** **What is the junior pay rate in Australia?** · What does Kmart pay 15 year olds? · Are junior pay rates gone? · How much does Maccas pay for juniors? · What is the KFC pay rate for a 14-year-old? · How much do Woolies pay a 15 year old? · What is the minimum wage for a 16-year-old at McDonald's? · How much does Coles pay a 16 year old? · How much does a casual worker get paid at Kmart?
- **Related searches:** Junior pay rates abolished · Junior pay rates VIC / WA / NSW · Minimum wage for 15 / 17 / 18 year olds (casual) · Minimum wage Australia 14 year old.
- **Added:**
  - The first FAQ is now "What is the junior pay rate in Australia?", a definition answer.
  - A new FAQ, "How much do McDonald's, Kmart, Woolworths and Coles pay juniors?".
  - A new H2, "What Do McDonald's, Kmart, Woolworths and Coles Pay Juniors?", with a table of casual weekday rates at ages 15, 16 and 17. It is read from the `lib/data/employer-pay` registry, and each row links to its `/pay-rates/<employer>/` page.
  - A related-searches row.
  - "Are junior pay rates gone?" was already answered by the existing "Are junior rates being abolished?".
- **Skipped:** KFC. We hold no verified instrument for it.

### 4. /hourly-to-annual-salary-calculator/ (394)
- **Queries:** "hourly to annual salary calculator" (#13; the AI overview cites us first), "hourly rate to salary calculator" (#19).
- **PAA:** How do I convert hourly to salary? · **How do I work out my hourly rate based on salary?** · **What is $70,000 a year hourly in Australia?** · **Is $45 an hour good in Australia?** · Can you live on $2000 a month? · What jobs pay $40 an hour?
- **Related searches:** Salary to hourly rate calculator Australia (weekly) · ATO salary calculator · Hourly to salary calculator with taxes · Casual pay calculator · Monthly salary calculator · Take home pay calculator Australia gov.
- **Added:**
  - A new `hourly-to-annual-faqs.ts`. The JSON-LD had 9 questions and the accordion 8, partly different; they now share 15. Hardcoded figures such as $79,040, $36,400, $69,160, $74,100 and $9.21 are now derived from `EMPLOYMENT`.
  - Three PAA FAQs. "Is $45 an hour good?" compares against the NMW and ABS AWOTE for May 2026.
  - A new H2, "How Do I Work Out My Hourly Rate From My Salary?", with a salary-to-hourly table that links the `/salary-to-hourly/<n>/` pages.
  - A related-searches row.

### 5. /teacher-pay-australia/qld/ (313)
- **Queries:** "qld teacher pay scale" (#8), "teachers salary qld" (#9). The AI overview does not cite us.
- **PAA:** Are QLD teachers getting a pay rise in 2026? (already answered) · **Which Australian state pays teachers the highest?** · What is the salary of a teacher in 2026? · What is the lowest teacher salary? · Are teachers underpaid in Australia? · What type of teacher gets paid the most?
- **Related searches:** QLD teacher salary 2026 (PDF) · QLD teacher bands explained · QLD teacher aide pay scale 2026 · Senior Teacher salary QLD · Principal salary QLD · QLD teacher pay dates 2026 · Teachers salary qld per hour / calculator.
- **Added:**
  - `teacherStateFaqs(state)` in `lib/data/teacher-pay/hub.ts`. It returns the state's verified FAQs plus "Which Australian state pays teachers the highest?", which ranks this state's graduate and top-of-scale salary against the hub rows.
  - The route JSON-LD and the accordion both read it, and the accordion now has an `sr-only` mirror.
  - A per-state related-searches row: after-tax pay at the graduate step, all states, public service pay scales, the state pay calculator, salary packaging and HECS.
  - These changes apply to all 8 state pages.

### 6. /second-job-tax-calculator/ (260)
- **Queries:** "second job tax calculator" (#6; Google shows our **generic site boilerplate** as the snippet), "tax rate on second job" (**not in the top 20**).
- **PAA:** **Do you get taxed 50% on your second job?** · **Is it worth getting a second job in Australia?** · **How much tax on second job Australia calculator?** · How much tax will I pay on $1800 a week? · Do I get taxed extra on a second job? · **Will my employer know if I have a second job?** · Can I do two full-time jobs? · Is it worth it to have a second job?
- **Related searches:** Tax on second job Australia calculator · Do you pay more tax on a second job · Second job tax rate ATO / nsw / qld · Tax-free threshold on second job · No tax-free threshold rate · Weekly / fortnightly tax calculator · Tax withheld calculator · Tax per week calculator ATO.
- **Added:**
  - A new `second-job-faqs.ts` (the union of both old sets plus 4 PAA questions, 10 in total).
  - A new H2, "What Is the Tax Rate on a Second Job?", with a table of no-threshold withholding at $250–$2,000 a fortnight.
  - A related-searches row.
- **Accuracy fix:**
  - The page said the no-threshold scale "often over-withholds" and that you "often receive a refund", withheld at "approximately 30%". The engine shows the opposite for typical cases. A $60k main job plus a $20k second job ends up **$2,808 short** at tax time, because the scale treats the second job as your only income above the threshold. The copy now derives both the amount and whether it is a refund or a bill.
  - The unsourced "$2,000–$5,000" debt range is replaced with a computed example: $3,183 owed on two $20k jobs that both claim the threshold.

### 7. /public-service-pay-scales/vic/ (200) and /aps/ (187)
- **Queries:** "vps pay scales" (#6), "vps salary" (#13; the **hub outranks /vic/**, see open issues), "aps pay scales" (#9, hub), "aps 6 salary" (#11, hub).
- **PAA:**
  - VPS: What are the VPS pay rates for 2026? · **What is the VPS grade 4 salary?** · **What does "VPS grade 3" mean?** · How much does a VPS 3 make in Victoria? · Salary range for VPS Grade 5? · **What is a VPS 6 salary?** · How much do VPS get paid? · What is a VPS 5 salary?
  - APS: **What are the APS pay rates for 2026?** · **What does an APS 3 get paid?** · What is an APS 4 salary? · **Is APS 3 entry level?** · **Is APS 6 a high level?** · What are the ATO pay scales for 2026? · What is the salary for an APS level 6 ATO member?
- **Related searches:** VPS salary 2026/2027/2028/PDF · VPS 3/4/5/6 salary 2026 · APS pay scales by department (2026 PDF) · APS 4/5/6/7 salary · Aps 6 salary calculator.
- **Added:**
  - A new `lib/data/public-service-pay/paa-faqs.ts`. `jurisdictionFaqs()` adds 4 APS and 3 VPS answers, all read from the same band rows the tables render.
  - The route JSON-LD and the accordion (now with an `sr-only` mirror) both read it.
  - A per-jurisdiction related-searches row.
- **Skipped:** questions about ATO agency pay scales. We carry no ATO agency schedule.

### 8. /backpay-calculator/ (190, #2)
- **Queries:** "back pay calculator" (#2; the AI overview cites us first for our formula), "back pay" (not in the top 20).
- **PAA:** How can you calculate back pay? · **How do I calculate back pay in Australia?** · **How is back pay taxed in Australia?** · How much do you get for backpay? · How much will my backdated pay be? · **What is back pay in Australia?** · How does a back pay work? · **Do I still get back pay if I resign?** · How long does back pay take?
- **Related searches:** Back pay calculator australia/qld/excel · Salary increase and retro pay calculator · Back pay lump sum · Back pay ATO · Back pay tax calculator Australia · Back payment gross superable · Back payment lump sum E superable (plus several US-military queries we ignored).
- **Added:**
  - A new `backpay-faqs.ts` (9 FAQs; 4 of them are PAA).
  - A new definition H2, "What Is Back Pay?".
  - A related-searches row.
- **Accuracy fixes** (checked via Firecrawl against ato.gov.au and fairwork.gov.au):
  - Tax: back pay is assessed in the year you receive it, and the ATO may apply the lump sum payment in arrears tax offset under a 10% test. The page used to say you can ask the ATO to "spread" it across years.
  - Super: the example claimed $0.71 an hour on a "$5.90" gap between $26.44 and $30. The real gap is $3.56, so the figure is now derived.
  - Wage theft: it has been a **federal** criminal offence since 1 January 2025. The page used to say "in some states".
  - The 6-year limit now runs "from when the underpayment happened".

### 9. /pay-rise-calculator/ (175)
- **Queries:** "pay rise calculator" (#9), "salary increase calculator" (not in the top 20).
- **PAA:** Are Australians getting a pay rise in 2026? · **How do I calculate my pay raise?** · **Who gets the 4.75% pay increase?** · Should you get a 3% raise every year? · **Is a 3% raise good in 2026?** · What is a fair pay rise? · Is a 3% raise really a raise? · Is a 5% raise good? · Is a 7% raise normal? · Is it better to get a bonus or raise?
- **Related searches:** Salary increase percentage calculator · Salary increase calculator over 5/10/30 years · Monthly salary increase calculator · How much is a 3 percent raise salary · Pay rise calculator qld/nsw · Pay calculator after tax · Casual pay calculator.
- **Added:**
  - A new `pay-rise-faqs.ts`. The JSON-LD used to carry 3 of the 8 visible questions; it now carries all 12.
  - WPI and CPI moved into the shared file, so the copy and the FAQs use one figure.
  - A new H2, "How Do I Calculate My Pay Rise?", with a formula box and a table of 3%, 4.75%, 5% and 10% rises on $80k (before tax, after tax and per week).
  - A related-searches row.

### 10. /weekly-pay-calculator/ (169)
- **Queries:** "weekly pay calculator" and "weekly pay after tax calculator". **This URL is not in the top 20 for either; only the homepage ranks, at #16–20.**
- **PAA:** **How do I calculate my weekly pay?** · How do you calculate a weekly salary? · **Is $1200 a week good in Australia?** · How to calculate 1 week pay? · What is $27 an hour weekly? · How much will I get after tax weekly? · How is tax calculated on weekly pay? · **How much is $1200 a week taxed?** · **How much tax do I pay if I earn $1500 a week?** · $750 a week?
- **Related searches:** Weekly tax calculator · Weekly tax table · Tax per week calculator ATO · Pay calculator after tax / hourly rate · Fortnightly pay calculator · Take home pay calculator Australia gov.
- **Added:**
  - A new `weekly-pay-faqs.ts`. The JSON-LD used to carry 3 short answers against 9 visible questions; both now read 13.
  - A new H2, "How Much Tax Is Taken Out of My Weekly Pay?", with a withholding table from the ATO table for $500–$2,500 a week.
  - A related-searches row.
  - Fixed pre-existing `react/no-unescaped-entities` errors.

### 11. /hospitality-award-rates/ (99)
- **Queries:** "hospitality award rates" (#13; the AI overview shows a rate table and does not cite us), "hospitality award" (not in the top 20).
- **PAA:** What is the hourly rate for a hospitality award? · What are the hospitality award pay rates for 2026? (already answered) · **How much do hospitality workers get paid per hour?** · What is the hospitality award pay rate? · **How much will the hospitality award minimum rates increase in 2026?** · **What does the hospitality award mean?** · What are the Australian hospitality Awards? (industry prizes; skipped). The rest of the box drifted to savings and retirement.
- **Related searches:** Hospitality Award rates by age / casual / 16 / 18 year old · Rates PDF / 2026 PDF / 2027 · Rates calculator · Hospitality Award breaks · Level descriptions · Casual Hospitality Award.
- **Added:**
  - 3 FAQs at the top of `HOSPITALITY_FAQS`. The coverage answer was checked via Firecrawl against the Fair Work MA000009 summary.
  - A related-searches row.
  - The rate table the AI overview uses was already on the page.

### 12. /contractor-pay-calculator/ (91)
- **Queries:** "contractor pay calculator" (#18), "contractor rate calculator australia" (not in the top 20).
- **PAA:** **What is the 80% rule for contractors?** · **What rate should I charge as a contractor?** · How do I calculate my contractor rate? (already answered) · How do I convert a contractor rate to a salary? · What is the average salary for a contractor? · How much more should you earn as a contractor? · What is the 80/20 rule for contractors?
- **Related searches:** Contractor vs employee calculator ATO · Contract vs permanent calculator · Salary to subby calculator · ABN to wages calculator · Construction contractor pay/rate calculator · Hourly rate ↔ salary calculator Australia.
- **Added:**
  - A new `contractor-pay-faqs.ts`, the union of both old sets plus 2 PAA questions (12 in total). The 80% rule answer was checked against the ATO page "Working out if the PSI rules apply".
  - A new H2, "What Rate Should I Charge as a Contractor?", with a derived minimum-rate formula: $61.40 an hour to replace $100k plus super over 48 weeks.
  - A related-searches row.
  - Removed unsourced insurance premium ranges.
- **Skipped:** "convert contractor rate to salary" (see open issues).

### 13. /hecs-help-calculator/ (90)
- **Queries:** "hecs repayment calculator" (#19; the AI overview shows the rate table and does not cite us), "hecs repayments" (not in the top 20).
- **PAA:** **How much HECS do I pay on $70,000?** · Is it better to pay off HECS debt early? (already answered) · **Is the government taking 20% off HECS?** · What are the HECS brackets for 2026? (already answered) · What income do you start paying HECS? (already answered) · HECS indexation 2026? (already answered) · What is the repayment rate for HECS? (already answered) · **What happens if I never pay off my HECS? / Does HECS debt ever get wiped?** · How to avoid paying HECS?
- **Related searches:** HECS repayment rates / table / threshold / income · HECS repayment calculator 2026 / ATO / overseas · ATO hecs repayment.
- **Added:**
  - 3 FAQs in the page's single `FAQS` array: $70k (engine-derived), the 20% cut (matches the news article and page body) and what happens to the debt on death.
  - A related-searches row: STSL, indexation 2026, the 20% cut, super vs HECS, tax return and take-home pay.

### 14. /redundancy-pay-calculator/ (the brief's last page)
- **Queries:** "redundancy pay calculator" (#13; the AI overview cites us), "redundancy payment" (not in the top 20).
- **PAA:** How do I calculate my redundancy payout? (already answered) · How much redundancy pay am I entitled to? (already answered) · How much do you get paid out for being made redundant? · How to calculate redundancy pay ATO? · **How much tax will I pay on $50,000 redundancy?** · How much of redundancy payment is tax-free? (already answered) · How much is redundancy pay in Australia? · **Do you get more redundancy if you are over 45?** · **Is it better to take redundancy or resign?**
- **Related searches:** Redundancy payment table Australia · Redundancy payment for 3 / 5 / 20 years service · Tax on redundancy payments calculator · ATO / NES redundancy calculator · Redundancy calculator Victoria · Redundancy payment NSW · Voluntary redundancy payment.
- **Added:**
  - 3 FAQs appended to `REDUNDANCY_FAQS`. The $50k answer is computed with `redundancyTax()` at 5 and 2 years: $767 and $7,296 in tax.
  - A related-searches row: final pay, leave payout, LSL, JobSeeker, lump-sum tax and the annual leave guide.

## Facts verified (Firecrawl, 24 Sep 2026)
- ATO, "Lump sum payment in arrears" (updated 8 Jun 2026): back pay is assessable in the year it is received, and the LSPIA offset applies under a 10% threshold test.
- ATO, "Reporting back payments": lump sum E means back pay that accrued more than 12 months before payment. The $1,200 threshold was removed from 1 July 2025.
- Fair Work Ombudsman, criminal prosecution and newsroom pages: intentional underpayment has been a criminal offence since 1 January 2025.
- ATO, "Working out if the PSI rules apply": the 80% rule and the results test.
- Fair Work, MA000009 summary: who the Hospitality Award covers.
- Secondary sources plus the ATO community forum: the remaining HELP debt is cancelled on death.

## Open issues for other agents (not changed here)
1. **Bonus page, H2 "What Is Lump Sum B (Back Pay)?"** Back pay for earlier years is **lump sum E**, per the ATO page above. Lump sum B is unused long service leave. The brief bars retitling this page, so this needs an owner's decision.
2. **QLD teachers:** Google still shows an old description, "from $76963 for a graduate". The current code correctly uses Band 2 Step 1 ($86,068). Competitors cited in the AI overview already show the 3% interim rates from 7 September 2026 (for example, Lead Teacher at $147,048, which is exactly 1.03 × $142,766). Our data deliberately holds back until the department publishes. Recheck the schedule.
3. **/fortnightly-pay-calculator/ and /weekly-pay-calculator/ are not in the top 20 for their own head terms.** The homepage takes those SERPs. This is a cannibalisation or intent question for the head-term agent.
4. **VPS:** the hub (/public-service-pay-scales/) outranks /vic/ on "vps salary", and both rank for "vps pay scales".
5. **/second-job-tax-calculator/:** Google shows the site-wide boilerplate as its snippet. It is worth checking which element Google is reading as the page description.
6. **Contractor page:** the "Equivalent Salary" column of "What Contractor Hourly Rate Equals a Salary?" is hand-typed (~$42k–$200k) and cannot be reproduced from the stated assumptions. It should be derived, and we left the "convert rate to salary" PAA unanswered until it is.
