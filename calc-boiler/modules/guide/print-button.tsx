"use client";

import { Printer } from "lucide-react";

/**
 * Print button. Print styles hide site chrome so the rate tables print as a
 * clean pay guide — the page's answer to "... pay rates pdf" searches.
 *
 * The only interactive part of the award pages, so it lives in its own client
 * module: award-page-parts.tsx (and the award rate data it reads) stays on the
 * server instead of shipping to the browser.
 */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <>
      <style media="print">{`
        body > :not(main), main aside, main nav, .no-print { display: none !important; }
        body { background: #fff !important; }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; }
        .overflow-x-auto { overflow: visible !important; }
      `}</style>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print inline-flex items-center gap-2 rounded-md border border-eucalyptus-dark px-4 py-2 text-sm font-semibold text-eucalyptus-dark hover:bg-eucalyptus-dark hover:text-white"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </>
  );
}
