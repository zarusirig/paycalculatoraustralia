import ModernAwardRatesPage from "@/modules/guide/modern-award-rates";
import { JsonLd } from "@/modules/seo/json-ld";
import { buildAwardJsonLd, buildAwardMetadata } from "@/modules/guide/modern-award-seo";
import { withPageEnd } from "@/components/common/content-slots";

// Pastoral Award 2020 (MA000035), farm and livestock hands (Part 6). All figures
// from lib/constants/modern-awards-oct2.ts; copy from modules/guide/modern-award-content-oct2.ts.
export const metadata = buildAwardMetadata("pastoral");

function Page() {
  return (
    <>
      <JsonLd code={buildAwardJsonLd("pastoral")} />
      <ModernAwardRatesPage awardKey="pastoral" />
    </>
  );
}

export default withPageEnd(Page, "/pastoral-award-rates/");
