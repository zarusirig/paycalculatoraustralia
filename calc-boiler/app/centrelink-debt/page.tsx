import CentrelinkDebtPage from "@/modules/calculator/centrelink-debt";
import WhatsNextInline from "@/components/common/whats-next-inline";
import CentrelinkDebtContent, { CentrelinkDebtIntro } from "@/modules/calculator/centrelink-debt-content";
import { DEBT_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { CARER_SUPPORT_SOURCES, RESOLUTION_SCHEME } from "@/lib/constants/centrelink-carer-and-support";
import { withPageEnd } from "@/components/common/content-slots";

const SLUG = "centrelink-debt";
const TITLE = "Centrelink Debt 2026 — Overpayment Refunds & Apportionment Scheme";
const DESCRIPTION = `Centrelink debt: Income Apportionment Resolution Scheme refunds of up to $600 per debt (apply by ${RESOLUTION_SCHEME.closes}), the $475m robodebt settlement and repayments.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Centrelink Debt", description: DESCRIPTION, faqs: DEBT_FAQS, calculator: false, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CentrelinkDebtPage intro={<CentrelinkDebtIntro />} afterCalculator={<WhatsNextInline route="/centrelink-debt/" />}><CentrelinkDebtContent /></CentrelinkDebtPage>
    </>
  );
}

export default withPageEnd(Page, "/centrelink-debt/");
