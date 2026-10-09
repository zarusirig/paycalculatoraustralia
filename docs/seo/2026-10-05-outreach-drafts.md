# Outreach drafts, 5 October 2026

> **Update, 9 October 2026.** The send sheet is now at `docs/seo/2026-10-09-outreach-send-sheet.csv`. All 30 prospect pages were reloaded with Firecrawl on 9 Oct. For every row the sheet gives the page status, the public contact route the site itself publishes (no guessed addresses, no email finders), a personalisation line taken from what is on the page, and the draft to use. The drafts below now carry those contacts and opening lines.
>
> - Result: 24 rows are ready to send. 3 are on hold because the page changed (SDA, JobWatch, Backpacker Job Board). 2 have no usable contact route (Victoria Legal Aid; Reddit, which is process only). SourceBottle needs Anita to register herself. No target is dead.
> - Draft 10 has been retargeted. The 5 Oct Youthlaw page offers resources for *youth workers* (duty of care, street law), not for young employees, so the draft now points at Youthlaw's "Rates of Pay and Unpaid Wages" fact sheet.
> - Draft 9 now goes to Finder's PR desk. The article dates from January 2023 and its author has published nothing on Finder since February 2023.
> - Draft 6 has a caveat: FCA's toolkit sits behind a login, so a listing there would not be a public link.
> - 17-year-old rate settled (9 Oct 2026): $15.29 is correct. It is the figure the Fair Work Ombudsman publishes (57.8% of the $1,004.90 weekly rate, divided by 38). Australian Unions' $15.28 applies 57.8% to the hourly rate, which is out by a cent; see `calc-boiler/lib/constants/junior-rates.ts`. Drafts 3, 4 and 8 can go. Drafts 3 and 8 now link `/junior-pay-rates/` rather than `/minimum-wage-by-age/17/`.
> - Page status in the sheet: *ok* means the page exists and fits the pitch. *changed* means it exists but no longer fits as described on 5 Oct. *dead* means it is gone.
> - Prospects with no draft of their own use the nearest draft, marked "adapt". Swap the **Page** line and replace the opening sentence with the sheet's personalisation line.

Ten drafts for the best prospects in `2026-10-05-link-prospects.csv`. **Nothing here has been sent and nobody has been contacted.** They are for Anita Bell to review, edit and send herself.

Assets these emails refer to. They shipped on branch `feat/oct-link-assets`, and all of them returned 200 on the live site on 9 Oct 2026. Check that they still resolve on the day you send:

- Open data: https://pay-calculator-australia.com/australian-tax-and-pay-data/ (six CSVs and one JSON: resident tax rates, Medicare levy, super guarantee, HECS-HELP thresholds, National Minimum Wage 2010-11 to 2026-27, junior rates; CC BY 4.0)
- Calendar: https://pay-calculator-australia.com/pay-and-tax-changes-calendar/ (1 July 2026, 1 December 2026, 1 January 2027, 1 July 2027, with an .ics)
- Badges and calculator widget: https://pay-calculator-australia.com/embed/

## Before sending any of them

1. Open the prospect's page and confirm it still has the list or paragraph the email mentions. (Done for all 30 on 9 Oct; see the send sheet. Look again on the day you send, because pages change.)
2. Find a real contact from the organisation's own site (webmaster, editor, student services, "suggest a resource" form). No addresses are guessed here. (Done on 9 Oct: the `contact` column of the send sheet. Every address or form in it is published by the site itself.)
3. Check the "To" line is a person or role, not a bulk list. One organisation, one email, no follow-up chain beyond a single reminder after two weeks.
4. Sign as Anita Bell, owner of Pay Calculator Australia. No other title, no credentials, no claims about expertise beyond running the site.
5. Lines such as "I read your piece" or "I came across your page" must be true when you send. Read the page first, or delete the line.
6. Do not ask for a link in a particular form, do not offer anything in return, and drop it immediately if they say no.

All figures quoted below come from the live assets, which read from the site's ATO / Fair Work-sourced constants. Re-check the three headline numbers (minimum wage $26.44 an hour from 1 July 2026, tax rate 15% on $18,201 to $45,000, HELP minimum threshold $69,528) against the assets on the day you send.

