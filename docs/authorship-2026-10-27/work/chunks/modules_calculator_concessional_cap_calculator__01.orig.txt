"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG, SUPER_GUARANTEE, calculatePayBreakdown, formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import {
  CARRY_FORWARD,
  CONTRIBUTIONS_TAX_RATE,
  concessionalCapPosition,
  division293Estimate,
} from "@/lib/constants/super-contributions";

// Cap position from concessionalCapPosition(); tax saved from the site's core
// calculatePayBreakdown(), the same engine behind /salary-sacrifice-calculator/,
// so the two pages cannot disagree. Sources are cited in super-contributions.ts.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";
const num = (v: string) => Math.max(0, Number(v || 0));
const FY = SITE_CONFIG.financialYear;

function Field({ id, label, hint, value, onChange, step = 1_000 }: { id: string; label: string; hint?: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1">{label}</label>
      <input id={id} type="number" min={0} step={step} value={value} onChange={(e) => onChange(num(e.target.value))} className={INPUT} />
      {hint && <p className="mt-1 text-xs text-warmgray">{hint}</p>}
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 text-sm ${muted ? "text-warmgray" : "text-navy"}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums text-right ${bold ? "font-bold text-base" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

export default function ConcessionalCapCalculator() {
  const [salary, setSalary] = useState(100_000);
  const [sacrifice, setSacrifice] = useState(10_000);
  const [personal, setPersonal] = useState(0);
  const [other, setOther] = useState(0);
  const [unused, setUnused] = useState(0);
  const [tsb, setTsb] = useState(150_000);

  const pos = useMemo(
    () => concessionalCapPosition({ salary, salarySacrifice: sacrifice, personalDeductible: personal, otherEmployer: other, unusedCarryForward: unused, totalSuperBalance: tsb }),
    [salary, sacrifice, personal, other, unused, tsb],
  );

  const effect = useMemo(() => {
    const without = calculatePayBreakdown({ grossSalary: salary, salarySacrifice: personal });
    const withSac = calculatePayBreakdown({ grossSalary: salary, salarySacrifice: sacrifice + personal });
    const taxSaved = without.totalDeductions - withSac.totalDeductions;
    const takeHomeDrop = without.takeHomePay - withSac.takeHomePay;
    const contributionsTax = sacrifice * CONTRIBUTIONS_TAX_RATE;
    const div293 = division293Estimate(withSac.taxableIncome, pos.totalConcessional);
    const div293Before = division293Estimate(without.taxableIncome, pos.totalConcessional - sacrifice);
    const extraDiv293 = Math.max(0, div293 - div293Before);
    const netToSuper = sacrifice - contributionsTax;
    return {
      taxSaved,
      takeHomeDrop,
      contributionsTax,
      div293,
      extraDiv293,
      netToSuper,
      gain: netToSuper - extraDiv293 - takeHomeDrop,
      marginal: withSac.marginalTaxRate,
    };
  }, [salary, sacrifice, personal, pos.totalConcessional]);

  return (
    <Card className="shadow-md not-prose" id="cap-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>Concessional Cap &amp; Salary Sacrifice Calculator {FY}</h2>
        <p className="text-sm text-warmgray mb-6">Checks your before-tax contributions against the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap (plus any carry-forward), then shows what salary sacrificing does to your pay and your super.</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <Field id="cc-salary" label="Salary (before sacrifice, excluding super)" hint={`Employer super guarantee is ${formatPercent(SUPER_GUARANTEE.rate, 0)} of this.`} value={salary} onChange={setSalary} />
            <Field id="cc-sacrifice" label="Salary sacrifice to super, per year" value={sacrifice} onChange={setSacrifice} step={500} />
            <Field id="cc-personal" label="Personal contributions you'll claim a deduction for" value={personal} onChange={setPersonal} step={500} />
            <Field id="cc-other" label="Other employer concessional contributions" hint="e.g. employer super above the 12%." value={other} onChange={setOther} step={500} />
            <Field id="cc-unused" label="Unused cap you can carry forward" hint="Shown in ATO online services under Super → Information." value={unused} onChange={setUnused} />
            <Field id="cc-tsb" label="Total super balance at 30 June last year" hint={`Carry-forward needs this under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}.`} value={tsb} onChange={setTsb} step={10_000} />
          </form>

          <div className="space-y-4">
            <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-sandstone/40 px-5 py-2">
              <Row label={`Employer super guarantee (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={formatAUD(pos.superGuarantee)} />
              <Row label="Total concessional contributions" value={formatAUD(pos.totalConcessional)} />
              <Row label="General cap" value={formatAUD(pos.generalCap)} muted />
              {pos.carryForwardAvailable > 0 && <Row label="Plus carry-forward" value={formatAUD(pos.carryForwardAvailable)} muted />}
              <Row label="Your cap this year" value={formatAUD(pos.availableCap)} />
              {pos.excess > 0 ? (
                <Row label="Over the cap by" value={formatAUD(pos.excess)} bold />
              ) : (
                <Row label="Room left under the cap" value={formatAUD(pos.headroom)} bold />
              )}
            </dl>
            <p className={`rounded-lg border-l-4 p-3 text-sm text-navy ${pos.excess > 0 ? "border-ochre bg-sandstone" : "border-eucalyptus bg-eucalyptus-light/30"}`} role="status" aria-live="polite">
              {pos.excess > 0
                ? `Excess concessional contributions are added to your assessable income and taxed at your marginal rate, less a 15% offset. Keep salary sacrifice to ${formatAUD(pos.maxSalarySacrifice)} or less to stay within the cap.`
                : `You could salary sacrifice up to ${formatAUD(pos.maxSalarySacrifice)} this year without going over the cap.`}
              {!pos.carryForwardEligible && unused > 0 && ` Your carry-forward amount isn't counted because your total super balance is ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} or more.`}
            </p>

            {sacrifice > 0 && pos.excess === 0 && (
              <dl className="divide-y divide-sandstone-dark/20 rounded-xl border border-sandstone-dark/20 bg-white px-5 py-2">
                <Row label="Income tax and Medicare levy saved" value={formatAUD(effect.taxSaved)} />
                <Row label="Take-home pay falls by" value={formatAUD(effect.takeHomeDrop)} />
                <Row label={`15% contributions tax in the fund`} value={formatNegAUD(effect.contributionsTax, 0, "−")} muted />
                {effect.extraDiv293 > 0 && <Row label="Extra Division 293 tax (estimate)" value={formatNegAUD(effect.extraDiv293, 0, "−")} muted />}
                <Row label="Added to your super after tax" value={formatAUD(effect.netToSuper - effect.extraDiv293)} />
                <Row label="Net gain vs taking it as pay" value={formatAUD(effect.gain)} bold />
              </dl>
            )}
            <p className="text-xs text-warmgray-light">
              {FY} resident tax rates, with private hospital cover assumed so the surcharge isn&rsquo;t counted. Contributions count in the year your fund receives them.{effect.div293 > 0 && <> Division 293 may apply: see <Link href="/division-293-tax/" className="underline">Division 293 tax</Link>.</>} For pay-period detail use the <Link href="/salary-sacrifice-calculator/" className="underline">salary sacrifice calculator</Link>.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
