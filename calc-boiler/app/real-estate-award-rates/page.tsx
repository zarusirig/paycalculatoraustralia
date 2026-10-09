import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Real Estate Industry Award 2020 (MA000106). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("real-estate"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("real-estate")} />
      <ModernAwardRatesPage awardKey="real-estate" />
    </>
  );
}

export default withPageEnd(Page, "/real-estate-award-rates/");
