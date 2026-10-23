import type { Metadata } from "next";
import ApprenticePayRatesPage from "@/modules/guide/apprentice-pay-rates";
import { APPRENTICE_PAY_FAQS } from "@/modules/guide/apprentice-pay-rates-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { formatAUD } from "@/lib/constants";
import { APPRENTICE_TRADES, apprenticeRate } from "@/lib/data/apprentice-pay";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026 trending set, item 6. Apprentice pay rates, apprentice wages and the
// apprentice wages calculator share one SERP, so they are one page (no
// cannibalising twin route). Rates verified against the modern awards on
// 5 October 2026; see lib/data/apprentice-pay.

const SLUG = "apprentice-pay-rates";
// Meta intent pass, 23 Oct 2026: the page is found for "4th year apprentice
// carpenter wage", "1st year apprentice boilermaker wages" and similar (pos 7
// to 11, 0.5% CTR). Searchers say "wages" and "1st year", so the title does
// too, and the description gives the first-year range the page leads with.
const FIRST_YEAR_HOURLY = APPRENTICE_TRADES.flatMap((t) =>
  (["completed", "not-completed"] as const).map((y) => apprenticeRate(t, "junior", 1, y)!.hourly),
);
const TITLE = "Apprentice Pay Rates & Wages 2026-27: 1st to 4th Year by Trade";
const DESCRIPTION = `1st year apprentice wages run from ${formatAUD(Math.min(...FIRST_YEAR_HOURLY), 2)} to ${formatAUD(Math.max(...FIRST_YEAR_HOURLY), 2)} an hour from 1 July 2026 and rise each year to 4th year. Rates for all ${APPRENTICE_TRADES.length} trades, with a wages calculator.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Apprentice Pay Rates in Australia, by Trade and Year (2026-27)",
  crumbs: [{ name: "Award Rates", path: "/award-rates/" }, { name: "Apprentice Pay Rates", path: `/${SLUG}/` }],
  faqs: APPRENTICE_PAY_FAQS,
  app: { name: "Apprentice Wages Calculator", description: "Shows the award minimum hourly, weekly and annual wage for an apprentice by trade, year and Year 12 completion, compares it with your payslip rate and estimates take-home pay." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <ApprenticePayRatesPage />
    </>
  );
}

export default withPageEnd(Page, "/apprentice-pay-rates/");
