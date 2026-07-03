"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Newspaper } from "lucide-react";
import { formatNewsDate, getAllNews, NEWS_CATEGORIES, type NewsCategory } from "@/lib/news";

export default function NewsIndexPage() {
  const [filter, setFilter] = useState<NewsCategory | "All">("All");
  const articles = getAllNews().filter((a) => filter === "All" || a.category === filter);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">News</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Australian Pay &amp; Tax News
          </h1>
          <p className="text-xl text-warmgray leading-relaxed">
            Wage decisions, tax changes, super rules and payment increases — what changed, when it
            starts, and what it means for your take-home pay. Every story links to a calculator so
            you can run your own numbers.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter news by category">
          {(["All", ...NEWS_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === cat ? "bg-navy text-white" : "bg-navy/5 text-navy hover:bg-eucalyptus/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="max-w-4xl divide-y divide-navy/10">
          {articles.map((a) => (
            <li key={a.slug} className="py-6">
              <p className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-eucalyptus/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest text-eucalyptus-dark">
                <Newspaper className="h-3 w-3" /> {a.category}
              </p>
              <h2 className="text-xl font-bold leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                <Link href={`/news/${a.slug}/`} className="text-navy hover:text-eucalyptus-dark hover:underline">{a.headline}</Link>
              </h2>
              <p className="mt-1 text-sm text-warmgray-light">{formatNewsDate(a.datePublished)}</p>
              <p className="mt-2 text-warmgray leading-relaxed">{a.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
