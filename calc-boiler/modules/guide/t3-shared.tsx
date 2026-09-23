// Shared layout pieces for the T3 workplace-entitlement pages (time in lieu,
// leave loading, enterprise agreements, travel allowance, cents per km, gross
// vs net, working credit). Server-safe: no hooks. The FAQ accordion is a
// client component rendered from here, with the Q&A also in the HTML.
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

export const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };

export interface Faq {
  q: string;
  a: string;
}

export interface Crumb {
  href?: string;
  label: string;
}

export function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} style={FONT}>{children}</h2>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 text-warmgray-light" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:text-eucalyptus-dark hover:underline">{c.label}</Link>
            ) : (
              <span className="font-medium text-navy" aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <header className="mb-10 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>{title}</h1>
      <div className="text-xl text-warmgray leading-relaxed mb-6">{children}</div>
      <TrustBar className="!max-w-none" />
    </header>
  );
}

export function KeyFigures({ items }: { items: { k: string; v: string; s: string }[] }) {
  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 not-prose">
      {items.map((c) => (
        <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
          <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
          <p className="text-xs text-warmgray-light">{c.s}</p>
        </div>
      ))}
    </div>
  );
}

/** Simple zebra table. `align` marks right-aligned (numeric) columns. */
export function DataTable({
  head,
  rows,
  align,
  caption,
}: {
  head: string[];
  rows: React.ReactNode[][];
  align?: ("l" | "r")[];
  caption?: React.ReactNode;
}) {
  const cls = (i: number) => (align?.[i] === "r" ? "text-right tabular-nums" : "");
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left text-warmgray">
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>{head.map((h, i) => <th key={h} scope="col" className={`px-4 py-3 ${cls(i)}`}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                {r.map((c, ci) => (
                  <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-medium text-navy" : ""} ${cls(ci)}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="mt-2 text-xs text-warmgray-light">{caption}</p>}
    </div>
  );
}

export function FaqSection({ faqs, label }: { faqs: Faq[]; label: string }) {
  return (
    <section>
      <H2 id="faq">Frequently Asked Questions</H2>
      <div className="sr-only">
        <h3>{label} questions and answers</h3>
        {faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
      </div>
      <Accordion type="multiple" className="not-prose mt-6 space-y-3">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
            <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
            <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function PageFooter({
  slug,
  methodology,
  sources,
  lastVerified,
}: {
  slug: string;
  methodology: React.ReactNode;
  sources: SourceLink[];
  lastVerified: string;
}) {
  const authorship = getGuideAuthorship(slug);
  return (
    <div className="mt-12 not-prose">
      <MethodologyDisclosure title="How we worked this out">{methodology}</MethodologyDisclosure>
      <SourceAttribution sources={sources} lastVerified={lastVerified} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </div>
  );
}

export function RelatedSidebar({ links }: { links: { href: string; label: string }[] }) {
  return (
    <aside className="lg:w-1/3">
      <div className="sticky top-8 space-y-6">
        <Card className="bg-sandstone border-sandstone-dark/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-navy mb-3">Related</h3>
            <div className="space-y-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{l.label}</span>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

export const ARTICLE_CLASS = "lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark";
export const PAGE_WRAP = "min-h-screen flex-grow bg-white";
export const PAGE_INNER = "max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8";

