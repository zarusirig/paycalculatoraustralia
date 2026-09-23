import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";

// Aged Care Award 2010 (MA000018). All figures from
// lib/constants/modern-awards.ts; copy from modules/guide/modern-award-content.ts.
export const metadata = buildAwardMetadata("aged-care");

export default function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("aged-care")} />
      <ModernAwardRatesPage awardKey="aged-care" />
    </>
  );
}
