import CentrelinkAdvancePaymentPage from "@/modules/calculator/centrelink-advance-payment";
import { ADVANCE_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { ADVANCE_LIMITS, CARER_SUPPORT_SOURCES } from "@/lib/constants/centrelink-carer-and-support";
import { withPageEnd } from "@/components/common/content-slots";

const SLUG = "centrelink-advance-payment";
const TITLE = "Centrelink Advance Payment 2026 — Amounts & Repayment Calculator";
const DESCRIPTION = `Centrelink advance payment: ${formatAUD(250)} to ${formatAUD(500)} on JobSeeker, Parenting Payment and Youth Allowance, up to ${formatAUD(ADVANCE_LIMITS.pensionSingle.max, 2)} on a pension, repaid over 13 fortnights.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Centrelink Advance Payment Calculator", description: DESCRIPTION, faqs: ADVANCE_FAQS, calculator: true, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CentrelinkAdvancePaymentPage />
    </>
  );
}

export default withPageEnd(Page, "/centrelink-advance-payment/");
