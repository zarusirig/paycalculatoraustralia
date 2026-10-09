import type { Metadata } from "next";
import ApprenticePayRatesPage from "@/modules/guide/apprentice-pay-rates";
import { APPRENTICE_PAY_FAQS } from "@/modules/guide/apprentice-pay-rates-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026 trending set, item 6. Apprentice pay rates, apprentice wages and the
// apprentice wages calculator share one SERP, so they are one page (no
// cannibalising twin route). Rates verified against the modern awards on
// 5 October 2026; see lib/data/apprentice-pay.

const SLUG = "apprentice-pay-rates";
const TITLE = "Apprentice Pay Rates Australia 2026-27 & Wages Calculator";
const DESCRIPTION =
  "Apprentice award minimums by trade and year from 1 July 2026: carpentry, plumbing, electrical, mechanic, hairdressing, cookery. Check your wage with the calculator.";

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
