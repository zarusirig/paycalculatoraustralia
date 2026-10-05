import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Plumbing and Fire Sprinklers Award 2020 (MA000036). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = buildAwardMetadata("plumbing");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("plumbing")} />
      <ModernAwardRatesPage awardKey="plumbing" />
    </>
  );
}

export default withPageEnd(Page, "/plumbing-award-rates/");
