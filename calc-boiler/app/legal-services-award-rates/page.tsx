import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Legal Services Award 2020 (MA000116). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("legal-services"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("legal-services")} />
      <ModernAwardRatesPage awardKey="legal-services" />
    </>
  );
}

export default withPageEnd(Page, "/legal-services-award-rates/");
