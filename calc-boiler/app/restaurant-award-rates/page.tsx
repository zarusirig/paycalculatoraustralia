import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Restaurant Industry Award 2020 (MA000119). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("restaurant");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("restaurant")} />
      <ModernAwardRatesPage awardKey="restaurant" />
    </>
  );
}

export default withPageEnd(Page, "/restaurant-award-rates/");
