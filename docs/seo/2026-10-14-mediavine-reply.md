# Reply to Mediavine (Jacob DiBiase, Solutions Engineer), 14 Oct 2026

Status: ready to send. Suraj sends it. No em dashes, on purpose.
Shipped in commits bd13330, 1ab69d3 and 14a8a33 (14 Oct 2026).

---

Subject: Re: Pay Calculator Australia: pre-launch items

Hi Jacob,

Thanks for the inspection. All three items are done and live on pay-calculator-australia.com. And yes please, we definitely want ads on the homepage.

**1. Sticky sidebar removed**

Nothing in the sidebar column is `position: sticky` any more. The sidebar runs the full height of the article, so your sticky sidebar unit has the whole page to travel. Our site header is `position: fixed` and 64px tall, if you need a top offset.

We also added a sidebar to the layouts that did not have one: all 63 calculator pages and the homepage. 446 pages now have a sidebar.

**2. Semantic body classes**

Every page has exactly one of these classes on `<body>`:

- `home`: the homepage. Calculator hero, then content and sidebar.
- `calculator`: 63 pages, for example /income-tax-calculator/, /take-home-pay-calculator/ and /pay-calculator-nsw/. Content and sidebar.
- `pay-rates`: 194 pages. Award rates, minimum, junior and apprentice wages, pay by job (/job-pay-rates/...), pay by employer (/pay-rates/...) and public holiday pay. Content and sidebar.
- `pay-scales`: 80 pages. Public service, teacher, nurse, police, fire, paramedic, prison officer and ADF pay scales, plus occupation salary pages. Content and sidebar.
- `tax-tables`: 11 pages. PAYG weekly, fortnightly, monthly and Schedule 5 tax tables. Content and sidebar.
- `guide`: 99 pages. All other guides. Content and sidebar.
- `salary-tables`: 204 pages. /tax-on/..., /take-home-pay-on/..., /salary-to-hourly/... and /hourly-to-salary/... Single column, no sidebar.
- `news`: 35 pages. /news/ and its articles. Single column, no sidebar.
- `utility`: 7 pages. About, contact, privacy, terms, disclaimer, site directory and /embed/. Your call on ads here. We would keep /embed/ clean, because other sites load it inside an iframe.

The class is set from the URL before your script runs, and it updates on client-side navigation.

**3. mv-sidebar and mv-content**

- `mv-sidebar` is on the innermost sidebar container (the div inside the `<aside>`) on every page that has a sidebar.
- `mv-content` is on the main content container of every content page: the `<article>` on guide-style pages, and the content column on calculator pages, the homepage, the salary tables and news. Each page has exactly one.

Example pages for targeting:

- https://pay-calculator-australia.com/ (home)
- https://pay-calculator-australia.com/income-tax-calculator/ (calculator)
- https://pay-calculator-australia.com/award-rates/ (pay-rates)
- https://pay-calculator-australia.com/public-service-pay-scales/aps/ (pay-scales)
- https://pay-calculator-australia.com/weekly-tax-table/ (tax-tables)
- https://pay-calculator-australia.com/superannuation-guide/ (guide)
- https://pay-calculator-australia.com/tax-on/80000/ (salary-tables)
- https://pay-calculator-australia.com/news/ (news)

**Please tell us what else would help you place more ads**

We want to give you as much room as you can use, so please treat the site as flexible. We are happy to:

- Add a sidebar to the two layouts that still do not have one: salary-tables (204 pages) and news (35 pages).
- Add more classes, IDs or containers for in-content units, or change the spacing between sections.
- Set up adhesion, video (Universal Player) or any other unit you recommend for a calculator site. Just tell us where you want the hooks.
- Change anything about our fixed header, spacing or layout that limits what you can run.

If you send us a list, we will do it before launch. Looking forward to the pre-launch checklist.

Thanks,
Suraj
