"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateAU, parseIsoDate } from "@/lib/constants/payday-super";
import {
  AGE_PENSION_CLAIM_WEEKS_EARLY,
  SUPER_ACCESS_AGE_WHILE_WORKING,
  addYearsMonths,
  earliestClaimDate,
  pensionAgeBand,
  pensionAgeDate,
  preservationAgeBand,
  preservationAgeDate,
  yearsMonthsBetween,
} from "@/lib/constants/pension-age";

/**
 * The interactive date-of-birth calculator on /pension-age-australia/. Split
 * out so the rest of pension-age-australia.tsx renders on the server.
 */

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const noopSubscribe = () => () => {};
function useTodayIso(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const n = new Date();
      return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())).toISOString().slice(0, 10);
    },
    () => "",
  );
}

function toGo(today: Date | null, target: Date): string {
  if (!today) return "";
  const t = yearsMonthsBetween(today, target);
  if (t.passed) return "Already reached";
  const parts = [];
  if (t.years) parts.push(`${t.years} year${t.years === 1 ? "" : "s"}`);
  if (t.months) parts.push(`${t.months} month${t.months === 1 ? "" : "s"}`);
  return parts.length ? `${parts.join(" ")} to go` : "Less than a month to go";
}

export default function RetirementDatesCalculator() {
  const [dob, setDob] = useState("1970-01-01");
  const todayIso = useTodayIso();
  const today = todayIso ? parseIsoDate(todayIso) : null;
  const birth = parseIsoDate(dob);

  const pBand = birth ? pensionAgeBand(birth) : null;
  const pDate = birth ? pensionAgeDate(birth) : null;
  const sBand = birth ? preservationAgeBand(birth) : null;
  const sDate = birth ? preservationAgeDate(birth) : null;
  const s65 = birth ? addYearsMonths(birth, SUPER_ACCESS_AGE_WHILE_WORKING, 0) : null;

  const rows = birth && sBand && sDate && s65
    ? [
        {
          label: "Age Pension age",
          age: pBand ? pBand.label : "Reached before 1 July 2017",
          date: pDate ? formatDateAU(pDate) : "Already reached",
          note: pDate ? toGo(today, pDate) : "Already reached",
        },
        ...(pDate
          ? [{ label: "Earliest Age Pension claim", age: `${AGE_PENSION_CLAIM_WEEKS_EARLY} weeks before`, date: formatDateAU(earliestClaimDate(pDate)), note: toGo(today, earliestClaimDate(pDate)) }]
          : []),
        { label: "Super preservation age", age: `${sBand.years}`, date: formatDateAU(sDate), note: toGo(today, sDate) },
        { label: "Super access even if still working", age: `${SUPER_ACCESS_AGE_WHILE_WORKING}`, date: formatDateAU(s65), note: toGo(today, s65) },
      ]
    : [];

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 style={H} className="mb-6 text-xl font-semibold text-navy">Pension age calculator by date of birth</h2>
        <form onSubmit={(e) => e.preventDefault()} className="mb-6 max-w-xs">
          <label htmlFor="pa-dob" className="mb-1 block text-sm font-medium text-navy">Your date of birth</label>
          <input id="pa-dob" type="date" min="1930-01-01" max="2010-12-31" value={dob} onChange={(e) => setDob(e.target.value)}
            className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
        </form>
        {rows.length ? (
          <div className="overflow-x-auto" aria-live="polite">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-sandstone text-navy">
                <tr><th className="px-4 py-3">Milestone</th><th className="px-4 py-3">Age</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Time to go</th></tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/20 text-warmgray">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 font-medium text-navy">{r.label}</td>
                    <td className="px-4 py-3">{r.age}</td>
                    <td className="px-4 py-3 font-semibold text-navy">{r.date}</td>
                    <td className="px-4 py-3">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-warmgray">Enter a valid date of birth.</p>
        )}
        <p className="mt-4 text-xs text-warmgray">
          These dates show when you reach each age. Getting the Age Pension also depends on residence rules and the income and assets tests. Getting your super at preservation age also depends on retiring or starting a transition to retirement income stream.
        </p>
      </CardContent>
    </Card>
  );
}
