import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Meat Industry Award 2020 (MA000059). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("meat-industry"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("meat-industry")} />
      <ModernAwardRatesPage awardKey="meat-industry" />
    </>
  );
}

export default withPageEnd(Page, "/meat-industry-award-rates/");
