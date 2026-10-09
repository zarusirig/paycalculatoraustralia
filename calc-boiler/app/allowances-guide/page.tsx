import type { Metadata } from "next";
import AllowancesGuidePage from "@/modules/guide/allowances-guide";
import { ALLOWANCES_GUIDE_FAQS } from "@/modules/guide/allowances-guide-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct core batch (5 Oct 2026): "allowances" / "first aid allowance" / "laundry
// allowance" / "split shift allowance". Amounts are read from the award
// transcriptions in lib/data/job-pay-rates/; nothing is typed in the page.

const SLUG = "allowances-guide";
const TITLE = "Award Allowances: First Aid, Laundry, Tool & Split Shift";
const DESCRIPTION =
  "Current award allowance amounts: first aid, laundry and uniform, tool, split or broken shift and on-call, by award with clause numbers, and how they are taxed.";

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
  headline: "Award Allowances Guide: First Aid, Laundry, Tool, Split Shift and On-Call Rates",
  crumbs: [{ name: "Payslip", path: "/understanding-your-payslip/" }, { name: "Allowances Guide", path: `/${SLUG}/` }],
  faqs: ALLOWANCES_GUIDE_FAQS,
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <AllowancesGuidePage />
    </>
  );
}

export default withPageEnd(Page, "/allowances-guide/");
