// Everything on /salary-sacrifice-calculator/ below the calculator card: how it
// works, worked examples, caps, available items, FBT, FAQ and sources. A
// server component, so it ships as HTML; salary-sacrifice-calculator.tsx
// (client) renders it via `children`.

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { SALARY_SACRIFICE_FAQS } from "./salary-sacrifice-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants";
import {
  FBT,
  FBT_CAPS,
  capFaceValue,
  fbtPayable,
  LUXURY_CAR_TAX,
  statutoryTaxableValue,
} from "@/lib/constants/novated-lease";
import { CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";

// Second-bracket figures are derived: at 15% (FY2026-27) the income tax saving
// on salary sacrifice is nil — the page previously showed 16% and "$0.01".
const FY = SITE_CONFIG.financialYear;
const SECOND_RATE = TAX_BRACKETS[1].rate;
const SECOND_RATE_PCT = `${Math.round(SECOND_RATE * 1000) / 10}%`;
const SECOND_SAVING = `$${Math.max(0, SECOND_RATE - CONTRIBUTIONS_TAX_RATE).toFixed(2)}`;
// $40,000 petrol car, statutory formula, full year, no employee contribution.
const ICE_TAXABLE_VALUE = statutoryTaxableValue(40_000);
const ICE_FBT = Math.round(fbtPayable(ICE_TAXABLE_VALUE));
// Lead example moved here from the hero (26 Sep 2026) so the calculator sits
// above the fold: $100,000 with $10,000 sacrificed.
const LEAD_SALARY = 100_000;
const LEAD_SACRIFICE = 10_000;

const SOURCES_LIST: SourceLink[] = [
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Contribution caps", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps", publisher: SOURCES.ato.name },
  { title: "Salary sacrificing to super", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super", publisher: SOURCES.ato.name },
];

export default function SalarySacrificeCalculatorContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <p className="text-lg text-warmgray">
        Tax with salary sacrifice is calculated on taxable income after the sacrificed amount is removed:{" "}
        {formatAUD(LEAD_SALARY)} with {formatAUD(LEAD_SACRIFICE)} sacrificed is taxed as{" "}
        {formatAUD(LEAD_SALARY - LEAD_SACRIFICE)}, and the {formatAUD(LEAD_SACRIFICE)} goes to super less{" "}
        {formatPercent(CONTRIBUTIONS_TAX_RATE, 0)} contributions tax. The calculator above shows both pays side by side.
      </p>

      {/* --- H2: How Does Salary Sacrifice Work? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Work?</h2>
        <p className="mb-4 text-warmgray">
          Salary sacrifice redirects a portion of your pre-tax gross salary into superannuation, reducing your taxable income and the income tax you pay in FY{SITE_CONFIG.financialYear}.
        </p>
        <p className="mb-4 text-warmgray">
          The sacrificed amount is taxed at <strong>15%</strong> inside your super fund as a concessional contribution, instead of your marginal tax rate of <strong>30%</strong>, <strong>37%</strong>, or <strong>45%</strong>. The difference between those two rates is your tax saving. Use our{" "}
          <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>{" "}
          to confirm your marginal rate before setting up a salary sacrifice arrangement.
        </p>

        <h3 className="text-lg font-semibold text-navy mb-2">Step-by-Step: How Salary Sacrifice Is Calculated</h3>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li>Start with your gross annual salary (e.g., <strong>$100,000</strong>).</li>
          <li>Choose a salary sacrifice amount (e.g., <strong>$10,000</strong>).</li>
          <li>Your employer deducts <strong>$10,000</strong> before PAYG withholding, reducing taxable income to <strong>$90,000</strong>.</li>
          <li>Income tax is calculated on <strong>$90,000</strong> instead of $100,000, saving you the difference in tax.</li>
          <li>Your super fund receives the $10,000 as a concessional contribution and applies <strong>15% contributions tax</strong> ($1,500).</li>
          <li>Net result: <strong>$8,500</strong> added to your super balance, with a take-home pay reduction smaller than $10,000 because of the tax saving.</li>
        </ol>

        <h3 className="text-lg font-semibold text-navy mb-2">Worked Example: $100,000 Salary With $10,000 Sacrifice</h3>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Item</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Without Sacrifice</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">With $10,000 Sacrifice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const w = calculatePayBreakdown({ grossSalary: 100_000 });
                const ws = calculatePayBreakdown({ grossSalary: 100_000, salarySacrifice: 10_000 });
                const saved = w.totalDeductions - ws.totalDeductions;
                return (
                  <>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">Gross Salary</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">Salary Sacrifice</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(0)}</td>
                      <td className="px-4 py-3 text-right text-eucalyptus-dark font-medium">{formatNegAUD(10_000)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">Taxable Income</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(100_000)}</td>
                      <td className="px-4 py-3 text-right text-navy">{formatAUD(90_000)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">Income Tax</td>
                      <td className="px-4 py-3 text-right text-navy">{formatNegAUD(w.netIncomeTax)}</td>
                      <td className="px-4 py-3 text-right text-navy">{formatNegAUD(ws.netIncomeTax)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">Medicare Levy</td>
                      <td className="px-4 py-3 text-right text-navy">{formatNegAUD(w.medicareLevy)}</td>
                      <td className="px-4 py-3 text-right text-navy">{formatNegAUD(ws.medicareLevy)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone bg-sandstone/50">
                      <td className="px-4 py-3 font-semibold text-navy">Take-Home Pay</td>
                      <td className="px-4 py-3 text-right font-bold text-navy">{formatAUD(w.takeHomePay)}</td>
                      <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(ws.takeHomePay)}</td>
                    </tr>
                    <tr className="hover:bg-sandstone bg-eucalyptus-light/20">
                      <td className="px-4 py-3 font-semibold text-navy">Tax Saved</td>
                      <td className="px-4 py-3 text-right text-navy">—</td>
                      <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(saved)}</td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
        <p className="text-warmgray">
          The sacrifice reduces take-home pay by less than $10,000 because the Australian tax calculator applies a lower tax rate to the reduced assessable income. Every dollar sacrificed from the 30% income tax bracket saves <strong>$0.15</strong> in net tax (30% marginal rate minus 15% super contributions tax).
        </p>
      </section>

      {/* --- H2: What Are the Tax Benefits of Salary Sacrifice? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Tax Benefits of Salary Sacrifice?</h2>
        <p className="mb-4 text-warmgray">
          Salary sacrifice saves tax because concessional super contributions are taxed at <strong>15%</strong>, which is lower than every income tax bracket above the tax-free threshold in FY{SITE_CONFIG.financialYear}.
        </p>
        <p className="mb-4 text-warmgray">
          The tax benefit increases with your marginal tax rate. An employee earning <strong>$80,000</strong> in the 30% bracket saves <strong>15 cents per dollar</strong> sacrificed. An employee earning <strong>$150,000</strong> in the 37% bracket saves <strong>22 cents per dollar</strong>. High-income earners above <strong>$190,000</strong> in the 45% bracket save <strong>30 cents per dollar</strong>, even after accounting for the 2% Medicare levy. Use our{" "}
          <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>{" "}
          to see your after-tax income with and without a sacrifice arrangement.
        </p>

        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income Bracket</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Super Tax</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Net Saving per $1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">$18,201 – $45,000</td>
                <td className="px-4 py-3 text-right text-navy">{SECOND_RATE_PCT}</td>
                <td className="px-4 py-3 text-right text-navy">15%</td>
                <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{SECOND_SAVING}</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">$45,001 – $135,000</td>
                <td className="px-4 py-3 text-right text-navy">30%</td>
                <td className="px-4 py-3 text-right text-navy">15%</td>
                <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.15</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">$135,001 – $190,000</td>
                <td className="px-4 py-3 text-right text-navy">37%</td>
                <td className="px-4 py-3 text-right text-navy">15%</td>
                <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.22</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">$190,001+</td>
                <td className="px-4 py-3 text-right text-navy">45%</td>
                <td className="px-4 py-3 text-right text-navy">15%</td>
                <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">$0.30</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-warmgray-light">
          Savings shown exclude the 2% Medicare levy reduction, which adds a further $0.02 per dollar for all brackets. Earners in the 15% bracket gain minimal benefit from salary sacrifice into super.
        </p>
      </section>

      {/* --- H2: Who Uses This Salary Sacrifice Calculator? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Salary Sacrifice Calculator?</h2>
        <p className="mb-4 text-warmgray">
          Australian employees earning above <strong>$45,000</strong> per year benefit most from salary sacrifice, as their marginal tax rate exceeds the 15% super contributions tax rate.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Full-time employees</strong> earning $60,000 to $200,000 who want to maximise retirement savings while minimising taxation</li>
          <li><strong>Employees approaching retirement</strong> (aged 50+) who want to accelerate super growth before accessing their balance at preservation age</li>
          <li><strong>High-income earners</strong> above $135,000 in the 37% or 45% income tax brackets, where the tax saving per dollar sacrificed is largest</li>
          <li><strong>HR and payroll professionals</strong> advising staff on salary packaging options and concessional contribution limits</li>
          <li><strong>Victorian public-sector and health workers</strong> who salary package through their employer and want to see the result against state-specific pay: the{" "}
            <Link href="/pay-calculator-vic/" className="text-eucalyptus-dark hover:underline">pay calculator vic</Link>{" "}
            page covers Victoria</li>
          <li><strong>Financial planners</strong> modelling salary sacrifice scenarios for clients alongside the{" "}
            <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>{" "}
            to project long-term super balances</li>
        </ul>
      </section>

      {/* --- H2: How Does Salary Sacrifice Compare to No Sacrifice? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Salary Sacrifice Compare to No Sacrifice?</h2>
        <p className="mb-4 text-warmgray">
          Salary sacrifice reduces take-home pay but increases total super contributions and delivers a net tax saving at every marginal rate above the 15% contributions tax rate.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Sacrifice</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home Drop</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Net Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [80_000, 5_000], [80_000, 10_000], [100_000, 10_000],
                [100_000, 15_000], [120_000, 15_000], [150_000, 20_000],
              ].map(([s, sac]) => {
                const w = calculatePayBreakdown({ grossSalary: s! });
                const ws = calculatePayBreakdown({ grossSalary: s!, salarySacrifice: sac });
                const saved = w.totalDeductions - ws.totalDeductions;
                const drop = w.takeHomePay - ws.takeHomePay;
                return (
                  <tr key={`${s}-${sac}`} className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">{formatAUD(s!)}</td>
                    <td className="px-4 py-3 text-right text-navy">{formatAUD(sac!)}</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(saved)}</td>
                    <td className="px-4 py-3 text-right text-navy">{formatNegAUD(drop)}</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(saved)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray-light">The tax saving increases with your marginal rate. At 30%, every $1,000 sacrificed saves <strong>$300</strong> in income tax (minus $150 in contributions tax = <strong>$150</strong> net). At 37%, it saves <strong>$220</strong> net per $1,000.</p>
      </section>

      {/* --- H2: What Are the Contribution Caps for Salary Sacrifice? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Contribution Caps for Salary Sacrifice?</h2>
        <p className="mb-4 text-warmgray">
          The concessional contribution cap for FY{SITE_CONFIG.financialYear} is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year, covering employer SG contributions, salary sacrifice, and personal deductible contributions combined.
        </p>

        <h3 className="text-lg font-semibold text-navy mb-2">How the Concessional Cap Works</h3>
        <p className="mb-3 text-warmgray">
          Your employer&apos;s compulsory {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee counts toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. On a $100,000 salary, your employer contributes <strong>$12,000</strong>, leaving <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap - 12_000)}</strong> of cap room for salary sacrifice. On a $150,000 salary, employer SG is <strong>$18,000</strong>, leaving only <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap - 18_000)}</strong> of cap room. Exceeding the cap results in the excess being added to your assessable income and taxed at your marginal rate, less a 15% offset.
        </p>

        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Employer SG (12%)</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Cap Room for Sacrifice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[60_000, 80_000, 100_000, 120_000, 150_000, 200_000].map((s) => {
                const sg = Math.round(s * SUPER_GUARANTEE.rate);
                const room = Math.max(0, SUPER_GUARANTEE.concessionalCap - sg);
                return (
                  <tr key={s} className="hover:bg-sandstone">
                    <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                    <td className="px-4 py-3 text-right text-navy">{formatAUD(sg)}</td>
                    <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(room)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-navy mb-2">What Is Division 293 Tax?</h3>
        <p className="text-warmgray">
          &quot;Division 293&quot; applies an additional <strong>15% tax</strong> on concessional contributions when your income plus concessional super contributions exceed <strong>$250,000</strong>. This brings the total super contributions tax to <strong>30%</strong> instead of 15%. Even at 30%, salary sacrifice remains beneficial for high-income earners because the top marginal income tax rate of 45% plus the 2% Medicare levy totals <strong>47%</strong> — still 17 percentage points higher than Division 293 taxation. Check your total assessable income using the{" "}
          <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>{" "}
          to determine if Division 293 applies to your situation.
        </p>
      </section>

      {/* --- H2: What Are Common Salary Sacrifice Mistakes? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Salary Sacrifice Mistakes?</h2>
        <p className="mb-4 text-warmgray">
          The most common salary sacrifice mistake is exceeding the <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> concessional cap: the excess is added to your assessable income and taxed at your marginal rate, less a 15% offset. See the <Link href="/concessional-contributions-cap/">concessional contributions cap</Link> guide.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray">
          <li><strong>Exceeding the concessional cap</strong> — Forgetting that employer SG contributions count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap. On a $120,000 salary, employer SG is $14,400, leaving only {formatAUD(SUPER_GUARANTEE.concessionalCap - 14_400)} of cap room, not the full {formatAUD(SUPER_GUARANTEE.concessionalCap)}.</li>
          <li><strong>Ignoring the HECS-HELP impact</strong> — Reportable super contributions are added back to &quot;repayment income&quot; when calculating HECS-HELP repayments. Salary sacrifice does not reduce your{" "}
            <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP</Link>{" "}
            obligation.</li>
          <li><strong>Sacrificing on a low marginal rate</strong> — Employees in the {SECOND_RATE_PCT} income tax bracket ($18,201 to $45,000) save no income tax from salary sacrifice into super in FY{FY} &mdash; only the 2 cent Medicare levy saving. The reduced liquidity is rarely worth the minimal tax saving.</li>
          <li><strong>Reducing borrowing capacity</strong> — Lenders assess income after salary sacrifice deductions. A large annual sacrifice lowers the income a lender counts, which can reduce how much you can borrow.</li>
          <li><strong>Not using carry-forward unused cap amounts</strong> — Since 1 July 2018, unused concessional cap amounts carry forward for up to 5 years if your total super balance is below <strong>$500,000</strong>. Employees who miss this opportunity leave tax savings on the table.</li>
        </ol>
      </section>

      {/* --- H2: What Changed for Salary Sacrifice this financial year? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Salary Sacrifice in FY{FY}?</h2>
        <p className="mb-4 text-warmgray">
          The concessional cap rose to <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> on 1 July 2026 (from {formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)}), the second income tax rate fell to <strong>{SECOND_RATE_PCT}</strong>, and Payday Super now requires employers to pay SG &mdash; still <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong>, the legislated ceiling &mdash; each payday. The SG rate itself last rose on {SUPER_GUARANTEE.effectiveDate}, from 11.5% to 12%.
        </p>
        <p className="text-warmgray">
          On a $100,000 salary, employer SG rose from $11,500 to <strong>$12,000</strong>, reducing cap room under the then {formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)} cap from $18,500 to $18,000. From 1 July 2026 the cap rose to <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>, so the room on $100,000 is now <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap - 12_000)}</strong>. The Stage 3 income tax cuts from 1 July 2024 also changed the calculus: the 30% bracket now extends to $135,000 (previously $120,000), giving more employees access to the 30% vs 15% salary sacrifice benefit. Use the{" "}
          <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link>{" "}
          to determine your total gross salary before modelling sacrifice scenarios.
        </p>
      </section>

      <MethodologyDisclosure>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Calculate pay breakdown without salary sacrifice.</li>
          <li>Reduce taxable income by sacrifice amount.</li>
          <li>Recalculate income tax, LITO, and Medicare on reduced taxable income.</li>
          <li>Tax saved = original total deductions − reduced total deductions.</li>
          <li>Take-home reduction = sacrifice amount − tax saved.</li>
        </ol>
      </MethodologyDisclosure>

{/* Merged from /salary-sacrifice-calculator/ on 2026-08-28 — the guide 301s here (GSC: same query network, split ranking). */}
                  <section id="available-items">
          <h2>What Items Are Available for Salary Sacrifice?</h2>
          <p>
            Salary sacrifice benefits fall into 3 categories: superannuation contributions, FBT-exempt items, and FBT-liable items. The tax outcome differs significantly between categories.
          </p>

          <div className="overflow-x-auto not-prose my-6">
            <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
              <thead>
                <tr className="bg-sandstone">
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Benefit</th>
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">FBT Status</th>
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Tax Outcome</th>
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Cap / Limit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy font-medium">Super contributions</td>
                  <td className="p-3 text-navy">Exempt</td>
                  <td className="p-3 text-navy">Taxed at 15% in fund</td>
                  <td className="p-3 text-navy">{formatAUD(SUPER_GUARANTEE.concessionalCap)}/year concessional cap</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                  <td className="p-3 text-navy font-medium">Electric vehicle (novated lease)</td>
                  <td className="p-3 text-navy">Exempt (below LCT threshold)</td>
                  <td className="p-3 text-navy">No FBT, no income tax on sacrificed amount</td>
                  <td className="p-3 text-navy">Vehicle price below {formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold, 0)} (FY{LUXURY_CAR_TAX.financialYear} LCT threshold for fuel-efficient vehicles)</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy font-medium">Laptop / tablet (work use)</td>
                  <td className="p-3 text-navy">Exempt (if primarily for work)</td>
                  <td className="p-3 text-navy">No FBT, reduces taxable income</td>
                  <td className="p-3 text-navy">1 item per FBT year</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                  <td className="p-3 text-navy font-medium">Mobile phone (work use)</td>
                  <td className="p-3 text-navy">Exempt (if primarily for work)</td>
                  <td className="p-3 text-navy">No FBT, reduces taxable income</td>
                  <td className="p-3 text-navy">1 item per FBT year</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy font-medium">NFP meal entertainment</td>
                  <td className="p-3 text-navy">Exempt (NFP employers only)</td>
                  <td className="p-3 text-navy">Reduces taxable income</td>
                  <td className="p-3 text-navy">Separate {formatAUD(FBT_CAPS.salaryPackagedEntertainment)} grossed-up cap (about {formatAUD(capFaceValue(FBT_CAPS.salaryPackagedEntertainment))} of meals)</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                  <td className="p-3 text-navy font-medium">NFP living expenses</td>
                  <td className="p-3 text-navy">Exempt (NFP employers only)</td>
                  <td className="p-3 text-navy">Reduces taxable income</td>
                  <td className="p-3 text-navy">{formatAUD(FBT_CAPS.pbiAndHealthPromotionCharity)} grossed-up (about {formatAUD(capFaceValue(FBT_CAPS.pbiAndHealthPromotionCharity))} of expenses) at PBIs and health promotion charities; {formatAUD(FBT_CAPS.hospitalAndAmbulance)} (about {formatAUD(capFaceValue(FBT_CAPS.hospitalAndAmbulance))}) at public and NFP hospitals</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy font-medium">ICE vehicle (novated lease)</td>
                  <td className="p-3 text-navy">Liable</td>
                  <td className="p-3 text-navy">FBT at 47% — benefit reduced or eliminated</td>
                  <td className="p-3 text-navy">No cap, but FBT erodes savings</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The &quot;Electric Car Discount&quot; (introduced 1 July 2022) makes battery electric vehicles, hydrogen fuel cell vehicles, and plug-in hybrids first held and used before 1 April 2025 FBT-exempt under a novated lease. This exemption turns EV salary sacrifice into one of the most tax-effective packaging arrangements available in Australia. Learn more about vehicle packaging in our <Link href="/novated-lease-guide/">Novated Lease Guide</Link>.
          </p>
        </section>
        <section id="who-benefits">
          <h2>Who Benefits Most from Salary Sacrifice?</h2>
          <p>
            Employees in higher income tax brackets benefit the most because the gap between their marginal tax rate and the 15% super contributions tax rate is largest. A taxpayer in the 45% bracket saves <strong>$0.30 per dollar</strong> sacrificed, while a taxpayer in the 15% bracket saves nothing on income tax (15% in, 15% contributions tax out) — only the 2c Medicare levy.
          </p>

          <div className="overflow-x-auto not-prose my-6">
            <table className="min-w-full text-sm border border-sandstone-dark/20 rounded-lg">
              <thead>
                <tr className="bg-sandstone">
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Income Range</th>
                  <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Marginal Rate</th>
                  <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Tax Saving per $1 Sacrificed</th>
                  <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy">$0–$18,200</td>
                  <td className="p-3 text-right text-navy">0%</td>
                  <td className="p-3 text-right text-navy">−$0.15 (worse off)</td>
                  <td className="p-3 text-ochre font-medium">Not recommended</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                  <td className="p-3 text-navy">$18,201–$45,000</td>
                  <td className="p-3 text-right text-navy">{SECOND_RATE_PCT}</td>
                  <td className="p-3 text-right text-navy">{SECOND_SAVING}</td>
                  <td className="p-3 text-ochre font-medium">Minimal benefit</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10">
                  <td className="p-3 text-navy">$45,001–$135,000</td>
                  <td className="p-3 text-right text-navy">30%</td>
                  <td className="p-3 text-right text-navy">$0.15</td>
                  <td className="p-3 text-eucalyptus-dark font-medium">Worthwhile</td>
                </tr>
                <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                  <td className="p-3 text-navy">$135,001–$190,000</td>
                  <td className="p-3 text-right text-navy">37%</td>
                  <td className="p-3 text-right text-navy">$0.22</td>
                  <td className="p-3 text-eucalyptus-dark font-medium">Highly beneficial</td>
                </tr>
                <tr>
                  <td className="p-3 text-navy">$190,001+</td>
                  <td className="p-3 text-right text-navy">45%</td>
                  <td className="p-3 text-right text-navy">$0.30</td>
                  <td className="p-3 text-eucalyptus-dark font-medium">Maximum benefit</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Three groups benefit the most from salary sacrifice arrangements:
          </p>
          <ul>
            <li><strong>High-income earners ($135,000+)</strong> — The 37% and 45% marginal rates create the largest gap above the 15% super tax rate, producing savings of $2,200 to $3,000 per $10,000 sacrificed</li>
            <li><strong>Employees approaching retirement (age 50–67)</strong> — Carry-forward rules allow lump-sum catch-up contributions to build super balances before retirement</li>
            <li><strong>Not-for-profit sector workers</strong> — Access to FBT-exempt packaging of everyday living expenses (rent, mortgage, groceries) of about {formatAUD(capFaceValue(FBT_CAPS.pbiAndHealthPromotionCharity))} a year at PBIs and health promotion charities, or about {formatAUD(capFaceValue(FBT_CAPS.hospitalAndAmbulance))} at public hospitals, produces savings even at lower income levels</li>
          </ul>
          <p>
            Employees earning below the tax-free threshold of <strong>$18,200</strong> are worse off salary sacrificing into super because the 15% contributions tax exceeds their 0% income tax rate. Employees in the 15% bracket ($18,201–$45,000) gain only the 2% Medicare levy saving and are better served by claiming the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> instead.
          </p>
        </section>
        <section id="risks-downsides">
          <h2>What Are the Risks and Downsides?</h2>
          <p>
            Salary sacrifice reduces take-home pay immediately. The tax savings are real, but the trade-off is lower disposable income each pay cycle. Employees must assess whether the reduced cash flow is sustainable before committing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6 mt-4">
            <Card className="bg-eucalyptus-light/30 border-sandstone-dark/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-eucalyptus-dark mb-2">The Pros</h4>
                <ul className="list-disc list-inside text-sm text-eucalyptus-dark space-y-1">
                  <li>Legally reduces your taxable income.</li>
                  <li>Turbocharges your retirement savings.</li>
                  <li>Can make expensive EVs surprisingly affordable.</li>
                  <li>Reduces your PAYG withholding immediately.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-sandstone border-sandstone-dark/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-ochre mb-2">The Cons</h4>
                <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                  <li>Reduces your immediately available cash flow.</li>
                  <li>Super contributions are locked away until age 60.</li>
                  <li>Does not reduce calculations for HECS repayments.</li>
                  <li>Subject to the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p>
            Seven specific risks require consideration before entering a salary sacrifice arrangement:
          </p>
          <ol>
            <li><strong>Reduced cash flow</strong> — Every dollar sacrificed is a dollar removed from your take-home pay. Budget accordingly using a fortnightly or monthly breakdown from our <Link href="/">Pay Calculator</Link></li>
            <li><strong>Super preservation</strong> — Salary sacrificed into super is locked until a condition of release is met, typically reaching age 60 and retiring. Early access is restricted to severe financial hardship, terminal illness, or compassionate grounds</li>
            <li><strong>HECS-HELP is unaffected</strong> — The ATO calculates HECS repayments using &quot;Repayment Income&quot; which adds back reportable super contributions and reportable fringe benefits. Salary sacrifice does not reduce HECS obligations. See our <Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> for the full repayment structure</li>
            <li><strong>Exceeding the concessional cap</strong> — Contributions beyond {formatAUD(SUPER_GUARANTEE.concessionalCap)} (including employer SG, and before any carry-forward) are taxed at the employee&apos;s marginal rate less a 15% offset</li>
            <li><strong>Impact on government benefits</strong> — Centrelink assessments may use adjusted taxable income, which includes reportable super contributions, potentially reducing eligibility for Family Tax Benefit, childcare subsidies, or other income-tested payments</li>
            <li><strong>Employer insolvency risk</strong> — If your employer becomes insolvent before remitting salary sacrifice contributions to your super fund, those contributions may be treated as unpaid wages</li>
            <li><strong>No retrospective changes</strong> — Once a pay period passes, the sacrifice cannot be reversed. Only future pay periods can be adjusted</li>
          </ol>
        </section>
        <section id="how-to-set-up">
          <h2>Step-by-Step: How to Set Up Salary Sacrifice</h2>
          <p>
            Setting up a salary sacrifice arrangement requires a written agreement with your employer before the relevant pay period. The process takes <strong>1 to 4 weeks</strong> depending on your employer&apos;s payroll cycle and approval process.
          </p>
          <ol>
            <li><strong>Calculate your cap space</strong> — Check your current employer SG contributions ({formatPercent(SUPER_GUARANTEE.rate, 0)} of your gross salary) and subtract from the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap. The result is your maximum sacrifice amount for super</li>
            <li><strong>Determine the right amount</strong> — Model the impact on your take-home pay using the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>. Ensure the reduced fortnightly pay covers rent, mortgage repayments, groceries, and other essential expenses</li>
            <li><strong>Request the arrangement in writing</strong> — Submit a written request to your employer or HR department specifying the dollar amount per pay period, the benefit type (super, novated lease, device), and the desired start date</li>
            <li><strong>Employer approves and adjusts payroll</strong> — Your employer confirms the arrangement and updates the payroll system. The first adjusted pay slip reflects the lower gross salary and reduced PAYG withholding</li>
            <li><strong>Verify your pay slip</strong> — Check that the sacrificed amount, adjusted gross income, reduced PAYG, and super contribution match the agreed figures. Report discrepancies to payroll immediately</li>
            <li><strong>Review annually</strong> — Reassess the arrangement at the start of each financial year. Changes in salary, tax brackets, or the concessional cap (indexed to AWOTE in $2,500 increments) may require adjustment</li>
          </ol>
        </section>
        <section id="fbt-implications">
          <h2>How Does Fringe Benefits Tax Affect Salary Sacrifice?</h2>
          <p>
            Fringe Benefits Tax is a <strong>47%</strong> tax imposed on employers who provide non-cash benefits to employees. FBT applies to most salary sacrifice items except superannuation, certain portable electronic devices used primarily for work, and eligible electric vehicles.
          </p>
          <p>
            When an item attracts FBT, the employer bears the tax liability. In practice, most employers pass the FBT cost directly to the employee through payroll adjustments, eliminating any net tax benefit. On a $40,000 internal combustion engine (ICE) car under the statutory formula, the taxable value is <strong>{formatAUD(ICE_TAXABLE_VALUE)}</strong> ({Math.round(FBT.statutoryRate * 100)}% of the cost) and the FBT is about <strong>{formatAUD(ICE_FBT)}</strong> a year &mdash; which is why most novated leases on petrol cars use post-tax employee contributions to reduce the taxable value to nil.
          </p>
          <p>
            FBT-exempt items deliver the full tax benefit because no additional tax applies. The 3 most common FBT-exempt salary sacrifice categories are:
          </p>
          <ul>
            <li><strong>Superannuation contributions</strong> — Exempt from FBT, taxed at 15% inside the fund</li>
            <li><strong>Eligible electric vehicles</strong> — FBT-exempt under the Electric Car Discount when the vehicle value is below the fuel-efficient luxury car tax threshold of {formatAUD(LUXURY_CAR_TAX.fuelEfficientThreshold, 0)}</li>
            <li><strong>Portable electronic devices</strong> — Laptops, tablets, and mobile phones used primarily for employment duties (limited to 1 device per FBT year per category)</li>
          </ul>
          <p>
            Read the full breakdown of FBT categories, rates, and exemptions on our <Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link>.
          </p>
        </section>

                {/* --- H2: Related Calculators --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Australian Tax Calculators</h2>
        <p className="mb-4 text-warmgray">
          Salary sacrifice is one component of your total pay package. These calculators model the other components that affect your take-home pay and superannuation balance.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — Project your total super balance at retirement, including employer SG and salary sacrifice contributions.</li>
          <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — See the full income tax brackets, LITO offset, and Medicare levy for FY{SITE_CONFIG.financialYear}.</li>
          <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — Calculate your net pay after tax, Medicare, and HECS deductions on any salary.</li>
          <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> — Model your HECS-HELP repayment under the new marginal system, including the impact of reportable super contributions.</li>
          <li><Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> — Compare the after-tax value of a pay rise versus increasing your salary sacrifice amount.</li>
        </ul>
      </section>

      {/* --- H2: Frequently Asked Questions --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
        <FaqAccordion faqs={SALARY_SACRIFICE_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
      </section>

      <section className="bg-sandstone rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your full pay breakdown</h2>
        <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super — all in one calculation.</p>
        <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator →</Link>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}
