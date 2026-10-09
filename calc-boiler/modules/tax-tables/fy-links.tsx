import Link from "next/link";
import { PAYG_TABLE_YEARS, type PayFrequency } from "@/lib/constants/payg-withholding";
import { FY_CYCLES, FY_CYCLE_ORDER, fyLabel, fyPath, fyWindow } from "./fy-tax-table-data";

/**
 * Links to the year-locked tax-table pages: one cycle (cycle landing pages) or
 * all six (the PAYG hub). The pay date, not the work period, decides the year.
 * 2024-25 has no page of its own: the ATO's one edition for 1 July 2024 to
 * 30 June 2026 is on the 2025-26 page, labelled "2024-25 and 2025-26".
 */
export default function FyTableLinks({ only, headingId = "tax-tables-by-year" }: { only?: PayFrequency; headingId?: string }) {
  const cycles = only ? [only] : FY_CYCLE_ORDER;
  return (
    <section id={headingId}>
      <h2>{only ? `${FY_CYCLES[only].label} Tax Table by Financial Year` : "Tax Tables by Financial Year"}</h2>
      <p>
        The ATO picks the table from the date a payment is made, not the period the work covers. Open the year-locked page for the pay
        date you are checking: {PAYG_TABLE_YEARS.map((y) => `${fyLabel(y)} (${fyWindow(y)})`).join("; ")}. The ATO did not reissue the
        tables on 1 July 2025, so 2024-25 and 2025-26 share one table and one page.
      </p>
      <ul>
        {cycles.flatMap((c) =>
          PAYG_TABLE_YEARS.map((y) => (
            <li key={`${c}-${y}`}>
              <Link href={fyPath(c, y)}>
                {FY_CYCLES[c].label} tax table {fyLabel(y)}
              </Link>{" "}
              &mdash; {FY_CYCLES[c].ato.nat}, pay dates {fyWindow(y)}.
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
