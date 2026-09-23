// The static long-form content on /commission-tax-calculator/. A server
// component, so it ships as HTML; the client module
// (commission-tax-calculator.tsx) renders it via `children` below the
// calculator card.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  HECS_HELP,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants";
import {
  PAY_PERIODS,
  SCHEDULE_5_WITHHOLDING_LIMIT,
} from "@/lib/constants/payg-withholding";
import {
  COMMISSION_TAX_FAQS,
  EX_ANNUAL_TAX,
  EX_BASE_SALARY,
  EX_COMMISSION,
  EX_WITHHOLDING,
} from "./commission-tax-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 5 – Tax table for back payments, commissions, bonuses and similar payments", url: "https://www.ato.gov.au/tax-rates-and-codes/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

const TABLE_BASES = [60_000, 80_000, 100_000, 130_000];
const TABLE_COMMISSIONS = [2_000, 5_000, 10_000, 20_000];

// Same computation as annualTaxOn in commission-tax-calculator.tsx (duplicated
// so this server file imports nothing from the client module).
function annualTaxOn(base: number, commission: number, includeHECS = false) {
  const without = calculatePayBreakdown({ grossSalary: base, includeHECS });
  const withCommission = calculatePayBreakdown({ grossSalary: base, bonus: commission, includeHECS });
  return withCommission.totalDeductions - without.totalDeductions;
}

const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

