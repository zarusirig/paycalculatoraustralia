import CarerPaymentCalculatorPage from "@/modules/calculator/carer-payment-calculator";
import { CARER_PAYMENT_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CARER_PAYMENT, CARER_PAYMENT_RATES, CARER_SUPPORT_SOURCES } from "@/lib/constants/centrelink-carer-and-support";

const SLUG = "carer-payment-calculator";
const TITLE = "Carer Payment Calculator 2026 — Centrelink Rates & Income Test";
const DESCRIPTION = `Carer Payment is ${formatAUD(CARER_PAYMENT_RATES.maxFortnightly.single.total, 2)} a fortnight single, ${formatAUD(CARER_PAYMENT_RATES.maxFortnightly.coupleEach.total, 2)} each for couples from ${CARER_PAYMENT.ratesFrom}. Calculate what you keep when you work: the pension income test, the ${CARER_PAYMENT.workHoursLimit}-hours-in-4-weeks rule and the assets limits, verified at Services Australia.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Carer Payment Calculator", description: DESCRIPTION, faqs: CARER_PAYMENT_FAQS, calculator: true, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CarerPaymentCalculatorPage />
    </>
  );
}
