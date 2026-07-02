"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  calculateSchedule5MethodB,
  PAYG_TABLES_UPDATED,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";
import TaxTablesSidebar from "./sidebar";

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 5 — Tax table for back payments, commissions, bonuses and similar payments (NAT 3348)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-back-payments-commissions-bonuses-and-similar-payments", publisher: SOURCES.ato.name },
  { title: "Tax tables overview", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Worked example used in the prose, computed from the shared engine.
const workedExample = calculateSchedule5MethodB(2_000, 5_000, "fortnightly");

function Schedule5Widget() {
  const [regular, setRegular] = useState(2_000);
  const [bonus, setBonus] = useState(5_000);
  const [frequency, setFrequency] = useState<PayFrequency>("fortnightly");
  const [hasSTSL, setHasSTSL] = useState(false);

  const result = useMemo(
    () => calculateSchedule5MethodB(regular, bonus, frequency, { hasSTSL }),
    [regular, bonus, frequency, hasSTSL]
  );

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
              Uses ATO Schedule 5 Method B(ii) with FY2026-27 rates. Assumes the tax-free threshold is claimed.
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
                  <span className="text-warmgray">Tax withheld (Method B(ii))</span>
                  <span className="text-navy">-{formatAUD(result.withheldFromAdditionalPayment, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">Effective rate on bonus</span>
                  <span className="text-navy">{formatPercent(result.effectiveRate)}</span>
                </div>
                <div className="border-t border-sandstone-dark/20" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-navy">Bonus in your pocket</span>
                  <span className="font-bold text-eucalyptus-dark">{formatAUD(result.netAdditionalPayment, 2)}</span>
                </div>
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
            Schedule 5 Tax Table — PAYG on Back Payments, Bonuses &amp; Commissions
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            Schedule 5 is the ATO tax table employers use to withhold PAYG from bonuses, commissions,
            and back payments. Instead of taxing the lump sum like a normal pay, it spreads the payment
            across the year&apos;s pay periods so withholding matches your real marginal rate.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — FY2026-27 rates (NAT 3348)</p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="calculator">
              <h2>Schedule 5 Calculator — Tax Withheld From Your Bonus</h2>
              <p>
                Enter your regular pay and the additional payment to see the Method B(ii) withholding your
                payroll should apply under the 2026-27 rates.
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

            <section id="what-is-schedule-5">
              <h2>What Is PAYG Schedule 5?</h2>
              <p>
                Schedule 5 (NAT 3348) is the ATO withholding schedule for <strong>&quot;back payments, commissions,
                bonuses and similar payments&quot;</strong> &mdash; any lump sum paid on top of ordinary wages. Employers
                cannot simply add a $5,000 bonus to one fortnight&apos;s pay and use the{" "}
                <Link href="/fortnightly-tax-table/">fortnightly tax table</Link>: doing so would annualise the
                bonus as if you earned it every fortnight and withhold far too much. Schedule 5 exists to
                withhold at a rate that reflects the payment&apos;s effect on your <em>annual</em> income.
              </p>
              <p>
                The schedule offers employers two calculation methods. Both arrive at broadly similar outcomes,
                but Method B(ii) is the default in most payroll software because it works for any additional
                payment, including back pay covering prior financial years.
              </p>
            </section>

            <section id="method-a-vs-method-b">
              <h2>Method A vs Method B — How Employers Calculate the Withholding</h2>
              <h3>Method A — apportion across the current year&apos;s remaining pays</h3>
              <p>
                Method A divides the additional payment by the number of pay periods in the financial year,
                adds that slice to the current pay&apos;s earnings, finds the withholding difference, and multiplies
                it by the number of pay periods. It is designed for payments that relate to the <strong>current</strong>{" "}
                pay period or year, such as a quarterly commission.
              </p>
              <h3>Method B(ii) — apportion across all pays in the year</h3>
              <p>
                Method B(ii) spreads the payment evenly across <strong>all</strong> pay periods in the year
                (52 weekly, 26 fortnightly, or 12 monthly). The steps:
              </p>
              <ol>
                <li>Divide the additional payment by the number of pay periods and disregard the cents.</li>
                <li>Add that amount to the gross earnings for the current period.</li>
                <li>Work out the withholding on the combined amount, and on the normal earnings alone, using the regular tax table.</li>
                <li>The difference, multiplied by the number of pay periods, is withheld from the additional payment.</li>
              </ol>
              <p>
                <strong>Worked example (2026-27):</strong> an employee earns {formatAUD(2_000)} a fortnight and receives a{" "}
                {formatAUD(5_000)} annual bonus. The apportioned slice is {formatAUD(workedExample.apportionedAmount)} per
                fortnight, the withholding difference is {formatAUD(workedExample.perPeriodDifference)} per pay, and total
                withholding on the bonus is <strong>{formatAUD(workedExample.withheldFromAdditionalPayment)}</strong> &mdash; an
                effective rate of about {formatPercent(workedExample.effectiveRate)}, close to the employee&apos;s marginal
                rate rather than the top rate. Verify your own numbers with our{" "}
                <Link href="/bonus-tax-calculator/">bonus tax calculator</Link>.
              </p>
            </section>

            <section id="payments-covered">
              <h2>Which Payments Use the Schedule 5 Tax Table?</h2>
              <ul>
                <li><strong>Bonuses and incentive payments</strong> &mdash; annual performance bonuses, sign-on bonuses, KPI payments. See the <Link href="/bonus-tax-guide/">bonus tax guide</Link> for how these interact with super.</li>
                <li><strong>Commissions</strong> &mdash; sales commissions paid as lump sums rather than in every pay.</li>
                <li><strong>Back payments and arrears</strong> &mdash; underpaid wages, backdated pay rises, and award reclassifications. Use the <Link href="/backpay-calculator/">back pay calculator</Link> to estimate the tax on arrears.</li>
                <li><strong>Repeated lump sums</strong> &mdash; quarterly or irregular allowances not part of ordinary pay.</li>
              </ul>
              <p>
                Payments that do <strong>not</strong> use Schedule 5 include unused leave on termination (Schedule 7)
                and employment termination payments such as redundancy (Schedule 11) &mdash; our{" "}
                <Link href="/final-pay-calculator/">final pay calculator</Link> and{" "}
                <Link href="/redundancy-pay-calculator/">redundancy pay calculator</Link> cover those cases.
              </p>
            </section>

            <section id="why-bonus-taxed-high">
              <h2>Why Does Your Bonus Look So Heavily Taxed?</h2>
              <p>
                A bonus is not taxed at a special punitive rate &mdash; it is <strong>withheld</strong> at your marginal
                rate, which is higher than the average rate applied to your normal pay. Because the tax-free
                threshold and lower brackets are already consumed by your salary, every bonus dollar sits in
                your top bracket (30%, 37%, or 45% plus Medicare levy). If payroll skipped Schedule 5 and taxed
                the lump sum through the regular table, withholding would be even higher, and the excess would
                only come back at <Link href="/tax-return-calculator/">tax return time</Link>.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; how all the ATO schedules fit together.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table</Link>, <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> and <Link href="/monthly-tax-table/">monthly tax table</Link> &mdash; the regular-pay tables Schedule 5 builds on.</li>
                <li><Link href="/bonus-tax-calculator/">Bonus tax calculator</Link> &mdash; your bonus after tax in full detail.</li>
                <li><Link href="/backpay-calculator/">Back pay calculator</Link> &mdash; tax on arrears and underpayments.</li>
                <li><Link href="/second-job-tax-calculator/">Second job tax calculator</Link> &mdash; withholding without the tax-free threshold.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="flat-rate" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is there a flat tax rate on bonuses in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Bonuses are ordinary assessable income taxed at your marginal rate. Schedule 5 only controls how much is withheld when the bonus is paid — your final tax is settled in your annual return, where any over- or under-withholding washes out.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="which-method" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Which method will my employer use — A or B?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Most payroll software defaults to Method B(ii) because it handles any additional payment, including back pay for earlier years. Method A is common for commissions relating to the current period. Both are ATO-approved; the difference in withholding is usually small and reconciles at tax time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="backpay-prior-year" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How is back pay for a previous financial year withheld?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Back payments that accrued more than 12 months ago are withheld under Method B(i), which applies the marginal rate to the average additional amount. You may also be entitled to a lump sum in arrears tax offset in your return, so you are not penalised for receiving old income in one hit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-on-bonus" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is super paid on bonuses withheld under Schedule 5?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Usually yes. Performance bonuses are generally ordinary time earnings, so the 12% superannuation guarantee applies on top of the gross bonus. Overtime-related bonuses can be excluded. Schedule 5 itself only deals with the PAYG withholding, not super.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stsl" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does HECS-HELP (STSL) apply to Schedule 5 payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. If you have a study or training support loan, the STSL component is calculated on the combined earnings in the same Method A/B steps, so a bonus increases the loan repayment withheld for that pay as well.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Schedule 5 calculations on this page implement ATO Method B(ii) using FY2026-27 resident rates
                  (15% on $18,201&ndash;$45,000 from 1 July 2026), assuming the tax-free threshold is claimed and pay
                  is uniform across the year. Printed ATO tables round coefficients slightly differently, so payroll
                  figures may vary by small amounts. Always verify payroll-critical amounts against NAT 3348.
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
              { href: "/weekly-tax-table/", label: "Weekly Tax Table" },
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
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
