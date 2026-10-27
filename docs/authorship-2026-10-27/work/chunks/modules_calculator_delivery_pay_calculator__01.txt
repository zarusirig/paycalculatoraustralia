"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  DEFAULT_COST_PER_KM,
  DELIVERY_MSO,
  DELIVERY_RATE_PERIODS,
  DELIVERY_VEHICLES,
  deliveryFloor,
  engagedMinutes,
  type DeliveryRatePeriodId,
  type DeliveryVehicle,
} from "@/lib/constants/delivery-minimum-pay";
import { gigTax } from "@/lib/constants/gig-tax";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Delivery payout vs the legal floor. All arithmetic is in
// lib/constants/delivery-minimum-pay.ts (tested) and lib/constants/gig-tax.ts.
// Every number shown is derived from the figures the reader types in; nothing
// here says what anyone earns.

const VEHICLE_OPTIONS = DELIVERY_VEHICLES.map((v) => ({ value: v.id, label: v.label }));
const PERIOD_OPTIONS = DELIVERY_RATE_PERIODS.map((p) => ({ value: p.id, label: p.label }));
const YES_NO = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

const hm = (mins: number) => `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;

export default function DeliveryPayCalculator() {
  const [vehicle, setVehicle] = useState<DeliveryVehicle>("bicycle-or-none");
  const [period, setPeriod] = useState<DeliveryRatePeriodId>("2026");
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [paid, setPaid] = useState(300);
  const [km, setKm] = useState(0);
  const [costPerKm, setCostPerKm] = useState(DEFAULT_COST_PER_KM);
  const [otherCosts, setOtherCosts] = useState(0);
  const [days, setDays] = useState(14);
  const [showTax, setShowTax] = useState<"yes" | "no">("no");
  const [otherIncome, setOtherIncome] = useState(0);

  const mins = engagedMinutes(hours, minutes);
  const r = useMemo(
    () => deliveryFloor({ vehicle, period, engagedMinutes: mins, paid, km, costPerKm, otherCosts }),
    [vehicle, period, mins, paid, km, costPerKm, otherCosts],
  );

  // Tax on the period, assuming the same figures repeat across a full year.
  const tax = useMemo(() => {
    if (showTax !== "yes" || days <= 0) return null;
    const factor = 365 / Math.min(Math.max(days, 1), 365);
    const t = gigTax({
      grossPayments: r.entitledTotal * factor,
      expenses: r.expenses * factor,
      expensesIncludeGst: false,
      gstRegistered: false,
      otherIncome,
    });
    const share = days / 365;
    const setAside = t.setAside * share;
    return { setAside, afterTax: r.profitBeforeTax - setAside, annualProfit: t.netBusinessIncome, annualTax: t.setAside };
  }, [showTax, days, r.entitledTotal, r.expenses, r.profitBeforeTax, otherIncome]);

  return (
    <Card className="shadow-md not-prose" id="delivery-pay-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Delivery Pay vs the Legal Minimum</h2>
        <p className="text-sm text-warmgray mb-6">
          Replace the example figures with one earnings period from your platform&rsquo;s statement. The calculator works out the minimum the order guarantees for your engaged time, any top-up owed, and what is left after your costs and tax.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="dp-vehicle" label="How you deliver" value={vehicle} onChange={setVehicle} options={VEHICLE_OPTIONS} />
            </div>
            <div className="sm:col-span-2">
              <SelectField id="dp-period" label="Rates in force" hint="The order has a new rate table from 1 January 2027." value={period} onChange={setPeriod} options={PERIOD_OPTIONS} />
            </div>
            <NumberField id="dp-hours" label="Engaged hours" hint="From accepting an order to completing it, as recorded in the app." value={hours} onChange={setHours} step={1} max={400} />
            <NumberField id="dp-mins" label="Plus minutes" value={minutes} onChange={setMinutes} step={1} max={59} />
            <div className="sm:col-span-2">
              <NumberField id="dp-paid" label="Paid to you for the period ($)" hint="The total on your earnings statement for the same period." value={paid} onChange={setPaid} step={1} />
            </div>
            <NumberField id="dp-km" label="Kilometres while delivering" hint="From your odometer or app. Leave 0 for walking." value={km} onChange={setKm} step={1} />
            <NumberField id="dp-cpk" label="Cost per km ($)" hint={`Default is the ATO's ${Math.round(DEFAULT_COST_PER_KM * 100)}c cents-per-km rate. Use your own running cost if you know it.`} value={costPerKm} onChange={setCostPerKm} step={0.01} />
            <div className="sm:col-span-2">
              <NumberField id="dp-other" label="Other costs in the period ($)" hint="Phone data, delivery bag, parking, fines you copped." value={otherCosts} onChange={setOtherCosts} step={1} />
            </div>
            <div className="sm:col-span-2">
              <SelectField id="dp-tax" label="Show a tax estimate?" hint="Assumes this period's figures repeated over a year, and no other business. Illustration only." value={showTax} onChange={setShowTax} options={YES_NO} />
            </div>
            {showTax === "yes" && (
              <>
                <NumberField id="dp-days" label="Days in the earnings period" hint={`Up to ${DELIVERY_MSO.maxEarningsPeriodDays} under the order.`} value={days} onChange={setDays} step={1} max={365} min={1} />
                <NumberField id="dp-oi" label="Other taxable income in the year ($)" hint="Wages from another job, if any." value={otherIncome} onChange={setOtherIncome} step={1000} />
              </>
            )}
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Engaged time" value={hm(mins)} muted />
              <ResultRow label="Minimum hourly rate" value={`${formatAUD(r.rate, 2)} an hour`} />
              <ResultRow label="Earnings floor for the period" value={formatAUD(r.floor, 2)} bold />
              <ResultRow label="Platform paid you" value={formatAUD(Math.max(0, paid), 2)} />
              <ResultRow label="Top-up owed" value={formatAUD(r.topUp, 2)} bold />
              <ResultRow label="Your payout per engaged hour" value={mins > 0 ? `${formatAUD(r.effectiveHourly, 2)} an hour` : "n/a"} muted />
            </dl>

            {mins === 0 ? (
              <p className={NOTE_WARN} role="status" aria-live="polite">Enter your engaged hours to see the floor.</p>
            ) : r.belowFloor ? (
              <p className={NOTE_WARN} role="status" aria-live="polite">
                Your payout is {formatAUD(r.topUp, 2)} under the floor for {hm(mins)} of engaged time. Under clause 14.1 of the order the platform must pay the difference as a top-up, in the next earnings period or within {DELIVERY_MSO.topUpDueDays} days after it. Check your engaged hours against the platform&rsquo;s statement first, because time the platform excludes (cancelled orders, breaks, flagged waiting) does not count.
              </p>
            ) : (
              <p className={NOTE_OK} role="status" aria-live="polite">
                Your payout is at or above the floor ({formatAUD(r.floor, 2)}), so no top-up is owed for this period on these figures.
              </p>
            )}

            <dl className={RESULT_LIST}>
              <ResultRow label="Vehicle cost" value={`−${formatAUD(r.vehicleCost, 2)}`} muted />
              <ResultRow label="Other costs" value={`−${formatAUD(r.otherCosts, 2)}`} muted />
              <ResultRow label="Left after costs (before tax)" value={formatAUD(r.profitBeforeTax, 2)} bold />
              <ResultRow label="Left per engaged hour" value={mins > 0 ? `${formatAUD(r.profitPerEngagedHour, 2)} an hour` : "n/a"} muted />
              {tax && <ResultRow label="Estimated tax to set aside for this period" value={`−${formatAUD(tax.setAside, 2)}`} muted />}
              {tax && <ResultRow label="Left after costs and tax" value={formatAUD(tax.afterTax, 2)} bold />}
            </dl>

            <p className="text-xs text-warmgray-light">
              The {formatAUD(r.rate, 2)} rate is before your expenses: the order makes vehicle, fuel, insurance and phone costs your own. Whether tips count as &ldquo;paid&rdquo; is not set out in the order&rsquo;s text, so check your platform&rsquo;s statement or call the Fair Work Infoline on 13 13 94.
              {tax && ` The tax figure repeats this period over a year (${formatAUD(tax.annualProfit, 0)} profit), then applies the 2026-27 resident rates and the Medicare levy. It is not your tax bill.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
