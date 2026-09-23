import type { Metadata } from "next";
import CentsPerKmPage from "@/modules/guide/cents-per-km";
import { CENTS_PER_KM_FAQS } from "@/modules/guide/cents-per-km-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { formatAUD } from "@/lib/constants";
import { CPK_KM_CAP, CURRENT_CPK_RATE, CURRENT_CPK_YEAR, PREVIOUS_CPK_RATE } from "@/lib/constants/cents-per-km";

const SLUG = "cents-per-km";
const c = (d: number) => `${Math.round(d * 100)}c`;
const TITLE = `Cents per km ${CURRENT_CPK_YEAR}: ATO Rate ${c(CURRENT_CPK_RATE)} + Calculator`;
const DESCRIPTION = `The ATO cents per km rate is ${c(CURRENT_CPK_RATE)} for ${CURRENT_CPK_YEAR} (${c(PREVIOUS_CPK_RATE)} for 2025-26), capped at ${CPK_KM_CAP.toLocaleString("en-AU")} km per car: up to ${formatAUD(CURRENT_CPK_RATE * CPK_KM_CAP)}. Rates by year, car allowance withholding on your payslip, award per-km allowances and a calculator.`;

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
  headline: `Cents per km ${CURRENT_CPK_YEAR}: ${c(CURRENT_CPK_RATE)} ATO Rate and Calculator`,
  crumbs: [{ name: "Tax Deductions", path: "/tax-deductions-guide/" }, { name: "Cents per km", path: `/${SLUG}/` }],
  faqs: CENTS_PER_KM_FAQS,
  app: { name: "Cents per Kilometre Calculator", description: "Car expense deduction at the ATO cents per km rate with the 5,000 km cap, and the withholding split of a per-km car allowance." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <CentsPerKmPage />
    </>
  );
}
