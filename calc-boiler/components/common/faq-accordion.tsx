import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/faq";

/**
 * An FAQ answer's plain text, with any `links` phrases rendered as internal
 * links. The text is unchanged, so it still matches the FAQPage JSON-LD.
 */
export function FaqAnswer({ faq, linkClassName = "text-eucalyptus-dark hover:underline font-medium" }: { faq: FaqItem; linkClassName?: string }) {
  if (!faq.links) return <>{faq.a}</>;
  let parts: ReactNode[] = [faq.a];
  for (const [phrase, href] of Object.entries(faq.links)) {
    let done = false;
    parts = parts.flatMap((part) => {
      if (done || typeof part !== "string") return [part];
      const at = part.indexOf(phrase);
      if (at < 0) return [part];
      done = true;
      return [
        part.slice(0, at),
        <Link key={href} href={href} className={linkClassName}>{phrase}</Link>,
        part.slice(at + phrase.length),
      ];
    });
  }
  return <>{parts}</>;
}

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
          <AccordionContent className={contentClassName}><FaqAnswer faq={f} /></AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
