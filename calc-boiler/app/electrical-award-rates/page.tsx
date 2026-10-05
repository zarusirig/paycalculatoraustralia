import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Electrical, Electronic and Communications Contracting Award 2020 (MA000025). All figures
// from lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = buildAwardMetadata("electrical");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("electrical")} />
      <ModernAwardRatesPage awardKey="electrical" />
    </>
  );
}

export default withPageEnd(Page, "/electrical-award-rates/");
