import { FileDown, FileSpreadsheet, ExternalLink } from "lucide-react";
import type { AtoScheduleDoc } from "./ato-schedules";

interface AtoDownloadsProps {
  doc: AtoScheduleDoc;
  /** Optional extra schedules to link (Schedule 1 formulas, Schedule 8 STSL). */
  also?: readonly AtoScheduleDoc[];
}

/**
 * Direct links to the ATO's own publication of a schedule. Every URL here was
 * confirmed to return HTTP 200 on the date in ato-schedules.ts.
 */
export default function AtoDownloads({ doc, also = [] }: AtoDownloadsProps) {
  return (
    <div className="not-prose my-8 rounded-xl border border-sandstone-dark/30 bg-sandstone p-6">
      <h3 className="mb-1 text-lg font-bold text-navy">
        Download the official ATO {doc.title.toLowerCase()} ({doc.nat})
      </h3>
      <p className="mb-4 text-sm text-warmgray">
        Published {doc.published} by the Australian Taxation Office, applying to payments made from
        1&nbsp;July&nbsp;2026. These are the source documents this page is checked against.
      </p>
      <ul className="space-y-2.5">
        {doc.pdfUrl && (
          <li>
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
            >
              <FileDown className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{doc.pdfLabel}</span>
            </a>
          </li>
        )}
        {doc.xlsxUrl && (
          <li>
            <a
              href={doc.xlsxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
            >
              <FileSpreadsheet className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{doc.xlsxLabel}</span>
            </a>
          </li>
        )}
        <li>
          <a
            href={doc.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
          >
            <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>
              {doc.title} ({doc.nat}) on ato.gov.au
            </span>
          </a>
        </li>
        {also.map((extra) => (
          <li key={extra.nat}>
            <a
              href={extra.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>
                {extra.title} ({extra.nat})
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
