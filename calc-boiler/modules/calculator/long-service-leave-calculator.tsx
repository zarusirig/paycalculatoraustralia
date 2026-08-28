"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import {
  JURISDICTION_CODES,
  LSL_JURISDICTIONS,
  entitlementOnEnding,
  lslWithholding,
  payoutValue,
  serviceBetween,
  splitLslComponents,
  type EndingReason,
  type JurisdictionCode,
} from "@/lib/constants/long-service-leave";
import { FONT, INPUT, LABEL, LINK, clamp, takeHomeSalaryStep, weeks } from "./long-service-leave-shared";

const REASONS: { key: EndingReason; label: string }[] = [
  { key: "resignation", label: "I resigned for another job or personal choice" },
  { key: "redundancy", label: "Genuine redundancy" },
  { key: "dismissal-not-misconduct", label: "The employer ended it (not misconduct)" },
  { key: "illness-or-pressing-necessity", label: "Illness, incapacity or pressing necessity" },
  { key: "retirement", label: "Retirement" },
  { key: "death", label: "Death (paid to the estate)" },
  { key: "serious-misconduct", label: "Dismissed for serious misconduct" },
];

/** Reasons the ATO treats concessionally: everything after 15 Aug 1978 at 32%. */
const REDUNDANCY_LIKE: EndingReason[] = ["redundancy"];

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div
      className={`flex justify-between items-baseline gap-4 ${
        highlight ? "bg-eucalyptus-light/40 -mx-2 px-2 py-1 rounded" : ""
      }`}
    >
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

const TODAY = new Date().toISOString().slice(0, 10);

export interface LongServiceLeaveCalculatorProps {
  /** Pre-set and lock the jurisdiction on a state spoke page. */
  jurisdiction?: JurisdictionCode;
  /** Heading rendered above the inputs. */
  heading?: string;
}

