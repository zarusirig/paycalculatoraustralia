import type { Metadata } from "next";
import CentrelinkPaymentRatesPage from "@/modules/guide/centrelink-payment-rates";
import { CENTRELINK_PAYMENT_RATES_FAQS } from "@/modules/guide/centrelink-payment-rates-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";

// J6 (wave 4, 24 Sep 2026). Targets: centrelink payment rates 2.9k (KD 14),
// how much is jobseeker payment 2.9k, centrelink rates 140 (DataForSEO, AU).

const SLUG = "centrelink-payment-rates";
const TITLE = "Centrelink Payment Rates from 20 September 2026 (All Payments)";
const DESCRIPTION =
  "Every Centrelink payment rate from 20 September 2026: JobSeeker, Youth Allowance, Austudy, Age Pension, DSP, Carer, Parenting Payment, FTB, Rent Assistance, deeming.";
const URL = `https://pay-calculator-australia.com/${SLUG}/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Centrelink Payment Rates from 20 September 2026",
  crumbs: [{ name: "Centrelink", path: "/centrelink-income-test/" }, { name: "Centrelink Payment Rates", path: `/${SLUG}/` }],
  faqs: CENTRELINK_PAYMENT_RATES_FAQS,
  published: "2026-09-24",
});

function Page() {
  return (
    <>
      {jsonLd}
      <CentrelinkPaymentRatesPage />
    </>
  );
}

export default withPageEnd(Page, "/centrelink-payment-rates/");
