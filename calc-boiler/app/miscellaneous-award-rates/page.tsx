import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Miscellaneous Award 2020 (MA000104). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("miscellaneous"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("miscellaneous")} />
      <ModernAwardRatesPage awardKey="miscellaneous" />
    </>
  );
}

export default withPageEnd(Page, "/miscellaneous-award-rates/");
