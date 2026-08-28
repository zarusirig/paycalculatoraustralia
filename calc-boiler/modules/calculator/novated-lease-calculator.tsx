"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatPercent, HECS_HELP, SITE_CONFIG } from "@/lib/constants";
import {
  EV_EXEMPTION,
  FBT,
  LEASE_TERMS,
  LUXURY_CAR_TAX,
  NOVATED_LEASE_SOURCES,
  NOVATED_LEASE_UNVERIFIED,
  RESIDUAL_MINIMUM_PCT,
  calculateNovatedLease,
  ecmBreakEvenMarginalRate,
  fbtPayable,
  statutoryTaxableValue,
  type FbtMethod,
  type VehicleType,
} from "@/lib/constants/novated-lease";
import { NOVATED_LEASE_FAQS, NOVATED_LEASE_SOURCE_LINKS } from "./novated-lease-faqs";

// Why this page exists: /novated-lease-guide/ answered "how does it work" but
// had no calculator, and the whole cluster — "ev novated lease calculator",
// "salary sacrifice novated lease calculator ato", "phev novated lease
// calculator" — is calculator intent. The guide keeps the explainer job.

const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const LABEL = "block text-sm font-medium text-navy mb-1";
const INPUT = "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const VEHICLE_TYPES: { key: VehicleType; label: string }[] = [
  { key: "bev", label: "Battery electric (or hydrogen fuel cell)" },
  { key: "phev", label: "Plug-in hybrid (PHEV)" },
  { key: "other", label: "Petrol, diesel or conventional hybrid" },
];

