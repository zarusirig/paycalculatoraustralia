import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Cleaning Services Award 2020 (MA000022). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("cleaning"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("cleaning")} />
      <ModernAwardRatesPage awardKey="cleaning" />
    </>
  );
}

export default withPageEnd(Page, "/cleaning-award-rates/");
