import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/faq";

/**
 * Renders a shared FAQ array (see lib/faq.ts) as an accordion. Pass the same
 * array to faqPageSchema() in the page file so markup and page cannot drift.
 * Styling hooks let each page keep its existing look.
 */
export default function FaqAccordion({
  faqs,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: {
  faqs: readonly FaqItem[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <Accordion type="multiple" className={className}>
      {faqs.map((f) => (
        <AccordionItem key={f.q} value={f.q} className={itemClassName}>
          <AccordionTrigger className={triggerClassName}>{f.q}</AccordionTrigger>
          <AccordionContent className={contentClassName}>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
