import type { Metadata } from "next";
import TerminationPaymentTaxPage from "@/modules/guide/termination-payment-tax";
import { TERMINATION_TAX_FAQS } from "@/modules/guide/termination-payment-tax-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { REDUNDANCY_TAX_2026_27 as Y } from "@/lib/constants/redundancy";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026. Targets: redundancy tax 480, termination payment tax 260,
// lump sum tax 110, genuine redundancy tax free 70 (DataForSEO, AU; flat).
// The NES entitlement (weeks of pay) stays on /redundancy-pay-calculator/;
// this page owns the TAX on the payment, including the whole-of-income cap.

const SLUG = "termination-payment-tax-calculator";
const URL = `${SITE_CONFIG.baseUrl}/${SLUG}/`;
const TITLE = "Termination Payment Tax Calculator: Redundancy & ETP 2026-27";
const DESCRIPTION = `Tax on a redundancy or termination payment: tax-free up to ${formatAUD(Y.taxFreeBase)} + ${formatAUD(Y.taxFreePerYear)} per year of service, then 17% or 32% up to the ${formatAUD(Y.etpCap)} ETP cap. Calculate yours.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Termination Payment Tax Calculator: Redundancy and ETP Tax 2026-27",
  crumbs: [{ name: "Redundancy Pay", path: "/redundancy-pay-calculator/" }, { name: "Termination Payment Tax", path: `/${SLUG}/` }],
  faqs: TERMINATION_TAX_FAQS,
  app: { name: "Termination Payment Tax Calculator", description: "Works out tax on a genuine redundancy or other employment termination payment: the tax-free amount, the ETP cap, the whole-of-income cap and the rate by age." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <TerminationPaymentTaxPage />
    </>
  );
}

export default withPageEnd(Page, "/termination-payment-tax-calculator/");
