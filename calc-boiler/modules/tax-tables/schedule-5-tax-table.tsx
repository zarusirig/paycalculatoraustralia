"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  calculateSchedule5MethodB,
  NO_TFN_RATES,
  PAYG_TABLES_UPDATED,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";
import Schedule5Table from "./schedule-5-table";
import AtoDownloads from "./ato-downloads";
import TaxTableFaqSection from "./faq-section";
import TaxTablesSidebar from "./sidebar";
import { SCHEDULE_5_FAQS } from "./schedule-5-tax-table-faqs";
import {
  ATO_SCHEDULE_1,
  ATO_SCHEDULE_5,
  ATO_SCHEDULE_8,
  SCHEDULE_5_BONUS_ROWS,
  SCHEDULE_5_WITHHOLDING_LIMIT,
} from "./ato-schedules";

const SOURCES_LIST: SourceLink[] = [
  { title: `${ATO_SCHEDULE_5.title} (${ATO_SCHEDULE_5.nat})`, url: ATO_SCHEDULE_5.pageUrl, publisher: SOURCES.ato.name },
  {
    title: "Schedule 5 — Working out the withholding amount",
    url: `${ATO_SCHEDULE_5.pageUrl}/working-out-the-withholding-amount`,
    publisher: SOURCES.ato.name,
  },
  { title: `${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: ATO_SCHEDULE_1.pageUrl, publisher: SOURCES.ato.name },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Worked example used in the prose, computed from the shared engine.
const workedExample = calculateSchedule5MethodB(2_000, 5_000, "fortnightly");

/** The ATO caps withholding on an additional payment at 47% of that payment. */
function withholdingLimitFor(additionalPayment: number): number {
  return Math.floor(additionalPayment * SCHEDULE_5_WITHHOLDING_LIMIT);
}

function Schedule5Widget() {
  const [regular, setRegular] = useState(2_000);
  const [bonus, setBonus] = useState(5_000);
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [hasSTSL, setHasSTSL] = useState(false);

  const result = useMemo(
    () => calculateSchedule5MethodB(regular, bonus, frequency, { hasSTSL }),
    [regular, bonus, frequency, hasSTSL]
  );

  const limit = withholdingLimitFor(bonus);
  const exceedsLimit = result.withheldFromAdditionalPayment > limit;

  return (
    <Card className="shadow-md not-prose my-8">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="s5-frequency" className="block text-sm font-medium text-navy mb-1">Pay frequency</label>
              <select
                id="s5-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                className="block w-full rounded-md border border-sandstone-dark/30 bg-white px-3 py-2 text-sm shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="s5-regular" className="block text-sm font-medium text-navy mb-1">Regular gross pay per period</label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number" id="s5-regular" min={0} max={50_000} step={50} value={regular}
                  onChange={(e) => setRegular(clamp(Number(e.target.value || 0), 0, 50_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="s5-bonus" className="block text-sm font-medium text-navy mb-1">Bonus / back payment / commission</label>
              <div className="flex items-center">
                <span className="text-warmgray-light mr-2">$</span>
                <input
                  type="number" id="s5-bonus" min={0} max={500_000} step={100} value={bonus}
                  onChange={(e) => setBonus(clamp(Number(e.target.value || 0), 0, 500_000))}
                  className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox" checked={hasSTSL} onChange={(e) => setHasSTSL(e.target.checked)}
                className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus"
              />
              <span className="text-navy">HECS-HELP / study loan (STSL)</span>
            </label>
            <p className="text-xs text-warmgray">
              Uses the ATO Schedule 5 apportionment arithmetic with FY2026-27 rates. Assumes the tax-free
              threshold is claimed and that pay is even across the year.
            </p>
          </form>

          <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-navy mb-4">Withholding on your bonus</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-warmgray">Bonus amount</span>
                  <span className="font-semibold text-navy">{formatAUD(bonus, 2)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between">
                  <span className="text-warmgray">Tax withheld (apportionment)</span>
                  <span className="text-navy">-{formatAUD(result.withheldFromAdditionalPayment, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">Effective rate on bonus</span>
                  <span className="text-navy">{formatPercent(result.effectiveRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">ATO withholding limit ({SCHEDULE_5_WITHHOLDING_LIMIT * 100}%)</span>
                  <span className="text-navy">{formatAUD(limit, 2)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-navy">Bonus in your pocket</span>
                  <span className="font-bold text-eucalyptus-dark">{formatAUD(result.netAdditionalPayment, 2)}</span>
                </div>
                {exceedsLimit && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
                    <p className="text-xs text-navy">
                      The apportionment result is above the ATO&apos;s {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% withholding
                      limit. Your employer must reduce the amount withheld from the additional payment to{" "}
                      <strong>{formatAUD(limit, 2)}</strong>, leaving <strong>{formatAUD(bonus - limit, 2)}</strong> in hand.
                    </p>
                  </div>
                )}
                <p className="text-xs text-warmgray pt-2">
                  Want the full breakdown including super?{" "}
                  <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark underline hover:text-navy">
                    Use the bonus tax calculator
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Schedule5TaxTablePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/payg-withholding-tables/" className="hover:text-eucalyptus-dark hover:underline">PAYG Withholding Tables</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Schedule 5 Tax Table</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Schedule 5 Tax Table 2026-27 (ATO NAT 3348) — PAYG on Bonuses, Commissions &amp; Back Payments
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            Schedule 5 &mdash; published by the ATO as <strong>{ATO_SCHEDULE_5.nat}</strong> &mdash; is the tax table employers use
            to withhold PAYG from bonuses, commissions and back payments. Instead of taxing the lump sum like a normal pay, it
            spreads the payment across the year&apos;s pay periods so withholding matches your real marginal rate.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">
            {ATO_SCHEDULE_5.nat} published {ATO_SCHEDULE_5.published} &middot; applies to payments made from {PAYG_TABLES_UPDATED} &middot; FY2026-27 rates
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="calculator">
              <h2>Schedule 5 Calculator — Tax Withheld From Your Bonus</h2>
              <p>
                Enter your regular pay and the additional payment to see the withholding your payroll should apply under the
                2026-27 rates, along with the ATO&apos;s {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% cap on the amount.
              </p>
              <Schedule5Widget />
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Full bonus breakdown</h3>
                    <p className="text-navy text-sm mb-3">See your bonus after tax alongside annual income, Medicare, and super effects.</p>
                    <Link href="/bonus-tax-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Bonus tax calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/backpay-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Back pay calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="schedule-5-table-2026-27">
              <h2>Schedule 5 Ready Reckoner 2026-27</h2>
              <p>
                The table below applies the Schedule 5 apportionment to a worker earning {formatAUD(2_000)} a fortnight
                ({formatAUD(52_000)} a year) who claims the tax-free threshold and has no study loan. Read it as a guide to
                the shape of the result: the effective rate stays close to the employee&apos;s marginal rate rather than
                spiking, which is the whole purpose of the schedule.
              </p>
              <Schedule5Table
                regularGross={2_000}
                frequency="fortnightly"
                amounts={SCHEDULE_5_BONUS_ROWS}
                caption="ATO Schedule 5 (NAT 3348) withholding on additional payments, 2026-27, for an employee earning $2,000 a fortnight"
              />
              <p className="text-sm text-warmgray-light">
                Every figure is computed at page load from the ATO Schedule 1 coefficients and the Schedule 5 apportionment
                steps. Change the regular pay, frequency or study loan setting in the calculator above for your own numbers.
              </p>
            </section>

            <section id="what-is-schedule-5">
              <h2>What Is PAYG Schedule 5?</h2>
              <p>
                Schedule 5 ({ATO_SCHEDULE_5.nat}) is the ATO withholding schedule for <strong>&quot;back payments, commissions,
                bonuses and similar payments&quot;</strong> &mdash; lump sums paid on top of ordinary wages. Employers cannot simply
                add a {formatAUD(5_000)} bonus to one fortnight&apos;s pay and use the{" "}
                <Link href="/fortnightly-tax-table/">fortnightly tax table</Link>: doing so would annualise the bonus as if you
                earned it every fortnight and withhold far too much. Schedule 5 exists to withhold at a rate that reflects the
                payment&apos;s effect on your <em>annual</em> income.
              </p>
              <p>
                Unlike the weekly, fortnightly and monthly tables, Schedule 5 is not a look-up grid &mdash; it is a set of
                calculation methods that sit on top of whichever regular tax table applies to the payee. That is why the ATO
                publishes it as web content rather than a printable PDF.
              </p>
              <p>
                One boundary matters before you start: Schedule 5 applies only where the payment relates to <strong>more than
                one pay period</strong>, or to an undefined period. If a commission or bonus relates to a single pay period, it is
                simply added to that period&apos;s earnings and withheld from the ordinary tax table instead.
              </p>
            </section>

            <section id="method-a-vs-method-b">
              <h2>Method A vs Method B — How Employers Calculate the Withholding</h2>
              <p>
                The ATO gives employers two methods, and either is acceptable. Method B is more complex but produces a
                withholding amount more likely to approximate the payee&apos;s actual tax payable. If either method produces a
                negative result, treat it as nil.
              </p>

              <h3>Method A — apportion across the pay periods in the year</h3>
              <p>
                Method A can be used for <strong>any</strong> additional payment, regardless of which financial year it relates to.
                It apportions the payment over the number of pay periods in a financial year and applies that average to the
                gross earnings in the <em>current</em> pay period:
              </p>
              <ol>
                <li>Work out the payee&apos;s gross earnings for the current period, excluding additional payments. Ignore cents.</li>
                <li>Find the withholding on that amount in the relevant tax table.</li>
                <li>Add together all additional payments in this period and divide by the number of pay periods in the year (52, 26 or 12). Ignore cents.</li>
                <li>Add the step 3 amount to the step 1 earnings.</li>
                <li>Find the withholding on the step 4 amount.</li>
                <li>Subtract step 2 from step 5.</li>
                <li>Multiply the step 6 difference by the number of pay periods used at step 3.</li>
                <li>Multiply the additional payment by {SCHEDULE_5_WITHHOLDING_LIMIT * 100}%.</li>
                <li>Withhold the <strong>lesser</strong> of step 7 and step 8, ignoring cents.</li>
              </ol>
              <p>
                A useful variation: if a commission or bonus covers a defined period of less than 12 months, the employer may
                divide by the number of pay periods the payment actually relates to at step 3, rather than the full year. A
                commission covering four weeks for a weekly-paid employee can be divided by four instead of 52.
              </p>

              <h3>Method B(i) — back pay for specific periods in the current financial year</h3>
              <p>
                Method B(i) is for back payments that map onto identifiable earlier pay periods <strong>in the current financial
                year</strong>. Rather than averaging, it reconstructs each affected period: work out how much of the back payment
                belongs to each period, add it to what was actually paid then, look up the withholding on that corrected total,
                and subtract what was already withheld. Repeat for every affected period and total the differences.
              </p>

              <h3>Method B(ii) — payments spread across the whole financial year</h3>
              <p>
                Method B(ii) is for back payments relating to a <strong>prior</strong> financial year, and for any additional payment
                that does not belong to a single pay period. It averages the additional payments across the pay periods in the year
                and applies that to your <em>average total earnings for the year to date</em> &mdash; not to the current period&apos;s
                earnings, which is the key difference from Method A. It also subtracts any amounts already withheld from earlier
                Method B(ii) payments in the same year, and is subject to the same {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% cap.
              </p>
              <p>
                If a back payment spans both the current and a previous financial year, the employer apportions it between the two
                and applies the relevant method to each part.
              </p>
              <p>
                <strong>Worked example (2026-27):</strong> an employee earns {formatAUD(2_000)} a fortnight and receives a{" "}
                {formatAUD(5_000)} annual bonus. The apportioned slice is {formatAUD(workedExample.apportionedAmount)} per fortnight,
                the withholding difference is {formatAUD(workedExample.perPeriodDifference)} per pay, and total withholding on the
                bonus is <strong>{formatAUD(workedExample.withheldFromAdditionalPayment)}</strong> &mdash; an effective rate of{" "}
                {formatPercent(workedExample.effectiveRate)}, close to the employee&apos;s marginal rate rather than the top rate, and
                comfortably under the {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% cap. Verify your own numbers with our{" "}
                <Link href="/bonus-tax-calculator/">bonus tax calculator</Link>.
              </p>
            </section>

            <section id="withholding-limit">
              <h2>The 47% Withholding Limit</h2>
              <p>
                Under both Method A and Method B(ii), the ATO caps withholding from an additional payment at{" "}
                <strong>{SCHEDULE_5_WITHHOLDING_LIMIT * 100}% of that payment</strong>. If the calculated amount comes out higher,
                the employer reduces it to exactly {SCHEDULE_5_WITHHOLDING_LIMIT * 100}%. Two details matter:
              </p>
              <ul>
                <li>The cap applies to the <strong>additional payment only</strong>, not to the normal earnings in that pay period. The ordinary withholding on the regular wage is unaffected.</li>
                <li>Where the study loan component is calculated separately, the cap is tested against the <strong>combined</strong> total of the tax and loan components, not against each one on its own.</li>
              </ul>
              <p>
                The cap can leave some payees under-withheld &mdash; for example, where the bonus pushes annual income past a study
                loan repayment threshold or into a higher bracket. In that case the ATO&apos;s remedy is an upwards variation: the
                payee enters an agreement with the employer to increase the rate or amount withheld. The calculator above shows the
                cap next to the calculated figure so you can see when it binds.
              </p>
            </section>

            <section id="payments-covered">
              <h2>Which Payments Use the Schedule 5 Tax Table?</h2>
              <ul>
                <li><strong>Bonuses and incentive payments</strong> &mdash; annual performance bonuses, sign-on bonuses, KPI payments. See the <Link href="/bonus-tax-calculator/">bonus tax guide</Link> for how these interact with super.</li>
                <li><strong>Commissions</strong> &mdash; sales commissions paid as lump sums rather than in every pay.</li>
                <li><strong>Back payments and arrears</strong> &mdash; underpaid wages, backdated pay rises, and award reclassifications. Use the <Link href="/backpay-calculator/">back pay calculator</Link> to estimate the tax on arrears.</li>
                <li><strong>Lump-sum leave loading</strong> &mdash; leave loading paid as a lump sum uses Schedule 5; paid pro-rata it is added to that period&apos;s earnings instead.</li>
                <li><strong>Back payments of super income streams</strong> &mdash; including lump sum payments in arrears from pensions and annuities.</li>
              </ul>
              <p>
                Payments that do <strong>not</strong> use Schedule 5 include anything relating to a single pay period, unused leave
                paid out on termination (Schedule 7, NAT 3351) and employment termination payments such as redundancy (Schedule 11,
                NAT 70980) &mdash; our <Link href="/final-pay-calculator/">final pay calculator</Link> and{" "}
                <Link href="/redundancy-pay-calculator/">redundancy pay calculator</Link> cover those cases. Where a payee has not
                quoted a TFN, the no-TFN rates override everything: {NO_TFN_RATES.resident * 100}% for a resident and{" "}
                {NO_TFN_RATES.foreignResident * 100}% for a foreign resident, with no offsets and no loan component.
              </p>
            </section>

            <section id="stsl">
              <h2>Study Loans on Bonuses and Back Payments</h2>
              <p>
                If the payee has a HELP, VET Student Loan, Financial Supplement, Student Start-up Loan or Australian Apprenticeship
                Support Loan debt, the employer must also withhold a study loan component from the additional payment &mdash; using
                the <strong>same method</strong> chosen for the income tax component. Calculate the bonus withholding under Method A,
                and the loan component must also come from Method A.
              </p>
              <p>
                Employers who prefer to combine the two in one calculation rather than running the steps twice can use{" "}
                <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">{ATO_SCHEDULE_8.nat} (Schedule 8)</a>.
                The ATO notes the combined result may differ slightly from the sum of the separate table amounts because of
                component rounding, and accepts either. See the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> for
                how a bonus changes your annual repayment.
              </p>
            </section>

            <section id="why-bonus-taxed-high">
              <h2>Why Does Your Bonus Look So Heavily Taxed?</h2>
              <p>
                A bonus is not taxed at a special punitive rate &mdash; it is <strong>withheld</strong> at your marginal rate, which is
                higher than the average rate applied to your normal pay. Because the tax-free threshold and lower brackets are already
                consumed by your salary, every bonus dollar sits in your top bracket (30%, 37% or 45%) plus the Medicare levy and any
                study loan repayment. If payroll skipped Schedule 5 and ran the lump sum through the regular table, withholding would be
                higher still, and the excess would only come back at{" "}
                <Link href="/tax-return-calculator/">tax return time</Link>.
              </p>
              <p>
                Withholding is also not your final tax. Schedule 5 only decides how much is held back when the payment is made; your
                actual liability is settled when you lodge, and any over- or under-withholding washes out then.
              </p>
            </section>

            <section id="ato-downloads">
              <h2>Official ATO Schedule 5 Publication</h2>
              <p>
                The ATO publishes {ATO_SCHEDULE_5.nat} as web content covering the calculation methods, TFN declarations, back
                payment reporting and worked examples. Because it is a method rather than a look-up grid, there is no printable PDF
                look-up table for 2026-27 &mdash; unlike the weekly, fortnightly and monthly tables.
              </p>
              <AtoDownloads doc={ATO_SCHEDULE_5} also={[ATO_SCHEDULE_1, ATO_SCHEDULE_8]} />
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; how all the ATO schedules fit together.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table (NAT 1005)</Link>, <Link href="/fortnightly-tax-table/">fortnightly tax table (NAT 1006)</Link> and <Link href="/monthly-tax-table/">monthly tax table (NAT 1007)</Link> &mdash; the regular-pay tables Schedule 5 builds on.</li>
                <li><Link href="/bonus-tax-calculator/">Bonus tax calculator</Link> &mdash; your bonus after tax in full detail.</li>
                <li><Link href="/backpay-calculator/">Back pay calculator</Link> &mdash; tax on arrears and underpayments.</li>
                <li><Link href="/second-job-tax-calculator/">Second job tax calculator</Link> &mdash; withholding without the tax-free threshold.</li>
              </ul>
            </section>

            <TaxTableFaqSection
              heading="Schedule 5 Tax Table — Frequently Asked Questions"
              mirrorHeading="Schedule 5 (NAT 3348) questions and answers"
              faqs={SCHEDULE_5_FAQS}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  The calculations on this page implement the ATO Schedule 5 apportionment arithmetic &mdash; divide the additional
                  payment by the number of pay periods, add the slice to the base earnings, take the withholding difference and
                  multiply it back &mdash; on top of the{" "}
                  <a href={ATO_SCHEDULE_1.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 1 ({ATO_SCHEDULE_1.nat})</a>{" "}
                  coefficient tables at FY2026-27 rates. They assume the tax-free threshold is claimed and that pay is even across the
                  year, in which case Method A and Method B(ii) coincide; where your earnings have varied, Method B(ii) uses your
                  average total earnings to date and will differ.
                </p>
                <p>
                  Two limits to be aware of. First, the figures here are the <em>uncapped</em> apportionment result; the ATO&apos;s{" "}
                  {SCHEDULE_5_WITHHOLDING_LIMIT * 100}% withholding limit is shown alongside it in the calculator and your employer must
                  apply it where it binds &mdash; most often on a small bonus paid to a high earner with a study loan. Second, Method B(i)
                  for current-year back pay recalculates each affected pay period individually and is not modelled here; use the{" "}
                  <Link href="/backpay-calculator/">back pay calculator</Link> or your payroll system for that case. Always verify
                  payroll-critical amounts against {ATO_SCHEDULE_5.nat}.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("schedule-5-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/bonus-tax-calculator/", label: "Bonus Tax Calculator" },
              { href: "/backpay-calculator/", label: "Back Pay Calculator" },
              { href: "/weekly-tax-table/", label: "Weekly Tax Table (NAT 1005)" },
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table (NAT 1006)" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
            ctaHref="/bonus-tax-calculator/"
            ctaTitle="Got a bonus coming?"
            ctaText="See exactly how much of your bonus you keep after tax and super."
            ctaButton="Bonus Tax Calculator"
          />

        </div>
      </div>
    </div>
  );
}
