import type { Metadata } from "next";
import SickLeavePage from "@/modules/guide/sick-leave";
import { SICK_LEAVE_FAQS } from "@/modules/guide/sick-leave-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

// G3 (wave 4, 24 Sep 2026). Targets: sick leave 8.1k, carer leave 5.4k,
// personal leave 2.9k, personal/carer's leave 1k, sick leave calculator 720,
// sick leave calculator 38-hour week 590 (DataForSEO, AU).

const SLUG = "sick-leave-calculator";
const TITLE = "Sick Leave Calculator Australia: Personal & Carer's Leave";
const DESCRIPTION =
  "How much sick leave you get: 10 days a year full-time (76 hours on a 38-hour week), pro rata part-time, 1/26 of ordinary hours. Calculate your personal/carer's leave balance. Casuals, medical certificates, payout rules — Fair Work sources.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Sick Leave Calculator: Personal/Carer's Leave in Australia",
  crumbs: [{ name: "Leave", path: "/annual-leave-guide/" }, { name: "Sick Leave Calculator", path: `/${SLUG}/` }],
  faqs: SICK_LEAVE_FAQS,
  app: { name: "Sick Leave Calculator", description: "Calculates paid sick and carer's leave accrued under the National Employment Standards (1/26 of ordinary hours), the balance after leave taken, and its value at the base rate." },
  published: "2026-09-24",
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <SickLeavePage />
    </>
  );
}
