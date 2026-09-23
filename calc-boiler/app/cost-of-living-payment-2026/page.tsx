import CostOfLivingPayment2026Page from "@/modules/calculator/cost-of-living-payment-2026";
import { COL_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { CARER_SUPPORT_SOURCES, COST_OF_LIVING_FACTS } from "@/lib/constants/centrelink-carer-and-support";

const SLUG = "cost-of-living-payment-2026";
const TITLE = "Cost of Living Payment 2026 — Is There One? (Checked Sep 2026)";
const DESCRIPTION = `No Commonwealth cost of living payment exists in 2026: it stopped from ${COST_OF_LIVING_FACTS.cwthCostOfLivingPaymentEnded}. What you can get instead: 20 September 2026 increases and Rent Assistance.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Is There a Cost of Living Payment in 2026?", description: DESCRIPTION, faqs: COL_FAQS, calculator: false, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CostOfLivingPayment2026Page />
    </>
  );
}
