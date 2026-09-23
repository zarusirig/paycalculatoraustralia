import Link from "./home-link";
import { ArrowRight, GraduationCap, Heart, PiggyBank, Receipt } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { HOME_FAQS, RATE_CUT_MAX_SAVING } from "@/modules/home/home-faqs";
import { HEAD_TERM_PRIMARY } from "@/modules/calculator/head-term-primary";
import {
  calculatePayBreakdown,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareSurcharge,
  calculateSuper,
  formatAUD,
  formatPercent,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  SUPER_GUARANTEE,
  LITO,
  HECS_HELP,
  MEDICARE_LEVY,
  EMPLOYMENT,
  SOURCES,
  SITE_CONFIG,
  STATE_PAYROLL_TAX,
} from "@/lib/constants";
import HomeCalculator from "./home-calculator";
import { SourceBadge } from "./source-badge";

const FY = SITE_CONFIG.financialYear;

// ─── Engine-derived reference figures (computed once at module scope; this is
// a static export, so these can never stale-drift the way hardcoded dollar
// figures did) ───
const BD80 = calculatePayBreakdown({ grossSalary: 80_000 });
const BD90 = calculatePayBreakdown({ grossSalary: 90_000 });
const BD90_HECS = calculatePayBreakdown({ grossSalary: 90_000, includeHECS: true });
const BD100 = calculatePayBreakdown({ grossSalary: 100_000 });
const BD100_PKG = calculatePayBreakdown({ grossSalary: 100_000, superIncluded: true });
const LADDER = [40_000, 50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 120_000, 150_000, 200_000].map(
  (gross) => ({ gross, bd: calculatePayBreakdown({ grossSalary: gross }) })
);
/** Tax on the full second bracket at the FY2026-27 rate ($4,020). */
const BRACKET2_TAX = Math.round((TAX_BRACKETS[1].max - TAX_BRACKETS[0].max) * TAX_BRACKETS[1].rate);
/** Tax on the $45,001–$80,000 slice at 30% ($10,500). */
const BRACKET3_TAX_80K = Math.round((80_000 - TAX_BRACKETS[1].max) * TAX_BRACKETS[2].rate);
const LITO_30K_TAX = Math.round(calculateIncomeTax(30_000));
const LITO_30K_NET = Math.round(calculateIncomeTax(30_000) - calculateLITO(30_000));
const MLS_120K = calculateMedicareSurcharge(120_000, false);
const CASUAL_MIN_WAGE = EMPLOYMENT.minimumWageHourly * (1 + EMPLOYMENT.casualLoading);

const pctX = (v: number) => `${Math.round(v * 100)}%`;

/** Exact-match anchors to the primary URL of each sibling head term. */
const HOME_HEAD_TERM_LINKS = [
  HEAD_TERM_PRIMARY.takeHomePayCalculator,
  HEAD_TERM_PRIMARY.incomeTaxCalculator,
  HEAD_TERM_PRIMARY.weeklyTaxCalculator,
  HEAD_TERM_PRIMARY.fortnightlyTaxCalculator,
];

/** Approximate ABS-based average full-time salaries; presentational only —
 * payroll tax rates/thresholds come from STATE_PAYROLL_TAX. */
const STATE_AVG_SALARY: Record<string, string> = {
  NSW: "$102,000",
  VIC: "$97,000",
  QLD: "$95,000",
  WA: "$105,000",
  SA: "$89,000",
  TAS: "$84,000",
  ACT: "$103,000",
  NT: "$91,000",
};

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "HECS-HELP repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "National minimum wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
];

/**
 * Homepage. A server component: the hero, the long-form sections and the FAQ
 * are static HTML, and only the calculator card (<HomeCalculator />) hydrates.
 * The content sections used to fade in with framer-motion whileInView, which
 * shipped them at opacity:0 in the HTML; they now render at their final state.
 */
