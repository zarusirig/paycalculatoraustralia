import CarerAllowancePage from "@/modules/calculator/carer-allowance";
import WhatsNextInline from "@/components/common/whats-next-inline";
import CarerAllowanceContent from "@/modules/calculator/carer-allowance-content";
import { CARER_ALLOWANCE_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CARER_ALLOWANCE, CARER_SUPPORT_SOURCES } from "@/lib/constants/centrelink-carer-and-support";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

const SLUG = "carer-allowance";
// Meta intent pass 23 Oct 2026: "carer allowance income test" and "income limit" lead GSC.
const TITLE = `Carer Allowance 2026: Income Test, ${formatAUD(CARER_ALLOWANCE.incomeLimit)} Limit & Rate`;
const DESCRIPTION = `Centrelink Carer Allowance is ${formatAUD(CARER_ALLOWANCE.fortnightly, 2)} a fortnight, not taxed, with a ${formatAUD(CARER_ALLOWANCE.incomeLimit)} combined income limit and no assets test. Plus the ${formatAUD(CARER_ALLOWANCE.carerSupplementAnnual)} Carer Supplement.`;

export const metadata = withFeaturedImage(w3Metadata(SLUG, TITLE, DESCRIPTION));

function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Carer Allowance", description: DESCRIPTION, faqs: CARER_ALLOWANCE_FAQS, calculator: true, dateModified: CARER_SUPPORT_SOURCES.verifiedOnISO })} />
      <CarerAllowancePage afterCalculator={<WhatsNextInline route="/carer-allowance/" />}><CarerAllowanceContent /></CarerAllowancePage>
    </>
  );
}

export default withPageEnd(Page, "/carer-allowance/");
