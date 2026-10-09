import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Hair and Beauty Industry Award 2020 (MA000005). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("hair-and-beauty"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("hair-and-beauty")} />
      <ModernAwardRatesPage awardKey="hair-and-beauty" />
    </>
  );
}

export default withPageEnd(Page, "/hair-and-beauty-award-rates/");
