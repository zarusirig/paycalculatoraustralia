import type { Metadata } from "next";
import RideshareDeliveryAfterTaxPage from "@/modules/guide/rideshare-delivery-earnings-after-tax";
import { RIDESHARE_AFTER_TAX_FAQS } from "@/modules/guide/rideshare-delivery-earnings-after-tax-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026 trending set, item 15 (spillover from the delivery minimum). Passes
// the audience border only as a contractor tax and GST calculator: no income
// claims. Target: uber driver earnings after tax (DataForSEO, AU, Oct 2026).

const SLUG = "rideshare-delivery-earnings-after-tax";
const TITLE = "Uber & Delivery Driver Earnings After Tax: ABN & GST Guide";
const DESCRIPTION =
  "Rideshare and delivery payments have no tax withheld. Work out GST, income tax and what to set aside on your own figures. ABN, GST and deductions explained.";

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
  headline: "Rideshare & Delivery Earnings After Tax in Australia",
  crumbs: [{ name: "Gig Economy", path: "/gig-economy-pay-guide/" }, { name: "Rideshare & Delivery Earnings After Tax", path: `/${SLUG}/` }],
  faqs: RIDESHARE_AFTER_TAX_FAQS,
  app: { name: "Rideshare & Delivery Tax Calculator", description: "Works out GST, income tax, Medicare levy and the amount to set aside from your own annual rideshare or delivery payments and expenses." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <RideshareDeliveryAfterTaxPage />
    </>
  );
}

export default withPageEnd(Page, "/rideshare-delivery-earnings-after-tax/");
