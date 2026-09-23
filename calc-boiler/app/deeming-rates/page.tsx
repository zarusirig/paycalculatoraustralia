import DeemingRatesPage from "@/modules/calculator/deeming-rates";
import { DEEMING_FAQS } from "@/modules/calculator/centrelink-h3-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { DEEMING, MEANS_TEST_SOURCES } from "@/lib/constants/centrelink-means-test";

const SLUG = "deeming-rates";
const pct = (r: number) => `${(r * 100).toFixed(2)}%`;
const TITLE = `Deeming Rates 2026 — ${pct(DEEMING.lowerRate)} & ${pct(DEEMING.upperRate)} + Deeming Calculator`;
const DESCRIPTION = `Centrelink deeming rates from ${DEEMING.ratesFrom}: ${pct(DEEMING.lowerRate)} on the first ${formatAUD(DEEMING.thresholds.single)} (single) or ${formatAUD(DEEMING.thresholds.pensionerCouple)} (pensioner couple), ${pct(DEEMING.upperRate)} above. Calculate deemed income on your savings, see how it combines with your wages in the income test, and the full rate history.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Deeming Rates and Deeming Calculator", description: DESCRIPTION, faqs: DEEMING_FAQS, calculator: true, dateModified: MEANS_TEST_SOURCES.verifiedOnISO })} />
      <DeemingRatesPage />
    </>
  );
}
