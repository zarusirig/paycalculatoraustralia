"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { MODERN_AWARDS } from "@/lib/constants/modern-awards";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES, RETAIL_AWARD, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { CALC_FONT, NOTE_OK, NOTE_WARN, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Compares an enterprise agreement base rate with the modern award base rate
// for the same classification. An agreement's base rate of pay can't be less
// than the award's (Fair Work Act s 206; FWO "About agreements"). Award rates
// come from the site's award constants (1 July 2026 rates).

interface AwardOption {
  code: string;
  name: string;
  href: string;
  rates: readonly { level: string; hourly: number }[];
}

const AWARDS: AwardOption[] = [
  { code: RETAIL_AWARD.code, name: "General Retail Award", href: "/retail-award-rates/", rates: RETAIL_RATES },
  { code: HOSPITALITY_AWARD.code, name: "Hospitality Award", href: "/hospitality-award-rates/", rates: HOSPITALITY_RATES },
  ...Object.values(MODERN_AWARDS).map((a) => ({ code: a.meta.code, name: a.meta.shortName, href: a.meta.href, rates: a.rates })),
];

export default function EaAwardFloorChecker() {
  const [code, setCode] = useState(AWARDS[0].code);
  const award = AWARDS.find((a) => a.code === code) ?? AWARDS[0];
  const [level, setLevel] = useState(award.rates[0].level);
  const [eaRate, setEaRate] = useState(28.5);

  const row = award.rates.find((r) => r.level === level) ?? award.rates[0];
  const diff = Math.round((eaRate - row.hourly) * 100) / 100;
  const pct = row.hourly > 0 ? (diff / row.hourly) * 100 : 0;

  return (
    <Card className="shadow-md not-prose" id="ea-award-checker">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Is Your Agreement Rate Above the Award?</h2>
        <p className="text-sm text-warmgray mb-6">An enterprise agreement can&rsquo;t pay a lower base rate than the award that would otherwise cover you. Compare your agreement&rsquo;s hourly rate with the award rate from 1 July 2026.</p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <SelectField
              id="ea-award"
              label="Award that would cover your job"
              value={code}
              onChange={(c) => {
                setCode(c);
                const next = AWARDS.find((a) => a.code === c);
                if (next) setLevel(next.rates[0].level);
              }}
              options={AWARDS.map((a) => ({ value: a.code, label: `${a.name} (${a.code})` }))}
            />
            <SelectField id="ea-level" label="Award classification" value={row.level} onChange={setLevel} options={award.rates.map((r) => ({ value: r.level, label: r.level }))} />
            <div className="sm:col-span-2">
              <NumberField id="ea-rate" label="Your agreement's base hourly rate (full-time/part-time)" hint="From your payslip or the agreement's pay table, before penalties or loadings." value={eaRate} onChange={setEaRate} step={0.01} />
            </div>
          </form>
          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Award base rate" value={`${formatAUD(row.hourly, 2)}/h`} />
              <ResultRow label="Your agreement rate" value={`${formatAUD(eaRate, 2)}/h`} />
              <ResultRow label={diff >= 0 ? "Above the award by" : "Below the award by"} value={`${formatAUD(Math.abs(diff), 2)}/h (${Math.abs(pct).toFixed(1)}%)`} bold />
              <ResultRow label="Over a 38-hour week" value={formatAUD(Math.abs(diff) * 38, 2)} muted />
            </dl>
            <p className={diff >= 0 ? NOTE_OK : NOTE_WARN} role="status" aria-live="polite">
              {diff >= 0
                ? "Your base rate meets the award floor. Penalty rates, allowances and other terms are set by the agreement itself, which had to pass the better off overall test when it was approved."
                : "An agreement's base rate can't be less than the award's. If the award rate has overtaken your agreement, your employer must pay at least the award base rate. Check you've picked the right classification, then raise it with your employer or the Fair Work Ombudsman."}
            </p>
            <p className="text-xs text-warmgray-light">
              Award rates from the first full pay period on or after 1 July 2026. Full classification tables: <Link href={award.href} className="underline">{award.name} rates</Link>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
