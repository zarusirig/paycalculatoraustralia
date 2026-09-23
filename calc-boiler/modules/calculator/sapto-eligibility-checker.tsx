"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  SAPTO_BANDS,
  SAPTO_INCOME_YEAR,
  calculateSAPTO,
  type SaptoStatus,
} from "@/lib/constants/sapto";

// The eligibility tests below follow the ATO's "Seniors and pensioners tax
// offset" page (QC72197): a pension/allowance condition, an income condition
// tested on half of combined rebate income for couples, and the whole-year
// jail exclusion. The income test and offset amount come from calculateSAPTO,
// so the checker cannot disagree with the calculator on the same page.

type PensionAnswer = "" | "receives" | "eligible-not-receiving" | "neither";

const PENSIONS = [
  "Age Pension",
  "Carer Payment",
  "Disability Support Pension (if you are age-pension age)",
  "Education Entry Payment",
  "Parenting Payment (single)",
  "Age service pension, income support supplement or Veteran Payment (DVA)",
  "Invalidity service pension (if you are age-pension age) or partner service pension",
];

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

export default function SaptoEligibilityChecker() {
  const [pension, setPension] = useState<PensionAnswer>("");
  const [jailAllYear, setJailAllYear] = useState(false);
  const [status, setStatus] = useState<SaptoStatus>("single");
  const [income, setIncome] = useState(30_000);
  const [spouseIncome, setSpouseIncome] = useState(20_000);

  const verdict = useMemo(() => {
    if (pension === "") return null;
    if (jailAllYear) {
      return { ok: false, text: "Not eligible: SAPTO cannot be claimed if you were in jail for the whole income year." };
    }
    if (pension === "neither") {
      return {
        ok: false,
        text: "Not eligible on the payment condition: SAPTO needs one of the listed payments, or Age Pension eligibility at age-pension age. If you are a self-funded retiree aged 67 or older who meets the residence rules, choose the second option — failing the Age Pension income or assets test does not stop you qualifying that way.",
      };
    }
    const r = calculateSAPTO({
      status,
      rebateIncome: income,
      spouseRebateIncome: spouseIncome,
      eligibleForPension: true,
    });
    const band = SAPTO_BANDS[status];
    if (!r.eligible) {
      return {
        ok: false,
        text:
          status === "single"
            ? `Not eligible on income: your rebate income must be under ${formatAUD(band.cutOutThreshold)}.`
            : `Not eligible on income: half your combined rebate income (${formatAUD(r.assessedRebateIncome, 2)}) must be under ${formatAUD(band.cutOutThreshold)} — combined under ${formatAUD(band.combinedCutOut)}.`,
      };
    }
    if (r.offset === 0) {
      return {
        ok: true,
        text: `You pass both eligibility tests, but your own rebate income is high enough that the offset works out to ${formatAUD(0)}. You may still be able to receive a transfer of your spouse's unused SAPTO.`,
      };
    }
    return {
      ok: true,
      text: `Eligible. Estimated SAPTO: ${formatAUD(r.offset)} for ${SAPTO_INCOME_YEAR}, out of a maximum of ${formatAUD(band.maxOffset)}. It is non-refundable, so it can reduce your tax to nil but not below.`,
    };
  }, [pension, jailAllYear, status, income, spouseIncome]);

  return (
    <Card className="shadow-md not-prose" id="sapto-eligibility">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>
          SAPTO Eligibility Checker
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Three questions, in the order the ATO applies them: the payment condition, the income
          condition, and the jail exclusion.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-navy mb-2">1. Which describes you during the income year?</legend>
            <div className="space-y-2 text-sm text-navy">
              <label className="flex items-start gap-2">
                <input type="radio" name="sapto-pension" checked={pension === "receives"} onChange={() => setPension("receives")} className="mt-1 accent-eucalyptus" />
                <span>
                  I received at least one of these payments:
                  <span className="block text-xs text-warmgray mt-1">{PENSIONS.join(" · ")}</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="sapto-pension" checked={pension === "eligible-not-receiving"} onChange={() => setPension("eligible-not-receiving")} className="mt-1 accent-eucalyptus" />
                <span>
                  I was age-pension age (67+) and eligible for the Age Pension, but did not get it because I did not claim or did not meet the income or assets test
                  <span className="block text-xs text-warmgray mt-1">You must also meet the Age Pension residence rules (generally 10 years of Australian residence).</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="sapto-pension" checked={pension === "neither"} onChange={() => setPension("neither")} className="mt-1 accent-eucalyptus" />
                <span>Neither of these</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <legend className="text-sm font-semibold text-navy mb-2 sm:col-span-2">2. Your situation and rebate income</legend>
            <div>
              <label htmlFor="sapto-el-status" className="block text-sm font-medium text-navy mb-1">Situation</label>
              <select id="sapto-el-status" value={status} onChange={(e) => setStatus(e.target.value as SaptoStatus)} className={INPUT}>
                <option value="single">Single</option>
                <option value="couple">Couple living together</option>
                <option value="illnessSeparated">Couple apart due to illness</option>
              </select>
            </div>
            <div>
              <label htmlFor="sapto-el-income" className="block text-sm font-medium text-navy mb-1">Your rebate income</label>
              <input id="sapto-el-income" type="number" min={0} step={500} value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value || 0)))} className={INPUT} />
            </div>
            {status !== "single" && (
              <div>
                <label htmlFor="sapto-el-spouse" className="block text-sm font-medium text-navy mb-1">Spouse&apos;s rebate income</label>
                <input id="sapto-el-spouse" type="number" min={0} step={500} value={spouseIncome}
                  onChange={(e) => setSpouseIncome(Math.max(0, Number(e.target.value || 0)))} className={INPUT} />
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-navy mb-2">3. Jail</legend>
            <label className="flex items-start gap-2 text-sm text-navy">
              <input type="checkbox" checked={jailAllYear} onChange={(e) => setJailAllYear(e.target.checked)} className="mt-1 accent-eucalyptus" />
              <span>I was in jail for the whole income year</span>
            </label>
          </fieldset>
        </form>

        <div className="mt-6" role="status" aria-live="polite">
          {verdict === null ? (
            <p className="text-sm text-warmgray-light">Answer question 1 to see your result.</p>
          ) : (
            <p className={`rounded-lg border-l-4 p-4 text-sm ${verdict.ok ? "border-eucalyptus bg-eucalyptus-light/30 text-navy" : "border-ochre bg-sandstone text-navy"}`}>
              {verdict.text}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