---

## 1. SuperGuide (finance publisher)

**To:** general enquiries form, https://www.superguide.com.au/about-us/contact-us (no editorial email is published)
**Page:** https://www.superguide.com.au/super-booster/income-tax-rates-brackets (updated 1 July 2026; checked 9 Oct)
**Asset:** /australian-tax-and-pay-data/

**Subject:** Free CSV of Australian tax scales, 2025-26 to 2027-28, in case it is useful for your tax rates page

Hello,

I run Pay Calculator Australia, a free calculator site. Your income tax brackets guide sets the resident scales side by side from 2016-17 to 2025-26 in its "Tax rate changes" table, and it covers the same ground as one of my own pages.

I have published the resident tax scales as a plain CSV and JSON, covering 2025-26, 2026-27 and the legislated 2027-28 scale (the second rate falling to 14% on 1 July 2027), with each row marked historical, current or legislated-not-in-force. Medicare levy, super guarantee by year and HELP thresholds are alongside. Every figure is sourced to the ATO and listed on the page, and it is free to reuse with a link under CC BY 4.0:

https://pay-calculator-australia.com/australian-tax-and-pay-data/

If it would help your readers who want the numbers in a spreadsheet, you are welcome to point to it. If you spot a figure that differs from the ATO's, I would genuinely like to know.

Thanks for your time,
Anita Bell
Pay Calculator Australia

---

## 2. Canstar (annual "what changes" coverage)

