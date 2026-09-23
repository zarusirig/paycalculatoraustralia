import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Pharmacy Industry Award 2020 (MA000012). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("pharmacy");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("pharmacy")} />
      <ModernAwardRatesPage awardKey="pharmacy" />
    </>
  );
}

export default withPageEnd(Page, "/pharmacy-award-rates/");
