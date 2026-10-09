import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Live Performance Award 2020 (MA000081), Production and Support Staff classifications. All
// figures from lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("live-performance"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("live-performance")} />
      <ModernAwardRatesPage awardKey="live-performance" />
    </>
  );
}

export default withPageEnd(Page, "/live-performance-award-rates/");
