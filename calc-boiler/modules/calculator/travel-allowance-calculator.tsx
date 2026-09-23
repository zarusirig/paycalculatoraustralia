"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  CAPITAL_CITIES,
  HIGH_COST_CENTRE_NAMES,
  OVERSEAS_COUNTRY_NAMES,
  SALARY_BANDS,
  TD_2026_4,
  salaryBand,
  tripReasonableAmount,
  type CapitalCity,
  type Destination,
} from "@/lib/constants/travel-allowance";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// ATO reasonable travel allowance amounts for 2026-27 (TD 2026/4). All
// arithmetic in tripReasonableAmount() — lib/constants/travel-allowance.ts.

type Kind = Destination["kind"];

const KIND_OPTIONS: readonly { value: Kind; label: string }[] = [
  { value: "capital", label: "Capital city" },
  { value: "high-cost", label: "High-cost country centre" },
  { value: "other-country", label: "Other regional or country centre" },
  { value: "overseas", label: "Overseas" },
];

const UNLISTED = "__unlisted";

export default function TravelAllowanceCalculator() {
  const [salary, setSalary] = useState(95_000);
  const [kind, setKind] = useState<Kind>("capital");
  const [city, setCity] = useState<CapitalCity>("Sydney");
  const [centre, setCentre] = useState(HIGH_COST_CENTRE_NAMES[0]);
  const [country, setCountry] = useState("New Zealand");
  const [nights, setNights] = useState(3);
  const [provided, setProvided] = useState<"no" | "yes">("no");
  const [paid, setPaid] = useState(0);

  const destination: Destination = useMemo(() => {
    if (kind === "capital") return { kind, city };
    if (kind === "high-cost") return { kind, centre };
    if (kind === "overseas") return { kind, country: country === UNLISTED ? "" : country };
    return { kind: "other-country" };
  }, [kind, city, centre, country]);

  const overseas = kind === "overseas";
  const r = useMemo(
    () => tripReasonableAmount({ salary, destination, nights, allowancePaid: paid, accommodationProvided: !overseas && provided === "yes" }),
    [salary, destination, nights, paid, provided, overseas],
  );
  const band = salaryBand(salary);

  return (
    <Card className="shadow-md not-prose" id="travel-allowance-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>ATO Reasonable Travel Allowance Calculator {TD_2026_4.incomeYear}</h2>
        <p className="text-sm text-warmgray mb-6">The ATO&rsquo;s reasonable amounts for accommodation, meals and incidentals from {TD_2026_4.id}, for your salary and destination. Enter the allowance you were paid to see how much of it your employer should withhold tax from.</p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <NumberField id="ta-salary" label="Annual salary (excluding allowances)" hint="Part-time: use the full-time equivalent." value={salary} onChange={setSalary} step={1000} />
            <SelectField id="ta-kind" label="Where you're staying" value={kind} onChange={setKind} options={KIND_OPTIONS} />
            {kind === "capital" && (
              <SelectField id="ta-city" label="Capital city" value={city} onChange={setCity} options={CAPITAL_CITIES.map((c) => ({ value: c, label: c }))} />
            )}
            {kind === "high-cost" && (
              <SelectField id="ta-centre" label="Country centre (TD Table 4)" value={centre} onChange={setCentre} options={HIGH_COST_CENTRE_NAMES.map((c) => ({ value: c, label: c }))} />
            )}
            {kind === "overseas" && (
              <SelectField
                id="ta-country"
                label="Country"
                value={country}
                onChange={setCountry}
                options={[...OVERSEAS_COUNTRY_NAMES.map((c) => ({ value: c, label: c })), { value: UNLISTED, label: "Not listed (cost group 3)" }]}
              />
            )}
            <NumberField id="ta-nights" label="Nights away" value={nights} onChange={setNights} step={1} max={365} />
            {!overseas && (
              <SelectField id="ta-provided" label="Employer pays the accommodation directly?" value={provided} onChange={setProvided} options={[{ value: "no", label: "No — the allowance covers it" }, { value: "yes", label: "Yes — allowance is meals and incidentals only" }]} />
            )}
            <div className="sm:col-span-2">
              <NumberField id="ta-paid" label="Travel allowance paid for the trip (optional)" hint={overseas ? "Overseas: enter the meals and incidentals part only. Tax is always withheld from an overseas accommodation allowance." : undefined} value={paid} onChange={setPaid} step={10} />
            </div>
          </form>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">Per day · {r.daily.table} · salary {SALARY_BANDS[band].label}</p>
            <dl className={RESULT_LIST}>
              <ResultRow label="Accommodation (per night)" value={r.daily.accommodation === null ? "Must be substantiated" : formatAUD(r.daily.accommodation, 2)} />
              {r.daily.meals ? (
                <ResultRow label={`Meals (B ${formatAUD(r.daily.meals.breakfast, 2)} · L ${formatAUD(r.daily.meals.lunch, 2)} · D ${formatAUD(r.daily.meals.dinner, 2)})`} value={formatAUD(r.daily.mealsTotal, 2)} />
              ) : (
                <ResultRow label="Meals" value={formatAUD(r.daily.mealsTotal, 2)} />
              )}
              <ResultRow label="Incidentals" value={formatAUD(r.daily.incidentals, 2)} />
              <ResultRow label="Daily total" value={formatAUD(r.daily.total, 2)} bold />
            </dl>
            <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">Trip · {nights} night{nights === 1 ? "" : "s"}, {r.days} day{r.days === 1 ? "" : "s"}</p>
            <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-white px-5 py-2">
              {r.accommodation > 0 && <ResultRow label="Accommodation" value={formatAUD(r.accommodation, 2)} />}
              <ResultRow label="Meals (full days, maximum)" value={formatAUD(r.mealsMax, 2)} />
              <ResultRow label="Incidentals" value={formatAUD(r.incidentals, 2)} />
              <ResultRow label="Reasonable amount for the trip" value={formatAUD(r.total, 2)} bold />
              {paid > 0 && <ResultRow label="Allowance above the reasonable amount" value={formatAUD(r.excessOverReasonable, 2)} bold />}
            </dl>
            {paid > 0 && (
              <p className={r.excessOverReasonable > 0 ? NOTE_WARN : NOTE_OK} role="status" aria-live="polite">
                {r.excessOverReasonable > 0
                  ? `Your employer withholds tax from the ${formatAUD(r.excessOverReasonable, 2)} above the reasonable amount and shows the whole allowance on your income statement. `
                  : "If the other ATO conditions are met, no tax is withheld and the allowance stays off your income statement's allowance box. "}
                {overseas && "Any part of the allowance for overseas accommodation is always withheld from."}
              </p>
            )}
            <p className="text-xs text-warmgray-light">
              Meals on the first and last days count only if they fall within the trip, so the trip meal figure is a ceiling. Accommodation amounts apply to hotels, motels and serviced apartments only. Spend more than the reasonable amount and you need receipts for the whole claim, not just the excess.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
