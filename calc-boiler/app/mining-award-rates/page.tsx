import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Mining Industry Award 2020 (MA000011). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("mining"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("mining")} />
      <ModernAwardRatesPage awardKey="mining" />
    </>
  );
}

export default withPageEnd(Page, "/mining-award-rates/");
