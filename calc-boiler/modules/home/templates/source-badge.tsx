import { ExternalLink } from "lucide-react";

// ─── Inline Source Badge ───
export function SourceBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="source-badge"
      title={`Source: ${label}`}
    >
      {label}
      <ExternalLink className="h-2.5 w-2.5" />
    </a>
  );
}
