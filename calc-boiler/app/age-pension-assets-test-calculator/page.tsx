import AgePensionAssetsTestCalculatorPage from "@/modules/calculator/age-pension-assets-test-calculator";
import { ASSETS_TEST_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { MEANS_TEST_SOURCES, PENSION_ASSETS_TEST as AT } from "@/lib/constants/centrelink-means-test";

const SLUG = "age-pension-assets-test-calculator";
const TITLE = "Age Pension Assets Test Calculator 2026 — Limits From 20 Sep";
const DESCRIPTION = `Full Age Pension with assets up to ${formatAUD(AT.fullPensionLimit.single.homeowner)} (single homeowner) or ${formatAUD(AT.fullPensionLimit.couple.homeowner)} (couple). The pension falls $3 a fortnight per $1,000 above that and stops at ${formatAUD(AT.partPensionCutOff.single.homeowner)} from ${AT.ratesFrom}. Calculate both tests with your wages and savings and see which one applies.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Age Pension Assets Test Calculator", description: DESCRIPTION, faqs: ASSETS_TEST_FAQS, calculator: true, dateModified: MEANS_TEST_SOURCES.verifiedOnISO })} />
      <AgePensionAssetsTestCalculatorPage />
    </>
  );
}
