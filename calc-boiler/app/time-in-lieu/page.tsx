import type { Metadata } from "next";
import TimeInLieuPage from "@/modules/guide/time-in-lieu";
import { TIME_IN_LIEU_FAQS } from "@/modules/guide/time-in-lieu-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";

const SLUG = "time-in-lieu";
const TITLE = "Time in Lieu (TOIL) Australia: Award Rules + Calculator";
const DESCRIPTION =
  "Time in lieu is paid time off instead of overtime pay. It isn't in the NES, so your award must allow it: hour for hour under Clerks, time and a half under Retail.";

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
  headline: "Time in Lieu (TOIL): Rules, Rates and Calculator",
  crumbs: [{ name: "Overtime & Penalty Rates", path: "/overtime-penalty-rates-guide/" }, { name: "Time in Lieu", path: `/${SLUG}/` }],
  faqs: TIME_IN_LIEU_FAQS,
  app: { name: "TOIL vs Overtime Pay Calculator", description: "Converts overtime hours into time off in lieu under hour-for-hour and overtime-rate award clauses, and compares it with overtime pay." },
});

function Page() {
  return (
    <>
      {jsonLd}
      <TimeInLieuPage />
    </>
  );
}

export default withPageEnd(Page, "/time-in-lieu/");
