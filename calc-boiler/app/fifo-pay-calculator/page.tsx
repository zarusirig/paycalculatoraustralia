import type { Metadata } from "next";
import FifoPayCalculatorPage from "@/modules/guide/fifo-pay-calculator";
import { FIFO_FAQS } from "@/modules/guide/fifo-pay-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// P9 (docs/seo/2026-08-28-gsc-query-network-traffic-opportunities.md).
// DataForSEO AU, 24 Sep 2026: "fifo pay calculator" 320/mo, "fifo salary
// calculator" 320, "fifo calculator" 110, "how much do fifo workers make" 110,
// "fifo roster calculator" 90, "average fifo salary" 90, "fifo wage
// calculator" 50. The guide (/mining-fifo-pay-guide/) was catching calculator
// intent; this node takes it and links back.

const SLUG = "fifo-pay-calculator";
const TITLE = "FIFO Pay Calculator: Roster, Overtime & Take-Home (2026-27)";
const DESCRIPTION =
  "Work out FIFO pay on a 2:1, 8:6, even-time or 4:1 roster: hourly rate, overtime, shift loadings and site allowances, then take-home after 2026-27 tax.";

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
  headline: "FIFO Pay Calculator",
  published: "2026-09-24",
  crumbs: [{ name: "Mining & FIFO Pay Guide", path: "/mining-fifo-pay-guide/" }, { name: "FIFO Pay Calculator", path: `/${SLUG}/` }],
  faqs: FIFO_FAQS,
  app: { name: "FIFO Pay Calculator", description: "Turns an hourly rate and FIFO roster into gross pay per swing and per year, with overtime, shift loadings and site allowances, and take-home pay after 2026-27 tax." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <FifoPayCalculatorPage />
    </>
  );
}
