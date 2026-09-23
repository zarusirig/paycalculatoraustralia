import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Clerks—Private Sector Award 2020 (MA000002). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("clerks");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("clerks")} />
      <ModernAwardRatesPage awardKey="clerks" />
    </>
  );
}

export default withPageEnd(Page, "/clerks-award-rates/");
