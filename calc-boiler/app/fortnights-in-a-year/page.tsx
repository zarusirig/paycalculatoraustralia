import type { Metadata } from "next";
import PayPeriodsPage from "@/modules/guide/pay-periods";
import { PAY_PERIODS_FAQS } from "@/modules/guide/pay-periods-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// P11 (docs/seo/2026-08-28-gsc-query-network-traffic-opportunities.md).
// DataForSEO AU, 24 Sep 2026: "how many fortnights in a year" 22,200/mo,
// "how many weeks in a year" 74,000, "how many weeks in a financial year" 260,
// "how many fortnights in a financial year" 140; "27 pay periods" and "pay
// periods 2026" have no measurable volume. The AU SERP for the head query is
// won by pages whose URL and H1 are the question (fosmore, alltechpayroll's
// 27-fortnights page), so the slug is the query rather than /pay-periods-2026-27/.
// The fortnightly calculator's #fortnights-in-a-year section stays short and
// links here.

const SLUG = "fortnights-in-a-year";
const TITLE = "How Many Fortnights in a Year? 26 or 27 Pays in 2026-27";
const DESCRIPTION =
  "There are 26 fortnights in a year plus a day, so usually 26 fortnightly pays, 52 weekly and 12 monthly. See when 2026-27 has 27 fortnightly or 53 weekly pay days, every pay date for your cycle, and the ATO's extra withholding.";

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
  headline: "How Many Fortnights in a Year?",
  published: "2026-09-24",
  crumbs: [{ name: "Fortnightly Pay Calculator", path: "/fortnightly-pay-calculator/" }, { name: "Fortnights in a Year", path: `/${SLUG}/` }],
  faqs: PAY_PERIODS_FAQS,
  app: { name: "Pay Date Calculator", description: "Lists every weekly, fortnightly or monthly pay day in a financial year from one known pay date, and flags 27-fortnight and 53-week pay years." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <PayPeriodsPage />
    </>
  );
}
