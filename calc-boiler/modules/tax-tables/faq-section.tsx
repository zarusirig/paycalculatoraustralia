import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { TaxTableFaq } from "./weekly-tax-table-faqs";

interface TaxTableFaqSectionProps {
  heading: string;
  /** Heading for the sr-only mirror — describes the set for screen readers. */
  mirrorHeading: string;
  faqs: readonly TaxTableFaq[];
}

/**
 * FAQ accordion with a crawlable sr-only mirror.
 *
 * The Radix accordion unmounts closed content, so answers never reach the
 * rendered HTML of a statically exported page. The sr-only block duplicates
 * every question and answer into the DOM so crawlers — and the FAQPage JSON-LD
 * that reads the same array — always agree with what a user can open.
 */
export default function TaxTableFaqSection({
  heading,
  mirrorHeading,
  faqs,
}: TaxTableFaqSectionProps) {
  return (
    <section id="faq">
      <h2>{heading}</h2>
      <div className="sr-only">
        <h3>{mirrorHeading}</h3>
        {faqs.map((f) => (
          <div key={f.q}>
            <h4>{f.q}</h4>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
      <Accordion type="multiple" className="not-prose mt-6 space-y-3">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
            <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
            <AccordionContent className="text-navy">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
