import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";

// Nurses Award 2020 (MA000034). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("nurses");

export default function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("nurses")} />
      <ModernAwardRatesPage awardKey="nurses" />
    </>
  );
}
