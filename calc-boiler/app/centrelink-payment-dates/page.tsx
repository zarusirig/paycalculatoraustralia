import type { Metadata } from "next";
import CentrelinkPaymentDatesPage from "@/modules/guide/centrelink-payment-dates";
import { CENTRELINK_DATES_FAQS } from "@/modules/guide/centrelink-payment-dates-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { CHRISTMAS_2026_27_PUBLISHED } from "@/lib/constants/centrelink-payment-dates";

// DataForSEO AU, 24 Sep 2026: "centrelink christmas payment dates" 14,800/mo
// (almost all in December: 165,000 in Dec 2025), "centrelink reporting dates"
// 2,400 (27,100 in Dec 2025), "centrelink payment dates for pensioners" 1,900
// (14,800 in Dec 2025), "centrelink christmas payment dates 2025" 1,300,
// "centrelink payment dates" 320. Only official Services Australia dates:
// the 2026 tables aren't published yet — see the REFRESH note in
// lib/constants/centrelink-payment-dates.ts. When they are, update TITLE too.

const SLUG = "centrelink-payment-dates";
const TITLE = CHRISTMAS_2026_27_PUBLISHED
  ? "Centrelink Christmas Payment Dates 2026 & Reporting Dates"
  : "Centrelink Payment Dates: Christmas 2026 & Reporting Dates";
const DESCRIPTION =
  "Centrelink payment dates: how payment and reporting dates work, when the Christmas 2026 dates are published, last year's holiday tables, and your next dates.";

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
  headline: "Centrelink Payment Dates and Christmas 2026 Changes",
  published: "2026-09-24",
  crumbs: [{ name: "Centrelink Income Test", path: "/centrelink-income-test/" }, { name: "Centrelink Payment Dates", path: `/${SLUG}/` }],
  faqs: CENTRELINK_DATES_FAQS,
  app: { name: "Centrelink Payment Date Tool", description: "Lists your next 12 fortnightly Centrelink payment or reporting dates from one known date and flags those on public holidays or over Christmas." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <CentrelinkPaymentDatesPage />
    </>
  );
}
