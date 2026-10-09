import type { Metadata } from "next";
import GraduateSalaryAustraliaPage from "@/modules/guide/graduate-salary-australia";
import { GRADUATE_SALARY_FAQS } from "@/modules/guide/graduate-salary-australia-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026 trending set, item 7. Graduate lawyer / nurse / engineer /
// accountant / teacher / intern doctor, from official sources only (QILT GOS
// 2025, awards, state agreements). See lib/data/graduate-salary.

const SLUG = "graduate-salary-australia";
const TITLE = "Graduate Salary Australia 2026: Law, Nursing, Engineering & More";
const DESCRIPTION =
  "Graduate salaries by field from official sources: QILT survey medians, award and state agreement starting rates, plus first-payslip take-home and HELP repayments.";

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
  headline: "Graduate Salary in Australia: Law, Nursing, Engineering, Accounting, Teaching & Medicine",
  crumbs: [{ name: "First Job", path: "/first-job-pay-guide/" }, { name: "Graduate Salary", path: `/${SLUG}/` }],
  faqs: GRADUATE_SALARY_FAQS,
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <GraduateSalaryAustraliaPage />
    </>
  );
}

export default withPageEnd(Page, "/graduate-salary-australia/");
