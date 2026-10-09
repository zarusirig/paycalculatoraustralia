import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Timber Industry Award 2020 (MA000071). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("timber"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("timber")} />
      <ModernAwardRatesPage awardKey="timber" />
    </>
  );
}

export default withPageEnd(Page, "/timber-award-rates/");
