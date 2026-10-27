// Shared presentational pieces for the /job-pay-rates/ and /adf-pay-scales/
// clusters. Server components; the FAQ accordion is the only client island.

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export function Breadcrumbs({ trail }: { trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 text-warmgray-light" aria-hidden="true" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-eucalyptus-dark hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-navy" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
    >
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Accordion type="multiple" className="not-prose mt-6 space-y-3">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-lg border bg-white px-4">
          <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
          <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Wide data table shell with the site's table styling and horizontal scroll on mobile. */
export function TableShell({
  children,
  minWidth = "34rem",
  caption,
}: {
  children: React.ReactNode;
  minWidth?: string;
  caption?: string;
}) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-left text-sm text-warmgray" style={{ minWidth }}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}
