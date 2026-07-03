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
