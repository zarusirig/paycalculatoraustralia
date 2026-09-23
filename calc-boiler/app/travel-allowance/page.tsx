import type { Metadata } from "next";
import TravelAllowancePage from "@/modules/guide/travel-allowance";
import { TRAVEL_ALLOWANCE_FAQS } from "@/modules/guide/travel-allowance-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { formatAUD } from "@/lib/constants";
import { OVERTIME_MEAL_REASONABLE, PUBLISHED_DAILY_TOTALS, TD_2026_4 } from "@/lib/constants/travel-allowance";

const SLUG = "travel-allowance";
const TITLE = `Travel Allowance ${TD_2026_4.incomeYear}: ATO Reasonable Amounts + Calculator`;
const DESCRIPTION = `ATO reasonable travel allowance amounts for ${TD_2026_4.incomeYear} (${TD_2026_4.id}): ${formatAUD(PUBLISHED_DAILY_TOTALS[1].Sydney!, 2)} a day in Sydney, every capital, 117 country centres and overseas. Overtime meal ${formatAUD(OVERTIME_MEAL_REASONABLE)}.`;

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
  headline: `Travel Allowance ${TD_2026_4.incomeYear}: ATO Reasonable Amounts`,
  crumbs: [{ name: "Your Payslip", path: "/understanding-your-payslip/" }, { name: "Travel Allowance", path: `/${SLUG}/` }],
  faqs: TRAVEL_ALLOWANCE_FAQS,
  app: { name: "ATO Reasonable Travel Allowance Calculator", description: `Daily and trip reasonable amounts for accommodation, meals and incidentals under ${TD_2026_4.id}, by salary band and destination, and the part of an allowance subject to withholding.` },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <TravelAllowancePage />
    </>
  );
}