export default function CommissionTaxCalculatorContent() {
  const authorship = getGuideAuthorship("commission-tax-calculator");
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>How Is Commission Taxed in Australia?</h2>
        <p className={P}>
          Commission is ordinary income. It goes into the same assessable-income total as your salary, and the ATO taxes that total through the {SITE_CONFIG.financialYear} brackets. There is no commission tax rate, no flat rate and no separate return — a commission is simply more income in the year it is paid.
        </p>
        <p className={P}>
          What makes commission feel heavily taxed is that it sits on top of your salary, so every dollar of it is taxed at your <em>marginal</em> rate rather than your average rate. On a {formatAUD(EX_BASE_SALARY)} salary, a {formatAUD(EX_COMMISSION)} commission adds <strong>{formatAUD(EX_ANNUAL_TAX)}</strong> to the year&apos;s tax — {formatPercent(EX_ANNUAL_TAX / EX_COMMISSION)} of the commission, including the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy — while the same worker&apos;s average rate on their salary is far lower.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>How Much Is Withheld From a Commission Payment?</h2>
        <p className={P}>
          When a commission is paid on top of normal earnings, your employer withholds under <strong>ATO Schedule 5</strong> — the tax table for back payments, commissions, bonuses and similar payments. Method B(ii), which this calculator and our <Link href="/schedule-5-tax-table/" className={LINK}>Schedule 5 tax table</Link> both use, works like this:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li>Divide the commission by the number of pay periods in the year ({PAY_PERIODS.weekly} weekly, {PAY_PERIODS.fortnightly} fortnightly, {PAY_PERIODS.monthly} monthly) and ignore cents.</li>
          <li>Work out withholding on your normal pay, then on your normal pay plus that slice.</li>
          <li>Multiply the difference back out by the number of pay periods.</li>
          <li>Cap the result at {formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)} of the commission (including any study loan component).</li>
        </ol>
        <p className={P}>
          Worked example — {formatAUD(EX_COMMISSION)} commission paid in one fortnight on {formatAUD(EX_BASE_SALARY)}: regular withholding {formatAUD(EX_WITHHOLDING.regularWithholding)} a fortnight; with a {formatAUD(EX_WITHHOLDING.apportionedAmount)} slice added it becomes {formatAUD(EX_WITHHOLDING.combinedWithholding)}; the {formatAUD(EX_WITHHOLDING.perPeriodDifference)} difference × {PAY_PERIODS.fortnightly} = <strong>{formatAUD(EX_WITHHOLDING.withheldFromAdditionalPayment)}</strong> withheld, leaving <strong>{formatAUD(EX_WITHHOLDING.netAdditionalPayment)}</strong> in hand. Against the {formatAUD(EX_ANNUAL_TAX)} the commission really adds to the year, the {formatAUD(Math.abs(EX_WITHHOLDING.withheldFromAdditionalPayment - EX_ANNUAL_TAX))} difference is {EX_WITHHOLDING.withheldFromAdditionalPayment >= EX_ANNUAL_TAX ? "returned in the refund" : "added to the bill"} at tax time.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Commission Paid Every Pay, Quarterly or One-Off</h2>
        <p className={P}>
          The annual tax does not care how the commission arrives — {formatAUD(EX_COMMISSION)} of commission adds the same {formatAUD(EX_ANNUAL_TAX)} whether it lands in one pay or twelve. Withholding does care, because each payment is worked out on its own:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Retainer plus commission, paid every pay.</strong> Small regular commissions are withheld close to their true annual cost; the settlement at tax time is usually minor.</li>
          <li><strong>Quarterly or one-off commission.</strong> A large payment in one period is exactly what Schedule 5 is designed for. Enter the single payment above to see the withholding on that pay.</li>
          <li><strong>Commission-only.</strong> With no base, enter $0 salary. The annual figure is the tax on your commission income alone; withholding on irregular pays can drift further from it, so keep something aside for tax time.</li>
        </ul>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Tax on Commission at Common Amounts ({SITE_CONFIG.financialYear})</h2>
        <p className={P}>Tax the commission adds to the year, with the effective rate on the commission in brackets. Resident rates including Medicare, no study loan.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th scope="col" className={TH}>Base salary</th>
                {TABLE_COMMISSIONS.map((c) => <th key={c} scope="col" className={TH + " text-right"}>{formatAUD(c)} commission</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TABLE_BASES.map((base, i) => (
                <tr key={base} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD + " font-medium"}>{formatAUD(base)}</td>
                  {TABLE_COMMISSIONS.map((c) => {
                    const t = annualTaxOn(base, c);
                    return <td key={c} className={TD + " text-right"}>{formatAUD(t)} <span className="text-warmgray text-xs">({formatPercent(t / c, 0)})</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Is Super Paid on Commission?</h2>
        <p className={P}>
          Yes. Commission for work performed is ordinary time earnings, so it attracts the {formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee on top of the commission — {formatAUD(EX_COMMISSION * SUPER_GUARANTEE.rate)} on a {formatAUD(EX_COMMISSION)} commission — up to the quarterly maximum contribution base. Check your payslip shows super on the commission line, not just on base salary; the <Link href="/superannuation-calculator/" className={LINK}>super guarantee calculator</Link> shows what the year&apos;s total should be. Comparing a sales offer quoted as OTE (on-target earnings)? See <Link href="/ote-salary/" className={LINK}>what OTE salary means</Link>.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Commission as a Contractor</h2>
        <p className={P}>
          Real estate, recruitment and sales agents often earn commission under an ABN rather than as employees. Then nothing is withheld: the commission is business income, GST applies once turnover passes $75,000, and the ATO may ask for PAYG instalments through the year. The tax rate is the same individual rate — the difference is who sets the money aside. The <Link href="/contractor-pay-calculator/" className={LINK}>contractor pay calculator</Link> shows commission income after tax and GST, and <Link href="/contractor-vs-employee-calculator/" className={LINK}>contractor vs employee</Link> compares the two on the same money.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Commission, HECS-HELP and the Medicare Levy Surcharge</h2>
        <p className={P}>
          Commission counts toward repayment income, so a good year can lift a <Link href="/hecs-help-calculator/" className={LINK}>HECS-HELP repayment</Link> into a higher band (the threshold is {formatAUD(HECS_HELP.minimumThreshold)} in {SITE_CONFIG.financialYear}); tick the study-loan box above to include the STSL component in both figures. It also counts toward income for the <Link href="/medicare-levy-surcharge-calculator/" className={LINK}>Medicare levy surcharge</Link> if you have no private hospital cover.
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Common Commission Tax Mistakes</h2>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Reading the withholding as the tax.</strong> The payslip deduction is an estimate from one pay period; the annual figure above is what the commission actually costs.</li>
          <li><strong>Expecting a flat rate.</strong> There is none. Two people paid the same {formatAUD(EX_COMMISSION)} commission pay different tax if their salaries sit in different brackets.</li>
          <li><strong>Spending the gross.</strong> Set aside the annual figure, not the withholding, if your commission is irregular or paid under an ABN.</li>
          <li><strong>Missing super on commission.</strong> It is OTE; SG is payable on it.</li>
          <li><strong>Timing.</strong> Commission is assessable in the year it is <em>paid</em>. A payment on 1 July belongs to the new year.</li>
        </ol>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Related Calculators</h2>
        <ul className="space-y-2 text-warmgray">
          <li><Link href="/bonus-tax-calculator/" className={LINK}>Bonus tax calculator</Link> &mdash; the same maths for a bonus.</li>
          <li><Link href="/schedule-5-tax-table/" className={LINK}>Schedule 5 tax table</Link> &mdash; the ATO withholding table this page uses, with every pay frequency.</li>
          <li><Link href="/backpay-calculator/" className={LINK}>Back pay calculator</Link> &mdash; arrears and Lump Sum B.</li>
          <li><Link href="/pay-rise-calculator/" className={LINK}>Pay rise calculator</Link> &mdash; what a permanent increase is worth after tax.</li>
          <li><Link href="/take-home-pay-calculator/" className={LINK}>Take-home pay calculator</Link> &mdash; the full year with commission included.</li>
        </ul>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">Two calculations, two engines:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Tax added to the year</strong> — full-year liability with and without the commission, using the {SITE_CONFIG.financialYear} resident brackets, LITO and Medicare levy (and the study loan repayment when ticked). The difference is the commission&apos;s real tax cost.</li>
          <li><strong>Withheld from the pay</strong> — ATO Schedule 5, Method B(ii), on the regular pay for the frequency chosen, capped at {formatPercent(SCHEDULE_5_WITHHOLDING_LIMIT, 0)}. Employers using a different Schedule 5 method will withhold a different amount; the annual figure does not change.</li>
          <li>Medicare levy surcharge, salary sacrifice and offsets other than LITO are not included — use the <Link href="/take-home-pay-calculator/" className={LINK}>main pay calculator</Link> for those.</li>
        </ul>
      </MethodologyDisclosure>

      {/* FAQ */}
      <section>
        <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
        {/* Radix unmounts closed accordion content, so answers would never
            reach the rendered HTML. This mirror makes them crawlable; the
            same array feeds the FAQPage JSON-LD in the page file. */}
        <div className="sr-only">
          <h3>Commission tax questions and answers</h3>
          {COMMISSION_TAX_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
        </div>
        <Accordion type="multiple">
          {COMMISSION_TAX_FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent><p>{f.a}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </>
  );
}
