"use client";

import { useState } from "react";
import Link from "next/link";
import { paygFinancialYearForPayDate, PAYG_TABLE_YEARS, PAYG_YEAR_INFO } from "@/lib/constants/payg-withholding";
import { fyPath, FY_CYCLES, longDate } from "./fy-tax-table-data";
import type { PayFrequency } from "@/lib/constants/payg-withholding";

/**
 * "Which table applies to my pay date?" The ATO goes by the date the payment is
 * MADE, so a pay run dated 3 July 2026 for work done in June still uses the
 * 2026-27 table. Pick a date and get the year and the link.
 */
export default function PayDateFinder({ frequency, currentFy }: { frequency: PayFrequency; currentFy: string }) {
  const [date, setDate] = useState("");
  const fy = date ? paygFinancialYearForPayDate(date) : null;
  const cycle = FY_CYCLES[frequency];
  const first = PAYG_TABLE_YEARS[PAYG_TABLE_YEARS.length - 1];

  return (
    <div className="mt-4 rounded-lg bg-white border border-sandstone-dark/20 p-4">
      <label htmlFor={`pay-date-${frequency}`} className="block text-sm font-semibold text-navy mb-1">
        Date the payment is made
      </label>
      <input
        id={`pay-date-${frequency}`}
        type="date"
        value={date}
        min="2024-07-01"
        onChange={(e) => setDate(e.target.value)}
        className="rounded-md border border-sandstone-dark/30 px-3 py-2 text-navy"
      />
      <div className="mt-3 text-sm text-navy" aria-live="polite">
        {!date && <span className="text-warmgray">Pick a pay date to see which table applies.</span>}
        {date && fy && (
          <span>
            A payment made on <strong>{longDate(date)}</strong> uses the <strong>{fy}</strong> {cycle.period}ly table.{" "}
            {fy === currentFy ? (
              <span>You are on that page.</span>
            ) : (
              <Link href={fyPath(frequency, fy)} className="font-semibold text-eucalyptus-dark underline">
                Open the {cycle.label.toLowerCase()} tax table for {fy}
              </Link>
            )}
          </span>
        )}
        {date && !fy && date > PAYG_YEAR_INFO[PAYG_TABLE_YEARS[0]].payDatesTo && (
          <span>The ATO has not published tables for payments made after {longDate(PAYG_YEAR_INFO[PAYG_TABLE_YEARS[0]].payDatesTo)}.</span>
        )}
        {date && !fy && date < PAYG_YEAR_INFO[first].payDatesFrom && (
          <span>
            This site carries tables for payments made from {longDate(PAYG_YEAR_INFO[first].payDatesFrom)}. Earlier pay dates use an
            older ATO edition: check the{" "}
            <a href="https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview" target="_blank" rel="noopener noreferrer" className="underline">
              ATO tax tables index
            </a>
            .
          </span>
        )}
      </div>
    </div>
  );
}
