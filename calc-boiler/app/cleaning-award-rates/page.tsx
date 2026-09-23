import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Cleaning Services Award 2020 (MA000022). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("cleaning");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("cleaning")} />
      <ModernAwardRatesPage awardKey="cleaning" />
    </>
  );
}

export default withPageEnd(Page, "/cleaning-award-rates/");
