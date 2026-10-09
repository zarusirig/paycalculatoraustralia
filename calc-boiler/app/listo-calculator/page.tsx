import type { Metadata } from "next";
import ListoCalculatorPage from "@/modules/guide/listo-calculator";
import { LISTO_FAQS } from "@/modules/guide/listo-calculator-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { LISTO_2027_28, LISTO_CURRENT } from "@/lib/constants/listo";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026. Targets: listo 880, low income super tax offset 590, lmito 110
// (DataForSEO, AU; Oct 2025 peak 2,400).

const SLUG = "listo-calculator";
const URL = `${SITE_CONFIG.baseUrl}/${SLUG}/`;
const TITLE = "LISTO Calculator: Low Income Super Tax Offset 2026-27";
const DESCRIPTION = `LISTO refunds the 15% tax on your super contributions: up to ${formatAUD(LISTO_CURRENT.maxPayment)} at ${formatAUD(LISTO_CURRENT.incomeThreshold)} income, rising to ${formatAUD(LISTO_2027_28.maxPayment)} at ${formatAUD(LISTO_2027_28.incomeThreshold)} from 1 July 2027. Check your payment.`;

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
  headline: "LISTO Calculator: Low Income Super Tax Offset 2026-27 and 2027",
  crumbs: [{ name: "Superannuation", path: "/superannuation-guide/" }, { name: "LISTO Calculator", path: `/${SLUG}/` }],
  faqs: LISTO_FAQS,
  app: { name: "LISTO Calculator", description: "Estimates the low income super tax offset: 15% of concessional super contributions up to $500 today, and up to $810 from 1 July 2027." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <ListoCalculatorPage />
    </>
  );
}

export default withPageEnd(Page, "/listo-calculator/");
