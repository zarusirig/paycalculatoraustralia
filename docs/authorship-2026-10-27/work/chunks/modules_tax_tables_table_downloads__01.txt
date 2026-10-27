import { FileDown, FileSpreadsheet, ExternalLink } from "lucide-react";
import type { PayFrequency } from "@/lib/constants/payg-withholding";
import type { AtoScheduleDoc } from "./ato-schedules";
import manifest from "./downloads-manifest.json";

// Files and sizes written by scripts/generate-tax-table-downloads.mjs into
// public/downloads/ (re-run it after any change to the withholding engine).

function size(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

interface TableDownloadsProps {
  frequency: PayFrequency;
  doc: AtoScheduleDoc;
  /** Financial year the page shows; nothing renders unless the files are for that year. */
  fy: string;
  className?: string;
}

/**
 * "Download PDF" / "Download CSV" for the current year's table, hosted on this
 * site, plus the official ATO PDF. Plain links with `download`, so they work
 * without JavaScript and are crawlable.
 */
export default function TableDownloads({ frequency, doc, fy, className = "" }: TableDownloadsProps) {
  if (fy !== manifest.fy) return null;
  const files = manifest.files[frequency];
  const period = `${frequency.charAt(0).toUpperCase()}${frequency.slice(1)}`;
  const btn =
    "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eucalyptus/40";
  return (
    <div className={`not-prose ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={files.pdf.href}
          download
          type="application/pdf"
          className={`${btn} border-eucalyptus-dark bg-eucalyptus-dark text-white hover:bg-navy hover:border-navy`}
        >
          <FileDown className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Download PDF ({manifest.fy}, {size(files.pdf.bytes)})
        </a>
        <a
          href={files.csv.href}
          download
          type="text/csv"
          className={`${btn} border-eucalyptus-dark bg-white text-eucalyptus-dark hover:bg-eucalyptus-light/40`}
        >
          <FileSpreadsheet className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Download CSV ({size(files.csv.bytes)})
        </a>
        {doc.pdfUrl && (
          <a
            href={doc.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-1 py-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            Official ATO PDF ({doc.nat})
          </a>
        )}
      </div>
      <p className="mt-2 text-xs text-warmgray">
        Free {period.toLowerCase()} tax table {manifest.fy} as a printable PDF ({files.pdf.pages} pages) or a spreadsheet, every row the
        ATO prints ({files.rows.toLocaleString("en-AU")} rows), with and without the tax-free threshold, plus study loan and foreign
        resident columns. We calculated it from the ATO Schedule 1 formula. It is not an official ATO document.
      </p>
    </div>
  );
}
