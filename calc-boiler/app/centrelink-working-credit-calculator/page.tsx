import type { Metadata } from "next";
import WorkingCreditPage from "@/modules/guide/working-credit";
import { WORKING_CREDIT_FAQS } from "@/modules/guide/working-credit-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { WORKING_CREDIT } from "@/lib/constants/working-credit";

const SLUG = "centrelink-working-credit-calculator";
const TITLE = "Centrelink Working Credit Calculator (2026)";
const DESCRIPTION = `Working Credit builds up to ${WORKING_CREDIT.maxPerFortnight} credits a fortnight while your income is under $${WORKING_CREDIT.accrualThreshold}, to a maximum of ${WORKING_CREDIT.maxBalance.toLocaleString("en-AU")} (${WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker.toLocaleString("en-AU")} for Youth Allowance job seekers). See how credits keep JobSeeker paying when you start work.`;

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
  headline: "Centrelink Working Credit Calculator",
  crumbs: [{ name: "Centrelink Income Test", path: "/centrelink-income-test/" }, { name: "Working Credit Calculator", path: `/${SLUG}/` }],
  faqs: WORKING_CREDIT_FAQS,
  app: { name: "Centrelink Working Credit Calculator", description: "Builds a Working Credit balance from fortnightly income and projects how the credits offset employment income and keep JobSeeker Payment paying." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <WorkingCreditPage />
    </>
  );
}
