import type { Metadata } from "next";
import OteSalaryPage from "@/modules/guide/ote-salary";
import { OTE_SALARY_FAQS } from "@/modules/guide/ote-salary-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// G3 (wave 4, 24 Sep 2026). Targets: ote meaning salary 3.6k, ote definition
// salary 3.6k, what is ote 1.3k, what does ote mean in salary 720, ote salary
// 480 — all KD 0 (DataForSEO, AU).

const SLUG = "ote-salary";
const TITLE = "OTE Salary Meaning: On-Target Earnings + Calculator";
const DESCRIPTION =
  "OTE means on-target earnings: base salary plus commission at 100% of target. See what an OTE offer pays above and below target, the 12% super on commission, take-home pay, and why commission doesn't count for the $190,100 high income threshold.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "OTE Salary Meaning: On-Target Earnings Explained, with Calculator",
  crumbs: [{ name: "Commission", path: "/commission-tax-calculator/" }, { name: "OTE Salary", path: `/${SLUG}/` }],
  faqs: OTE_SALARY_FAQS,
  app: { name: "OTE Salary Calculator", description: "Splits an on-target earnings offer into base and variable pay, shows earnings, super and take-home pay at any target attainment, and applies the Fair Work high income threshold to the base." },
  published: "2026-09-24",
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <OteSalaryPage />
    </>
  );
}
