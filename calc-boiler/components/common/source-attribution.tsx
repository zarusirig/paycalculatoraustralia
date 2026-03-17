import { ExternalLink } from "lucide-react";

export interface SourceLink {
  title: string;
  url: string;
  publisher: string;
}

interface SourceAttributionProps {
  sources: SourceLink[];
  lastVerified?: string;
  className?: string;
}

export default function SourceAttribution({
  sources,
  lastVerified,
  className = "",
}: SourceAttributionProps) {
  return (
    <section className={`border-t border-sandstone-dark/20 pt-6 ${className}`}>
      <h2
        className="mb-4 text-xl font-semibold text-navy"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Sources &amp; References
      </h2>
      <ol className="space-y-3">
        {sources.map((source, index) => (
          <li key={source.url} className="flex items-start gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-eucalyptus-light text-xs font-semibold text-eucalyptus-dark">
              {index + 1}
            </span>
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 font-medium text-eucalyptus-dark transition-colors hover:text-navy hover:underline"
              >
                {source.title}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <span className="ml-1 text-warmgray-light">— {source.publisher}</span>
            </div>
          </li>
        ))}
      </ol>
      {lastVerified && (
        <p className="mt-4 flex items-center gap-2 text-sm text-warmgray-light">
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          Last verified: {lastVerified}. Our content is based on the latest
          information from official Australian government sources.
        </p>
      )}
    </section>
  );
}
