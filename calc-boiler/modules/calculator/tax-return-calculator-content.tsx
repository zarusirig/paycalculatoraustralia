// Everything on /tax-return-calculator/ below the calculator card: how a
// return is calculated, deductions, who it is for, key dates, mistakes,
// related tools, methodology, FAQ and sources. A server component, so it ships
// as HTML; tax-return-calculator.tsx (client) renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SOURCES, SITE_CONFIG } from "@/lib/constants";
import { HECS_HELP_2025_26, LITO, MEDICARE_LEVY } from "@/lib/constants/australian-tax";
import { RETURN_2026, RETURN_2026_SOURCES } from "@/lib/constants/tax-return-2025-26";
import { RETURN_YEARS } from "@/lib/constants/tax-return-estimator";
import {
  FTL_MAX_INDIVIDUAL,
  PENALTY_UNIT,
  RETURN_DATES_2026,
  TAX_CALENDAR_SOURCES,
  formatIso,
} from "@/lib/constants/tax-calendar-2026-27";
import {
  EXAMPLE_INPUTS,
  EXAMPLE_NEXT_YEAR,
  EXAMPLE_THIS_YEAR,
  TAX_RETURN_CALCULATOR_FAQS,
} from "@/modules/calculator/tax-return-calculator-faqs";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const R = RETURN_2026;
const THIS = RETURN_YEARS["2025-26"];
const NEXT = RETURN_YEARS["2026-27"];
const pct = (r: number) => `${Math.round(r * 10_000) / 100}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Tax rates – Australian residents", url: RETURN_2026_SOURCES.rates, publisher: SOURCES.ato.name },
  { title: "Lodge your tax return online with myTax", url: RETURN_2026_SOURCES.myTax, publisher: SOURCES.ato.name },
  { title: "Registered agent lodgment program – individuals and trusts", url: RETURN_2026_SOURCES.agentProgram, publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge income, thresholds and rates", url: RETURN_2026_SOURCES.mls, publisher: SOURCES.ato.name },
  { title: "Study and training loans – what's new", url: RETURN_2026_SOURCES.studyLoans, publisher: SOURCES.ato.name },
  { title: "Working from home – fixed rate method", url: RETURN_2026_SOURCES.wfh, publisher: SOURCES.ato.name },
  { title: "Cents per kilometre method", url: RETURN_2026_SOURCES.carCentsPerKm, publisher: SOURCES.ato.name },
  { title: "Failure to lodge on time penalty", url: TAX_CALENDAR_SOURCES.failureToLodge, publisher: SOURCES.ato.name },
  { title: "Penalty units", url: TAX_CALENDAR_SOURCES.penaltyUnits, publisher: SOURCES.ato.name },
];

/** Example deduction claims. Tax saved is at the 30% bracket plus the 2% Medicare levy. */
const DEDUCTION_EXAMPLES: { name: string; what: string; low: number; high: number }[] = [
  { name: "Work from home", what: `Fixed rate of ${R.wfhFixedRateCents}c per hour worked from home in ${THIS.incomeYear}, covering energy, internet, phone and stationery. You need a record of your actual hours.`, low: 1_000, high: 3_000 },
  { name: "Car and travel", what: `Work trips (not home to work) at ${R.carCentsPerKm}c per km for ${THIS.incomeYear}, up to ${R.carMaxKm.toLocaleString("en-AU")} km, or the logbook method`, low: 500, high: 4_000 },
  { name: "Uniform and clothing", what: "Buying and cleaning occupation-specific clothing and protective gear", low: 150, high: 500 },
  { name: "Self-education", what: "Courses, textbooks and conferences directly related to your current job", low: 200, high: 2_000 },
  { name: "Tools and equipment", what: "Items costing $300 or less claimed in full; dearer items depreciated over their effective life", low: 100, high: 1_000 },
  { name: "Union fees and subscriptions", what: "Union dues, professional association memberships, trade journals", low: 200, high: 800 },
  { name: "Donations", what: "Gifts of $2 or more to deductible gift recipients (DGRs)", low: 50, high: 500 },
];
const SAVE_RATE = THIS.brackets[2].rate + MEDICARE_LEVY.rate;

export default function TaxReturnCalculatorContent() {
  return (
    <>
      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">How Is Your Tax Return Calculated?</h2>
        <p className="mb-4 text-warmgray">
          Your tax return compares the tax withheld from your pay with the tax you actually owe for the income year. The return you lodge in {THIS.returnName} covers the {THIS.incomeYear} year, {THIS.incomeYearStart} to {THIS.incomeYearEnd}, and is assessed on the {THIS.incomeYear} rates.
        </p>
        <p className="mb-4 text-warmgray">
          During the year, your employer withholds tax from each pay under the <strong>PAYG withholding</strong> system. Withholding is worked out pay by pay and does not know about your deductions, other jobs or investment income. When you lodge, the ATO works out your tax on the whole year&rsquo;s figures.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-eucalyptus">
            <h3 className="font-semibold text-navy mb-2">Over-Withheld = Refund</h3>
            <p className="text-sm text-warmgray">If more tax was withheld than you owe (common when you claim deductions), you get the difference back as a refund.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-ochre">
            <h3 className="font-semibold text-navy mb-2">Under-Withheld = Bill</h3>
            <p className="text-sm text-warmgray">If not enough was withheld (for example, two jobs both claiming the tax-free threshold), you owe the ATO the shortfall.</p>
          </div>
        </div>
        <p className="mb-4 text-warmgray">The calculation follows 4 steps:</p>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Add up assessable income</strong> &mdash; salary, wages, interest, dividends and other income received in {THIS.incomeYear}</li>
          <li><strong>Subtract allowable deductions</strong> &mdash; work-related expenses, self-education, donations and tax agent fees reduce your taxable income</li>
          <li><strong>Apply the tax rates and offsets</strong> &mdash; tax is worked out on taxable income at marginal rates, then the Low Income Tax Offset (up to <strong>{formatAUD(LITO.maxOffset)}</strong>) is taken off and the <strong>{pct(MEDICARE_LEVY.rate)}</strong> Medicare levy is added</li>
          <li><strong>Compare with tax withheld</strong> &mdash; the difference between your total tax and the tax already withheld is your refund or amount owing</li>
        </ol>
        <p className="text-warmgray">
          For deadlines, refund times and what changed this year, see the <Link href="/tax-return-2026/" className="text-eucalyptus-dark hover:underline">2026 tax return guide</Link>. For tax on the pay you are earning now, use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>.
        </p>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">What Deductions Increase Your Tax Refund?</h2>
        <p className="mb-4 text-warmgray">
          Deductions reduce your taxable income, which lowers your tax and increases your refund. In {THIS.incomeYear}, each <strong>$1</strong> of deductions saves between <strong>{Math.round(THIS.brackets[1].rate * 100)}c and {Math.round(THIS.brackets[4].rate * 100)}c</strong> of income tax depending on your marginal rate, plus up to 2c of Medicare levy.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Deduction Category</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">What You Claim</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Example Claim</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved ({pct(SAVE_RATE)})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {DEDUCTION_EXAMPLES.map((d) => (
                <tr key={d.name} className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">{d.name}</td>
                  <td className="px-4 py-3 text-warmgray">{d.what}</td>
                  <td className="px-4 py-3 text-right text-warmgray">{formatAUD(d.low)} &ndash; {formatAUD(d.high)}</td>
                  <td className="px-4 py-3 text-right text-warmgray">{formatAUD(d.low * SAVE_RATE)} &ndash; {formatAUD(d.high * SAVE_RATE)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">
          Tax saved assumes taxable income between $45,001 and $135,000 ({pct(THIS.brackets[2].rate)} rate plus the Medicare levy). You must have spent the money yourself, it must relate directly to earning your income, and you need records. For {NEXT.incomeYear} the car rate rises to {R.carCentsPerKmNextYear}c per km.
        </p>
        <p className="mt-3 text-warmgray">
          Salary sacrifice reduces your taxable income before tax is withheld. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to compare take-home pay with and without it.
        </p>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">What Tax Rates Apply to Your {THIS.incomeYear} Return?</h2>
        <p className="mb-4 text-warmgray">
          The {THIS.incomeYear} return uses a <strong>{pct(THIS.secondBracketRate)}</strong> second bracket. That rate fell to <strong>{pct(NEXT.secondBracketRate)}</strong> from 1 July 2026, so a calculator set to {NEXT.incomeYear} shows up to <strong>{formatAUD((THIS.secondBracketRate - NEXT.secondBracketRate) * (THIS.brackets[1].max - THIS.brackets[0].max))}</strong> less tax than your {THIS.returnName} return really works out.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">{THIS.incomeYear} rate</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">{NEXT.incomeYear} rate</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Tax saved by $1,000 of deductions ({THIS.incomeYear})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {THIS.brackets.map((b, i) => (
                <tr key={b.min} className="hover:bg-sandstone">
                  <td className="px-4 py-3 font-medium text-navy">
                    {b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min)} – ${formatAUD(b.max)}`}
                  </td>
                  <td className="px-4 py-3 text-right text-warmgray">{pct(b.rate)}</td>
                  <td className="px-4 py-3 text-right text-warmgray">{pct(NEXT.brackets[i].rate)}</td>
                  <td className="px-4 py-3 text-right text-warmgray">{formatAUD(1_000 * b.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-warmgray">
          Worked example: {formatAUD(EXAMPLE_INPUTS.grossIncome)} of income, {formatAUD(EXAMPLE_INPUTS.deductions)} of deductions and {formatAUD(EXAMPLE_INPUTS.taxWithheld)} withheld gives an estimated {THIS.incomeYear} refund of <strong>{formatAUD(EXAMPLE_THIS_YEAR.refund)}</strong>. The same inputs at {NEXT.incomeYear} rates show {formatAUD(EXAMPLE_NEXT_YEAR.refund)}. Without private hospital cover, singles earning over {formatAUD(THIS.mlsSinglesThreshold)} also pay the Medicare levy surcharge. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> for your after-tax pay this year.
        </p>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">Who Uses This Tax Return Calculator?</h2>
        <p className="mb-4 text-warmgray">
          Employees, contractors and retirees use it to estimate their refund before lodging through myTax or a tax agent.
        </p>
        <ul className="space-y-3 text-warmgray mb-4">
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">1</span>
            <span><strong>PAYG employees</strong> checking whether the right amount of tax was withheld, especially after a new job, a pay rise or overtime</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">2</span>
            <span><strong>People with two or more jobs</strong> reconciling tax withheld by each employer, since each withholds as if it were your only job</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">3</span>
            <span><strong>Contractors and sole traders</strong> estimating their year-end tax alongside our <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline">Contractor Pay Calculator</Link></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">4</span>
            <span><strong>Study loan holders</strong> checking how much their compulsory repayment takes off the refund &mdash; for {THIS.incomeYear}, repayments start above <strong>{formatAUD(HECS_HELP_2025_26.minimumThreshold)}</strong> and apply only to income above it</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full mt-0.5">5</span>
            <span><strong>Anyone planning ahead</strong> for {NEXT.incomeYear}, comparing deductions, super contributions and salary sacrifice before 30 June 2027</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">What Is the Difference Between a Tax Return and a Tax Refund?</h2>
        <p className="mb-4 text-warmgray">
          A &quot;tax return&quot; is the form you lodge with the ATO reporting your income, deductions and offsets. A &quot;tax refund&quot; is the money the ATO pays back when more tax was withheld than you owe.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Feature</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Tax Return</th>
                <th className="px-4 py-3 text-left font-semibold text-navy">Tax Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 font-medium text-navy">Definition</td>
                <td className="px-4 py-3 text-warmgray">The yearly form lodged with the ATO declaring income and deductions</td>
                <td className="px-4 py-3 text-warmgray">The money returned when tax withheld is more than the tax you owe</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 font-medium text-navy">Who</td>
                <td className="px-4 py-3 text-warmgray">Most people who earned income or had tax withheld during the year</td>
                <td className="px-4 py-3 text-warmgray">Issued by the ATO after it assesses your return</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 font-medium text-navy">Timing ({THIS.incomeYear})</td>
                <td className="px-4 py-3 text-warmgray">Due <strong>{R.selfLodgeDueDate}</strong> (self-lodged) or usually <strong>{R.agentDueDateMostPeople}</strong> (tax agent)</td>
                <td className="px-4 py-3 text-warmgray">Most myTax refunds within <strong>{R.onlineRefundTypical}</strong>; paper within {R.paperRefundBusinessDays} business days</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 font-medium text-navy">Outcome</td>
                <td className="px-4 py-3 text-warmgray">Either a refund or an amount owing</td>
                <td className="px-4 py-3 text-warmgray">Paid into your nominated bank account</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 font-medium text-navy">Guaranteed?</td>
                <td className="px-4 py-3 text-warmgray">Required for most income earners</td>
                <td className="px-4 py-3 text-warmgray">No &mdash; you get a bill if too little was withheld</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-warmgray">
          Lodging a return doesn&rsquo;t always produce a refund. People with more than one job, investment income with no tax withheld, or a study loan are the most likely to get a bill.
        </p>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">Tax Return Deadlines for {THIS.incomeYear}</h2>
        <p className="mb-4 text-warmgray">
          The {THIS.incomeYear} return covers income from <strong>{THIS.incomeYearStart} to {THIS.incomeYearEnd}</strong>. A late return can attract a failure-to-lodge penalty of <strong>{formatAUD(PENALTY_UNIT.amount)}</strong> (one penalty unit from {PENALTY_UNIT.from}) for every {PENALTY_UNIT.ftlDaysPerUnit} days or part of that it is overdue, up to <strong>{formatAUD(FTL_MAX_INDIVIDUAL)}</strong> for an individual.
        </p>
        <ul className="space-y-3 text-warmgray">
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap capitalize">{R.prefillReady}</span>
            <span>The ATO has pre-filled most employer, bank, health fund and government information. Wait until your income statement is &quot;tax ready&quot;.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{formatIso(RETURN_DATES_2026.selfLodge.iso)}</span>
            <span>
              Deadline if you lodge yourself through myTax, and the last day to get on a tax agent&rsquo;s client list.
              {RETURN_DATES_2026.selfLodge.effectiveIso !== RETURN_DATES_2026.selfLodge.iso && <> It falls on a weekend this year, so you can lodge on {formatIso(RETURN_DATES_2026.selfLodge.effectiveIso, "long")}.</>}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{formatIso(RETURN_DATES_2026.agentLargeLiability.iso)}</span>
            <span>Agent clients whose latest return had a tax liability of $20,000 or more</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-sandstone text-navy text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{formatIso(RETURN_DATES_2026.agentMostPeople.iso)}</span>
            <span>Most other clients of a registered tax agent. Your agent confirms the date that applies to you.</span>
          </li>
        </ul>
        <p className="mt-4 text-warmgray">
          Every other date in the year, including BAS and super, is on the <Link href="/tax-calendar/" className="text-eucalyptus-dark hover:underline">tax calendar</Link>.
        </p>
      </section>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">What Are the Most Common Tax Return Mistakes?</h2>
        <p className="mb-4 text-warmgray">
          The ATO matches your return against data from employers, banks, share registries and government agencies. Avoiding these 5 mistakes protects your refund.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
          <li><strong>Leaving out income</strong> &mdash; bank interest, dividends, government payments and second jobs are all reported to the ATO. Missing them triggers an amendment.</li>
          <li><strong>Claiming private expenses</strong> &mdash; travel between home and work, personal phone use and everyday clothing are not deductible.</li>
          <li><strong>Claiming the tax-free threshold twice</strong> &mdash; only one employer should apply the <strong>$18,200</strong> tax-free threshold. Claiming it from two causes under-withholding and a bill.</li>
          <li><strong>Forgetting the Medicare levy surcharge</strong> &mdash; for {THIS.incomeYear}, singles earning above <strong>{formatAUD(THIS.mlsSinglesThreshold)}</strong> without private hospital cover pay 1% to 1.5% extra. Family thresholds are higher.</li>
          <li><strong>Lodging too early</strong> &mdash; lodging before your income statement is &quot;tax ready&quot; risks missing pre-fill data. The ATO has most of it by {R.prefillReady}.</li>
        </ol>
        <p className="text-warmgray">
          Study loan repayments are based on &quot;repayment income&quot;, which can be higher than taxable income. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to check your compulsory repayment.
        </p>
      </section>

      {/* --- CONTEXT BORDER --- */}

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">Related Australian Tax Calculators</h2>
        <p className="mb-4 text-warmgray">
          Estimating your tax return is one part of understanding your pay. These tools cover this year&rsquo;s pay, super, salary sacrifice and study loans.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/tax-return-2026/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">Tax Return 2026 Guide</h3>
            <p className="text-sm text-warmgray">Deadlines, refund times and what changed for the {THIS.incomeYear} return.</p>
          </Link>
          <Link href="/income-tax-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">Income Tax Calculator</h3>
            <p className="text-sm text-warmgray">Tax brackets, LITO and marginal rates on the pay you earn this year.</p>
          </Link>
          <Link href="/take-home-pay-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">Take-Home Pay Calculator</h3>
            <p className="text-sm text-warmgray">Net pay after tax, Medicare levy, super and study loan repayments.</p>
          </Link>
          <Link href="/superannuation-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">Superannuation Calculator</h3>
            <p className="text-sm text-warmgray">Employer super at 12% and your projected balance.</p>
          </Link>
          <Link href="/salary-sacrifice-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">Salary Sacrifice Calculator</h3>
            <p className="text-sm text-warmgray">Compare pre-tax and post-tax salary packaging.</p>
          </Link>
          <Link href="/hecs-help-calculator/" className="block bg-white p-5 rounded-xl border border-sandstone-dark/20 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-navy mb-1">HECS-HELP Calculator</h3>
            <p className="text-sm text-warmgray">Your compulsory study loan repayment at current thresholds.</p>
          </Link>
        </div>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">This estimator uses the following approach:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>{THIS.incomeYear} (default): the {THIS.incomeYear} resident tax rates, LITO, the {THIS.incomeYear} Medicare levy thresholds, Medicare levy surcharge tiers and study loan bands. These are the rates your {THIS.returnName} return is assessed on.</li>
          <li>{NEXT.incomeYear}: the current-year rates used across this site. Medicare levy low-income thresholds for {NEXT.incomeYear} are not yet published, so the {THIS.incomeYear} ones are used.</li>
          <li>Compares the result with your PAYG tax withheld to estimate your refund or amount owing.</li>
          <li>Uses taxable income for the surcharge and study loan tests. Real returns also add items such as reportable fringe benefits and super contributions.</li>
          <li>Does not include other offsets, foreign income, capital gains, rental income, franking credits or the private health insurance rebate adjustment.</li>
          <li>This is an estimate only &mdash; lodge through <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">myTax</a> for your actual result.</li>
        </ul>
      </MethodologyDisclosure>

      <section>
        <h2 style={H} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
        <Accordion type="multiple" className="space-y-3">
          {TAX_RETURN_CALCULATOR_FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}
