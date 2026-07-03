import { AUTHORS } from "@/lib/authors";

export type NewsCategory = "Tax" | "Super" | "Wages" | "HECS" | "Centrelink & Payments";

export type NewsSource = { title: string; url: string; publisher: string };
export type NewsFaq = { question: string; answer: string };
export type NewsLink = { href: string; label: string };

export type NewsArticleMeta = {
  slug: string;
  headline: string;          // H1 + schema headline
  title: string;             // <title> tag
  description: string;       // meta description + schema description
  category: NewsCategory;
  datePublished: string;     // ISO yyyy-mm-dd — real event date, never today-by-default
  dateModified: string;      // ISO yyyy-mm-dd — last content update
  authorId: keyof typeof AUTHORS;
  relatedCalculators: NewsLink[];  // drives the "What it means for your pay" CTA card
  relatedArticles: string[];       // slugs for the Related News block
  sources: NewsSource[];           // ≥2, rendered via SourceAttribution
  faq?: NewsFaq[];                 // optional FAQPage schema
};

export const NEWS_CATEGORIES: NewsCategory[] = ["Wages", "Super", "Tax", "HECS", "Centrelink & Payments"];

export const NEWS_ARTICLES: NewsArticleMeta[] = [
  {
    slug: "minimum-wage-increase-july-2026",
    headline: "Minimum Wage Rises 6% to $26.44 an Hour From 1 July 2026",
    title: "Minimum Wage Increase July 2026: FWC Lifts NMW 6% — New Rates",
    description: "The Fair Work Commission's 2026 Annual Wage Review lifts the national minimum wage 6% — from $24.95 to $26.44 an hour ($1,004.90 a week) — and modern award rates 4.75%, from 1 July 2026. See who gets the increase and what it means for your take-home pay.",
    category: "Wages",
    datePublished: "2026-06-02",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/hourly-to-annual-salary-calculator/", label: "Hourly to Annual Salary Calculator" },
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
    ],
    relatedArticles: ["new-minimum-wage-take-home-pay", "award-wage-increase-2026-industries", "july-1-2026-money-changes"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
    ],
    faq: [
      { question: "What is the new minimum wage in Australia from 1 July 2026?", answer: "The national minimum wage is $26.44 per hour or $1,004.90 per 38-hour week, a 6% rise from the Fair Work Commission's Annual Wage Review, effective from the first full pay period on or after 1 July 2026. Modern award minimum rates rose by a separate 4.75%." },
      { question: "Who gets the 4.75% wage increase?", answer: "Around 2.8 million award-reliant employees — about 21% of the Australian workforce — get the 4.75% modern award increase. National minimum wage earners instead receive a separate 6% rise to $26.44 an hour. Enterprise agreement or over-award workers are only affected if their pay is tied to award movements." },
      { question: "When does the 2026 minimum wage increase start?", answer: "From the first full pay period starting on or after 1 July 2026. If your pay week begins on a Wednesday, the new rate applies from the first Wednesday in July." },
    ],
  },
  {
    slug: "new-minimum-wage-take-home-pay",
    headline: "What the New $26.44 Minimum Wage Means for Your Take-Home Pay",
    title: "New Minimum Wage 2026: Weekly, Fortnightly & Annual Take-Home Pay",
    description: "From 1 July 2026 the minimum wage is $26.44/hour — $1,004.90 a week or about $52,255 a year full-time. Here's what actually lands in your bank account after tax, and how casuals and part-timers work out their new rate.",
    category: "Wages",
    datePublished: "2026-06-16",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
      { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "award-wage-increase-2026-industries", "tax-cut-july-2026"],
    sources: [
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
    ],
    faq: [
      { question: "What is the new minimum wage take-home pay after tax?", answer: "A full-time minimum-wage worker on $1,004.90 a week ($26.44/hour) takes home about $869.90 a week after tax, based on the FY2026-27 PAYG withholding schedule with the tax-free threshold claimed and no HECS debt. Fortnightly that's roughly $1,739.80, and around $45,230 for the full year." },
      { question: "How much tax do you pay on minimum wage in Australia?", answer: "On the new $52,254.80 annual minimum-wage earnings, PAYG withholding works out to about $135 a week, $270 a fortnight, or roughly $7,025 for the year — after the low income tax offset and Medicare levy shading are applied. Your actual tax depends on your TFN declaration and any other income." },
      { question: "Do casuals get more than $26.44 an hour on minimum wage?", answer: "Yes. Casual employees on the national minimum wage receive a 25% casual loading on top of the $26.44 base rate, taking their minimum casual hourly rate to $33.05 from 1 July 2026, to compensate for not getting paid leave entitlements." },
      { question: "How is the minimum wage worked out for part-time workers?", answer: "Part-time minimum-wage workers are paid $26.44 for every hour actually worked, pro-rated to their contracted hours — there's no separate part-time rate. A 20-hour week at the minimum wage comes to $528.80 gross before tax." },
    ],
  },
  {
    slug: "award-wage-increase-2026-industries",
    headline: "Award Wages Rise 4.75% From July: Retail, Hospitality and Care Rates",
    title: "Award Wage Increase 2026: New Rates by Industry From 1 July",
    description: "All modern award minimum rates rise 4.75% from the first full pay period after 1 July 2026. What the increase looks like in retail, hospitality, aged care and other award-reliant industries — and how to check your new rate.",
    category: "Wages",
    datePublished: "2026-06-24",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/award-rates/", label: "Award Rates Guide" },
      { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "new-minimum-wage-take-home-pay", "c13-classification-phase-out"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
    ],
    faq: [
      { question: "Which awards get the 4.75% pay rise in 2026?", answer: "Every modern award minimum rate rises 4.75% from the first full pay period on or after 1 July 2026 — including the Hospitality Award, Retail Award, Fast Food Industry Award, Restaurant Industry Award and the Aged Care Award. About 2.8 million award-reliant employees, roughly 21% of the workforce, are covered." },
      { question: "Is the award wage increase the same as the minimum wage increase?", answer: "No. The 4.75% rise applies only to modern award minimum rates. The national minimum wage — the safety-net rate for employees not covered by an award or agreement — rose separately by 6% to $26.44 an hour." },
      { question: "How do I find my new award rate?", answer: "Check your award's classification schedule for your role and grade, then apply the 4.75% increase to the current base rate. Fair Work Ombudsman publishes updated pay guides for each award from 1 July, and our award rates guide links to the current tables." },
      { question: "When do the new award rates start being paid?", answer: "From the first full pay period starting on or after 1 July 2026 — not 1 July itself. If your pay cycle doesn't align with the calendar, your first full July pay may still include a few days at the old rate." },
    ],
  },
  {
    slug: "c13-classification-phase-out",
    headline: "FWC Begins Phasing Out the C13 Award Classification",
    title: "C13 Classification Phase-Out: What the Lowest Award Rate Change Means",
    description: "The Fair Work Commission is phasing out the C13 classification — the lowest ongoing rate in the award system — in three stages, starting 1 July 2026. What C13 workers can expect their pay to do as the transition rolls through.",
    category: "Wages",
    datePublished: "2026-06-10",
    dateModified: "2026-07-02",
    authorId: "penny-ward",
    relatedCalculators: [
      { href: "/award-rates/", label: "Award Rates Guide" },
      { href: "/minimum-wage-history-australia/", label: "Minimum Wage History" },
    ],
    relatedArticles: ["minimum-wage-increase-july-2026", "award-wage-increase-2026-industries"],
    sources: [
      { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews/annual-wage-review-2026", publisher: "Fair Work Commission" },
      { title: "Annual Wage Review", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review", publisher: "Fair Work Ombudsman" },
    ],
    faq: [
      { question: "What is the C13 classification and why is it being phased out?", answer: "C13 is the lowest ongoing pay classification in most modern awards. The Fair Work Commission decided to phase it out and make C12 the new lowest ongoing rate, in three stages, because it found the gap between C13 and C12 too narrow to justify as a distinct entry-level rate." },
      { question: "How much extra do C13 workers get in stage one?", answer: "From 1 July 2026, C13 rates rise by 5.95% in total — the general 4.75% award increase plus an extra 1.2%, representing one-third of the dollar gap between C13 and C12. The C14 rate rises by the same percentage to preserve its relativity to C13." },
      { question: "When will C13 disappear completely from awards?", answer: "The Fair Work Commission has not set a fixed end date. The phase-out continues over subsequent Annual Wage Reviews, with each stage closing another third of the gap to C12, until C13 is fully absorbed and C12 becomes the permanent lowest ongoing rate." },
      { question: "Does the C13 phase-out affect casual or junior rates?", answer: "The phase-out targets the ongoing (non-casual) C13 classification rate specifically. Casual loadings and junior, apprentice and trainee rates are calculated as usual off the adjusted base rate for your classification." },
    ],
  },
  {
    slug: "payday-super-starts-july-2026",
    headline: "Payday Super Is Live: Employers Must Now Pay Super With Every Pay",
    title: "Payday Super Starts July 2026: New Employer Rules Explained",
    description: "From 1 July 2026, employers must pay super guarantee into your fund within 7 business days of each payday. Here's what payday super means for you.",
    category: "Super",
    datePublished: "2026-07-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
      { href: "/employer-cost-calculator/", label: "Employer Cost Calculator" },
    ],
    relatedArticles: ["payday-super-employees-payslip", "super-contribution-caps-2026-27", "july-1-2026-money-changes"],
    sources: [
      { title: "About payday super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/about-payday-super", publisher: "Australian Taxation Office" },
      { title: "Payment deadlines for payday super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/paying-super-on-payday/payment-deadlines-for-payday-super", publisher: "Australian Taxation Office" },
    ],
    faq: [
      { question: "What is payday super and when does it start?", answer: "Payday super is a law requiring employers to pay super guarantee contributions into an employee's fund within 7 business days of each payday, rather than quarterly. It started on 1 July 2026 and applies to qualifying earnings paid from that date, even if the work was done earlier." },
      { question: "What happens if my employer pays my super late under payday super?", answer: "If super isn't in your fund within 7 business days of payday, your employer becomes liable for the new super guarantee charge, which includes the shortfall, interest and administrative penalties. You can check contributions have landed through your fund's app or the ATO online services in myGov." },
      { question: "Can employers still use the Small Business Superannuation Clearing House?", answer: "No. The SBSCH closed permanently on 30 June 2026. Employers who relied on it needed to move to a commercial clearing house or their payroll software's default fund service before payday super started, to keep meeting the new 7-business-day deadline." },
      { question: "Does payday super change how much super I get paid?", answer: "No, payday super changes the timing of contributions, not the rate. Super guarantee stays at 12% of ordinary time earnings for 2026-27. The change means your super lands in your account sooner and more often, which can slightly boost compounding returns over your career." },
    ],
  },
  {
    slug: "payday-super-employees-payslip",
    headline: "Payday Super: What Changes on Your Payslip From July 2026",
    title: "Payday Super and Your Payslip: What Changed July 2026",
    description: "Payday super requires employers to pay your super guarantee alongside every pay run from 1 July 2026. Here's what to check on your payslip now.",
    category: "Super",
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
    ],
    relatedArticles: ["payday-super-starts-july-2026", "july-1-2026-money-changes"],
    sources: [
      { title: "About payday super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/about-payday-super", publisher: "Australian Taxation Office" },
      { title: "Payday super: how to manage super during the changeover", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/payday-super-how-to-manage-super-during-the-changeover", publisher: "Australian Taxation Office" },
    ],
  },
  {
    slug: "division-296-super-tax-starts",
    headline: "Division 296 Super Tax Starts: Extra 15% on Balances Above $3 Million",
    title: "Division 296 Super Tax 2026: Extra 15% Above $3 Million Explained",
    description: "From 1 July 2026, Division 296 adds a 15% tax on earnings from super balances above $3 million, plus 10% above $10 million. Who it hits and when.",
    category: "Super",
    datePublished: "2026-07-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/division-293-tax/", label: "Division 293 Tax Guide" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
    ],
    relatedArticles: ["super-tax-changes-explained", "transfer-balance-cap-increase-2026"],
    sources: [
      { title: "Better Targeted Super Concessions is law", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law", publisher: "Australian Taxation Office" },
      { title: "Better targeted superannuation concessions", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions", publisher: "Australian Taxation Office" },
      { title: "Division 296 super tax explained", url: "https://www.superguide.com.au/super-booster/super-tax-accounts-3-million", publisher: "SuperGuide" },
    ],
    faq: [
      { question: "What is Division 296 tax and who does it apply to?", answer: "Division 296 is an extra 15% tax on the share of super earnings attributed to the portion of an individual's total super balance above $3 million. It applies from 1 July 2026, with a further 10% on earnings attributed to balances above $10 million, taking the combined extra tax on that top slice to 25%." },
      { question: "When is Division 296 tax first assessed?", answer: "Division 296 tax first applies to earnings in the 2026-27 financial year. Because it's based on your total super balance at 30 June, the earliest individuals will receive an assessment is after 30 June 2027, once the ATO calculates earnings attributable to balances above the $3 million threshold." },
      { question: "Does Division 296 tax unrealised capital gains?", answer: "Yes. Division 296 earnings are calculated using the growth in your total super balance over the year, adjusted for contributions and withdrawals, which can include unrealised gains on assets like property or shares that haven't been sold. This is one of the most contested features of the measure." },
      { question: "Are the $3 million and $10 million thresholds indexed?", answer: "Yes. Both the $3 million large super balance threshold and the $10 million very large super balance threshold are indexed to CPI, in increments of $150,000 and $500,000 respectively, so they will rise over time rather than staying fixed at today's dollar values." },
    ],
  },
  {
    slug: "super-contribution-caps-2026-27",
    headline: "Super Contribution Caps Rise to $32,500 and $130,000 for 2026-27",
    title: "Super Contribution Caps 2026-27: $32,500 Concessional Cap",
    description: "From 1 July 2026 the concessional super cap rises to $32,500 and the non-concessional cap to $130,000. See the new caps and bring-forward limits.",
    category: "Super",
    datePublished: "2026-02-24",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
    ],
    relatedArticles: ["transfer-balance-cap-increase-2026", "payday-super-starts-july-2026"],
    sources: [
      { title: "Contributions caps", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps", publisher: "Australian Taxation Office" },
      { title: "Non-concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/non-concessional-contributions-cap", publisher: "Australian Taxation Office" },
    ],
  },
  {
    slug: "transfer-balance-cap-increase-2026",
    headline: "Transfer Balance Cap Lifts to $2.1 Million From 1 July 2026",
    title: "Transfer Balance Cap 2026: Rises to $2.1 Million — What Changes",
    description: "The transfer balance cap rises from $2.0 million to $2.1 million on 1 July 2026, lifting how much can move into a tax-free retirement pension.",
    category: "Super",
    datePublished: "2026-03-05",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
      { href: "/division-293-tax/", label: "Division 293 Tax Guide" },
    ],
    relatedArticles: ["super-contribution-caps-2026-27", "division-296-super-tax-starts"],
    sources: [
      { title: "General transfer balance cap indexation on 1 July 2026", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/general-transfer-balance-cap-indexation-on-1-july-2026", publisher: "Australian Taxation Office" },
      { title: "Calculating your personal transfer balance cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/retirement-withdrawal-lump-sum-or-income-stream/calculating-your-personal-transfer-balance-cap", publisher: "Australian Taxation Office" },
    ],
  },
  {
    slug: "super-tax-changes-explained",
    headline: "The Super Tax Changes, Explained: Who Division 296 Actually Hits",
    title: "Super Tax Changes 2026 Explained: Who Division 296 Affects",
    description: "Payday super, Division 296 and higher contribution caps all start or change in 2026-27. A plain-English guide to who is affected and what changes.",
    category: "Super",
    datePublished: "2026-05-12",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/division-293-tax/", label: "Division 293 Tax Guide" },
      { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
    ],
    relatedArticles: ["division-296-super-tax-starts", "super-contribution-caps-2026-27"],
    sources: [
      { title: "Better Targeted Super Concessions is law", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law", publisher: "Australian Taxation Office" },
      { title: "Better targeted superannuation concessions", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions", publisher: "Australian Taxation Office" },
      { title: "Division 296 super tax explained", url: "https://www.superguide.com.au/super-booster/super-tax-accounts-3-million", publisher: "SuperGuide" },
    ],
    faq: [
      { question: "What superannuation changes started in 2026-27?", answer: "The biggest changes are payday super (employers pay super with every pay from 1 July 2026), Division 296 tax (an extra 15% on earnings from balances above $3 million, plus 10% above $10 million), higher contribution caps ($32,500 concessional, $130,000 non-concessional) and a $2.1 million transfer balance cap." },
      { question: "Does Division 296 tax affect most Australians?", answer: "No. Division 296 tax only applies to individuals with a total super balance above $3 million at the end of the financial year, a small fraction of super members. Most Australians are far more affected by payday super, the higher contribution caps and the transfer balance cap increase." },
      { question: "Why did Jim Chalmers introduce the Division 296 tax?", answer: "Treasurer Jim Chalmers said the measure better targets superannuation tax concessions, which the government argued disproportionately benefited a small number of very large balances, to help fund the budget and make the system more sustainable as super balances grow with compulsory contributions." },
    ],
  },
  {
    slug: "hecs-indexation-2026",
    headline: "HECS Indexation 2026: 2.8% Added to Student Debts on 1 June",
    title: "HECS Indexation 2026: 2.8% Added on 1 June",
    description: "HECS and HELP debts were indexed 2.8% on 1 June 2026, the lowest rate since 2021 and below the lower CPI/WPI cap. See what it adds to your balance.",
    category: "HECS",
    datePublished: "2026-06-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
      { href: "/extra-super-vs-hecs-repayment/", label: "Extra Super vs HECS Repayment" },
    ],
    relatedArticles: ["hecs-20-percent-cut-status", "hecs-repayment-threshold-2026-27"],
    sources: [
      { title: "Indexation of 2.8% will be applied to your study loan on 1 June 2026", url: "https://www.studyassist.gov.au/news/indexation-28-will-be-applied-your-study-loan-1-june-2026", publisher: "Study Assist, Australian Government" },
      { title: "Study and training loan indexation rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates", publisher: "Australian Taxation Office" },
    ],
    faq: [
      { question: "What was the HECS indexation rate on 1 June 2026?", answer: "HELP debts, including HECS-HELP, were indexed by 2.8% on 1 June 2026 — the lowest rate since 2021. Indexation is capped at the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI), both measured to the March quarter, so your debt can never grow faster than average wages." },
      { question: "How much did 2.8% indexation add to my HECS debt?", answer: "A $30,000 HECS balance grew by about $840 on 1 June 2026 at the 2.8% rate. Indexation applies to whatever balance remained unpaid for more than 11 months, so any voluntary repayment made before 1 June reduced the amount that was indexed." },
      { question: "Why is HECS indexation capped at the lower of CPI or WPI?", answer: "The government introduced the cap after CPI-based indexation hit 7.1% in June 2023, adding thousands of dollars to balances overnight. Since 1 June 2023, indexation has used whichever measure — CPI or WPI — is lower, protecting borrowers from another inflation-driven spike." },
      { question: "Does indexation apply before or after the 20% debt cut?", answer: "The one-off 20% reduction was applied to balances as at 1 June 2025, before that year's indexation. Indexation each 1 June, including the 2.8% applied in 2026, is a separate annual adjustment that continues to apply to whatever balance remains outstanding." },
    ],
  },
  {
    slug: "hecs-20-percent-cut-status",
    headline: "The 20% HECS Debt Cut: How to Check It Hit Your Balance",
    title: "The 20% HECS Debt Cut: How to Check It Landed",
    description: "The one-off 20% HELP debt cut is now fully processed, wiping about $5,520 off the average $27,600 balance. Here's how to check it applied to your account.",
    category: "HECS",
    datePublished: "2026-01-20",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
      { href: "/hecs-help-guide/", label: "HECS-HELP Guide" },
    ],
    relatedArticles: ["hecs-indexation-2026", "hecs-marginal-repayment-first-tax-time"],
    sources: [
      { title: "20% reduction of HELP debts", url: "https://www.studyassist.gov.au/news/20-reduction-help-debts", publisher: "Study Assist, Australian Government" },
      { title: "FAQs — 20% reduction off all outstanding HELP loan debt", url: "https://www.education.gov.au/higher-education-loan-program/20-reduction-student-loan-debt/faqs-20-reduction-all-outstanding-help-loan-debt", publisher: "Department of Education, Australian Government" },
      { title: "More than 3.2 million Australians' student debt now cut by 20 per cent", url: "https://ministers.education.gov.au/clare/more-32-million-australians-student-debt-now-cut-20-cent", publisher: "Ministers' Media Centre, Department of Education" },
    ],
    faq: [
      { question: "Has the 20% HECS debt cut been applied yet?", answer: "Yes. The ATO has completed processing the one-off 20% reduction for every HELP and other student loan balance that existed on 1 June 2025. Most people received the cut before the end of 2025, with a small number of more complex accounts finalised in early 2026." },
      { question: "How much was cut from the average HECS debt?", answer: "The average HELP debt of $27,600 was reduced by around $5,520 — 20% off the balance as it stood on 1 June 2025, before that year's indexation was applied. Your own reduction depends on your exact balance on that date." },
      { question: "Do I need to apply for the 20% HECS reduction?", answer: "No. The reduction was applied automatically by the ATO to every eligible HELP, VET Student Loan and other study loan balance — there was no application process. If your loan existed on 1 June 2025, the cut should already be reflected in your account." },
      { question: "How do I check the 20% cut applied to my HECS debt?", answer: "Log in to the ATO app or ATO online services through myGov and check your study loan account balance and transaction history under 'Tax > Study and training loans'. The reduction shows as a credit transaction dated against your 1 June 2025 balance." },
    ],
  },
  {
    slug: "hecs-repayment-threshold-2026-27",
    headline: "HECS Repayment Threshold Rises to $69,528 for 2026-27",
    title: "HECS Repayment Threshold Rises to $69,528 for 2026-27",
    description: "The FY2026-27 HECS repayment threshold is $69,528, up from $67,000, before 15c-in-the-dollar repayments start under the marginal system. See the full bands.",
    category: "HECS",
    datePublished: "2026-06-26",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
      { href: "/stsl-on-payslip/", label: "STSL on Your Payslip" },
    ],
    relatedArticles: ["hecs-marginal-repayment-first-tax-time", "hecs-indexation-2026"],
    sources: [
      { title: "Study and training loan repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "Australian Taxation Office" },
      { title: "Legislation reducing HELP debt by 20% and changes to repayment rates passed", url: "https://www.studyassist.gov.au/news/legislation-reducing-help-debt-20-and-changes-repayment-rates-passed", publisher: "Study Assist, Australian Government" },
    ],
    faq: [
      { question: "What is the HECS repayment threshold for 2026-27?", answer: "The minimum repayment threshold for FY2026-27 is $69,528. Below that repayment income, you make no compulsory HECS or HELP repayment at all. It's indexed up from $67,000 in FY2025-26, the year the marginal repayment system launched with a raised $54,435-to-$67,000 threshold jump." },
      { question: "What happens once I earn over $69,528?", answer: "Under the marginal system, you pay 15c for every dollar of repayment income above $69,528, up to $129,717. Above that, repayments are $9,028 plus 17c per dollar up to $186,050, and a flat 10% of your total repayment income once you earn above $186,050." },
      { question: "Is the $69,528 threshold the same as $69,529?", answer: "No — $69,528 is the exempt threshold; the first dollar of repayment income taxed at 15% is $69,529. Below $69,528 you pay nothing, and the 15% rate applies only to income above that figure, not to the threshold amount itself." },
      { question: "Does the higher threshold mean smaller HECS repayments?", answer: "Yes, for most earners. Because the threshold rose and repayments are now marginal rather than a flat percentage of total income, someone on $70,000 pays a small amount on the sliver above $69,528, instead of the old flat-rate cliff that applied to their entire income." },
    ],
  },
  {
    slug: "hecs-marginal-repayment-first-tax-time",
    headline: "Your First Tax Return Under the New HECS Repayment System",
    title: "Your First Tax Return Under the New HECS System",
    description: "Millions lodge their first return under the new marginal HECS system this year, with 15% charged only above $69,528. Here's how it changes your refund.",
    category: "HECS",
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/hecs-help-calculator/", label: "HECS-HELP Calculator" },
      { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
    ],
    relatedArticles: ["hecs-repayment-threshold-2026-27", "hecs-20-percent-cut-status"],
    sources: [
      { title: "Compulsory repayments", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/compulsory-repayments", publisher: "Australian Taxation Office" },
      { title: "Study and training loan repayment thresholds and rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "Australian Taxation Office" },
    ],
    faq: [
      { question: "Why is this tax time different for HECS debtors?", answer: "This is the second full financial year the marginal repayment system has applied, but the first where the FY2026-27 threshold, bands and 2.8% indexation all interact in the one assessment. Your notice of assessment reconciles what your employer withheld against your actual compulsory repayment." },
      { question: "Will I get a refund if too much STSL was withheld?", answer: "Yes. If your employer withheld more STSL than your compulsory repayment for the year — common if you had irregular income or multiple jobs — the ATO refunds the difference as part of your tax return, or nets it against your HECS balance instead." },
      { question: "Do I owe extra HECS if I had two jobs under the threshold?", answer: "Possibly. STSL withholding is calculated separately per employer, so two jobs each paying under $69,528 might trigger no withholding individually, but your combined repayment income at tax time can still exceed the threshold — leaving you with an unexpected compulsory repayment on your notice of assessment." },
      { question: "How does the 20% debt cut show up on this tax return?", answer: "The 20% reduction was applied directly to your loan balance by the ATO during 2025, not through your tax return, so it doesn't appear as a line item on your notice of assessment. Your compulsory repayment for the year is calculated as usual on your reduced balance." },
    ],
  },
  {
    slug: "federal-budget-2026-27-your-pay",
    headline: "Federal Budget 2026-27: What It Means for Your Take-Home Pay",
    title: "Federal Budget 2026-27: What It Means for Your Pay",
    description: "The 12 May 2026 Budget added a $250 tax offset from 2027-28 on top of the 1 July tax cut and $1,000 deduction — worth up to $2,816 a year combined.",
    category: "Tax",
    datePublished: "2026-05-12",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
    ],
    relatedArticles: ["tax-cut-july-2026", "medicare-levy-thresholds-2026"],
    sources: [
      { title: "Tax reform", url: "https://budget.gov.au/content/04-tax-reform.htm", publisher: "Budget 2026-27, Australian Government" },
      { title: "Cost of living", url: "https://budget.gov.au/content/02-cost-of-living.htm", publisher: "Budget 2026-27, Australian Government" },
    ],
    faq: [
      { question: "When was the 2026-27 Federal Budget handed down?", answer: "Treasurer Jim Chalmers handed down the 2026-27 Budget on Tuesday 12 May 2026. It confirmed the previously legislated 1 July 2026 tax cut and the $1,000 instant deduction, and added a new $250 Working Australians Tax Offset starting from the 2027-28 income year." },
      { question: "Did the Budget cut tax rates again?", answer: "No new rate cut was announced in this Budget. The 16% to 15% cut on income between $18,201 and $45,000 was already legislated in the 2025 Budget and simply took effect on 1 July 2026 as planned. This Budget's new measure was the $250 Working Australians Tax Offset from 2027-28." },
      { question: "How much extra will an average earner get from this Budget?", answer: "Treasury estimates a worker on average earnings of $81,245 will be up to $2,816 a year better off from 2027-28 with the maximum $1,000 instant deduction benefit — or about $2,701 with the average $205 benefit — once every tax cut and the $250 offset are fully phased in, versus 2023-24 settings." },
    ],
  },
  {
    slug: "medicare-levy-thresholds-2026",
    headline: "Medicare Levy Thresholds Lifted: Who Pays Less From 2026",
    title: "Medicare Levy Thresholds Lifted: Who Pays Less in 2025-26",
    description: "Medicare levy low-income thresholds rose 2.9% for 2025-26 — singles now pay no levy below $28,011, up from $27,222, sparing over a million low earners.",
    category: "Tax",
    datePublished: "2026-05-12",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/medicare-levy/", label: "Medicare Levy Guide" },
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
    ],
    relatedArticles: ["federal-budget-2026-27-your-pay", "tax-time-2026-whats-new"],
    sources: [
      { title: "Medicare levy reduction for low-income earners", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners", publisher: "Australian Taxation Office" },
      { title: "Cost of living", url: "https://budget.gov.au/content/02-cost-of-living.htm", publisher: "Budget 2026-27, Australian Government" },
    ],
    faq: [
      { question: "What is the new Medicare levy low-income threshold?", answer: "For the 2025-26 income year, the singles threshold rose from $27,222 to $28,011 — below that, you pay no Medicare levy at all. The family threshold lifted from $45,907 to $47,238, and each dependent child or student adds $4,338 rather than $4,216 to the family threshold." },
      { question: "When do the higher Medicare levy thresholds apply from?", answer: "The 2.9% increase is backdated to 1 July 2025, so it applies to the whole 2025-26 income year — the return most people lodge between July and October 2026. You don't need to do anything; the ATO applies the new thresholds automatically when it assesses your return." },
      { question: "Do senior and pensioner thresholds also rise?", answer: "Yes. The single seniors and pensioners threshold increased from $43,020 to $44,268, and the senior and pensioner family threshold from $59,886 to $61,623, keeping pace with the same 2.9% uplift applied across all Medicare levy low-income categories for the 2025-26 income year." },
    ],
  },
  {
    slug: "tax-cut-july-2026",
    headline: "Tax Cut From 1 July 2026: The 16% Rate Drops to 15%",
    title: "Tax Cut From 1 July 2026: 16% Rate Drops to 15%",
    description: "From 1 July 2026 the 16% tax rate on income between $18,201 and $45,000 fell to 15%, cutting up to $268 a year off every taxpayer bill this year.",
    category: "Tax",
    datePublished: "2026-07-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
      { href: "/pay-rise-calculator/", label: "Pay Rise Calculator" },
    ],
    relatedArticles: ["july-1-2026-money-changes", "tax-time-2026-whats-new"],
    sources: [
      { title: "Personal income tax – new tax cuts for every Australian taxpayer", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer", publisher: "Australian Taxation Office" },
      { title: "Tax reform", url: "https://budget.gov.au/content/04-tax-reform.htm", publisher: "Budget 2026-27, Australian Government" },
    ],
    faq: [
      { question: "What tax rate changed on 1 July 2026?", answer: "The second marginal tax rate, applied to taxable income between $18,201 and $45,000, dropped from 16% to 15% from 1 July 2026. It's the second stage of tax cuts legislated in the 2025 Budget under the Treasury Laws Amendment (More Cost of Living Relief) Act 2025." },
      { question: "How much is the 1 July 2026 tax cut worth?", answer: "Every taxpayer earning above $45,000 saves the maximum $268 a year, because the full $26,799 of income in that bracket is now taxed 1 percentage point lower. Taxpayers earning less than $45,000 save proportionally less, based on how much of their income falls in the bracket." },
      { question: "Is there another tax cut coming after this one?", answer: "Yes. The same legislation cuts the rate again, from 15% to 14%, from 1 July 2027, on the same $18,201 to $45,000 bracket, taking the maximum annual saving to $536 a year compared with 2024-25 settings — double the saving delivered by the 1 July 2026 cut alone." },
      { question: "Do I need to do anything to get the tax cut?", answer: "No. The lower withholding rate is built into the PAYG tax tables employers and payroll software use automatically from the first pay run after 1 July 2026, so the extra take-home pay shows up in your pay packet without any action on your part." },
    ],
  },
  {
    slug: "1000-dollar-instant-tax-deduction",
    headline: "The $1,000 Instant Tax Deduction: No Receipts, One Tick",
    title: "$1,000 Instant Tax Deduction: How It Works for 2026-27",
    description: "The $1,000 instant work-related deduction is now law for 2026-27 — claim it with no receipts from July 2027, saving workers an average $205.",
    category: "Tax",
    datePublished: "2026-07-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
    ],
    relatedArticles: ["tax-time-2026-whats-new", "tax-cut-july-2026"],
    sources: [
      { title: "Standard deduction for work-related expenses", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/standard-deduction-for-work-related-expenses", publisher: "Australian Taxation Office" },
      { title: "Tax reform", url: "https://budget.gov.au/content/04-tax-reform.htm", publisher: "Budget 2026-27, Australian Government" },
    ],
    faq: [
      { question: "Is the $1,000 instant tax deduction law yet?", answer: "Yes. It's now law under the Treasury Laws Amendment (Tax Reform No. 1) Act 2026, which received royal assent on 26 June 2026. It applies to the 2026-27 income year — the financial year that started on 1 July 2026, not the return most people are lodging right now." },
      { question: "When can I actually claim the $1,000 deduction?", answer: "You claim it on your 2026-27 tax return, which you lodge from 1 July 2027. It doesn't apply to the 2025-26 return most workers lodge between July and October 2026 — that return still uses the normal substantiation rules for work-related expenses." },
      { question: "Do I need receipts for the $1,000 deduction?", answer: "No. You can deduct up to $1,000 for work-related expenses with no receipts and no substantiation at all. If your actual work expenses are higher than $1,000, you can still claim the full, itemised amount the usual way instead — you choose whichever gives the better outcome." },
      { question: "Can I claim other deductions on top of the $1,000?", answer: "Yes. Non-work deductions such as charitable donations, union or professional association fees, income protection premiums and investment expenses aren't capped by the instant deduction and remain fully claimable alongside it, using your normal records and receipts as you would in any other year." },
    ],
  },
  {
    slug: "tax-time-2026-whats-new",
    headline: "Tax Time 2026: Everything New When You Lodge This Year",
    title: "Tax Time 2026: What's New When You Lodge Your Return",
    description: "Lodging your 2025-26 tax return? Medicare levy thresholds rose, the $2 gift minimum was scrapped, and the WFH rate stays at 70 cents an hour.",
    category: "Tax",
    datePublished: "2026-06-29",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
    ],
    relatedArticles: ["1000-dollar-instant-tax-deduction", "hecs-marginal-repayment-first-tax-time"],
    sources: [
      { title: "What's new for individuals", url: "https://www.ato.gov.au/individuals-and-families/your-tax-return/before-you-prepare-your-tax-return/what-s-new-for-individuals", publisher: "Australian Taxation Office" },
      { title: "Fixed rate method", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/working-from-home-expenses/fixed-rate-method", publisher: "Australian Taxation Office" },
    ],
    faq: [
      { question: "When is the 2026 tax return deadline?", answer: "If you lodge your own 2025-26 tax return, it's due by 31 October 2026. If you engage a registered tax agent before that date, your deadline can extend to 15 May 2027, provided you're on their client list before 31 October." },
      { question: "What is the work-from-home deduction rate for 2025-26?", answer: "The fixed rate method stays at 70 cents per work hour for 2025-26, unchanged from 2024-25. You can still separately claim depreciation on assets over $300, work-related purchases up to $300, and home office cleaning and repair costs on top of the fixed rate." },
      { question: "Did the $2 minimum for gift deductions change?", answer: "Yes. From the 2025-26 income year, the $2 minimum donation threshold for deductible gift recipients was removed, so you can now claim a deduction for any eligible gift or donation regardless of size, provided you keep a valid receipt from the recipient." },
      { question: "Does the $1,000 instant deduction apply to this year's return?", answer: "No, not yet. The $1,000 instant work-related deduction applies to the 2026-27 income year and is claimed on the return lodged from July 2027. The return you lodge this tax time, for 2025-26, still uses the normal substantiation rules for work expenses." },
    ],
  },
  {
    slug: "july-1-2026-money-changes",
    headline: "Everything That Changed on 1 July 2026: Pay, Super, Tax, HECS and Centrelink",
    title: "1 July 2026 Money Changes: Pay, Super, Tax, HECS, Centrelink",
    description: "From 1 July 2026: minimum wage up 6% to $26.44/hr, payday super begins, tax drops to 15%, HECS threshold rises to $69,528. The full roundup.",
    category: "Tax",
    datePublished: "2026-07-01",
    dateModified: "2026-07-02",
    authorId: "james-harrington",
    relatedCalculators: [
      { href: "/take-home-pay-calculator/", label: "Take-Home Pay Calculator" },
      { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
    ],
    relatedArticles: [
      "minimum-wage-increase-july-2026",
      "payday-super-starts-july-2026",
      "tax-cut-july-2026",
      "hecs-repayment-threshold-2026-27",
      "centrelink-changes-july-2026",
    ],
    sources: [
      { title: "Minimum wages increase from 1 July 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: "Fair Work Ombudsman" },
      { title: "Personal income tax – new tax cuts for every Australian taxpayer", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer", publisher: "Australian Taxation Office" },
      { title: "About payday super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/payday-super/about-payday-super", publisher: "Australian Taxation Office" },
    ],
    faq: [
      { question: "What changed on 1 July 2026?", answer: "The minimum wage rose 6% to $26.44 an hour, payday super began requiring employers to pay super within 7 business days of payday, the 16% tax rate dropped to 15%, the HECS repayment threshold rose to $69,528, and several Centrelink payment rates were indexed upward." },
      { question: "Which of these changes affects the most people?", answer: "The tax cut affects the broadest group — every resident taxpayer earning above $18,201 gets a saving of up to $268 a year. The minimum wage and award rises directly affect around 2.8 million award-reliant workers plus national minimum wage earners." },
      { question: "Do these changes apply automatically?", answer: "Most do. The tax cut, payday super and minimum wage rise are all built into payroll systems and PAYG withholding tables from the first pay run after 1 July 2026, so you don't need to apply for them — they should simply appear in your pay and super." },
      { question: "Where can I check how these changes affect my own pay?", answer: "Run your salary through our take-home pay calculator to see your new after-tax figure, or the income tax calculator to check your exact tax cut, HECS repayment and Medicare levy under the FY2026-27 settings — all in one place, updated for every change on this page." },
    ],
  },
];

/** All articles, newest first. */
export function getAllNews(): NewsArticleMeta[] {
  return [...NEWS_ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

export function getNewsBySlug(slug: string): NewsArticleMeta | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedNews(slug: string): NewsArticleMeta[] {
  const article = getNewsBySlug(slug);
  if (!article) return [];
  return article.relatedArticles
    .map(getNewsBySlug)
    .filter((a): a is NewsArticleMeta => Boolean(a));
}

/** "2026-06-02" → "2 June 2026" (AEST-safe). */
export function formatNewsDate(iso: string): string {
  return new Date(`${iso}T00:00:00+10:00`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  });
}
