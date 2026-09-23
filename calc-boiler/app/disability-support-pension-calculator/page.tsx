import DisabilitySupportPensionCalculatorPage from "@/modules/calculator/disability-support-pension-calculator";
import { DSP_FAQS } from "@/modules/calculator/disability-support-pension-faqs";
import { JsonLd } from "@/modules/seo/json-ld";
import { w3Metadata, w3Schema } from "@/modules/seo/centrelink-w3-schema";
import { formatAUD } from "@/lib/constants";
import { DSP, DSP_RATES_21_PLUS } from "@/lib/constants/disability-support-pension";

// G3 (wave 4, 24 Sep 2026). Targets: disability pension 8.1k (KD 4),
// centrelink disability pension 2.9k, dsp rates 1.3k, disability pension
// amount 390 (DataForSEO, AU).

const SLUG = "disability-support-pension-calculator";
const TITLE = "Disability Support Pension Calculator 2026 — DSP Rates";
const DESCRIPTION = `DSP is ${formatAUD(DSP_RATES_21_PLUS.maxFortnightly.single.total, 2)} a fortnight single, ${formatAUD(DSP_RATES_21_PLUS.maxFortnightly.coupleEach.total, 2)} each for couples from ${DSP.ratesFrom}. Calculate your Disability Support Pension with the income and assets tests, the ${DSP.maxWeeklyWorkHours}-hour work rule and under-21 rates, verified at Services Australia.`;

export const metadata = w3Metadata(SLUG, TITLE, DESCRIPTION);

export default function Page() {
  return (
    <>
      <JsonLd code={w3Schema({ slug: SLUG, name: "Disability Support Pension Calculator", description: DESCRIPTION, faqs: DSP_FAQS, calculator: true, dateModified: "2026-09-24" })} />
      <DisabilitySupportPensionCalculatorPage />
    </>
  );
}
