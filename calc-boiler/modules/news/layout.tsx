import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Newspaper, ArrowRight } from "lucide-react";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { AUTHORS } from "@/lib/authors";
import { formatNewsDate, getRelatedNews, type NewsArticleMeta } from "@/lib/news";

type KeyFactRow = { label: string; before?: string; after: string };

/** Old → new comparison box for the numbers that changed. */
export function NewsKeyFacts({ title = "Key facts", rows }: { title?: string; rows: KeyFactRow[] }) {
  const hasBefore = rows.some((r) => r.before !== undefined);
  return (
    <div className="overflow-x-auto not-prose my-8 rounded-xl border border-eucalyptus/30 bg-eucalyptus/5 p-1">
      <p className="px-4 pt-3 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">{title}</p>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-navy/60">
            <th className="px-4 py-2 font-semibold">What changed</th>
            {hasBefore && <th className="px-4 py-2 font-semibold">Before</th>}
            <th className="px-4 py-2 font-semibold">{hasBefore ? "Now" : "Detail"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-eucalyptus/10 text-navy">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-4 py-2.5 font-medium">{row.label}</td>
              {hasBefore && <td className="px-4 py-2.5">{row.before ?? "—"}</td>}
              <td className="px-4 py-2.5 font-semibold">{row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NewsArticleLayout({ meta, children }: { meta: NewsArticleMeta; children: ReactNode }) {
  const author = AUTHORS[meta.authorId];
  const related = getRelatedNews(meta.slug);
  const sources: SourceLink[] = meta.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/news/" className="hover:text-eucalyptus-dark hover:underline">News</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{meta.headline}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-eucalyptus/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">
            <Newspaper className="h-3.5 w-3.5" /> {meta.category}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {meta.headline}
          </h1>
          <p className="text-sm text-warmgray-light">
            By <span className="font-semibold text-navy">{author.name}</span>, {author.role} · Published {formatNewsDate(meta.datePublished)}
            {meta.dateModified !== meta.datePublished && <> · Updated {formatNewsDate(meta.dateModified)}</>}
          </p>
        </header>

        <div className="max-w-4xl">
          <article className="prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">
            {children}
          </article>

          {meta.faq && meta.faq.length > 0 && (
            <section className="not-prose my-10">
              <h2 className="mb-4 text-xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Frequently asked questions
              </h2>
              <div className="space-y-5">
                {meta.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="mb-1 font-semibold text-navy">{item.question}</h3>
                    <p className="text-warmgray">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <aside className="not-prose my-10 rounded-xl border border-navy/10 bg-navy/3 p-6">
            <h2 className="mb-3 text-lg font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Run your own numbers
            </h2>
            <ul className="space-y-2">
              {meta.relatedCalculators.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    {c.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <SourceAttribution sources={sources} />

          {related.length > 0 && (
            <section className="mt-12 border-t border-navy/10 pt-8">
              <h2 className="mb-4 text-xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Related news
              </h2>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/news/${r.slug}/`} className="font-semibold text-eucalyptus-dark hover:text-navy hover:underline">{r.headline}</Link>
                    <span className="ml-2 text-sm text-warmgray-light">{formatNewsDate(r.datePublished)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
