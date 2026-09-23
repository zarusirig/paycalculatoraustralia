import CentrelinkDebtPage from "@/modules/calculator/centrelink-debt";
import { DEBT_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { CARER_SUPPORT_SOURCES, RESOLUTION_SCHEME } from "@/lib/constants/centrelink-carer-and-support";

const SLUG = "centrelink-debt";
const TITLE = "Centrelink Debt 2026 — Overpayment Refunds & Apportionment Scheme";
const DESCRIPTION = `Why Centrelink debts are in the news: refunds for people who overpaid a debt, the Income Apportionment Resolution Scheme (up to $600 per debt, apply by ${RESOLUTION_SCHEME.closes}) and the $475m robodebt settlement. Plus how income reporting creates an overpayment, and your repayment options.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Centrelink Debt", description: DESCRIPTION, faqs: DEBT_FAQS, calculator: false, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CentrelinkDebtPage />
    </>
  );
}
