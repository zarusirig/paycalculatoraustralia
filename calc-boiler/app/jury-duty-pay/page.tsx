import type { Metadata } from "next";
import JuryDutyPayPage from "@/modules/guide/jury-duty-pay";
import { JURY_DUTY_PAY_FAQS } from "@/modules/guide/jury-duty-pay-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// G3 (wave 4, 24 Sep 2026). Targets: jury duty pay 1.3k (KD 0), community
// service leave 390 (DataForSEO, AU).

const SLUG = "jury-duty-pay";
const TITLE = "Jury Duty Pay Australia: Make-Up Pay Calculator";
const DESCRIPTION =
  "Employers pay full-time and part-time staff for the first 10 days of jury duty: base pay, or make-up pay minus the court payment. Calculator with Fair Work examples.";

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
  headline: "Jury Duty Pay in Australia: What Your Employer and the Court Pay",
  crumbs: [{ name: "Leave", path: "/annual-leave-guide/" }, { name: "Jury Duty Pay", path: `/${SLUG}/` }],
  faqs: JURY_DUTY_PAY_FAQS,
  app: { name: "Jury Duty Pay Calculator", description: "Works out employer jury duty pay or make-up pay for the first 10 days under the National Employment Standards, plus the court's daily payment." },
  published: "2026-09-24",
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <JuryDutyPayPage />
    </>
  );
}
