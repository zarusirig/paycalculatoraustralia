import CentrelinkCrisisPaymentPage from "@/modules/calculator/centrelink-crisis-payment";
import { CRISIS_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CARER_SUPPORT_SOURCES, crisisPaymentAmount } from "@/lib/constants/centrelink-carer-and-support";
import { JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { withPageEnd } from "@/components/common/content-slots";

const SLUG = "centrelink-crisis-payment";
const TITLE = "Centrelink Crisis Payment 2026: Eligibility, Amount, How to Claim";
const DESCRIPTION = `Crisis Payment is one week of your payment's maximum basic rate: ${formatAUD(crisisPaymentAmount(JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single), 2)} on single JobSeeker. Who qualifies, the 7-day contact rule and how to claim.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Centrelink Crisis Payment", description: DESCRIPTION, faqs: CRISIS_FAQS, calculator: false, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CentrelinkCrisisPaymentPage />
    </>
  );
}

export default withPageEnd(Page, "/centrelink-crisis-payment/");
