// One FAQ list per page: the visible accordion and the FAQPage JSON-LD both
// read the same array, so the structured data can never drift from the page.
// Answers are plain text (no markup) so the JSON-LD text is exactly what the
// reader sees. `npm run check:faq` (scripts/check-faq-sync.mjs) enforces this
// against the static export.

import type { FAQPage, WithContext } from "schema-dts";

export interface FaqItem {
  q: string;
  a: string;
}

/** FAQPage JSON-LD built from the same array the page renders. */
export function faqPageSchema(faqs: readonly FaqItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
}
