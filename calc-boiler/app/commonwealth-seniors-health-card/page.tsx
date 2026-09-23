import CommonwealthSeniorsHealthCardPage from "@/modules/calculator/commonwealth-seniors-health-card";
import { CSHC_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { CSHC, MEANS_TEST_SOURCES } from "@/lib/constants/centrelink-means-test";

const SLUG = "commonwealth-seniors-health-card";
const TITLE = `Commonwealth Seniors Health Card 2026 — ${formatAUD(CSHC.incomeLimit.single)} Income Limit`;
const DESCRIPTION = `Commonwealth Seniors Health Card income limit from 20 Sep 2026: ${formatAUD(CSHC.incomeLimit.single)} single, ${formatAUD(CSHC.incomeLimit.couple)} couple, no assets test. Check your wages and deemed super against it.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Commonwealth Seniors Health Card Income Test Calculator", description: DESCRIPTION, faqs: CSHC_FAQS, calculator: true, dateModified: MEANS_TEST_SOURCES.verifiedOnISO })} />
      <CommonwealthSeniorsHealthCardPage />
    </>
  );
}
