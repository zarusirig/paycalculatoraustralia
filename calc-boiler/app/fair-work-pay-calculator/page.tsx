import type { Metadata } from "next";
import FairWorkPayCalculatorPage from "@/modules/guide/fair-work-pay-calculator";
import { FAIR_WORK_PAY_CALCULATOR_FAQS } from "@/modules/guide/fair-work-pay-calculator-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { NMW } from "@/lib/constants/minimum-wage";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import { withFeaturedImage } from "@/lib/featured-image";

const SLUG = "fair-work-pay-calculator";
const TITLE = `Fair Work Pay Calculator (PACT) ${SITE_CONFIG.financialYear} - How It Works & Rates`;
const DESCRIPTION = `How the Fair Work pay calculator (PACT) works, the ${SITE_CONFIG.financialYear} award base rates for ${AWARD_DIRECTORY.length} awards from ${formatAUD(NMW.hourly, 2)} an hour, and a checker for your own payslip rate.`;

// Meta pass 23 Oct 2026: "pact calculator" is 2,224 impr/28d at pos 3.8 with
// 0.2% CTR, plus "pact pay calculator" (405). Searchers type "PACT" first, so
// the meta title leads with it; the description says what PACT is before what
// this page adds. TITLE/DESCRIPTION above still feed the JSON-LD unchanged.
const META_TITLE = `PACT Pay Calculator ${SITE_CONFIG.financialYear}: How Fair Work's Tool Works + Rates`;
const META_DESCRIPTION = `PACT is the Fair Work Ombudsman's free pay calculator. See how to use it, the ${SITE_CONFIG.financialYear} base rates for ${AWARD_DIRECTORY.length} awards from ${formatAUD(NMW.hourly, 2)} an hour, and check your payslip rate.`;

export const metadata: Metadata = withFeaturedImage({
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.baseUrl}/${SLUG}/` },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: `${SITE_CONFIG.baseUrl}/${SLUG}/`, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: `Fair Work Pay Calculator (PACT) ${SITE_CONFIG.financialYear}: How It Works and the Rates Behind It`,
  crumbs: [{ name: "Award Rates", path: "/award-rates/" }, { name: "Fair Work Pay Calculator", path: `/${SLUG}/` }],
  faqs: FAIR_WORK_PAY_CALCULATOR_FAQS,
  app: { name: "Award Floor Checker", description: "Compares the base hourly rate on a payslip or agreement with the modern award base rate for the same classification from 1 July 2026." },
  published: "2026-09-25",
});

function Page() {
  return (
    <>
      {jsonLd}
      <FairWorkPayCalculatorPage />
    </>
  );
}

export default withPageEnd(Page, "/fair-work-pay-calculator/");