export default function LongServiceLeaveCalculator({
  jurisdiction,
  heading,
}: LongServiceLeaveCalculatorProps) {
  const [code, setCode] = useState<JurisdictionCode>(jurisdiction ?? "nsw");
  const [startDate, setStartDate] = useState("2016-07-01");
  const [endDate, setEndDate] = useState(TODAY);
  const [weeklyPay, setWeeklyPay] = useState(1_600);
  const [reason, setReason] = useState<EndingReason>("resignation");
  const [stillEmployed, setStillEmployed] = useState(true);

  const active = jurisdiction ?? code;
  const j = LSL_JURISDICTIONS[active];

  const result = useMemo(() => {
    const service = serviceBetween(startDate, endDate);
    const ent = entitlementOnEnding(active, service, reason);
    const balanceWeeks = stillEmployed ? ent.takeableWeeks : ent.payableOnEndingWeeks;
    const gross = payoutValue(balanceWeeks, weeklyPay);

    // Marginal rate is derived from the site's own tax engine rather than
    // quoted from a bracket, because a payout can push you into the next one.
    const annualSalary = Math.round(weeklyPay * 52);
    const taxBefore = calculatePayBreakdown({ grossSalary: annualSalary });
    const taxAfter = calculatePayBreakdown({ grossSalary: annualSalary + Math.round(gross) });
    const extraTax =
      taxBefore.netIncomeTax + taxBefore.medicareLevy - (taxAfter.netIncomeTax + taxAfter.medicareLevy);
    const marginalRate = gross > 0 ? Math.abs(extraTax) / gross : taxBefore.marginalTaxRate;

    const components = splitLslComponents(gross, startDate, endDate);
    const withheld = lslWithholding(
      components,
      REDUNDANCY_LIKE.includes(reason) ? "redundancy-invalidity-early-retirement" : "other",
      marginalRate,
    );

    return {
      service,
      ent,
      balanceWeeks,
      gross,
      annualSalary,
      marginalRate,
      components,
      withheld,
      net: gross - withheld.total,
    };
  }, [active, startDate, endDate, weeklyPay, reason, stillEmployed]);

  const { service, ent, balanceWeeks, gross, withheld, net, marginalRate } = result;
  const dailyPay = weeklyPay / 5;
  const takeHomeTarget = takeHomeSalaryStep(result.annualSalary + Math.round(gross));

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 md:p-8">
        <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">
          {heading ?? `Long Service Leave Calculator — ${j.abbr}`}
        </h2>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {!jurisdiction && (
              <div>
                <label htmlFor="lsl-state" className={LABEL}>
                  Where you work
                </label>
                <select
                  id="lsl-state"
                  value={code}
                  onChange={(e) => setCode(e.target.value as JurisdictionCode)}
                  className={INPUT}
                >
                  {JURISDICTION_CODES.map((c) => (
                    <option key={c} value={c}>
                      {LSL_JURISDICTIONS[c].name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-warmgray-light mt-1">
                  {j.act}. Qualifying period {j.takeAfterYears} years, {j.weeksAtQualifying} weeks.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="lsl-start" className={LABEL}>
                First day of continuous service
              </label>
              <input
                type="date"
                id="lsl-start"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="lsl-end" className={LABEL}>
                {stillEmployed ? "Work it out as at" : "Last day of employment"}
              </label>
              <input
                type="date"
                id="lsl-end"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="lsl-pay" className={LABEL}>
                Ordinary pay per week (before tax)
              </label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number"
                  id="lsl-pay"
                  min={0}
                  max={20_000}
                  step={10}
                  value={weeklyPay}
                  onChange={(e) => setWeeklyPay(clamp(Number(e.target.value || 0), 0, 20_000))}
                  className={INPUT}
                />
              </div>
              <p className="text-xs text-warmgray-light mt-1">
                Ordinary time only &mdash; no overtime. About {formatAUD(weeklyPay * 52)} a year.
              </p>
            </div>

            <fieldset className="space-y-2">
              <legend className={LABEL}>Are you still employed?</legend>
              <label className="flex items-center gap-2 text-sm text-warmgray">
                <input
                  type="radio"
                  name="lsl-status"
                  checked={stillEmployed}
                  onChange={() => setStillEmployed(true)}
                  className="accent-eucalyptus"
                />
                Yes &mdash; show what I can take as leave
              </label>
              <label className="flex items-center gap-2 text-sm text-warmgray">
                <input
                  type="radio"
                  name="lsl-status"
                  checked={!stillEmployed}
                  onChange={() => setStillEmployed(false)}
                  className="accent-eucalyptus"
                />
                No &mdash; show what is paid out
              </label>
            </fieldset>

            {!stillEmployed && (
              <div>
                <label htmlFor="lsl-reason" className={LABEL}>
                  Why the job ended
                </label>
                <select
                  id="lsl-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as EndingReason)}
                  className={INPUT}
                >
                  {REASONS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-warmgray-light mt-1">
                  {j.abbr} pays pro-rata from {j.proRataFromYears} years
                  {j.proRataUnconditionalFromYears > j.proRataFromYears
                    ? `, but only on defined grounds until ${j.proRataUnconditionalFromYears} years`
                    : ", however the job ends"}
                  .
                </p>
              </div>
            )}
          </form>

          <div className="space-y-5">
            <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
              <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">
                {stillEmployed ? "Long service leave you can take" : "Long service leave payable"}
              </div>
              <div className="text-4xl font-extrabold text-navy mb-1">
                {weeks(balanceWeeks)} weeks
              </div>
              <div className="text-sm text-warmgray">
                {formatAUD(gross)} gross at {formatAUD(weeklyPay)} a week &middot;{" "}
                {(balanceWeeks * 5).toFixed(1)} working days
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
              <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                  How {j.abbr} works it out
                </h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <Row
                  label="Continuous service"
                  value={`${service.years} yr ${service.months} mth ${service.weeks} wk ${service.days} d`}
                  bold
                />
                <Row
                  label={
                    j.proRataBasis === "completed-years"
                      ? "Service paid on (completed years only)"
                      : j.proRataBasis === "completed-years-and-months"
                        ? "Service paid on (completed years and months)"
                        : "Service paid on (part years count)"
                  }
                  value={`${(j.proRataBasis === "completed-years"
                    ? service.years
                    : j.proRataBasis === "completed-years-and-months"
                      ? service.years + service.months / 12
                      : service.decimalYears
                  ).toFixed(4)} years`}
                />
                <Row label="Rate" value={`${j.weeksPerYear.toFixed(4)} weeks per year`} />
                <Row label="Accrued to date" value={`${weeks(ent.accruedWeeks)} weeks`} />
                <div className="border-t border-sandstone-dark/20 pt-3" />
                <Row
                  label={`Qualifying period (${j.takeAfterYears} years)`}
                  value={
                    ent.canTakeLeave
                      ? "reached"
                      : `${ent.yearsToQualify.toFixed(1)} years to go`
                  }
                />
                <Row
                  label={stillEmployed ? "Takeable as leave now" : "Payable on ending"}
                  value={`${weeks(balanceWeeks)} weeks`}
                  bold
                  highlight
                />
                {!stillEmployed && (
                  <p className="text-xs text-warmgray pt-1">{ent.payableExplanation}</p>
                )}
                {stillEmployed && !ent.canTakeLeave && (
                  <p className="text-xs text-warmgray pt-1">
                    {j.abbr} does not let you take long service leave until {j.takeAfterYears} years of
                    continuous service. You have still accrued {weeks(ent.accruedWeeks)} weeks, and{" "}
                    {ent.accruedWeeks > 0 && service.years >= j.proRataFromYears
                      ? "it can be payable if the job ends."
                      : `a pro-rata payment only becomes possible at ${j.proRataFromYears} years.`}
                  </p>
                )}
              </div>
            </div>

            {gross > 0 && (
              <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                  <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
                    Tax on the payout (ATO)
                  </h3>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <Row label="Gross payout" value={formatAUD(gross, 2)} bold />
                  {result.components.pre1978 > 0.5 && (
                    <Row
                      label="Pre-16 Aug 1978 service (5% taxed)"
                      value={`-${formatAUD(withheld.pre1978Withheld, 2)}`}
                    />
                  )}
                  {result.components.between1978And1993 > 0.5 && (
                    <Row
                      label="16 Aug 1978 – 17 Aug 1993 (flat 32%)"
                      value={`-${formatAUD(withheld.between1978And1993Withheld, 2)}`}
                    />
                  )}
                  <Row
                    label={
                      REDUNDANCY_LIKE.includes(reason) && !stillEmployed
                        ? "Post-15 Aug 1978, genuine redundancy (flat 32%)"
                        : `Post-17 Aug 1993 at your marginal rate (${(marginalRate * 100).toFixed(1)}%)`
                    }
                    value={`-${formatAUD(withheld.post1993Withheld, 2)}`}
                  />
                  <div className="border-t border-sandstone-dark/20 pt-3" />
                  <Row label="Tax withheld" value={`-${formatAUD(withheld.total, 2)}`} />
                  <Row label="In your hand" value={formatAUD(net, 2)} bold highlight />
                  <p className="text-xs text-warmgray pt-1">
                    Long service leave you <em>take</em> as leave is taxed like ordinary pay. This
                    schedule is for an <strong>unused</strong> balance paid out when the job ends. See{" "}
                    <Link href={`/take-home-pay-on/${takeHomeTarget}/`} className={LINK}>
                      take-home pay on {formatAUD(takeHomeTarget)}
                    </Link>{" "}
                    for the year that includes it, or the{" "}
                    <Link href="/final-pay-calculator/" className={LINK}>
                      final pay calculator
                    </Link>{" "}
                    for the whole termination payment.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
              <strong>Not modelled:</strong> unpaid leave and other absences that do not count as
              service; long service leave you have already taken; portable schemes (building and
              construction, contract cleaning, community services, security, black coal); an award or
              agreement that replaces the Act; and pay averaging where your hours changed. A day is
              taken as one fifth of a week ({formatAUD(dailyPay, 2)} here). Check the balance on your
              payslip against this figure and ask payroll about any gap.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
