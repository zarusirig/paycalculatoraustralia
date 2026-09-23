import DisabilitySupportPensionCalculatorPage from "@/modules/calculator/disability-support-pension-calculator";
import { DSP_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { DSP, MEANS_TEST_SOURCES } from "@/lib/constants/centrelink-means-test";

const SLUG = "disability-support-pension-calculator";
const R = DSP.rates21Plus.maxFortnightly;
const TITLE = "Disability Support Pension Calculator 2026 — DSP Rates & Work";
const DESCRIPTION = `DSP is ${formatAUD(R.single.total, 2)} a fortnight single and ${formatAUD(R.coupleEach.total, 2)} each for couples from ${DSP.ratesFrom}. Work up to ${DSP.maxWorkHoursPerWeek} hours a week and keep it: calculate what your pay does to DSP under the income test, plus under-21 rates, cut-offs and assets limits.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Disability Support Pension Calculator", description: DESCRIPTION, faqs: DSP_FAQS, calculator: true, dateModified: MEANS_TEST_SOURCES.verifiedOnISO })} />
      <DisabilitySupportPensionCalculatorPage />
    </>
  );
}
