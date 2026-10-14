# Reply to Mediavine (Jacob DiBiase, Solutions Engineer) — 14 Oct 2026

Status: ready to send. Suraj sends from the account Mediavine emails.
What shipped is in calc-boiler commit "feat(ads): Mediavine targeting hooks" (14 Oct 2026).

---

Subject: Re: Pay Calculator Australia — pre-launch items

Hi Jacob,

Thanks for the inspection. All three items are now live on pay-calculator-australia.com, and yes please — we definitely want ads on the homepage.

**1. Sticky sidebar removed.**
Nothing in the sidebar column is `position: sticky` any more (it was `sticky top-8` on the inner sidebar div, on every template that has one). The sidebar column is a stretched flex item, so it runs the full height of the article and your sticky sidebar unit has the whole page to travel. The site header is `position: fixed`, 64px tall, if you need a top offset.

**2. Semantic body classes.**
Every page now carries exactly one of these on `<body>`:

| Body class | Pages | Layout |
|---|---|---|
| `home` | / | homepage, no sidebar |
| `calculator` | 63 calculator pages, e.g. /income-tax-calculator/, /take-home-pay-calculator/, /pay-calculator-nsw/ | calculator widget + full-width sections, **no sidebar** |
| `pay-rates` | 194 — award rates (/award-rates/, /*-award-rates/), minimum / junior / apprentice wages, pay by job (/job-pay-rates/*), pay by employer (/pay-rates/*), public holiday pay | article + sidebar |
| `pay-scales` | 80 — public service, teacher, nurse, police, fire, paramedic, prison officer and ADF pay scales (/public-service-pay-scales/*, /teacher-pay-australia/*, /police-pay/* …) and occupation salary pages | article + sidebar |
| `tax-tables` | 11 — PAYG weekly / fortnightly / monthly / Schedule 5 tax tables | article + sidebar |
| `guide` | 99 — every other guide, including guide-layout pages whose URL ends in -calculator/ (e.g. /annual-leave-calculator/) | article + sidebar |
| `salary-tables` | 204 — /tax-on/*, /take-home-pay-on/*, /salary-to-hourly/*, /hourly-to-salary/* | single centred column, no sidebar |
| `news` | 35 — /news/ and its articles | single column, no sidebar |
| `utility` | 7 — about, contact, privacy, terms, disclaimer, site directory, /embed/ | your call on ads; we would keep /embed/ clean, it is loaded inside other sites' iframes |

The class is set from the URL before your script runs and is updated on client-side navigation, so it is always current.

**3. `mv-sidebar`.**
Added to the innermost sidebar container (the div inside `<aside class="lg:w-1/3">`) on every layout that has a sidebar: `pay-rates`, `pay-scales`, `tax-tables` and `guide`. The main content container on those pages is the `<article>` immediately before the aside. `calculator`, `salary-tables`, `news` and `home` have no sidebar column, so in-content units only there.

Example pages for targeting:
- https://pay-calculator-australia.com/ (home)
- https://pay-calculator-australia.com/income-tax-calculator/ (calculator)
- https://pay-calculator-australia.com/award-rates/ (pay-rates)
- https://pay-calculator-australia.com/public-service-pay-scales/aps/ (pay-scales)
- https://pay-calculator-australia.com/weekly-tax-table/ (tax-tables)
- https://pay-calculator-australia.com/superannuation-guide/ (guide)
- https://pay-calculator-australia.com/tax-on/80000/ (salary-tables)
- https://pay-calculator-australia.com/news/ (news)

**One more thing — please tell us what else would let you place more ads.** We want to give you as much room as you can use, so treat the site as flexible. Things we are happy to change if they help revenue:
- Add a right sidebar column to the layouts that do not have one yet — calculator, salary-tables, news and the homepage (about 300 pages, including our highest-traffic ones) — so the sticky sidebar unit can run there too.
- Add fixed containers or extra semantic hooks for in-content units (e.g. a `mv-content` class, or spacing between sections) if that places more units than the `<article>` selector alone.
- Adhesion, Universal Player / video, recipe-style or any other units you recommend for a calculator site — just say where you want the hooks.
- Anything about the 64px fixed header, spacing or density that is limiting what you can run.

If you send a list, we will implement it before launch. Looking forward to the pre-launch checklist.

Thanks,
Suraj
