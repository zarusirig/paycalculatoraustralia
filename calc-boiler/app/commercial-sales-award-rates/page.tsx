import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Commercial Sales Award 2020 (MA000083). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = buildAwardMetadata("commercial-sales");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("commercial-sales")} />
      <ModernAwardRatesPage awardKey="commercial-sales" />
    </>
  );
}

export default withPageEnd(Page, "/commercial-sales-award-rates/");
