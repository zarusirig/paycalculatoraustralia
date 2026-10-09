import type { Metadata } from "next";
import HighestPayingJobsPage from "@/modules/guide/highest-paying-jobs-australia";
import { HIGHEST_PAYING_FAQS } from "@/modules/guide/highest-paying-jobs-australia-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG } from "@/lib/constants";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct core batch (5 Oct 2026): "highest paying jobs australia". Border-
// conditional: kept strictly payslip-shaped (median gross, tax, take-home) and
// used as a link hub into /job-pay-rates/{job}/ and /take-home-pay-on/{salary}/.
// No career advice.

const SLUG = "highest-paying-jobs-australia";
const TITLE = `Highest Paying Jobs Australia ${SITE_CONFIG.financialYear}: Median Pay & Take-Home`;
const DESCRIPTION =
  "Highest paying jobs in Australia ranked by median full-time weekly pay, with what each takes home after tax and a link to each job's award rates.";

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
  headline: `Highest Paying Jobs in Australia ${SITE_CONFIG.financialYear}: Median Pay and Take-Home`,
  crumbs: [{ name: "Pay Rates by Job", path: "/job-pay-rates/" }, { name: "Highest Paying Jobs", path: `/${SLUG}/` }],
  faqs: HIGHEST_PAYING_FAQS,
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <HighestPayingJobsPage />
    </>
  );
}

export default withPageEnd(Page, "/highest-paying-jobs-australia/");
