import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Manufacturing and Associated Industries and Occupations Award 2020
// (MA000010). All figures from lib/constants/modern-awards.ts; copy from
// modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("manufacturing");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("manufacturing")} />
      <ModernAwardRatesPage awardKey="manufacturing" />
    </>
  );
}

export default withPageEnd(Page, "/manufacturing-award-rates/");
