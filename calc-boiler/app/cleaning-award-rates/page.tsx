import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";

// Cleaning Services Award 2020 (MA000022). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("cleaning");

export default function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("cleaning")} />
      <ModernAwardRatesPage awardKey="cleaning" />
    </>
  );
}
