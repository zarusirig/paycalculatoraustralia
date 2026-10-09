import type { Metadata } from "next";
import PilonPage from "@/modules/guide/payment-in-lieu-of-notice";
import { PILON_FAQS } from "@/modules/guide/payment-in-lieu-of-notice-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct core batch (5 Oct 2026): "payment in lieu of notice" / "notice period
// australia". The NES notice table and the tax and super treatment of PILON.
// The whole final pay stays on /final-pay-calculator/; ETP and redundancy tax
// are covered by /termination-payment-tax-calculator/ (built separately).

const SLUG = "payment-in-lieu-of-notice";
const TITLE = "Payment in Lieu of Notice Australia: Notice, Tax & Super";
const DESCRIPTION =
  "Payment in lieu of notice in Australia: NES notice periods (1 to 4 weeks, plus 1 if over 45), what the payment must include, ETP tax rates and super on top.";

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
  headline: "Payment in Lieu of Notice Australia: Notice Periods, Tax and Super",
  crumbs: [{ name: "Final Pay", path: "/final-pay-calculator/" }, { name: "Payment in Lieu of Notice", path: `/${SLUG}/` }],
  faqs: PILON_FAQS,
  app: { name: "Notice Period and Payment in Lieu Calculator", description: "Works out the minimum National Employment Standards notice period, the payment in lieu of notice, the super payable on it and an estimate of the employment termination payment tax." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <PilonPage />
    </>
  );
}

export default withPageEnd(Page, "/payment-in-lieu-of-notice/");
