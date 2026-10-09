import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

// Fitness Industry Award 2020 (MA000094). All figures from
// lib/constants/modern-awards-oct.ts; copy from modules/guide/modern-award-content-oct.ts.
export const metadata = withFeaturedImage(buildAwardMetadata("fitness"));

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("fitness")} />
      <ModernAwardRatesPage awardKey="fitness" />
    </>
  );
}

export default withPageEnd(Page, "/fitness-industry-award-rates/");
