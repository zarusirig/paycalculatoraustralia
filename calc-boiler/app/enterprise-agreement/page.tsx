import type { Metadata } from "next";
import EnterpriseAgreementPage from "@/modules/guide/enterprise-agreement";
import { ENTERPRISE_AGREEMENT_FAQS } from "@/modules/guide/enterprise-agreement-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";

const SLUG = "enterprise-agreement";
const TITLE = "Enterprise Agreement (EBA) Search: How to Find Yours";
const DESCRIPTION =
  "What an enterprise agreement is, how to find yours in the Fair Work Commission's agreement search step by step, why an expired EBA still applies, and how EBA pay compares with the award floor. Coles, Woolworths and more.";

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
  headline: "Enterprise Agreements (EBAs): What They Are and How to Find Yours",
  crumbs: [{ name: "Awards & Agreements", path: "/award-rates/" }, { name: "Enterprise Agreements", path: `/${SLUG}/` }],
  faqs: ENTERPRISE_AGREEMENT_FAQS,
  app: { name: "Enterprise Agreement vs Award Rate Checker", description: "Compares an enterprise agreement base hourly rate with the modern award base rate for the same classification from 1 July 2026." },
});

export default function Page() {
  return (
    <>
      {jsonLd}
      <EnterpriseAgreementPage />
    </>
  );
}
