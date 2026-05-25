"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Back payment of wages", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages", publisher: SOURCES.fwo.name },
  { title: "Schedule 5 — back payments", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Unpaid wages and underpayments", url: "https://www.fairwork.gov.au/pay-and-wages", publisher: SOURCES.fwo.name },
];

export default function BackpayCalculatorPage() {
  const [correctRate, setCorrectRate] = useState(30);
  const [actualRate, setActualRate] = useState(24.1);
  const [hoursPerWeek, setHoursPerWeek] = useState(38);
  const [weeksUnderpaid, setWeeksUnderpaid] = useState(26);

  const result = useMemo(() => {
    const rateDiff = Math.max(0, correctRate - actualRate);
    const totalHours = hoursPerWeek * weeksUnderpaid;

    // Wage underpayment
    const wageShortfall = Math.round(rateDiff * totalHours * 100) / 100;

    // Unpaid super (12% on the wage difference)
    const unpaidSuper = Math.round(wageShortfall * SUPER_GUARANTEE.rate * 100) / 100;

    // Unpaid leave loading (annual leave accrues at ~7.7% of ordinary hours — 4 weeks / 52 weeks)
    const leaveAccrualRate = 4 / 52;
    const unpaidLeaveLoading = Math.round(wageShortfall * leaveAccrualRate * 100) / 100;

    // Total owed before tax
    const totalOwedBeforeTax = Math.round((wageShortfall + unpaidLeaveLoading) * 100) / 100;

    // Estimate tax on backpay lump sum (use Schedule 5 approach: marginal rate)
    // Approximate: assume worker earns ~$60k and back payment is additional income
    const approxAnnualIncome = correctRate * hoursPerWeek * 52;
    const rawTax = calculateIncomeTax(approxAnnualIncome);
    const lito = calculateLITO(approxAnnualIncome);
    const netTax = Math.max(0, rawTax - lito);
    const medicare = calculateMedicareLevy(approxAnnualIncome);
    const effectiveRate = approxAnnualIncome > 0 ? (netTax + medicare) / approxAnnualIncome : 0;

    // Marginal rate on the backpay (simplified)
    const taxOnBackpay = Math.round(totalOwedBeforeTax * effectiveRate);
    const netBackpay = Math.round(totalOwedBeforeTax - taxOnBackpay);

    // Grand total including super (super goes to fund, not employee directly)
    const grandTotal = totalOwedBeforeTax + unpaidSuper;

    return {
      rateDiff, totalHours, wageShortfall, unpaidSuper, unpaidLeaveLoading,
      totalOwedBeforeTax, taxOnBackpay, netBackpay, grandTotal, effectiveRate,
    };
  }, [correctRate, actualRate, hoursPerWeek, weeksUnderpaid]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* HERO */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Backpay Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-4 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Backpay Calculator Australia — Underpayment Calculator
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Calculate how much you are owed in backpay. Enter your correct rate, actual rate paid, hours, and period to see the total underpayment including unpaid super and leave entitlements.
              </p>
              <TrustBar className="mt-4" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Backpay</h2>
                <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                  {/* Inputs */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div>
                      <label htmlFor="correctRate" className="block text-sm font-medium text-navy mb-1">Correct Hourly Rate</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="correctRate" min={0} max={200} step={0.01} value={correctRate}
                          onChange={(e) => setCorrectRate(clamp(Number(e.target.value || 0), 0, 200))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <p className="text-xs text-warmgray-light mt-1">The rate you should have been paid. Check <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Award Rates</Link>.</p>
                    </div>
                    <div>
                      <label htmlFor="actualRate" className="block text-sm font-medium text-navy mb-1">Actual Hourly Rate Paid</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="actualRate" min={0} max={200} step={0.01} value={actualRate}
                          onChange={(e) => setActualRate(clamp(Number(e.target.value || 0), 0, 200))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hours" className="block text-sm font-medium text-navy mb-1">Hours Per Week</label>
                      <input type="number" id="hours" min={1} max={60} step={1} value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(clamp(Number(e.target.value || 1), 1, 60))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="weeks" className="block text-sm font-medium text-navy mb-1">Number of Weeks Underpaid</label>
                      <input type="number" id="weeks" min={1} max={312} step={1} value={weeksUnderpaid}
                        onChange={(e) => setWeeksUnderpaid(clamp(Number(e.target.value || 1), 1, 312))}
                        className="block w-24 rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      <input type="range" min={1} max={156} step={1} value={clamp(weeksUnderpaid, 1, 156)}
                        onChange={(e) => setWeeksUnderpaid(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                      <p className="text-xs text-warmgray-light mt-1">You can claim up to 6 years (312 weeks) of underpayment.</p>
                    </div>
                  </form>

                  {/* Results */}
                  <div className="space-y-4">
                    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                      <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Total Amount Owed</div>
                      <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.grandTotal)}</div>
                      <div className="text-sm text-warmgray mt-2">Including {formatAUD(result.unpaidSuper)} in unpaid super</div>
                    </div>

                    <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                      <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                        <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Underpayment Breakdown</h3>
                      </div>
                      <div className="p-5 space-y-3 text-sm">
                        <Row label={`Rate Difference ($${result.rateDiff.toFixed(2)}/hr)`} value={formatAUD(result.wageShortfall)} />
                        <Row label={`Total Hours Underpaid`} value={`${result.totalHours.toLocaleString()} hrs`} />
                        <div className="border-t border-sandstone-dark/10 pt-3" />
                        <Row label="Wage Shortfall" value={formatAUD(result.wageShortfall)} bold />
                        <Row label="Unpaid Leave Accrual" value={formatAUD(result.unpaidLeaveLoading)} />
                        <Row label={`Unpaid Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`} value={formatAUD(result.unpaidSuper)} green />
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Total Before Tax (wages + leave)" value={formatAUD(result.totalOwedBeforeTax)} bold />
                        <Row label={`Est. Tax on Backpay (~${formatPercent(result.effectiveRate)})`} value={`-${formatAUD(result.taxOnBackpay)}`} />
                        <div className="border-t border-sandstone-dark/20 pt-3" />
                        <Row label="Net Backpay to You" value={formatAUD(result.netBackpay)} bold highlight />
                        <Row label="Plus Unpaid Super (to fund)" value={formatAUD(result.unpaidSuper)} green />
                      </div>
                    </div>

                    {result.wageShortfall === 0 && (
                      <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                        <strong>No underpayment detected.</strong> The correct rate must be higher than the actual rate paid to calculate backpay.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This calculator provides estimates for wage underpayment claims. Actual amounts may vary based on overtime, penalty rates, allowances, and specific award conditions. Backpay tax is estimated using ATO Schedule 5 principles. For formal underpayment claims, consult the Fair Work Ombudsman or a workplace lawyer.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on Fair Work minimum entitlements and ATO rates for FY{SITE_CONFIG.financialYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CONTENT */}
          <div className="max-w-4xl mx-auto space-y-10">

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Backpay Calculated in Australia?</h2>
              <p className="mb-4 text-warmgray">Backpay is the difference between what you <strong>should have been paid</strong> and what you <strong>were actually paid</strong>, multiplied by the total hours worked during the underpayment period. The Fair Work Ombudsman uses a straightforward formula:</p>
              <p className="mb-4 text-warmgray font-medium">(Correct hourly rate - Actual hourly rate) x Total hours worked = Wage shortfall</p>
              <p className="mb-4 text-warmgray">In addition to the wage shortfall, your employer also owes:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Unpaid superannuation:</strong> The 12% SG applies to the underpaid amount. If you were paid $24.10/hr instead of $30/hr, your employer owes an additional <strong>$0.71/hr</strong> in super on the $5.90 difference.</li>
                <li><strong>Unpaid leave accrual:</strong> Annual leave accrues on ordinary hours. Underpayment means your leave balance was also underpaid when you took or cashed out leave.</li>
                <li><strong>Interest:</strong> In some cases, the Fair Work Ombudsman or courts may award interest on unpaid wages, particularly for prolonged underpayments.</li>
              </ul>
              <p className="mt-4 text-warmgray">Check the correct rate for your role using the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page, which lists minimum pay rates by industry classification.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Backpay Taxed?</h2>
              <p className="mb-4 text-warmgray">Backpay received as a lump sum is taxed under <strong>ATO Schedule 5</strong> (back payments, commissions, bonuses, and similar payments). Your employer withholds tax at a rate that considers your regular earnings plus the lump sum.</p>
              <p className="mb-4 text-warmgray">If the backpay covers <strong>multiple financial years</strong>, you can request the ATO to spread the amount across the relevant years when assessing your tax return. This can reduce your overall tax liability by avoiding a single-year spike in income.</p>
              <p className="text-warmgray">Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see how the lump sum affects your tax bracket, or the <Link href="/bonus-tax-guide/" className="text-eucalyptus-dark hover:underline font-medium">Bonus Tax Guide</Link> for details on lump sum taxation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Make an Underpayment Claim</h2>
              <p className="mb-4 text-warmgray">If you believe you have been underpaid, follow these <strong>4 steps</strong>:</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray">
                <li><strong>Check your correct rate.</strong> Find your award or enterprise agreement on the Fair Work website. Use the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page to look up your classification and minimum rate.</li>
                <li><strong>Gather evidence.</strong> Collect payslips, time sheets, rosters, bank statements, and your employment contract. Compare the hours worked against the pay received.</li>
                <li><strong>Raise it with your employer.</strong> Many underpayments are genuine errors. Write to your employer (keep a copy) requesting they review your pay and rectify the shortfall.</li>
                <li><strong>Lodge a complaint.</strong> If your employer does not resolve the issue, lodge a complaint with the <strong>Fair Work Ombudsman</strong> online at fairwork.gov.au or call <strong>13 13 94</strong>.</li>
              </ol>
              <p className="mt-4 text-warmgray">Under the Fair Work Act, you can claim underpayments going back <strong>6 years</strong> from the date you make a complaint. Serious wage theft may also attract criminal penalties in some states.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common Types of Underpayment</h2>
              <p className="mb-4 text-warmgray">The Fair Work Ombudsman identifies <strong>5 common underpayment types</strong> in Australian workplaces:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Below-award base rates:</strong> Paying less than the minimum hourly rate for the employee&apos;s classification level.</li>
                <li><strong>Missing penalty rates:</strong> Not paying weekend, public holiday, or overtime loadings as required by the award.</li>
                <li><strong>Unpaid overtime:</strong> Requiring employees to work before or after shifts without recording or paying the hours.</li>
                <li><strong>Incorrect casual loading:</strong> Paying casual employees without the required 25% casual loading on top of the base rate.</li>
                <li><strong>Super shortfall:</strong> Not paying the 12% superannuation guarantee on all ordinary time earnings. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to verify your employer&apos;s contributions.</li>
              </ul>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Wage shortfall = (correct rate - actual rate) x hours per week x weeks underpaid.</li>
                <li>Unpaid super = wage shortfall x 12% (SG rate).</li>
                <li>Unpaid leave accrual = wage shortfall x (4/52) for annual leave component.</li>
                <li>Tax estimated at the effective rate derived from the correct annual salary using ATO progressive brackets.</li>
                <li>Super goes directly to the super fund, not to the employee as cash.</li>
              </ol>
              <p className="mt-2">Based on <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/pay-and-wages" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a> guidelines, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="how-far" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How far back can I claim backpay in Australia?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Under the Fair Work Act, you can claim underpayments going back <strong>6 years</strong> from the date you make a complaint. This applies to wages, overtime, penalty rates, allowances, and superannuation contributions.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is backpay taxed differently to normal wages?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Backpay received as a lump sum may be withheld at a higher rate under <strong>ATO Schedule 5</strong>. However, you can request the ATO to spread the amount over the financial years it relates to, potentially reducing your tax liability at assessment time.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Does my employer owe super on backpay?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. The <strong>12% superannuation guarantee</strong> applies to all ordinary time earnings, including any underpaid amount. Your employer must make additional super contributions on the wage difference and may face a Super Guarantee Charge (SGC) for late payments.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="report" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>How do I report underpayment to the Fair Work Ombudsman?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Lodge a complaint online at <strong>fairwork.gov.au</strong> or call <strong>13 13 94</strong>. The Fair Work Ombudsman can investigate, mediate, and in serious cases take legal action. Gather payslips, rosters, and bank statements as evidence before filing.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="criminal" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is wage theft a criminal offence in Australia?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes, in some states. <strong>Victoria and Queensland</strong> have enacted wage theft laws that make deliberate underpayment a criminal offence with penalties including fines and imprisonment. The federal government has also introduced criminal penalties for serious wage theft under amendments to the Fair Work Act.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="penalty" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Do I get interest on underpaid wages?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Interest is not automatically included in Fair Work claims, but courts may award interest on underpaid wages in legal proceedings. The ATO also charges a <strong>Super Guarantee Charge (SGC)</strong> on late super payments, which includes an interest component and administration fee.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Related */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Award Rates</h3>
                  <p className="text-sm text-warmgray">Check the correct minimum rate for your industry and classification</p>
                </Link>
                <Link href="/income-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Income Tax Calculator</h3>
                  <p className="text-sm text-warmgray">See how a backpay lump sum affects your tax bracket</p>
                </Link>
                <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
                  <p className="text-sm text-warmgray">Verify your employer is paying the correct 12% SG rate</p>
                </Link>
                <Link href="/bonus-tax-guide/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Bonus Tax Guide</h3>
                  <p className="text-sm text-warmgray">Understand how lump sum payments like backpay are taxed</p>
                </Link>
              </div>
            </section>

            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Check Your Current Pay</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Make sure your current employer is paying you correctly with our full pay breakdown calculator.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}
