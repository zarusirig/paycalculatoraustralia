import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Building and Construction General On-site Award 2020 (MA000020). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = buildAwardMetadata("building-construction");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("building-construction")} />
      <ModernAwardRatesPage awardKey="building-construction" />
    </>
  );
}

export default withPageEnd(Page, "/building-and-construction-award-rates/");
