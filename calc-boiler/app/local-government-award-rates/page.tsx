import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Local Government Industry Award 2020 (MA000112). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("local-government"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("local-government")} />
      <ModernAwardRatesPage awardKey="local-government" />
    </>
  );
}

export default withPageEnd(Page, "/local-government-award-rates/");
