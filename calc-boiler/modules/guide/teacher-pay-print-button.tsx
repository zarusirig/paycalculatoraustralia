"use client";

import { Printer } from "lucide-react";

/**
 * The one interactive element on /teacher-pay-australia/<state>/: a print
 * button. Split out so the rest of teacher-pay-state.tsx renders on the server.
 */
export default function TeacherPayPrintButton({ stateCode }: { stateCode: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="not-prose inline-flex items-center gap-2 rounded-lg border border-sandstone-dark/30 bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus-dark print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print or save the {stateCode} pay scale as a PDF
    </button>
  );
}
