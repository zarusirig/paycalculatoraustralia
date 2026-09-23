import CarerAllowancePage from "@/modules/calculator/carer-allowance";
import { CARER_ALLOWANCE_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CARER_ALLOWANCE, CARER_SUPPORT_SOURCES } from "@/lib/constants/centrelink-carer-and-support";

const SLUG = "carer-allowance";
const TITLE = "Carer Allowance 2026 — Centrelink Rate, Income Limit & Work";
const DESCRIPTION = `Centrelink Carer Allowance is ${formatAUD(CARER_ALLOWANCE.fortnightly, 2)} a fortnight, not taxed, with a ${formatAUD(CARER_ALLOWANCE.incomeLimit)} combined income limit and no assets test. How it works with your wages and Carer Payment, plus the ${formatAUD(CARER_ALLOWANCE.carerSupplementAnnual)} Carer Supplement.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Carer Allowance", description: DESCRIPTION, faqs: CARER_ALLOWANCE_FAQS, calculator: true, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CarerAllowancePage />
    </>
  );
}
