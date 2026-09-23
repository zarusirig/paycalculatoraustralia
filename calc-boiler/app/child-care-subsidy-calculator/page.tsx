import ChildCareSubsidyCalculatorPage from "@/modules/calculator/child-care-subsidy-calculator";
import { CCS_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CCS, CCS_SOURCES } from "@/lib/constants/child-care-subsidy";

const SLUG = "child-care-subsidy-calculator";
const TITLE = "Child Care Subsidy Calculator 2026-27 — CCS % & Gap Fee";
const DESCRIPTION = `CCS ${CCS.financialYear}: ${CCS.standard.maxPercent}% up to ${formatAUD(CCS.standard.lowerThreshold)} family income, 1% less per ${formatAUD(CCS.standard.step)} above, up to ${CCS.higher.maxPercent}% for younger siblings. Enter both parents' pay and fees for your gap fee.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Child Care Subsidy Calculator", description: DESCRIPTION, faqs: CCS_FAQS, calculator: true, dateModified: CCS_SOURCES.verifiedOnISO })} />
      <ChildCareSubsidyCalculatorPage />
    </>
  );
}
