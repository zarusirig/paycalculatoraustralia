"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CHRISTMAS_2026_27_PUBLISHED, projectFortnightlyDates } from "@/lib/constants/centrelink-payment-dates";
import { isValidIso, weekdayName } from "@/lib/constants/pay-periods";
import { CALC_FONT, INPUT, LABEL, NOTE_OK, NOTE_WARN, SelectField } from "./t3-calc-shared";

// Normal fortnightly Centrelink dates from one known date, with 2026-27
// national holidays and the Christmas window flagged. Services Australia moves
// affected dates EARLIER; the real dates are in the customer's online account.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${weekdayName(iso)} ${d} ${MONTHS[m - 1]} ${y}`;
};

type Kind = "payment" | "reporting";

export default function CentrelinkDatesCalculator() {
  const [kind, setKind] = useState<Kind>("payment");
  const [known, setKnown] = useState("2026-10-01");
  const valid = isValidIso(known);
  const dates = useMemo(() => (valid ? projectFortnightlyDates(known, known, 12) : []), [known, valid]);
  const flagged = dates.filter((d) => d.flag);
  const noun = kind === "payment" ? "payment" : "reporting";

  return (
    <Card className="shadow-md not-prose" id="centrelink-dates-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Your Next Centrelink Dates</h2>
        <p className="text-sm text-warmgray mb-6">Enter one payment or reporting date from your Centrelink online account or a letter. We&rsquo;ll list the next 12 on your fortnightly cycle and flag any that fall on a public holiday or over Christmas, when Services Australia may move them earlier.</p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <SelectField id="cl-kind" label="The date is my" value={kind} onChange={setKind} options={[{ value: "payment", label: "Payment date" }, { value: "reporting", label: "Reporting date" }]} />
            <div>
              <label htmlFor="cl-known" className={LABEL}>Date</label>
              <input id="cl-known" type="date" value={known} onChange={(e) => setKnown(e.target.value)} className={INPUT} />
            </div>
            <p className="sm:col-span-2 text-xs text-warmgray">Most payments and reporting run every 2 weeks. If you&rsquo;re paid weekly or report on a different cycle, this won&rsquo;t match.</p>
          </form>
          <div className="space-y-4">
            {!valid ? (
              <p className={NOTE_WARN}>Enter a valid date.</p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                  <table className="w-full text-sm text-navy">
                    <thead className="bg-sandstone text-left">
                      <tr><th className="px-3 py-2">Normal {noun} date</th><th className="px-3 py-2">Holiday check</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20">
                      {dates.map((d) => (
                        <tr key={d.iso} className={d.flag ? "bg-sandstone/60" : ""}>
                          <td className="px-3 py-2 tabular-nums">{fmt(d.iso)}</td>
                          <td className="px-3 py-2">{d.flag === "holiday" ? `${d.holidayName}: likely earlier` : d.flag === "christmas-window" ? "Christmas period: may change" : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={flagged.length ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                  {flagged.length
                    ? `${flagged.length} of these dates fall on a public holiday or over Christmas–New Year. ${CHRISTMAS_2026_27_PUBLISHED ? "Check the official table below." : "Services Australia hasn't published its Christmas 2026 dates yet; last year every change moved dates earlier, never later."}`
                    : "None of these dates fall on a national public holiday or over Christmas, so they should stay as they are."}
                </p>
                <p className="text-xs text-warmgray-light">These are the dates your cycle falls on without holiday changes. The dates in your <a href="https://www.servicesaustralia.gov.au/centrelink-online-account" target="_blank" rel="noopener noreferrer" className="underline">Centrelink online account</a> are the ones that count. To see what you&rsquo;ll be paid, use the <Link href="/jobseeker-payment-calculator/" className="underline">JobSeeker</Link> or <Link href="/age-pension-income-test-calculator/" className="underline">Age Pension</Link> calculator.</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
