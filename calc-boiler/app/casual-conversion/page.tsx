import type { Metadata } from "next";
import CasualConversionPage from "@/modules/guide/casual-conversion";
import { CASUAL_CONVERSION_FAQS } from "@/modules/guide/casual-conversion-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Oct core batch (5 Oct 2026): "casual conversion". A guide to the employee
// choice pathway, with the pay trade-off, linking /casual-loading-calculator/.

const SLUG = "casual-conversion";
const TITLE = "Casual Conversion Australia: Becoming Permanent & Your Pay";
const DESCRIPTION =
  "Casual conversion in Australia: the 6 and 12 month employee choice pathway, 21-day employer response, reasons to refuse, and what happens to your 25% loading.";

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
  headline: "Casual Conversion in Australia: How to Become Permanent and What It Does to Your Pay",
  crumbs: [{ name: "Employment Types", path: "/full-time-vs-part-time-vs-casual/" }, { name: "Casual Conversion", path: `/${SLUG}/` }],
  faqs: CASUAL_CONVERSION_FAQS,
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <CasualConversionPage />
    </>
  );
}

export default withPageEnd(Page, "/casual-conversion/");
