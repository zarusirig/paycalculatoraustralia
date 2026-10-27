"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SUPER_GUARANTEE, formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import { FREQUENCY_LABELS, PAY_PERIODS, type PayFrequency } from "@/lib/constants/payg-withholding";
import { grossFromNet, payslipFromGross } from "@/lib/constants/gross-vs-net";
import { CALC_FONT, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Gross → net and net → gross for one pay period, on the ATO Schedule 1
// withholding engine (lib/constants/gross-vs-net.ts). "Net" here is what the
// payslip pays into your account, not the year-end tax result.

type Mode = "gross-to-net" | "net-to-gross";
const FREQS: PayFrequency[] = ["weekly", "fortnightly", "monthly"];
const FREQ_OPTION: Record<PayFrequency, string> = { weekly: "Weekly", fortnightly: "Fortnightly", monthly: "Monthly" };

export default function GrossVsNetCalculator() {
  const [mode, setMode] = useState<Mode>("gross-to-net");
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [amount, setAmount] = useState(3_000);
  const [tft, setTft] = useState<"yes" | "no">("yes");
  const [stsl, setStsl] = useState<"no" | "yes">("no");
  const [sacrifice, setSacrifice] = useState(0);
  const [postTax, setPostTax] = useState(0);

  const options = useMemo(() => ({ claimsTaxFreeThreshold: tft === "yes", hasSTSL: stsl === "yes" }), [tft, stsl]);

  const slip = useMemo(() => {
    if (mode === "gross-to-net") {
      return payslipFromGross({ gross: amount, frequency, salarySacrifice: sacrifice, postTaxDeductions: postTax, options });
    }
    const gross = grossFromNet(amount, frequency, options);
    return payslipFromGross({ gross, frequency, options });
  }, [mode, amount, frequency, sacrifice, postTax, options]);

  const periods = PAY_PERIODS[frequency];
  const per = FREQUENCY_LABELS[frequency];

  return (
    <Card className="shadow-md not-prose" id="gross-net-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Gross to Net / Net to Gross Pay Converter</h2>
        <p className="text-sm text-warmgray mb-6">Uses the ATO&rsquo;s 2026-27 withholding formulas, so the net figure matches what a payslip pays, not the year-end tax result.</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
            <SelectField id="gn-mode" label="I know my" value={mode} onChange={setMode} options={[{ value: "gross-to-net", label: "Gross pay (work out net)" }, { value: "net-to-gross", label: "Net pay (work out gross)" }]} />
            <SelectField id="gn-freq" label="Pay frequency" value={frequency} onChange={setFrequency} options={FREQS.map((f) => ({ value: f, label: FREQ_OPTION[f] }))} />
            <NumberField id="gn-amount" label={mode === "gross-to-net" ? `Gross pay per ${per}` : `Net pay per ${per}`} value={amount} onChange={setAmount} step={50} />
            <SelectField id="gn-tft" label="Claiming the tax-free threshold?" value={tft} onChange={setTft} options={[{ value: "yes", label: "Yes (main job)" }, { value: "no", label: "No (second job)" }]} />
            <SelectField id="gn-stsl" label="HELP or other study loan?" value={stsl} onChange={setStsl} options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
            {mode === "gross-to-net" && (
              <>
                <NumberField id="gn-sac" label="Salary sacrifice (pre-tax), per pay" value={sacrifice} onChange={setSacrifice} step={10} />
                <NumberField id="gn-post" label="After-tax deductions, per pay" hint="Union fees, donations, etc." value={postTax} onChange={setPostTax} step={5} />
              </>
            )}
          </form>
          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Gross pay" value={formatAUD(slip.gross, 2)} bold={mode === "net-to-gross"} />
              {slip.salarySacrifice > 0 && <ResultRow label="Less salary sacrifice (pre-tax)" value={formatNegAUD(slip.salarySacrifice, 2, "−")} muted />}
              {slip.salarySacrifice > 0 && <ResultRow label="Taxable gross" value={formatAUD(slip.taxableGross, 2)} />}
              <ResultRow label="PAYG tax withheld" value={formatNegAUD(slip.paygWithheld, 2, "−")} muted />
              {slip.stslWithheld > 0 && <ResultRow label="Study loan (HELP) repayment" value={formatNegAUD(slip.stslWithheld, 2, "−")} muted />}
              {slip.postTaxDeductions > 0 && <ResultRow label="After-tax deductions" value={formatNegAUD(slip.postTaxDeductions, 2, "−")} muted />}
              <ResultRow label="Net pay" value={formatAUD(slip.net, 2)} bold={mode === "gross-to-net"} />
              <ResultRow label={`Employer super (${formatPercent(SUPER_GUARANTEE.rate, 0)}, paid on top)`} value={formatAUD(slip.employerSuper, 2)} muted />
            </dl>
            <p className="rounded-lg border-l-4 border-eucalyptus bg-eucalyptus-light/30 p-3 text-sm text-navy" role="status" aria-live="polite">
              {formatAUD(slip.gross, 2)} gross is about {formatAUD(slip.gross * periods)} a year; {formatAUD(slip.net, 2)} net is about {formatAUD(slip.net * periods)} a year. {(slip.deductionRate * 100).toFixed(1)}% of your gross pay is deducted before it reaches you.
            </p>
            <p className="text-xs text-warmgray-light">
              Resident 2026-27 withholding scales; offsets beyond those built into the scales aren&rsquo;t included. Your actual tax is settled in your return: see the <Link href="/gross-pay-calculator/" className="underline">gross pay calculator</Link> for the annual figure.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
