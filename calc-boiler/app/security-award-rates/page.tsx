import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Security Services Industry Award 2020 (MA000016). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("security");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("security")} />
      <ModernAwardRatesPage awardKey="security" />
    </>
  );
}

export default withPageEnd(Page, "/security-award-rates/");
