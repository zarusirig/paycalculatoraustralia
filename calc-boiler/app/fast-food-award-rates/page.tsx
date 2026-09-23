import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Fast Food Industry Award 2020 (MA000003). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("fast-food");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("fast-food")} />
      <ModernAwardRatesPage awardKey="fast-food" />
    </>
  );
}

export default withPageEnd(Page, "/fast-food-award-rates/");
