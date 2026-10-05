import type { Metadata } from "next";
import AnnualLeavePage from "@/modules/guide/annual-leave-calculator";
import { ANNUAL_LEAVE_CALCULATOR_FAQS } from "@/modules/guide/annual-leave-calculator-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Oct core batch (5 Oct 2026): head term "annual leave calculator". Owns the
// accrual / balance intent. /leave-calculator/ was retargeted to the payout
// intent at the same time so the two do not compete for the same query.

const SLUG = "annual-leave-calculator";
const TITLE = "Annual Leave Calculator Australia: Hours, Balance & Payout";
const DESCRIPTION =
  "Annual leave calculator: 4 weeks a year (152 hours on a 38-hour week), accrual per pay, your balance, 17.5% loading and tax on a payout. Fair Work NES rules.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Annual Leave Calculator Australia: Hours, Balance and Payout",
  crumbs: [{ name: "Leave", path: "/annual-leave-guide/" }, { name: "Annual Leave Calculator", path: `/${SLUG}/` }],
  faqs: ANNUAL_LEAVE_CALCULATOR_FAQS,
  app: { name: "Annual Leave Calculator", description: "Calculates annual leave accrued under the National Employment Standards (4 weeks a year on ordinary hours), the balance after leave taken, its value with optional 17.5% loading, and the tax if it is paid out on leaving." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <AnnualLeavePage />
    </>
  );
}

export default withPageEnd(Page, "/annual-leave-calculator/");
