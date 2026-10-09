import type { Metadata } from "next";
import NetPayPage from "@/modules/guide/net-pay-calculator";
import { NET_PAY_CALCULATOR_FAQS } from "@/modules/guide/net-pay-calculator-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG } from "@/lib/constants";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct core batch (5 Oct 2026): head term "net pay calculator". The hourly-rate
// view of net pay with a payslip layout and net pay per hour; the annual
// salary view stays on /take-home-pay-calculator/.

const SLUG = "net-pay-calculator";
const TITLE = `Net Pay Calculator Australia ${SITE_CONFIG.financialYear}: Hourly to Payslip`;
const DESCRIPTION =
  "Net pay calculator for Australia: enter your hourly rate and hours to see net pay each week, fortnight or month, line by line, and what each hour is worth after tax.";

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
  headline: `Net Pay Calculator Australia ${SITE_CONFIG.financialYear}: Hourly Rate to Payslip`,
  crumbs: [{ name: "Take-Home Pay", path: "/take-home-pay-calculator/" }, { name: "Net Pay Calculator", path: `/${SLUG}/` }],
  faqs: NET_PAY_CALCULATOR_FAQS,
  app: { name: "Net Pay Calculator", description: "Works out net pay each week, fortnight or month from an hourly rate and hours, with PAYG withholding, HELP and deductions shown as payslip lines, plus net pay per hour." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <NetPayPage />
    </>
  );
}

export default withPageEnd(Page, "/net-pay-calculator/");