export default function HomePageTemplate() {
  return (
    <div className="flex-grow">
      {/* ===== HERO + CALCULATOR ===== */}
      <section className="grain-overlay relative overflow-hidden bg-navy pb-16 pt-20 lg:pt-24">
        {/* Background effects */}
        <div className="hero-pattern absolute inset-0" />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-eucalyptus/8 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-ochre/6 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Copy — centered above calculator on all screens */}
          {/* Server-rendered: the hero (H1 + intro = the LCP element) is plain
              HTML at its final state, with no animation wrapper to wait on. */}
          <div className="mb-6 text-center sm:mb-8">
            {/* Head-term intent map (Sep 2026): this URL is the one primary for
                "pay calculator australia" + "salary calculator". Intro kept to
                one sentence so the calculator sits above the fold on mobile —
                paycalculator.com.au / wagecalculator open straight on the form. */}
            <h1
              className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Pay Calculator Australia {FY} — Salary Calculator After Tax
            </h1>
            <p className="mx-auto mb-4 max-w-2xl text-base text-sandstone-dark/60 sm:text-lg">
              Free salary calculator: enter any salary or hourly, weekly, fortnightly or monthly wage and see your take-home pay after ATO tax, Medicare, HECS-HELP and {formatPercent(SUPER_GUARANTEE.rate, 0)} super at FY{FY} rates.
            </p>
            <TrustBar className="mx-auto" variant="dark" />
          </div>

          {/* Calculator — centered, elevated. The card is the only client
              component on the page (./home-calculator.tsx). */}
          <div className="mx-auto max-w-3xl">
            <HomeCalculator />

            {/* Quick CTA links below calculator */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {HOME_HEAD_TERM_LINKS.map(({ href, anchor }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium capitalize text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                >
                  {anchor} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
              <Link
                href="/tax-brackets/"
                className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                Tax Brackets {FY} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/superannuation-calculator/"
                className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-4 py-2.5 text-sm font-medium text-sandstone-dark/60 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
              >
                Super Calculator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT SECTIONS ═══ */}
      <div className="mx-auto max-w-4xl space-y-20 px-4 py-20 sm:px-6 lg:px-8">
        {/* ===== 1. WHAT CHANGED ON 1 JULY 2026 ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Changed in Your Pay on 1 July 2026?
          </h2>
          <p className="mb-5 text-warmgray">
            Four changes hit Australian pay packets at the start of FY{FY}. This pay calculator already applies all of them.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-eucalyptus/20 bg-eucalyptus-light/20 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income tax cut: {formatPercent(TAX_BRACKETS_2025_26[1].rate, 0)} &rarr; {formatPercent(TAX_BRACKETS[1].rate, 0)}</p>
              <p className="text-sm text-warmgray">
                The rate on income between {formatAUD(TAX_BRACKETS[0].max)} and {formatAUD(TAX_BRACKETS[1].max)} dropped one point — worth up to <strong>{formatAUD(RATE_CUT_MAX_SAVING)} a year</strong>, received in full once you earn {formatAUD(TAX_BRACKETS[1].max)} or more.
              </p>
            </div>
            <div className="rounded-xl border border-sky-200/60 bg-sky-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super stays {formatPercent(SUPER_GUARANTEE.rate, 0)} — now paid every payday</p>
              <p className="text-sm text-warmgray">
                The SG rate is unchanged at its legislated ceiling, but Payday Super started on {SUPER_GUARANTEE.paydaySuperStart}: contributions must now reach your fund within 7 business days of each payday instead of quarterly.
              </p>
            </div>
            <div className="rounded-xl border border-violet-200/60 bg-violet-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS-HELP threshold: {formatAUD(HECS_HELP.minimumThreshold)}</p>
              <p className="text-sm text-warmgray">
                Repayments are marginal — {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} of income <em>above</em> {formatAUD(HECS_HELP.minimumThreshold)}, not a percentage of your whole salary. Below the threshold you repay nothing.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-4">
              <p className="mb-1 font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super caps lifted</p>
              <p className="text-sm text-warmgray">
                The concessional contributions cap rose from {formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)} to <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong>, and the non-concessional cap to {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-warmgray-light">
            Full details: <Link href="/tax-changes-2026-27/" className="font-medium text-eucalyptus-dark hover:underline">tax changes for {FY}</Link> and <Link href="/news/july-1-2026-money-changes/" className="font-medium text-eucalyptus-dark hover:underline">everything that changed on 1 July 2026</Link>.
          </p>
        </section>

        {/* ===== 2. HOW IS TAKE-HOME PAY CALCULATED? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Is Take-Home Pay Calculated?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            Take-home pay is your gross salary minus income tax, minus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, minus any HECS-HELP repayment. Income tax is applied in stages — each marginal rate only taxes the slice of income inside its bracket, never your whole salary. Here is the full working for an <strong>$80,000</strong> salary in FY{FY}:
          </p>
          <ol className="mb-3 list-decimal space-y-1 pl-6 text-warmgray">
            <li>First {formatAUD(TAX_BRACKETS[0].max)} — tax-free = <strong>$0</strong></li>
            <li>{formatAUD(TAX_BRACKETS[1].min)} – {formatAUD(TAX_BRACKETS[1].max)} at {formatPercent(TAX_BRACKETS[1].rate, 0)} = <strong>{formatAUD(BRACKET2_TAX)}</strong></li>
            <li>{formatAUD(TAX_BRACKETS[2].min)} – $80,000 at {formatPercent(TAX_BRACKETS[2].rate, 0)} = <strong>{formatAUD(BRACKET3_TAX_80K)}</strong> — income tax totals <strong>{formatAUD(BD80.netIncomeTax)}</strong></li>
            <li>Medicare levy at {formatPercent(MEDICARE_LEVY.rate, 0)} = <strong>{formatAUD(BD80.medicareLevy)}</strong> (LITO is $0 above {formatAUD(LITO.nilOffsetIncome)})</li>
          </ol>
          <p className="mb-3 leading-relaxed text-warmgray">
            Total deductions come to {formatAUD(BD80.totalDeductions)}, leaving take-home pay of <strong>{formatAUD(BD80.takeHomePay)}</strong> a year — {formatAUD(BD80.weekly, 2)} a week or {formatAUD(BD80.monthly, 2)} a month. The effective rate on the whole salary is <strong>{formatPercent(BD80.effectiveTaxRate)}</strong>, far below the {formatPercent(BD80.marginalTaxRate)} marginal rate (including Medicare) on the next dollar earned. See the full working for <Link href="/tax-on/80000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $80,000</Link> or <Link href="/tax-on/100000/" className="font-medium text-eucalyptus-dark hover:underline">tax on $100,000</Link>.
          </p>
          <p className="leading-relaxed text-warmgray">
            For a bracket-by-bracket breakdown of the tax side, use the <Link href="/income-tax-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>; to compare net pay across salaries, use the <Link href="/take-home-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>; and to decode each line of your payslip, read <Link href="/understanding-your-payslip/" className="font-medium text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link>.
          </p>

          <MethodologyDisclosure className="mt-4">
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate income tax using ATO resident tax brackets (progressive marginal rates). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" /></li>
              <li>Apply the Low Income Tax Offset (up to {formatAUD(LITO.maxOffset)}) for qualifying incomes below {formatAUD(LITO.nilOffsetIncome)}.</li>
              <li>Add the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy on taxable income. Apply the <Link href="/medicare-levy-surcharge-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Medicare Levy Surcharge</Link> (1%–1.5%) for high earners without private health insurance.</li>
              <li>Calculate HECS-HELP repayment using the marginal system (threshold: {formatAUD(HECS_HELP.minimumThreshold)}). <SourceBadge label="ATO" href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" /></li>
              <li>Calculate employer superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} (paid on top, not deducted from salary).</li>
              <li>Take-home pay = Gross salary &minus; income tax &minus; Medicare levy &minus; HECS repayment.</li>
            </ol>
          </MethodologyDisclosure>
        </section>

        {/* ===== 3. HOURLY, CASUAL & SHIFT PAY ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Hourly, Casual &amp; Shift Pay
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            This wage calculator converts an hourly rate to an annual salary the same way every major Australian pay tool does: rate &times; weekly hours &times; {EMPLOYMENT.weeksPerYear} weeks. A standard {EMPLOYMENT.standardWeeklyHours}-hour week is <strong>{EMPLOYMENT.hoursPerYear.toLocaleString("en-AU")} hours a year</strong>, so {formatAUD(80_000 / EMPLOYMENT.hoursPerYear, 2)} an hour is roughly an $80,000 salary. Use the <strong>Hourly</strong> tab in the calculator above, or the dedicated <Link href="/hourly-to-annual-salary-calculator/" className="font-medium text-eucalyptus-dark hover:underline">hourly to annual salary calculator</Link> and <Link href="/salary-vs-hourly/" className="font-medium text-eucalyptus-dark hover:underline">salary vs hourly guide</Link>.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>Casual workers</strong> receive casual loading — an extra {pctX(EMPLOYMENT.casualLoading)} on the base hourly rate in place of paid leave and notice entitlements. On the {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} national minimum wage, the casual rate is <strong>{formatAUD(CASUAL_MIN_WAGE, 2)} an hour</strong>. The loading is taxed as ordinary income, so tick the casual toggle above to see the after-tax difference. How casual work compares with permanent: <Link href="/full-time-vs-part-time-vs-casual/" className="font-medium text-eucalyptus-dark hover:underline">full-time vs part-time vs casual</Link>.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>Penalty rates</strong> are award-specific loadings for weekends, public holidays and late nights — commonly {pctX(EMPLOYMENT.penaltyRates.saturdayMin)}–{pctX(EMPLOYMENT.penaltyRates.saturdayMax)} on Saturdays, {pctX(EMPLOYMENT.penaltyRates.sundayMin)}–{pctX(EMPLOYMENT.penaltyRates.sundayMax)} on Sundays and {pctX(EMPLOYMENT.penaltyRates.publicHolidayMin)}–{pctX(EMPLOYMENT.penaltyRates.publicHolidayMax)} on public holidays, though every award sets its own percentages. This calculator deliberately doesn&apos;t guess them: check the <Link href="/overtime-penalty-rates-guide/" className="font-medium text-eucalyptus-dark hover:underline">penalty rates guide</Link> or your award — <Link href="/hospitality-award-rates/" className="font-medium text-eucalyptus-dark hover:underline">hospitality</Link>, <Link href="/retail-award-rates/" className="font-medium text-eucalyptus-dark hover:underline">retail</Link> or <Link href="/schads-award-pay-rates/" className="font-medium text-eucalyptus-dark hover:underline">SCHADS</Link> — for exact rates.
          </p>
          <p className="leading-relaxed text-warmgray">
            Workers under 21 may be on age-based percentages of the adult rate — see <Link href="/junior-pay-rates/" className="font-medium text-eucalyptus-dark hover:underline">junior pay rates</Link>. For overtime at time-and-a-half or double time, use the <Link href="/overtime-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">overtime pay calculator</Link>, and for a week-by-week view of a casual income, the <Link href="/weekly-pay-calculator/" className="font-medium text-eucalyptus-dark hover:underline">weekly pay calculator</Link>.
          </p>
        </section>

        {/* ===== 4. TAKE-HOME PAY ON COMMON SALARIES ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Take-Home Pay on Common Salaries in FY{FY}
          </h2>
          <p className="mb-4 text-warmgray">
            The table below is computed live from the FY{FY} rates — income tax (after LITO), Medicare levy, take-home pay and employer super for 10 common Australian salary levels.
          </p>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-navy">Gross Salary</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Income Tax</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Medicare Levy</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Take-Home Pay</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Effective Rate</th>
                  <th className="px-3 py-3 text-right font-semibold text-navy">Super ({formatPercent(SUPER_GUARANTEE.rate, 0)})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {LADDER.map(({ gross, bd }) => (
                  <tr key={gross} className="transition-colors hover:bg-sandstone/50">
                    <td className="px-3 py-2.5 font-medium text-navy">
                      <Link href={`/tax-on/${gross}/`} className="hover:text-eucalyptus-dark hover:underline">{formatAUD(gross)}</Link>
                    </td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.netIncomeTax)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.medicareLevy)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-eucalyptus-dark">{formatAUD(bd.takeHomePay)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatPercent(bd.effectiveTaxRate)}</td>
                    <td className="px-3 py-2.5 text-right text-warmgray">{formatAUD(bd.superContribution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-warmgray-light">
            Figures assume Australian resident, no HECS-HELP debt, private health insurance held, and LITO applied where eligible. Effective rate includes the Medicare levy. Use the pay calculator above for your exact salary, or jump to <Link href="/take-home-pay-on/60000/" className="font-medium text-eucalyptus-dark hover:underline">take-home pay on $60K</Link>, <Link href="/take-home-pay-on/90000/" className="font-medium text-eucalyptus-dark hover:underline">$90K</Link>, or <Link href="/take-home-pay-on/120000/" className="font-medium text-eucalyptus-dark hover:underline">$120K</Link>.
          </p>
        </section>

        {/* ===== 5. WHAT COMES OUT OF YOUR PAY? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Comes Out of Your Pay?
          </h2>
          <p className="mb-5 text-warmgray">
            Four components decide what lands in your bank account. Three are deducted from your salary; superannuation is paid on top of it. Each card links to its dedicated calculator or guide.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/income-tax-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-ochre" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>1. Income tax</span>
              </div>
              <p className="text-xs text-warmgray">Bracket-based progressive rates from 0% to 45%, applied to your taxable income.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Income Tax Calculator &rarr;</span>
            </Link>
            <Link href="/medicare-levy/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>2. Medicare levy</span>
              </div>
              <p className="text-xs text-warmgray">A {formatPercent(MEDICARE_LEVY.rate, 0)} levy on your taxable income that funds Australia&apos;s public healthcare system.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Medicare Levy Guide &rarr;</span>
            </Link>
            <Link href="/hecs-help-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>3. HECS/HELP</span>
              </div>
              <p className="text-xs text-warmgray">Income-contingent student loan repayments under the marginal system — {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} above {formatAUD(HECS_HELP.minimumThreshold)}.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">HECS-HELP Calculator &rarr;</span>
            </Link>
            <Link href="/superannuation-calculator/" className="group rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-sky-500" />
                <span className="font-semibold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>4. Super ({formatPercent(SUPER_GUARANTEE.rate, 0)} SG)</span>
              </div>
              <p className="text-xs text-warmgray">Employer Superannuation Guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} — paid on top of your salary, not deducted.</p>
              <span className="mt-2 inline-block text-xs font-medium text-eucalyptus-dark group-hover:underline">Superannuation Calculator &rarr;</span>
            </Link>
          </div>

          {/* H3: How Does the Low Income Tax Offset (LITO) Work? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Does the Low Income Tax Offset (LITO) Work?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The &quot;Low Income Tax Offset&quot; is a non-refundable tax offset of up to <strong>{formatAUD(LITO.maxOffset)}</strong> per year. Earners below {formatAUD(LITO.fullOffsetCeiling)} receive the full {formatAUD(LITO.maxOffset)} offset. The offset phases out in 2 stages: a 5-cent reduction for every dollar earned between {formatAUD(LITO.fullOffsetCeiling)} and {formatAUD(LITO.phaseOut1.end)}, followed by a 1.5-cent reduction for every dollar earned between {formatAUD(LITO.phaseOut1.end)} and {formatAUD(LITO.nilOffsetIncome)}. Earners above {formatAUD(LITO.nilOffsetIncome)} receive <strong>no LITO benefit</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            LITO raises the effective tax-free threshold from {formatAUD(TAX_BRACKETS[0].max)} to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>. For example, a worker earning $30,000 receives the full {formatAUD(LITO.maxOffset)} offset, reducing their tax bill from {formatAUD(LITO_30K_TAX)} to <strong>{formatAUD(LITO_30K_NET)}</strong>. Read our <Link href="/low-income-tax-offset/" className="font-medium text-eucalyptus-dark hover:underline">Low Income Tax Offset guide</Link> for full phase-out tables.
          </p>

          {/* H3: What Is the Medicare Levy Surcharge? */}
          <h3
            className="mb-3 mt-8 text-xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Is the Medicare Levy Surcharge?
          </h3>
          <p className="mb-3 leading-relaxed text-warmgray">
            The &quot;Medicare Levy Surcharge&quot; (MLS) is an additional levy of <strong>1% to 1.5%</strong> charged to high-income earners who do not hold private hospital cover. For FY{FY} it applies to singles earning above <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> and families above {formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1)}. Three tiers apply:
          </p>
          <ul className="mb-3 list-disc space-y-1 pl-6 text-warmgray">
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier1.max)}: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier1.rate, 2)}</strong></li>
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier2.min)} – {formatAUD(MEDICARE_LEVY.surcharge.tier2.max)}: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier2.rate, 2)}</strong></li>
            <li>{formatAUD(MEDICARE_LEVY.surcharge.tier3.min)} and above: surcharge of <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier3.rate, 2)}</strong></li>
          </ul>
          <p className="leading-relaxed text-warmgray">
            A worker earning $120,000 without private hospital cover pays an MLS of <strong>{formatAUD(MLS_120K)}</strong> per year — on top of the standard {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, taking the total health-related levy to {formatAUD(MLS_120K + Math.round(120_000 * MEDICARE_LEVY.rate))} instead of {formatAUD(Math.round(120_000 * MEDICARE_LEVY.rate))}. Holding any eligible private hospital cover eliminates the surcharge entirely. See our <Link href="/medicare-levy-surcharge-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Medicare levy surcharge calculator</Link> for the full threshold tables.
          </p>
        </section>

        {/* ===== 6. HOW IS SUPERANNUATION CALCULATED? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Is Superannuation Calculated?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            Your employer pays a &quot;Superannuation Guarantee&quot; (SG) of <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> of your ordinary earnings into your nominated super fund. On a salary of $80,000 that is <strong>{formatAUD(BD80.superContribution)} per year</strong>; on $100,000 it is {formatAUD(BD100.superContribution)}; on $60,000, {formatAUD(calculateSuper(60_000))}. These amounts are paid on top of your gross salary and do not reduce your take-home pay. See the <Link href="/super-guarantee-rate-history/" className="font-medium text-eucalyptus-dark hover:underline">SG rate history</Link> for how the rate climbed to its {formatPercent(SUPER_GUARANTEE.rate, 0)} ceiling.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            Since {SUPER_GUARANTEE.paydaySuperStart}, Payday Super requires employers to pay super <strong>on every payday</strong> rather than quarterly, calculated on qualifying earnings. Late payments trigger the Superannuation Guarantee Charge, which adds daily-compounding interest and an administrative uplift. The &quot;Maximum Super Contribution Base&quot; for FY{FY} is <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> per year — employers are not required to pay SG on earnings above this cap.
          </p>
          <p className="leading-relaxed text-warmgray">
            The concessional contributions cap (employer SG plus salary sacrifice and personal deductible contributions) is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> for FY{FY}. Use the <Link href="/superannuation-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> for your exact employer contributions, the <Link href="/salary-sacrifice-calculator/" className="font-medium text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model pre-tax contributions, or the <Link href="/superannuation-guide/" className="font-medium text-eucalyptus-dark hover:underline">Superannuation Guide</Link> for caps, options and withdrawal rules.
          </p>
        </section>

        {/* ===== 7. HOW DO HECS-HELP REPAYMENTS AFFECT TAKE-HOME PAY? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How Do HECS-HELP Repayments Affect Take-Home Pay?
          </h2>
          <p className="mb-3 leading-relaxed text-warmgray">
            HECS-HELP repayments are calculated under a marginal system for FY{FY}: repayments start when repayment income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, and you only pay on the amount <em>above</em> the threshold — not on your total income.
          </p>
          <div className="mb-4 overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Repayment Income</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Marginal Rate</th>
                  <th className="px-4 py-3 text-left font-semibold text-navy">Calculation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {HECS_HELP.bands.map((band) => (
                  <tr key={band.label} className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 text-warmgray">
                      {band.min === 0 ? `Below ${formatAUD(band.max)}` : band.max === Infinity ? `${formatAUD(band.min)}+` : `${formatAUD(band.min)} – ${formatAUD(band.max)}`}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-navy">{formatPercent(band.marginalRate, 0)}</td>
                    <td className="px-4 py-2.5 text-warmgray-light">{band.min === 0 ? "No repayment required" : band.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $65,000:</strong> Your income is below the {formatAUD(HECS_HELP.minimumThreshold)} threshold, so your HECS repayment is <strong>$0</strong>. Your take-home pay is unaffected by your student debt.
          </p>
          <p className="mb-3 leading-relaxed text-warmgray">
            <strong>At $90,000:</strong> You pay {formatPercent(HECS_HELP.bands[1].marginalRate, 0)} on the {formatAUD(90_000 - HECS_HELP.minimumThreshold)} above {formatAUD(HECS_HELP.minimumThreshold)}, a repayment of <strong>{formatAUD(BD90_HECS.hecsRepayment)}</strong> per year ({formatAUD(BD90_HECS.hecsRepayment / 26, 2)} per fortnight). Your annual take-home pay drops from {formatAUD(BD90.takeHomePay)} to <strong>{formatAUD(BD90_HECS.takeHomePay)}</strong>.
          </p>
          <p className="leading-relaxed text-warmgray">
            The marginal system eliminates the cliff effect of the old model, where crossing a threshold by a single dollar triggered repayments on your entire income. Use our <Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> for your exact repayment, check the <Link href="/hecs-help-calculator/#threshold" className="font-medium text-eucalyptus-dark hover:underline">current repayment thresholds</Link>, or read the <Link href="/hecs-help-calculator/" className="font-medium text-eucalyptus-dark hover:underline">HECS-HELP Guide</Link>.
          </p>
        </section>

        {/* ===== 8. WHICH PAY CALCULATOR SHOULD YOU USE? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Which Pay Calculator Should You Use?
          </h2>
          <p className="mb-4 text-warmgray">
            The calculator above handles the most common scenario — converting a salary or wage to take-home pay. For specialised situations, use one of the dedicated calculators below. Working holiday makers and non-residents are taxed differently: see the <Link href="/working-holiday-tax/" className="font-medium text-eucalyptus-dark hover:underline">working holiday tax guide</Link> and <Link href="/non-resident-tax/" className="font-medium text-eucalyptus-dark hover:underline">non-resident tax guide</Link>.
          </p>

          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Calculators for Employees
          </h3>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <CalcLink href="/income-tax-calculator/" title="Income Tax Calculator" desc="Bracket-by-bracket tax breakdown with LITO" />
            <CalcLink href="/take-home-pay-calculator/" title="Take-Home Pay Calculator" desc="Quick net pay from any gross salary" />
            <CalcLink href="/salary-sacrifice-calculator/" title="Salary Sacrifice Calculator" desc="Compare pay before and after sacrifice into super" />
            <CalcLink href="/pay-rise-calculator/" title="Pay Rise Calculator" desc="See how much extra take-home a raise gives you" />
            <CalcLink href="/hecs-help-calculator/" title="HECS-HELP Calculator" desc="Student loan repayments under the marginal system" />
            <CalcLink href="/hourly-to-annual-salary-calculator/" title="Hourly to Annual Converter" desc="Convert between any pay frequency" />
            <CalcLink href="/gross-pay-calculator/" title="Gross Pay Calculator" desc="Reverse calculate gross from net take-home pay" />
            <CalcLink href="/redundancy-pay-calculator/" title="Redundancy Pay Calculator" desc="NES entitlements and tax on redundancy" />
            <CalcLink href="/bonus-tax-calculator/" title="Bonus Tax Calculator" desc="The extra tax you'll owe on a bonus or commission" />
            <CalcLink href="/leave-calculator/" title="Leave Calculator" desc="Annual leave, leave loading, and long service leave" />
            <CalcLink href="/fortnightly-pay-calculator/" title="Fortnightly Pay Calculator" desc="Fortnightly take-home pay breakdown" />
            <CalcLink href="/weekly-pay-calculator/" title="Weekly Pay Calculator" desc="Weekly wage to take-home pay" />
            <CalcLink href="/monthly-pay-calculator/" title="Monthly Pay Calculator" desc="Monthly salary to take-home pay" />
            <CalcLink href="/second-job-tax-calculator/" title="Second Job Tax Calculator" desc="Withholding when you can't claim the tax-free threshold" />
          </div>

          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Calculators for Employers and Contractors
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CalcLink href="/employer-cost-calculator/" title="Employer Cost Calculator" desc="True cost of an employee beyond salary" />
            <CalcLink href="/contractor-pay-calculator/" title="Contractor Pay Calculator" desc="ABN workers, freelancers and gig economy rates" />
            <CalcLink href="/contractor-vs-employee-calculator/" title="Contractor vs Employee" desc="Side-by-side pay comparison for hiring decisions" />
            <CalcLink href="/superannuation-calculator/" title="Superannuation Calculator" desc={`Employer SG contributions at ${formatPercent(SUPER_GUARANTEE.rate, 0)}`} />
            <CalcLink href="/overtime-pay-calculator/" title="Overtime Pay Calculator" desc="Time-and-a-half, double time, and public holiday rates" />
            <CalcLink href="/tax-return-calculator/" title="Tax Return Calculator" desc="Estimate your annual tax refund or liability" />
            <CalcLink href="/annual-pay-calculator/" title="Annual Pay Calculator" desc="Full-year gross to net breakdown" />
            <CalcLink href="/employment-type-calculator/" title="Employment Type Calculator" desc="Compare full-time, part-time and casual pay" />
          </div>
        </section>

        {/* ===== 9. PAY CALCULATOR BY STATE ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Pay Calculator by State
          </h2>
          <p className="mb-4 text-warmgray">
            Income tax in Australia is <strong>federal</strong> — every state and territory uses the same tax brackets, so a pay calculator for NSW gives the same take-home pay as one for WA. State-level differences affect employers through payroll tax (a tax on total wages paid), which influences hiring costs but does not directly reduce employee take-home pay. Average salaries also vary by state due to industry composition, cost of living, and labour market conditions.
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "/pay-calculator-nsw/", label: "NSW", sub: "New South Wales", color: "from-sky-50 to-sky-100/50" },
              { href: "/pay-calculator-qld/", label: "QLD", sub: "Queensland", color: "from-amber-50 to-amber-100/50" },
              { href: "/pay-calculator-vic/", label: "VIC", sub: "Victoria", color: "from-indigo-50 to-indigo-100/50" },
              { href: "/pay-calculator-wa/", label: "WA", sub: "Western Australia", color: "from-emerald-50 to-emerald-100/50" },
              { href: "/pay-calculator-sa/", label: "SA", sub: "South Australia", color: "from-rose-50 to-rose-100/50" },
              { href: "/pay-calculator-tas/", label: "TAS", sub: "Tasmania", color: "from-teal-50 to-teal-100/50" },
              { href: "/pay-calculator-act/", label: "ACT", sub: "Australian Capital Territory", color: "from-blue-50 to-blue-100/50" },
              { href: "/pay-calculator-nt/", label: "NT", sub: "Northern Territory", color: "from-orange-50 to-orange-100/50" },
            ].map((state) => (
              <Link
                key={state.href}
                href={state.href}
                className={`group flex flex-col items-center rounded-xl border border-sandstone-dark/20 bg-gradient-to-b ${state.color} p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <span className="text-xl font-bold text-navy group-hover:text-eucalyptus-dark" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{state.label}</span>
                <span className="text-xs text-warmgray-light">{state.sub}</span>
              </Link>
            ))}
          </div>

          {/* State comparison table */}
          <h3
            className="mb-3 text-lg font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            State Payroll Tax Comparison
          </h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
            <table className="w-full text-sm">
              <thead className="bg-sandstone">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-navy">State</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Payroll Tax Rate</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Tax-Free Threshold</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy">Avg. Full-Time Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {Object.entries(STATE_PAYROLL_TAX).map(([code, s]) => (
                  <tr key={code} className="hover:bg-sandstone/50">
                    <td className="px-4 py-2.5 font-medium text-navy">{code}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{formatPercent(s.rate, 2)}{s.note ? "*" : ""}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{formatAUD(s.threshold)}</td>
                    <td className="px-4 py-2.5 text-right text-warmgray">{STATE_AVG_SALARY[code]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-warmgray-light">
            *{" "}
            {Object.entries(STATE_PAYROLL_TAX)
              .filter(([, s]) => s.note)
              .map(([code, s]) => `${code}: ${s.note}`)
              .join(". ")}
            .
          </p>
          <p className="mt-3 text-xs text-warmgray-light">
            Payroll tax is paid by employers, not employees. Average salary figures are approximate and based on ABS data. Individual take-home pay uses the same federal income tax brackets in all states. Compare a state-specific pay calculator: <Link href="/pay-calculator-nsw/" className="font-medium text-eucalyptus-dark hover:underline">NSW</Link>, <Link href="/pay-calculator-vic/" className="font-medium text-eucalyptus-dark hover:underline">VIC</Link>, or <Link href="/pay-calculator-qld/" className="font-medium text-eucalyptus-dark hover:underline">QLD</Link>.
          </p>
        </section>

        {/* ===== 10. WHAT ARE THE MOST COMMON PAY CALCULATION MISTAKES? ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            What Are the Most Common Pay Calculation Mistakes?
          </h2>
          <p className="mb-4 text-warmgray">
            These 5 errors are the most frequent mistakes Australian workers make when estimating their take-home pay — each one leads to a materially wrong expectation of net income.
          </p>
          <ol className="list-decimal space-y-4 pl-6 text-warmgray">
            <li>
              <strong>Applying one flat tax rate to your entire salary.</strong> A worker earning $100,000 who assumes a {formatPercent(TAX_BRACKETS[2].rate, 0)} flat rate expects to pay <strong>{formatAUD(100_000 * TAX_BRACKETS[2].rate)}</strong> in tax. The actual income tax (using progressive marginal rates) is <strong>{formatAUD(BD100.netIncomeTax)}</strong> — an overestimate of {formatAUD(100_000 * TAX_BRACKETS[2].rate - BD100.netIncomeTax)}. Tax is calculated in brackets, not as a single percentage.
            </li>
            <li>
              <strong>Confusing gross salary with a package that includes super.</strong> A &quot;$100,000 package including super&quot; means a base salary of <strong>{formatAUD(BD100_PKG.grossSalary)}</strong> ($100,000 &divide; {(1 + SUPER_GUARANTEE.rate).toFixed(2)}). The take-home pay on that base is <strong>{formatAUD(BD100_PKG.takeHomePay)}</strong> — not the {formatAUD(BD100.takeHomePay)} you receive on a $100,000 base salary. The difference is <strong>{formatAUD(BD100.takeHomePay - BD100_PKG.takeHomePay)} per year</strong>.
            </li>
            <li>
              <strong>Forgetting the Medicare levy.</strong> The {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy adds <strong>{formatAUD(80_000 * MEDICARE_LEVY.rate)}</strong> in deductions on an $80,000 salary, <strong>{formatAUD(100_000 * MEDICARE_LEVY.rate)}</strong> on $100,000, and <strong>{formatAUD(150_000 * MEDICARE_LEVY.rate)}</strong> on $150,000. This is a separate charge from income tax and applies to most Australian residents above the low-income threshold.
            </li>
            <li>
              <strong>Not accounting for HECS-HELP repayments.</strong> An employee earning $90,000 with a HECS debt loses an additional <strong>{formatAUD(BD90_HECS.hecsRepayment)}</strong> per year in compulsory repayments. This is deducted from every pay cycle by your employer, reducing your fortnightly take-home by <strong>{formatAUD(BD90_HECS.hecsRepayment / 26, 2)}</strong>.
            </li>
            <li>
              <strong>Treating superannuation as a salary deduction.</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} employer SG contribution is paid on top of your gross salary — it does not reduce your take-home pay. Workers who subtract super from their gross overstate their deductions by <strong>{formatAUD(calculateSuper(80_000))}</strong> at the $80,000 salary level.
            </li>
          </ol>
        </section>

        {/* ===== 11. FREQUENTLY ASKED QUESTIONS ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          {/*
            The Radix accordion unmounts closed content, so answers never reach
            the rendered HTML. This mirror makes them crawlable and AI-Overview
            eligible. Same pattern as the award/guide pages (gap analysis §A4).
          */}
          <div className="sr-only">
            <h3>Australian pay calculator questions and answers</h3>
            {HOME_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
          </div>
          <Accordion type="multiple" className="space-y-3">
            {HOME_FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger className="text-left text-base font-medium text-navy">{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed text-warmgray">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ===== 12. GUIDES AND RESOURCES ===== */}
        <section>
          <h2
            className="mb-4 text-2xl font-bold text-navy"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Guides and Resources
          </h2>
          <p className="mb-4 text-warmgray">
            These guides explain the rules behind the numbers. Each guide covers the legislation, worked examples, and edge cases for a specific area of Australian tax and payroll.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <CalcLink href="/tax-brackets/" title={`Tax Brackets ${FY}`} desc="Complete bracket table with worked examples at every income level" />
            <CalcLink href="/medicare-levy/" title="Medicare Levy Guide" desc="2% levy, low-income exemption, surcharge thresholds, and family rates" />
            <CalcLink href="/superannuation-guide/" title="Superannuation Guide" desc="SG rates, contribution caps, employer obligations, and withdrawal rules" />
            <CalcLink href="/salary-sacrifice-calculator/" title="Salary Sacrifice Guide" desc="How pre-tax super contributions reduce your tax bill" />
            <CalcLink href="/hecs-help-calculator/" title="HECS-HELP Guide" desc="Marginal repayment system, thresholds, and indexation rules" />
            <CalcLink href="/award-rates/" title="Award Rates Guide" desc="Minimum pay rates, penalty rates, and overtime rules by award" />
            <CalcLink href="/understanding-your-payslip/" title="Understanding Your Payslip" desc="Line-by-line explanation of every item on an Australian payslip" />
            <CalcLink href="/tax-calendar/" title="Tax Calendar" desc="Key dates for BAS, PAYG, super payments, and tax return lodgement" />
            <CalcLink href="/tax-refund-guide/" title="Tax Refund Guide" desc="How refunds are calculated, common deductions, and lodgement deadlines" />
            <CalcLink href="/novated-lease-guide/" title="Novated Lease Guide" desc="How novated leasing reduces taxable income through salary packaging" />
          </div>
        </section>

        {/* ===== SOURCES ===== */}
        <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
      </div>
    </div>
  );
}

// ---------- Small components ----------

function CalcLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-eucalyptus/30 hover:shadow-md">
      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-eucalyptus transition-transform group-hover:translate-x-1" />
      <div>
        <div className="font-medium text-navy">{title}</div>
        <div className="text-sm text-warmgray-light">{desc}</div>
      </div>
    </Link>
  );
}
