import type { Metadata } from "next";
import DeliveryDriverPayRatePage from "@/modules/guide/delivery-driver-pay-rate";
import { DELIVERY_DRIVER_FAQS } from "@/modules/guide/delivery-driver-pay-rate-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Oct 2026 trending set, item 1. The first FWC Minimum Standards Order
// (on-demand delivery) started 17 August 2026. Targets: delivery driver pay
// rate, doordash pay, uber eats pay (DataForSEO, AU, Oct 2026).

const SLUG = "delivery-driver-pay-rate";
const TITLE = "Delivery Driver Pay Rate Australia: $31.30/hr Minimum (2026)";
const DESCRIPTION =
  "On-demand delivery workers have a legal pay floor from 17 Aug 2026: $31.30/hr on a bike, $31.50 motorbike, $32 car, before expenses. Check your payout, free.";

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
  headline: "Delivery Driver Pay Rate in Australia: the $31.30 an Hour Minimum",
  crumbs: [{ name: "Gig Economy", path: "/gig-economy-pay-guide/" }, { name: "Delivery Driver Pay Rate", path: `/${SLUG}/` }],
  faqs: DELIVERY_DRIVER_FAQS,
  app: { name: "Delivery Pay vs Legal Minimum Calculator", description: "Compares what a delivery platform paid you for an earnings period with the Fair Work Commission's minimum hourly rate for your engaged time, works out any top-up and estimates what is left after costs and tax." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <DeliveryDriverPayRatePage />
    </>
  );
}

export default withPageEnd(Page, "/delivery-driver-pay-rate/");
