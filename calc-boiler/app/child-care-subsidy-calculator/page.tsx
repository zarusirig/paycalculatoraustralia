import ChildCareSubsidyCalculatorPage from "@/modules/calculator/child-care-subsidy-calculator";
import { CCS_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CCS, CCS_SOURCES } from "@/lib/constants/child-care-subsidy";

const SLUG = "child-care-subsidy-calculator";
const TITLE = "Child Care Subsidy Calculator 2026-27 — CCS % & Gap Fee";
const DESCRIPTION = `CCS is ${CCS.standard.maxPercent}% on family income up to ${formatAUD(CCS.standard.lowerThreshold)} in ${CCS.financialYear}, falling 1% per ${formatAUD(CCS.standard.step)} to 0% at ${formatAUD(CCS.standard.cutOut)}; up to ${CCS.higher.maxPercent}% for younger siblings. Enter both parents' pay and your fees to see your subsidy, hourly caps, the ${CCS.hours.guaranteed}-hour 3 Day Guarantee and your gap fee.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Child Care Subsidy Calculator", description: DESCRIPTION, faqs: CCS_FAQS, calculator: true, dateModified: CCS_SOURCES.verifiedOnISO })} />
      <ChildCareSubsidyCalculatorPage />
    </>
  );
}