function Row({ label, value, bold, highlight, note }: { label: string; value: string; bold?: boolean; highlight?: boolean; note?: string }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${highlight ? "rounded-lg bg-eucalyptus-light/40 px-3 py-2" : ""}`}>
      <span className={`text-warmgray ${bold ? "font-semibold text-navy" : ""}`}>
        {label}
        {note ? <span className="block text-xs text-warmgray-light">{note}</span> : null}
      </span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

export default function NovatedLeaseCalculatorPage() {
  const [salary, setSalary] = useState(100_000);
  const [vehiclePrice, setVehiclePrice] = useState(60_000);
  const [termYears, setTermYears] = useState<number>(5);
  const [annualRunningCosts, setAnnualRunningCosts] = useState(5_000);
  const [vehicleType, setVehicleType] = useState<VehicleType>("bev");
  const [fbtMethod, setFbtMethod] = useState<FbtMethod>("ecm");
  const [includeHECS, setIncludeHECS] = useState(false);
  const [privateHospitalCover, setPrivateHospitalCover] = useState(true);
  const [phevCommitted, setPhevCommitted] = useState(false);
  const authorship = getGuideAuthorship("novated-lease-calculator");

  const result = useMemo(
    () =>
      calculateNovatedLease({
        salary,
        vehiclePrice,
        termYears,
        annualRunningCosts,
        vehicleType,
        fbtMethod,
        includeHECS,
        privateHospitalCover,
        phevCommittedBefore1April2025: vehicleType === "phev" && phevCommitted,
      }),
    [salary, vehiclePrice, termYears, annualRunningCosts, vehicleType, fbtMethod, includeHECS, privateHospitalCover, phevCommitted]
  );

  const { before, after } = result;
  const breakEven = ecmBreakEvenMarginalRate();
  const overLctThreshold = vehicleType !== "other" && vehiclePrice > LUXURY_CAR_TAX.fuelEfficientThreshold;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Novated Lease Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Novated Lease Calculator — EV, PHEV and Petrol, With FBT
          </h1>
          <p className="text-lg text-warmgray">
            See the pre-tax and post-tax deductions a novated lease puts on your payslip, the FBT (or the electric car
            exemption), what it does to your take-home pay, and how the total compares with buying the same car from
            after-tax income. FBT rates and the {LUXURY_CAR_TAX.financialYear} luxury car tax thresholds are read
            from the ATO pages listed at the bottom, verified {NOVATED_LEASE_SOURCES.verifiedOn}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-5xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Work Out Your Novated Lease Deductions and Take-Home Pay</h2>
              <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="salary" className={LABEL}>Annual salary (before tax, excluding super)</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={1_000_000} step={1_000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 1_000_000))} className={INPUT} /></div>
                    <input type="range" min={40_000} max={300_000} step={1_000} value={clamp(salary, 40_000, 300_000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>

                  <div>
                    <label htmlFor="price" className={LABEL}>Vehicle purchase price (GST-inclusive)</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="price" min={0} max={250_000} step={1_000} value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(clamp(Number(e.target.value || 0), 0, 250_000))} className={INPUT} /></div>
                    <input type="range" min={20_000} max={130_000} step={1_000} value={clamp(vehiclePrice, 20_000, 130_000)}
                      onChange={(e) => setVehiclePrice(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                    <p className="text-xs text-warmgray-light mt-1">
                      The FBT base value: cost price including GST and any luxury car tax, plus dealer delivery and
                      non-business accessories, but excluding registration and stamp duty.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="vehicleType" className={LABEL}>Vehicle type</label>
                    <select id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value as VehicleType)} className={INPUT}>
                      {VEHICLE_TYPES.map((v) => <option key={v.key} value={v.key}>{v.label}</option>)}
                    </select>
                  </div>

                  {vehicleType === "phev" && (
                    <label className="flex items-start gap-2 rounded-lg border border-ochre/40 bg-ochre/5 p-3 text-sm text-navy">
                      <input type="checkbox" checked={phevCommitted} onChange={(e) => setPhevCommitted(e.target.checked)} className="mt-1 accent-eucalyptus" />
                      <span>
                        This plug-in hybrid was <strong>used, or available for use, before {EV_EXEMPTION.phevExcludedFrom}</strong>, and a
                        financially binding commitment continues to provide it.
                        <span className="block text-xs text-warmgray mt-1">Leave this unticked for any PHEV lease signed since that date — the exemption ended and the ATO cannot extend it.</span>
                      </span>
                    </label>
                  )}

                  <div>
                    <label htmlFor="term" className={LABEL}>Lease term</label>
                    <select id="term" value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className={INPUT}>
                      {LEASE_TERMS.map((t) => (
                        <option key={t} value={t}>{t} {t === 1 ? "year" : "years"} — minimum residual {formatPercent(RESIDUAL_MINIMUM_PCT[t], 2)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="running" className={LABEL}>Estimated running costs a year</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="running" min={0} max={50_000} step={500} value={annualRunningCosts}
                        onChange={(e) => setAnnualRunningCosts(clamp(Number(e.target.value || 0), 0, 50_000))} className={INPUT} /></div>
                    <p className="text-xs text-warmgray-light mt-1">Fuel or charging, insurance, registration, tyres and servicing — whatever your packaging budget covers.</p>
                  </div>

                  <fieldset disabled={result.exempt} className={result.exempt ? "opacity-50" : undefined}>
                    <legend className="block text-sm font-medium text-navy mb-2">FBT method</legend>
                    <div className="space-y-2 text-sm text-navy">
                      <label className="flex items-start gap-2">
                        <input type="radio" name="fbtMethod" value="ecm" checked={fbtMethod === "ecm"} onChange={() => setFbtMethod("ecm")} className="mt-1 accent-eucalyptus" />
                        <span><strong>Employee Contribution Method</strong><br /><span className="text-warmgray">Pay the taxable value from post-tax salary and cancel the FBT</span></span>
                      </label>
                      <label className="flex items-start gap-2">
                        <input type="radio" name="fbtMethod" value="statutory" checked={fbtMethod === "statutory"} onChange={() => setFbtMethod("statutory")} className="mt-1 accent-eucalyptus" />
                        <span><strong>Statutory formula, FBT paid</strong><br /><span className="text-warmgray">No post-tax contribution; the FBT is funded from the pre-tax budget</span></span>
                      </label>
                    </div>
                    {result.exempt && <p className="text-xs text-warmgray-light mt-2">No FBT is payable on this car, so there is nothing for an employee contribution to offset.</p>}
                  </fieldset>

                  <div className="space-y-2 text-sm text-navy">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)} className="accent-eucalyptus" />
                      <span>I have a HECS-HELP or study loan</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={privateHospitalCover} onChange={(e) => setPrivateHospitalCover(e.target.checked)} className="accent-eucalyptus" />
                      <span>I have private hospital cover</span>
                    </label>
                  </div>
                </form>

                <div className="space-y-5">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Take-home pay with the lease</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(after.takeHome)}</div>
                    <div className="text-sm text-warmgray">
                      was {formatAUD(before.takeHome)} without it — the car costs you {formatAUD(result.annualCostToYou)} a year after tax
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">What comes off your pay</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Capital repaid each year" value={formatAUD(result.annualCapital)} note={`${formatAUD(result.baseValue)} less the ${formatPercent(result.residualPct, 2)} residual, over ${termYears} ${termYears === 1 ? "year" : "years"}`} />
                      <Row label="Running costs" value={formatAUD(annualRunningCosts)} />
                      <Row label="FBT payable" value={result.exempt ? "exempt" : formatAUD(result.fbt)} note={result.exempt ? "electric car exemption" : `${formatPercent(FBT.statutoryRate, 0)} of ${formatAUD(result.baseValue)} = ${formatAUD(result.statutoryValue)} taxable value, grossed up at ${FBT.grossUpType1} and taxed at ${formatPercent(FBT.rate, 0)}`} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Pre-tax (salary sacrifice) deduction" value={formatAUD(result.preTaxDeduction)} bold />
                      <Row label="Post-tax (employee contribution) deduction" value={formatAUD(result.postTaxDeduction)} bold />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Taxable income" value={`${formatAUD(before.taxableIncome)} → ${formatAUD(after.taxableIncome)}`} />
                      <Row label="Income tax + Medicare levy" value={`${formatAUD(before.incomeTax + before.medicareLevy)} → ${formatAUD(after.incomeTax + after.medicareLevy)}`} />
                      {includeHECS && <Row label="HECS-HELP repayment" value={`${formatAUD(before.hecsRepayment)} → ${formatAUD(after.hecsRepayment)}`} />}
                      {!privateHospitalCover && <Row label="Medicare levy surcharge" value={`${formatAUD(before.medicareSurcharge)} → ${formatAUD(after.medicareSurcharge)}`} />}
                      <Row label="Take-home pay" value={formatAUD(after.takeHome)} bold highlight />
                    </div>
                  </div>

                  {result.reportableFringeBenefits > 0 && (
                    <div className="rounded-xl border border-ochre/50 bg-ochre/5 p-5 text-sm">
                      <h3 className="font-semibold text-navy mb-2">Reportable fringe benefits: {formatAUD(result.reportableFringeBenefits)}</h3>
                      <p className="text-warmgray mb-2">
                        {result.exempt
                          ? "An FBT-exempt electric car is still a reportable fringe benefit."
                          : "The taxable value left after your employee contribution is reportable."}{" "}
                        The notional taxable value of {formatAUD(result.taxableValueAfterContribution)} is grossed up at {FBT.grossUpType2} and
                        shown on your income statement. It is never taxed — but it is added to your income for the
                        HECS-HELP, Medicare levy surcharge and Division 293 tests.
                      </p>
                      <Row label="Income used in those tests" value={formatAUD(after.incomeTestIncome)} note={`${formatAUD(after.taxableIncome)} taxable income + ${formatAUD(result.reportableFringeBenefits)} reported`} />
                      {includeHECS && (
                        <p className="text-warmgray mt-2">
                          Your compulsory repayment is {formatAUD(after.hecsRepayment)} instead of the {formatAUD(before.hecsRepayment)} your
                          salary alone would produce.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Over {termYears} {termYears === 1 ? "year" : "years"}, against buying the same car</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Novated lease, from take-home pay" value={formatAUD(result.annualCostToYou * termYears)} />
                      <Row label="Residual to own the car at the end" value={formatAUD(result.residual)} note={`${formatPercent(result.residualPct, 2)} of ${formatAUD(result.baseValue)}, paid from after-tax money`} />
                      <Row label="Novated lease total" value={formatAUD(result.leaseTotalCost)} bold />
                      <Row label="Buying it outright, plus running costs" value={formatAUD(result.buyTotalCost)} bold />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row
                        label={result.difference >= 0 ? "The lease costs you less by" : "The lease costs you more by"}
                        value={formatAUD(Math.abs(result.difference))}
                        bold
                        highlight
                      />
                      <p className="text-xs text-warmgray-light">
                        Neither column includes lease interest — this site does not model finance charges. Ask your
                        provider for the amount financed and the total of the payments, and add the difference to the
                        lease column.
                      </p>
                    </div>
                  </div>

                  {overLctThreshold && (
                    <p className="rounded-lg border border-ochre/50 bg-ochre/5 p-3 text-sm text-navy">
                      At {formatAUD(vehiclePrice)} this car is over the {LUXURY_CAR_TAX.financialYear} luxury car tax
                      threshold for fuel-efficient vehicles ({formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold)}), so LCT
                      was payable and the electric car exemption cannot apply — to any of it, not just the excess.
                    </p>
                  )}
                  {result.exceedsSalary && (
                    <p className="rounded-lg border border-ochre/50 bg-ochre/5 p-3 text-sm text-navy">
                      The pre-tax deduction is larger than the salary and has been capped. Lower the car price, lengthen
                      the term or raise the salary for a meaningful result.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={FONT} className={H2}>What a Novated Lease Looks Like on Your Payslip</h2>
            <p className={P}>
              A novated lease should show as <strong>two</strong> deductions, not one. The pre-tax deduction comes off
              your gross pay before PAYG withholding, so your taxable income and your tax both fall. The post-tax
              deduction — the employee contribution — comes off after tax and does not reduce your taxable income at
              all; its job is to cancel the FBT.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Payslip line</th><th scope="col" className={TH}>What it should equal</th><th scope="col" className={TH + " text-right"}>Your figure</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Pre-tax deduction (salary sacrifice)</td><td className={TD}>Lease and running-cost budget{result.exempt ? "" : ", less the employee contribution, plus FBT"}</td><td className={TD + " text-right font-bold"}>{formatAUD(result.preTaxDeduction)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Post-tax deduction (employee contribution)</td><td className={TD}>{result.postTaxDeduction > 0 ? `${formatPercent(FBT.statutoryRate, 0)} of the base value` : "Nil under this method"}</td><td className={TD + " text-right font-bold"}>{formatAUD(result.postTaxDeduction)}</td></tr>
                  <tr><td className={TD}>Taxable gross (year to date)</td><td className={TD}>Salary less the pre-tax deduction</td><td className={TD + " text-right font-bold"}>{formatAUD(after.taxableIncome)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Super</td><td className={TD}>Unchanged — calculated on pre-sacrifice salary</td><td className={TD + " text-right"}>no change</td></tr>
                  <tr><td className={TD}>Reportable fringe benefits (income statement, not payslip)</td><td className={TD}>Taxable value grossed up at {FBT.grossUpType2}</td><td className={TD + " text-right font-bold"}>{formatAUD(result.reportableFringeBenefits)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              If the super line dropped when the lease started, ask payroll which figure they are using. Compare the rest
              of the payslip against the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>, or
              read the whole slip line by line in the <Link href="/payslip-generator/" className={LINK}>payslip generator</Link>.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>The Electric Car FBT Exemption, and Where It Stops</h2>
            <p className={P}>
              A battery electric or hydrogen fuel cell car is exempt from FBT when it was first held and used on or
              after {EV_EXEMPTION.firstHeldAndUsedFrom}, it is a car under one tonne with fewer than nine seats, and
              luxury car tax has <em>never</em> been payable on it. That last condition is the one that bites: the
              GST-inclusive value has to be at or under the LCT threshold for fuel-efficient vehicles at the first
              retail sale and at every later sale.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Financial year</th><th scope="col" className={TH + " text-right"}>Fuel-efficient vehicles</th><th scope="col" className={TH + " text-right"}>Other vehicles</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>{LUXURY_CAR_TAX.financialYear}</td><td className={TD + " text-right font-bold"}>{formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold)}</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.otherVehiclesThreshold)}</td></tr>
                  <tr><td className={TD}>2025-26</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.fuelEfficientThresholdPrevious)}</td><td className={TD + " text-right"}>{formatAUD(LUXURY_CAR_TAX.otherVehiclesThresholdPrevious)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>
              From {LUXURY_CAR_TAX.fuelEfficientDefinitionFrom} a fuel-efficient car means combined fuel consumption of
              no more than {LUXURY_CAR_TAX.fuelEfficientLitresPer100km} litres per 100km, down from 7 litres. A battery
              electric car clears that on any reading; the threshold that matters to it is the dollar one. The
              government is due to review the exemption by {EV_EXEMPTION.reviewDue}.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Plug-In Hybrids: the {EV_EXEMPTION.phevExcludedFrom} Cut-Off</h2>
            <p className={P}>
              From {EV_EXEMPTION.phevExcludedFrom} a plug-in hybrid is not a zero or low emissions vehicle for FBT, so a
              PHEV novated lease entered into now is fully subject to FBT — on a {formatAUD(60_000)} car that is{" "}
              {formatAUD(statutoryTaxableValue(60_000))} of taxable value and{" "}
              {formatAUD(fbtPayable(statutoryTaxableValue(60_000)))} of FBT for a full FBT year, before any employee
              contribution.
            </p>
            <p className={P}>
              A PHEV keeps the exemption only where <strong>both</strong> of these are true: it was used, or available
              for use, before that date and that use was exempt; and there is a financially binding commitment to keep
              providing it. The ATO says plainly it has no discretion to extend the date, including where delivery was
              delayed. The exemption then ends the moment the commitment changes — an optional extension being taken up,
              a break in the novation, a change to the lease payments or the residual value, or a change of employer.
              Tick the box in the calculator only if that describes your arrangement.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Employee Contribution Method vs the Statutory Formula</h2>
            <p className={P}>
              Under the statutory formula the taxable value is {formatPercent(FBT.statutoryRate, 0)} of the base value,
              apportioned over the days the car is available for private use, less any employee contribution. FBT is
              {" "}{formatPercent(FBT.rate, 0)} of that value grossed up at {FBT.grossUpType1} — so a dollar of taxable
              value costs {formatAUD(FBT.grossUpType1 * FBT.rate, 2)}.
            </p>
            <p className={P}>
              That is why ECM works. A dollar paid from post-tax salary removes a dollar of taxable value, and with it
              {" "}{formatAUD(FBT.grossUpType1 * FBT.rate, 2)} of FBT that would otherwise have come out of your pre-tax
              budget. The methods break even at a marginal rate of {formatPercent(breakEven, 1)}, which is above the
              {" "}{formatPercent(0.47, 0)} top rate including the Medicare levy — so in {SITE_CONFIG.financialYear}, for
              a resident employee, ECM is the cheaper method at every income.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>On your inputs</th><th scope="col" className={TH + " text-right"}>Employee contribution method</th><th scope="col" className={TH + " text-right"}>Statutory formula, FBT paid</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {(() => {
                    const shared = { salary, vehiclePrice, termYears, annualRunningCosts, vehicleType, includeHECS, privateHospitalCover, phevCommittedBefore1April2025: vehicleType === "phev" && phevCommitted };
                    const ecm = calculateNovatedLease({ ...shared, fbtMethod: "ecm" });
                    const stat = calculateNovatedLease({ ...shared, fbtMethod: "statutory" });
                    const rows: { label: string; a: string; b: string }[] = [
                      { label: "Pre-tax deduction", a: formatAUD(ecm.preTaxDeduction), b: formatAUD(stat.preTaxDeduction) },
                      { label: "Post-tax deduction", a: formatAUD(ecm.postTaxDeduction), b: formatAUD(stat.postTaxDeduction) },
                      { label: "FBT payable", a: formatAUD(ecm.fbt), b: formatAUD(stat.fbt) },
                      { label: "Reportable fringe benefits", a: formatAUD(ecm.reportableFringeBenefits), b: formatAUD(stat.reportableFringeBenefits) },
                      { label: "Take-home pay", a: formatAUD(ecm.after.takeHome), b: formatAUD(stat.after.takeHome) },
                    ];
                    return rows.map((r, i) => (
                      <tr key={r.label} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD}>{r.label}</td>
                        <td className={TD + " text-right font-bold"}>{r.a}</td>
                        <td className={TD + " text-right"}>{r.b}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              {result.exempt ? "This car is FBT-exempt, so both columns are the same — there is no FBT for a contribution to offset." : "Both columns fund the same lease budget; only the split between pre-tax salary, post-tax salary and FBT changes."}
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>What a Novated Lease Does to HECS-HELP and the Medicare Levy Surcharge</h2>
            <p className={P}>
              This is the part most novated lease calculators leave out. A car fringe benefit with a taxable value over
              {" "}{formatAUD(FBT.reportableThreshold)} in an FBT year is reported on your income statement as a
              reportable fringe benefits amount, grossed up at the lower rate of {FBT.grossUpType2}. You are not taxed
              on it. But it is added to your income for the HECS-HELP repayment test, the Medicare levy surcharge, the
              private health insurance rebate, <Link href="/division-293-tax/" className={LINK}>Division 293 tax</Link> and
              family assistance payments.
            </p>
            <p className={P}>
              An FBT-<em>exempt</em> electric car is not exempt from that. The notional taxable value is still worked
              out and still reported — so an EV lease can cut your taxable income and raise your compulsory study loan
              repayment at the same time. A full employee contribution is the one thing that removes it: it takes the
              taxable value to nil, so there is nothing left to report. The repayment threshold is{" "}
              {formatAUD(HECS_HELP.minimumThreshold)} for {SITE_CONFIG.financialYear}; the{" "}
              <Link href="/hecs-help-calculator/" className={LINK}>HECS-HELP calculator</Link> shows the bands, and{" "}
              <Link href="/private-health-insurance-medicare/" className={LINK}>private health cover and the Medicare levy surcharge</Link>{" "}
              covers the surcharge tiers.
            </p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>FBT Rates for the Year Ending {FBT.yearEnding}</h2>
            <p className={P}>
              The FBT year runs {FBT.yearStart} to {FBT.yearEnd} — it is not the income year. A lease that starts in
              September is only available for part of the FBT year, and the statutory formula apportions by days, so
              your first year&apos;s FBT is smaller than a full year&apos;s.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Figure</th><th scope="col" className={TH + " text-right"}>{FBT.yearLabel}</th><th scope="col" className={TH}>What it is for</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>FBT rate</td><td className={TD + " text-right font-bold"}>{formatPercent(FBT.rate, 0)}</td><td className={TD}>Applied to the grossed-up taxable value</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Type 1 gross-up rate</td><td className={TD + " text-right font-bold"}>{FBT.grossUpType1}</td><td className={TD}>Where the employer can claim GST credits — the usual novated lease case</td></tr>
                  <tr><td className={TD}>Type 2 gross-up rate</td><td className={TD + " text-right font-bold"}>{FBT.grossUpType2}</td><td className={TD}>No GST credits — and every reportable amount, whatever the type</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Statutory percentage</td><td className={TD + " text-right font-bold"}>{formatPercent(FBT.statutoryRate, 0)}</td><td className={TD}>Flat since 1 April 2014, regardless of kilometres</td></tr>
                  <tr><td className={TD}>Reportable threshold</td><td className={TD + " text-right font-bold"}>{formatAUD(FBT.reportableThreshold)}</td><td className={TD}>Taxable value above this is reported ({formatAUD(FBT.reportableMinimumGrossedUp)} grossed up)</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>EV home charging rate</td><td className={TD + " text-right font-bold"}>{FBT.evHomeChargingCentsPerKm}c/km</td><td className={TD}>PCG 2024/2 shortcut for home-charged electricity (4.20c before this year)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Residual Values by Lease Term</h2>
            <p className={P}>
              The residual — the balloon payment — is set by the ATO as a minimum percentage of the original cost. It is
              paid from after-tax money, which is why the comparison above counts it. A lease can be written with a
              higher residual, which lowers the deductions now and raises the payment at the end.
            </p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Lease term</th><th scope="col" className={TH + " text-right"}>Minimum residual</th><th scope="col" className={TH + " text-right"}>On your {formatAUD(vehiclePrice)} car</th><th scope="col" className={TH + " text-right"}>Capital repaid a year</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {LEASE_TERMS.map((t, i) => (
                    <tr key={t} className={t === termYears ? "bg-eucalyptus-light/50" : i % 2 === 1 ? "bg-eucalyptus-light/20" : undefined}>
                      <td className={TD + " font-medium"}>{t} {t === 1 ? "year" : "years"}</td>
                      <td className={TD + " text-right"}>{formatPercent(RESIDUAL_MINIMUM_PCT[t], 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(vehiclePrice * RESIDUAL_MINIMUM_PCT[t])}</td>
                      <td className={TD + " text-right"}>{formatAUD((vehiclePrice - vehiclePrice * RESIDUAL_MINIMUM_PCT[t]) / t)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">ATO Taxation Determination TD 93/142, table at paragraph 3A, 8-year effective life — the column its own worked example uses for a car.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/novated-lease-guide/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">How a Novated Lease Works</h3>
                <p className="text-sm text-warmgray mt-1">The three-way agreement, what sits in the budget, and what happens if you leave your job.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Sacrifice Calculator</h3>
                <p className="text-sm text-warmgray mt-1">What any pre-tax deduction does to your take-home pay.</p>
              </Link>
              <Link href="/fringe-benefits-tax/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Fringe Benefits Tax</h3>
                <p className="text-sm text-warmgray mt-1">How FBT works across benefit types, not just cars.</p>
              </Link>
              <Link href="/hecs-help-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">HECS-HELP Calculator</h3>
                <p className="text-sm text-warmgray mt-1">Repayment income, the bands, and what a reported benefit adds.</p>
              </Link>
              <Link href="/take-home-pay-calculator/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Take-Home Pay Calculator</h3>
                <p className="text-sm text-warmgray mt-1">Your pay after tax with and without the deduction.</p>
              </Link>
              <Link href="/salary-packaging-guide/" className="group rounded-xl border border-sandstone-dark/20 p-4 hover:border-eucalyptus transition-colors">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Packaging Guide</h3>
                <p className="text-sm text-warmgray mt-1">The other benefits that can be packaged, and their caps.</p>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Statutory formula taxable value = base value &times; {formatPercent(FBT.statutoryRate, 0)} &times; days available &divide; days in the FBT year, less the employee contribution. FBT = that value &times; {FBT.grossUpType1} &times; {formatPercent(FBT.rate, 0)}. Every figure here is a full FBT year of availability.</li>
              <li>Capital repaid a year = (purchase price &minus; the TD 93/142 minimum residual) &divide; the term. <strong>Finance charges are not modelled</strong> — the interest rate is set per deal and this site does not compare lease finance. Both sides of the buy-versus-lease comparison are therefore interest-free, and both are GST-inclusive.</li>
              <li>Under the employee contribution method the post-tax deduction is the statutory taxable value (capped at the year&apos;s lease cost), which reduces the taxable value, the FBT and the reportable amount to nil. Under the statutory method the FBT is funded from the pre-tax deduction.</li>
              <li>Reportable fringe benefits amount = taxable value &times; {FBT.grossUpType2}, reported only where the taxable value exceeds {formatAUD(FBT.reportableThreshold)}, and applied to FBT-exempt electric cars as well. HECS-HELP and the Medicare levy surcharge are then calculated on taxable income <em>plus</em> that amount, using the site&apos;s shared {SITE_CONFIG.financialYear} tax engine.</li>
              <li>Not modelled: {NOVATED_LEASE_UNVERIFIED.join("; ")}.</li>
              <li>{SITE_CONFIG.name} is not the ATO and this is not financial or tax advice. Rates and thresholds read from the ATO pages listed below on {NOVATED_LEASE_SOURCES.verifiedOn}; get your own quote and check it against your payslip.</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
            <div className="sr-only"><h3>Novated lease questions and answers</h3>{NOVATED_LEASE_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
            <Accordion type="multiple">
              {NOVATED_LEASE_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent><p>{f.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <SourceAttribution sources={NOVATED_LEASE_SOURCE_LINKS} lastVerified={NOVATED_LEASE_SOURCES.verifiedOn} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}
