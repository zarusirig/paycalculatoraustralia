import type { Metadata } from "next";
import EnterpriseAgreementPage from "@/modules/guide/enterprise-agreement";
import { ENTERPRISE_AGREEMENT_FAQS } from "@/modules/guide/enterprise-agreement-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const SLUG = "enterprise-agreement";
// Meta pass (23 Oct 2026): "eba lookup" (350 impressions) is the head query, ahead of
// "eba search" and "enterprise agreement search"; the description gives the answer first.
const TITLE = "EBA Lookup and Search: How to Find Your Enterprise Agreement";
const DESCRIPTION =
  "EBA lookup: search the employer name or ABN on your payslip in the Fair Work Commission's Document Search. Why an expired EBA still applies, and the award floor.";

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Enterprise Agreements (EBAs): What They Are and How to Find Yours",
  crumbs: [{ name: "Awards & Agreements", path: "/award-rates/" }, { name: "Enterprise Agreements", path: `/${SLUG}/` }],
  faqs: ENTERPRISE_AGREEMENT_FAQS,
  app: { name: "Enterprise Agreement vs Award Rate Checker", description: "Compares an enterprise agreement base hourly rate with the modern award base rate for the same classification from 1 July 2026." },
});

function Page() {
  return (
    <>
      {jsonLd}
      <EnterpriseAgreementPage />
    </>
  );
}

export default withPageEnd(Page, "/enterprise-agreement/");
