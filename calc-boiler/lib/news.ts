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
