import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Calendar } from "lucide-react";
import type { Author, Reviewer } from "@/lib/authors";

type AuthorBoxProps = {
  author: Author;
  reviewer: Reviewer;
  lastReviewed: string;
  datePublished?: string;
};

export default function AuthorBox({
  author,
  reviewer,
  lastReviewed,
  datePublished,
}: AuthorBoxProps) {
  const reviewedDate = new Date(lastReviewed);
  const formattedReviewed = reviewedDate.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedPublished = datePublished
    ? new Date(datePublished).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <section
      aria-label="Article author information"
      className="mt-10 rounded-xl border border-sandstone-dark/20 bg-sandstone/30 p-6 sm:p-8"
      itemScope
      itemType="https://schema.org/Person"
      itemProp="author"
    >
      {/* Author header */}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-eucalyptus/30 bg-eucalyptus-light">
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-eucalyptus-dark">
            {author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3
              className="text-lg font-bold text-navy"
              itemProp="name"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {author.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-eucalyptus-light/60 px-2.5 py-0.5 text-xs font-semibold text-eucalyptus-dark">
              <ShieldCheck className="h-3 w-3" />
              Verified Author
            </span>
          </div>

          <p className="text-sm font-medium text-warmgray" itemProp="jobTitle">
            {author.role}
          </p>
          <p className="mt-0.5 text-xs text-warmgray-light">
            <Award className="mr-1 inline h-3 w-3" />
            {author.credentials}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p
        className="mt-4 text-sm leading-relaxed text-warmgray"
        itemProp="description"
      >
        {author.bio}
      </p>

      {/* Expertise tags */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-warmgray-light">
          Areas of Expertise
        </p>
        <div className="flex flex-wrap gap-2">
          {author.expertise.map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-navy shadow-sm ring-1 ring-sandstone-dark/15"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Reviewer + dates */}
      <div className="mt-5 flex flex-col gap-3 border-t border-sandstone-dark/15 pt-4 text-xs text-warmgray sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-eucalyptus" />
          <span>
            Fact-checked by{" "}
            <strong className="font-semibold text-navy">
              {reviewer.name}
            </strong>
            <span className="text-warmgray-light">
              {" "}
              — {reviewer.credentials}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-warmgray-light">
          {formattedPublished && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Published {formattedPublished}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Reviewed{" "}
            <time dateTime={lastReviewed}>{formattedReviewed}</time>
          </span>
        </div>
      </div>

      {/* Hidden schema metadata */}
      <meta itemProp="url" content={author.profileUrl} />
      <span
        itemProp="worksFor"
        itemScope
        itemType="https://schema.org/Organization"
        className="hidden"
      >
        <meta itemProp="name" content="Pay Calculator Australia" />
      </span>
    </section>
  );
}