**To:** Laine Gordon, PR Lead, Banking (the piece's author), Laine.Gordon@canstar.com.au, as listed on https://www.canstar.com.au/media/ (general alternative: media@canstar.com.au)
**Page:** https://www.canstar.com.au/news/the-changes-happening-on-july-1-2026/ (now titled "New financial year: the winners, losers and hidden costs from 1 July", 25 June 2026)
**Asset:** /pay-and-tax-changes-calendar/

**Subject:** A dated list of pay and tax changes through 1 July 2027, with sources

Hello Laine,

I run Pay Calculator Australia. I read your 25 June piece on the winners, losers and hidden costs from 1 July, which led with the 16% rate falling to 15% and the further drop to 14% next July. I have since put together a single dated page for the following twelve months:

https://pay-calculator-australia.com/pay-and-tax-changes-calendar/

It covers what changed on 1 July 2026, the 1 December 2026 phase-in of higher junior percentages for 18 to 20 year olds on the retail, fast food and pharmacy awards (a phase-in, not a move to the adult rate), what we could not find changing on 1 January 2027, and what is already legislated for 1 July 2027 (the 14% rate, the CGT discount replacement, the next Annual Wage Review outcome). There is a table of what the two tax cuts are worth at six salaries, and an .ics file. Each date links to its ATO or Fair Work Commission source.

If you are planning a 1 December or 1 July follow-up, it may save a little checking time. You are welcome to cite or link it. Please tell me if anything looks wrong.

Regards,
Anita Bell
Pay Calculator Australia

---

## 3. AWU (minimum wage page)

**To:** contact form, https://awu.net.au/contact-us/ (the national office address members@nat.awu.net.au is also published, but it is for member services)
**Page:** https://awu.net.au/minimum-wage/ (still shows 2025-26 figures; checked 9 Oct)
**Asset:** /junior-pay-rates/ and /australian-tax-and-pay-data/

**Subject:** Minimum wage history and junior rates as a free table, for your members' page

Hello,

I run Pay Calculator Australia, an independent calculator site. Your minimum wage page explains the rate in plain terms, but it still gives the 1 July 2025 figure of $24.95 an hour ($948 a week) and junior rates built on it, such as $9.18 for under-16s. From 1 July 2026 the National Minimum Wage is $26.44 an hour ($1,004.90 a week), and the under-16 rate is $9.73.

I have two free resources that might sit alongside it:

- Junior minimum wage by age, with hourly and casual rates for every age from under 16 to 20: https://pay-calculator-australia.com/junior-pay-rates/
- The adult National Minimum Wage for every year since 2010-11 as a CSV, from $15.00 to $26.44 an hour, with the increase as announced by the Fair Work Commission: https://pay-calculator-australia.com/australian-tax-and-pay-data/

Figures are from the Fair Work Commission's Annual Wage Review decisions and the National Minimum Wage Order, linked on the page. If either would be useful as a supporting resource, you are welcome to link it. If you notice a number that does not match your records, please tell me and I will check it.

Thanks,
Anita Bell
Pay Calculator Australia

---

## 4. Australian Unions (minimum wage factsheet)

**To:** "Send us a message" form, https://www.australianunions.org.au/contact-australian-unions/ (subject: General enquiry)
**Page:** https://www.australianunions.org.au/factsheet/minimum-wage/ (updated July 2026; checked 9 Oct)
**Asset:** /minimum-wage-history-australia/ and the CSV

**Subject:** Minimum wage history 2010 to 2026 with a downloadable table

Hello,

I run Pay Calculator Australia. I came across your minimum wage factsheet while checking my own history page. It makes the point that unions campaign at the Annual Wage Review every year to win the increase.

For people who want the year-by-year results of those reviews, I have published the National Minimum Wage from 2010-11 to 2026-27 (hourly, 38-hour week, and the announced percentage increase). The history page is the first link below; the second is the data page, which has the CSV download and a "Cite this page" box:

https://pay-calculator-australia.com/minimum-wage-history-australia/
https://pay-calculator-australia.com/australian-tax-and-pay-data/

It is free to reuse with a link. If it is of use as a supporting reference for the factsheet, I would be glad for you to list it; either way, thank you for the clear explainer.

Regards,
Anita Bell
Pay Calculator Australia

---

## 5. Employsure (employer guide)

**To:** media@peninsula-au.com, listed under "Media & PR" on https://employsure.com.au/contact (the guide's byline is Adam Wyatt, Content Writer, with no email published)
**Page:** https://employsure.com.au/guides/wage-and-pay/minimum-wage-australia (last updated 2 July 2025; checked 9 Oct)
**Asset:** /embed/ badges and the CSV

**Subject:** A live minimum wage figure for your guide that updates itself

Hello,

I run Pay Calculator Australia. Your Minimum Wage in Australia guide (last updated 2 July 2025) still opens with $23.23 an hour and the 3.75% rise to $24.10 from 1 July 2024. The rate from 1 July 2026 is $26.44 an hour, or $1,004.90 for a 38-hour week.

Employer guides on minimum wage go out of date every 1 July, so I built a small embeddable badge that shows the current National Minimum Wage and changes by itself when the figure changes. There are also badges for the super guarantee rate, the tax-free threshold and the HELP threshold. They have no ads or tracking and carry a visible source link:

https://pay-calculator-australia.com/embed/

The minimum wage history since 2010-11 is also available as a CSV:
https://pay-calculator-australia.com/australian-tax-and-pay-data/

If either is useful for your guide or for readers who check figures, you are welcome to use it. Everything is free.

Thanks,
Anita Bell
Pay Calculator Australia

---

## 6. Financial Counselling Australia (toolkit for counsellors)

**To:** info@financialcounsellingaustralia.org.au, as published on https://www.financialcounsellingaustralia.org.au/contact/
**Page:** https://www.financialcounsellingaustralia.org.au/our-work/toolkit-for-financial-counsellors/ (checked 9 Oct)
**Asset:** /embed/ and /take-home-pay-calculator/

> Caveat (9 Oct): the public page has no resource list, and the toolkit sits behind a login at toolkit.org.au, so a listing there would not be a public link. Send only if the referral and credibility value is worth it.

**Subject:** A free, ad-free take-home pay calculator and HELP threshold table for counsellors

Hello,

I run Pay Calculator Australia. Your toolkit page says new resources such as guidance notes are added to the toolkit frequently. Counsellors often need a quick, reliable figure for a client's after-tax income or HELP repayment, so I wondered whether a calculator would be of use there. I have a take-home pay calculator that carries no ads or tracking when embedded, using the 2026-27 ATO rates, with options for HELP debt and super:

https://pay-calculator-australia.com/embed/

The 2026-27 HELP repayment thresholds, resident tax scale, Medicare levy and National Minimum Wage are also available as free CSV tables with the ATO and Fair Work sources listed:

https://pay-calculator-australia.com/australian-tax-and-pay-data/

These are estimates for residents and not advice, and the page says so. If you think the toolkit could use either, you are welcome to link it, and I would value any feedback on what would make it more useful in practice.

Kind regards,
Anita Bell
Pay Calculator Australia

---

## 7. La Trobe University (student wellbeing, financial awareness)

**To:** no page-owner email is published. Use General enquiries on https://www.latrobe.edu.au/contact (ASK La Trobe). Do not use the Wellbeing "Contact us" form, which is for students asking for support.
**Page:** https://www.latrobe.edu.au/students/support/wellbeing/resource-hub/financial/awareness (checked 9 Oct)
**Asset:** /first-job-pay-guide/ and /embed/

**Subject:** A plain-English first-job pay guide and a free calculator students can use

Hello,

I run Pay Calculator Australia, a free calculator site. Your Financial awareness page's Taxes section points students to CPA Australia's tax tips, a pay calculator and Moneysmart's income tax page. It also notes that tax time is confusing for students with student loans, government payments and multiple jobs. I thought two of mine might fit there.

- A first-job pay guide: payslips, tax, super and junior rates: https://pay-calculator-australia.com/first-job-pay-guide/
- A take-home pay calculator with a HELP/HECS option on the 2026-27 rates, with no sign-up. It can also be embedded: https://pay-calculator-australia.com/embed/

Casual and part-time students often do not know how much of an hourly wage they will keep, or that junior rates depend on age and award, so I have tried to keep both pages simple and sourced to the ATO and Fair Work. If either is useful, you are welcome to list it, and if anything is out of date or unclear for students, I would like to fix it.

Thank you,
Anita Bell
Pay Calculator Australia

---

## 8. Right Now (opinion and reporting on young workers)

**To:** the Editor, rose@rightnow.org.au ("Contact the Editor" on https://rightnow.org.au/contact/). The author, Megan Sapardanis, has no published email, so do not look for her elsewhere.
**Page:** https://rightnow.org.au/opinion/young-cheap-and-disposable-why-australias-retail-and-food-industry-is-failing-young-people/ (published 20 January 2026; checked 9 Oct)
**Asset:** /junior-pay-rates/ and the junior rates CSV

**Subject:** Junior pay rates as a percentage of the adult minimum wage, with a table you can cite

Hello,

I run Pay Calculator Australia. Megan Sapardanis's 20 January piece on retail and food work cites the under-16 junior rate as 36.8% of the minimum wage, or $9.18 an hour, with the adult rate at $24.95. Those were the 2025-26 figures. From 1 July 2026 they are $9.73 and $26.44, so I thought a source table might help future articles.

The National Minimum Wage for juniors, as a percentage of the adult rate and in dollars (hourly and casual), is on one page and as a CSV, with the Fair Work Commission order it comes from:

https://pay-calculator-australia.com/junior-pay-rates/
https://pay-calculator-australia.com/australian-tax-and-pay-data/

I have also put a dated page together on the 1 December 2026 phase-in for 18 to 20 year olds on the retail, fast food and pharmacy awards, which is the change most relevant to your topic. It is a phase-in with six-monthly steps, not a move to the adult rate:

https://pay-calculator-australia.com/pay-and-tax-changes-calendar/

You are welcome to cite any of it. I would be glad to hear about anything that looks off.

Regards,
Anita Bell
Pay Calculator Australia

---

## 9. Finder (HECS coverage)

**To:** Taylor Blackburn, head of public relations, Australia, aupr@finder.com. https://www.finder.com.au/media says to send data requests there. The author, Luana Matrone, lists an address on her author page but has published nothing on Finder since February 2023.
**Page:** https://www.finder.com.au/news/is-paying-off-hecs-debt-early-the-smart-move (posted 31 January 2023, shown with a "more than 3 years old" banner; checked 9 Oct)
**Asset:** /australian-tax-and-pay-data/ (HECS table) and /hecs-help-calculator/

**Subject:** 2026-27 HELP repayment thresholds as a table, if useful for future HECS stories

Hello Taylor,

I run Pay Calculator Australia. Finder's 31 January 2023 article on paying off HECS early quotes the 2022/23 repayment threshold of $48,361 and repayments of 1% to 10% of total income. Since 1 July 2025, repayments are charged only on income above the threshold, which is $69,528 for 2026-27.

For future stories, I have put the 2025-26 and 2026-27 HELP repayment thresholds (the minimum is $69,528 for 2026-27) in a table and CSV, with the rate and base repayment for each band and a link to the ATO page they come from:

https://pay-calculator-australia.com/australian-tax-and-pay-data/#hecs

There is also a calculator for a given repayment income, and a note that HELP balances are indexed each 1 June (the 2027 rate is not yet published):

https://pay-calculator-australia.com/hecs-help-calculator/

You are welcome to cite or link either. If I have anything wrong against the ATO's page, please tell me.

Thanks,
Anita Bell
Pay Calculator Australia

---

## 10. Youthlaw (rates of pay fact sheet)

> Retargeted 9 Oct. The 5 Oct target (https://youthlaw.asn.au/training-resources/publications-for-workers/) offers resources for *youth workers*: duty of care, street law, police contact. It has nothing on pay, so the old opening line ("your publications for young workers") would have been wrong. Youthlaw's pay content for young people is the fact sheet below.

**To:** info@youthlaw.asn.au, the general and media address on https://youthlaw.asn.au/general-and-media-enquiries/
**Page:** https://youthlaw.asn.au/learn-about-the-law/rates-of-pay-and-unpaid-wages/ (last updated June 2023; checked 9 Oct)
**Asset:** /junior-pay-rates/ and /pay-and-tax-changes-calendar/

**Subject:** Junior pay rates by age and the 1 December 2026 award change, in plain English

Hello,

I run Pay Calculator Australia, an independent calculator site. Your Rates of Pay and Unpaid Wages fact sheet (last updated June 2023) points young people to a single JobWatch page on getting paid.

I have two plain-English pages that might be worth a mention alongside it:

- Junior minimum wage by age, with hourly and casual rates and how awards differ from the national rate: https://pay-calculator-australia.com/junior-pay-rates/
- A dated list of what is changing, including the 1 December 2026 start of higher junior percentages for 18 to 20 year olds on the retail, fast food and pharmacy awards (only for employees with more than 6 months with their employer): https://pay-calculator-australia.com/pay-and-tax-changes-calendar/

Both link to the Fair Work Commission and ATO sources, and neither is legal advice. If they would help the young workers you assist, you are welcome to link them, and I would welcome corrections from anyone with more direct experience of how these rates play out in practice.

Kind regards,
Anita Bell
Pay Calculator Australia

---

## Prospects held back

- **Reddit / SourceBottle:** process, not outreach. Register as Anita Bell and answer only what she can stand behind.
- **Government pages (youth.gov.au):** low odds. There is no "suggest a resource" form, only the general enquiries form, which is in the send sheet.
- **University hubs not drafted here (UTS, ANU, VU, Curtin, Monash):** same shape as draft 7; send after one or two replies show the framing works. As of 9 Oct, each has a published contact and a personalisation line in the send sheet. VU's post still gives the 2022 HELP threshold ($46,620), and Monash MSA's HECS timeline still describes the $67,000 threshold as a promise. Lead with those corrections.
- **Redundant with 1-10:** Compare the Market (same as Finder), Australian Unions and AWU can be sent the same week but as separate emails.
- **Held on 9 Oct (page changed):** SDA (the page is SDA's own retail pay calculator), JobWatch (its external links list only regulators and legal services), Backpacker Job Board (the guide now cites only official sources and is building its own calculator). Victoria Legal Aid has no website or resource-suggestion contact route.
