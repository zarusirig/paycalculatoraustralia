import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";

// Road Transport and Distribution Award 2020 (MA000038). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("road-transport");

export default function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("road-transport")} />
      <ModernAwardRatesPage awardKey="road-transport" />
    </>
  );
}
