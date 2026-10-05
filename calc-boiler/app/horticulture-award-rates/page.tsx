import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Horticulture Award 2020 (MA000028). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = buildAwardMetadata("horticulture");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("horticulture")} />
      <ModernAwardRatesPage awardKey="horticulture" />
    </>
  );
}

export default withPageEnd(Page, "/horticulture-award-rates/");
