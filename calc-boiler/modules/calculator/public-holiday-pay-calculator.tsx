"use client";

// Public holiday pay calculator (G4). Hourly rate + hours + award and
// employment type → pay for the public holiday against the same hours on an
// ordinary day, plus what a permanent employee is owed for NOT working it.
// The arithmetic is lib/data/public-holidays/calc.ts (tested); the award
// multiples come from lib/data/public-holidays/award-rates.ts, which reads the
// award constants.

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import { PUBLIC_HOLIDAY_AWARD_RATES, getAwardPublicHolidayRate } from "@/lib/data/public-holidays/award-rates";
import { pctLabel, publicHolidayPay, type PhEmployment } from "@/lib/data/public-holidays/calc";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

const CUSTOM = "custom";

function entryHourly(href: string): number | undefined {
  return AWARD_DIRECTORY.find((a) => a.href === href)?.headlineHourly;
}

export interface PublicHolidayCalculatorProps {
  /** Holiday named in the heading, e.g. "Melbourne Cup Day". */
  holidayName?: string;
  awardKey?: string;
  employment?: PhEmployment;
  hours?: number;
  /** State code for the heading, e.g. "VIC". */
  stateCode?: string;
  /** Extra line under the result, e.g. SA's 7pm–midnight part-day rule. */
  partDayNote?: string;
}

export default function PublicHolidayPayCalculator({
  holidayName,
  awardKey = "retail",
  employment: initialEmployment = "permanent",
  hours: initialHours = 8,
  stateCode,
  partDayNote,
}: PublicHolidayCalculatorProps) {
  const initialAward = getAwardPublicHolidayRate(awardKey) ?? PUBLIC_HOLIDAY_AWARD_RATES[0];
  const [key, setKey] = useState<string>(initialAward.key);
  const [employment, setEmployment] = useState<PhEmployment>(initialEmployment);
  const [hourly, setHourly] = useState<number>(entryHourly(initialAward.href) ?? 30);
  const [hours, setHours] = useState<number>(initialHours);
  const [customPerm, setCustomPerm] = useState<number>(250);
  const [customCasual, setCustomCasual] = useState<number>(275);

  const award = key === CUSTOM ? undefined : getAwardPublicHolidayRate(key);
  const permanentMultiple = award ? award.permanent : customPerm / 100;
  const casualMultiple = award ? award.casual : customCasual / 100;
  const r = publicHolidayPay({ baseHourly: hourly, hours, employment, permanentMultiple, casualMultiple });
  const casual = employment === "casual";
  const heading = holidayName
    ? `What you're paid for working ${holidayName}${stateCode ? ` in ${stateCode}` : ""}`
    : "Public Holiday Pay Calculator";

  return (
    <Card className="not-prose shadow-md" id="public-holiday-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-1 text-xl font-semibold text-navy" style={CALC_FONT}>
          {heading}
        </h2>
        <p className="mb-6 text-sm text-warmgray">
          Enter your base hourly rate (the permanent rate from your payslip or award, before any casual loading), the
          hours you work on the day and your award. The award rate is read from the award&rsquo;s own penalty table.
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid content-start gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <SelectField
                id="ph-award"
                label="Award"
                value={key}
                onChange={(k) => {
                  setKey(k);
                  const next = getAwardPublicHolidayRate(k);
                  const h = next ? entryHourly(next.href) : undefined;
                  if (h) setHourly(h);
                }}
                options={[
                  ...PUBLIC_HOLIDAY_AWARD_RATES.map((a) => ({
                    value: a.key,
                    label: `${a.shortName} — ${pctLabel(a.permanent)} / casual ${pctLabel(a.casual)}`,
                  })),
                  { value: CUSTOM, label: "Enterprise agreement or other — enter the rate" },
                ]}
              />
            </div>
            <SelectField<PhEmployment>
              id="ph-employment"
              label="Employment type"
              value={employment}
              onChange={setEmployment}
              options={[
                { value: "permanent", label: "Full-time or part-time" },
                { value: "casual", label: "Casual" },
              ]}
            />
            <NumberField id="ph-hours" label="Hours worked on the day" value={hours} onChange={setHours} step={0.25} max={24} />
            <div className="sm:col-span-2">
              <NumberField
                id="ph-hourly"
                label="Base hourly rate ($)"
                hint={award ? "Prefilled with the award's entry-level adult rate from 1 July 2026. Change it to yours." : "Your ordinary (non-casual) hourly rate."}
                value={hourly}
                onChange={setHourly}
                step={0.01}
              />
            </div>
            {key === CUSTOM ? (
              <>
                <NumberField id="ph-custom-perm" label="Public holiday rate — permanent (%)" value={customPerm} onChange={setCustomPerm} step={5} max={500} />
                <NumberField id="ph-custom-casual" label="Public holiday rate — casual (% of base)" value={customCasual} onChange={setCustomCasual} step={5} max={500} />
              </>
            ) : null}
          </form>
          <div className="space-y-4">
            <dl className={RESULT_LIST} aria-live="polite">
              <ResultRow label={`Public holiday rate (${pctLabel(r.multiple)})`} value={`${formatAUD(r.holidayHourly, 2)}/h`} />
              <ResultRow label={`Pay for ${hours} hours on the public holiday`} value={formatAUD(r.holidayPay, 2)} bold />
              <ResultRow
                label={`Same hours on an ordinary weekday${casual ? " (incl. 25% loading)" : ""}`}
                value={formatAUD(r.ordinaryPay, 2)}
                muted
              />
              <ResultRow label="Extra for working the public holiday" value={formatAUD(r.extra, 2)} />
              <ResultRow
                label="If you don't work it and would normally be rostered"
                value={casual ? "$0.00 (casual)" : formatAUD(r.dayOffPay, 2)}
                muted
              />
            </dl>
            <p className={casual ? NOTE_WARN : NOTE_OK}>
              {casual
                ? "Casuals are paid only for public holidays they work. The casual rate shown already includes the 25% loading — it is not added again."
                : "Full-time and part-time employees who normally work that day are paid their base rate for their ordinary hours even when they have the day off (Fair Work Act s 116)."}
            </p>
            {award?.note ? <p className="text-xs text-warmgray">{award.shortName}: {award.note}</p> : null}
            {partDayNote ? <p className="text-xs text-warmgray">{partDayNote}</p> : null}
            <p className="text-xs text-warmgray-light">
              Before tax. Minimum shift lengths, overtime and allowances are not included.{" "}
              {award ? (
                <Link href={award.href} className="underline">
                  All {award.shortName} rates
                </Link>
              ) : (
                <Link href="/enterprise-agreement/" className="underline">
                  Checking an enterprise agreement
                </Link>
              )}
              {" · "}
              <Link href="/take-home-pay-calculator/" className="underline">
                Take-home pay after tax
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
