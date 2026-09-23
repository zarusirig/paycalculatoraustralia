import AgePensionAssetsTestCalculatorPage from "@/modules/calculator/age-pension-assets-test-calculator";
import AgePensionAssetsTestCalculatorContent from "@/modules/calculator/age-pension-assets-test-calculator-content";
import { ASSETS_TEST_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { MEANS_TEST_SOURCES, PENSION_ASSETS_TEST as AT } from "@/lib/constants/centrelink-means-test";
import { withPageEnd } from "@/components/common/content-slots";

const SLUG = "age-pension-assets-test-calculator";
const TITLE = "Age Pension Assets Test Calculator 2026 — Limits From 20 Sep";
const DESCRIPTION = `Full Age Pension with assets up to ${formatAUD(AT.fullPensionLimit.single.homeowner)} (single homeowner); $3 a fortnight less per $1,000 above, nil at ${formatAUD(AT.partPensionCutOff.single.homeowner)} from 20 Sep 2026. See which test applies.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Age Pension Assets Test Calculator", description: DESCRIPTION, faqs: ASSETS_TEST_FAQS, calculator: true, dateModified: MEANS_TEST_SOURCES.verifiedOnISO })} />
      <AgePensionAssetsTestCalculatorPage><AgePensionAssetsTestCalculatorContent /></AgePensionAssetsTestCalculatorPage>
    </>
  );
}

export default withPageEnd(Page, "/age-pension-assets-test-calculator/");
