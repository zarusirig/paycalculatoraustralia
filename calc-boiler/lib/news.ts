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
      { question: "Who gets the 4.75% wage increase?", answer: "Around 2.8 million award-reliant employees — about 21% of the Australian workforce — plus anyone on the national minimum wage. Workers on enterprise agreements or over-award salaries are only affected if their pay is tied to award movements." },
      { question: "When does the 2026 minimum wage increase start?", answer: "From the first full pay period starting on or after 1 July 2026. If your pay week begins on a Wednesday, the new rate applies from the first Wednesday in July." },
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
