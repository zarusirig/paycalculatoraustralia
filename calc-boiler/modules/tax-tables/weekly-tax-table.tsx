"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  NO_TFN_RATES,
  PAYG_TABLES_UPDATED,
} from "@/lib/constants/payg-withholding";
import TaxTableLookupWidget from "./lookup-widget";
import WithholdingTable from "./withholding-table";
import ForeignResidentTable from "./foreign-resident-table";
import ExtraPayTable from "./extra-pay-table";
import AtoDownloads from "./ato-downloads";
import TaxTableFaqSection from "./faq-section";
import TaxTablesSidebar from "./sidebar";
import { WEEKLY_TAX_TABLE_FAQS } from "./weekly-tax-table-faqs";
import {
  ATO_SCHEDULE_1,
  ATO_SCHEDULE_8,
  ATO_WEEKLY,
  ATO_WORKED_EXAMPLES,
  WEEKLY_EXTRA_PAY,
  WEEKLY_FOREIGN_BANDS,
  WEEKLY_TABLE_ROWS,
} from "./ato-schedules";

const SOURCES_LIST: SourceLink[] = [
  { title: `${ATO_WEEKLY.title} (${ATO_WEEKLY.nat})`, url: ATO_WEEKLY.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: ATO_SCHEDULE_1.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_8.title} (${ATO_SCHEDULE_8.nat})`, url: ATO_SCHEDULE_8.pageUrl, publisher: SOURCES.ato.name },
];

// Worked examples computed from the shared engine so prose never drifts.
const ex = ATO_WORKED_EXAMPLES.weekly;
const example1000 = calculatePAYGWithholding(1_000, "weekly");
const example1500 = calculatePAYGWithholding(1_500, "weekly");
const example1500stsl = calculatePAYGWithholding(1_500, "weekly", { hasSTSL: true });
const example800noTft = calculatePAYGWithholding(800, "weekly", { claimsTaxFreeThreshold: false });
const example800tft = calculatePAYGWithholding(800, "weekly");
const example1000Foreign = calculatePAYGWithholding(1_000, "weekly", { foreignResident: true });

export default function WeeklyTaxTablePage() {
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
            <li><span className="font-medium text-navy" aria-current="page">Weekly Tax Table</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Weekly Tax Table 2026-27 (ATO NAT 1005) — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The weekly tax table &mdash; published by the ATO as <strong>{ATO_WEEKLY.nat}</strong> &mdash; sets out how much
            tax your employer must withhold from each weekly pay under the PAYG system. For 2026-27, a worker
            earning {formatAUD(1_000)} a week and claiming the tax-free threshold has {formatAUD(example1000.totalWithheld)} withheld,
            taking home {formatAUD(example1000.netPerPeriod)}.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">
            {ATO_WEEKLY.nat} published {ATO_WEEKLY.published} &middot; applies to payments made from {PAYG_TABLES_UPDATED} &middot; includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="lookup">
              <h2>Weekly Tax Table Lookup — Check Your Withholding Instantly</h2>
              <p>
                Enter your gross weekly pay to see the PAYG amount your employer should withhold this
                financial year, including the study loan (STSL) component if you have a HECS-HELP debt.
              </p>
              <TaxTableLookupWidget frequency="weekly" defaultGross={1_500} />
            </section>

            <section id="weekly-tax-table-2026-27">
              <h2>Weekly Tax Table 2026-27 (NAT 1005)</h2>
              <p>
                The table below lists PAYG withholding for common weekly earnings under the 2026-27
                resident rates, in the three most-used {ATO_WEEKLY.nat} columns: claiming the tax-free
                threshold (column 2 of the ATO table), claiming the threshold with a study loan, and not
                claiming the threshold (column 3, typical for a{" "}
                <Link href="/second-job-tax-calculator/">second job</Link>).
              </p>
              <WithholdingTable
                frequency="weekly"
                amounts={WEEKLY_TABLE_ROWS}
                caption="Weekly PAYG withholding amounts for 2026-27 by gross weekly earnings, ATO NAT 1005"
              />
              <p className="text-sm text-warmgray-light">
                Every figure is computed at page load from the ATO Schedule 1 coefficients, so it reproduces
                the printed {ATO_WEEKLY.nat} look-up table exactly.{" "}
                <Link href="/weekly-pay-calculator/">Calculate your exact weekly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Weekly Tax Table</h2>
              <p>
                The ATO&apos;s printed table has three numbered columns. Column 1 is weekly earnings, column 2 is
                the amount to withhold <em>with</em> the tax-free threshold, and column 3 is the amount to
                withhold <em>without</em> it. The ATO&apos;s process for a single pay run is:
              </p>
              <ol>
                <li>Add allowances and any irregular payments to normal weekly earnings, then <strong>ignore the cents</strong>.</li>
                <li>Find that whole-dollar amount in column 1. If the exact figure is not listed, use the next lower one.</li>
                <li>Read across to column 2 or column 3, depending on the payee&apos;s Tax file number declaration.</li>
                <li>Subtract any tax offset the payee has claimed on a <em>Withholding declaration</em>, converted to a weekly value.</li>
                <li>Subtract any Medicare levy adjustment the payee is entitled to.</li>
                <li>Add the study and training support loan component if the payee has one.</li>
              </ol>
              <p>
                The ATO&apos;s own worked example: a payee earns {formatAUD(ex.earnings, 2)} in a week. Ignore the cents and
                look up {formatAUD(ex.lookup)}. Claiming the tax-free threshold, withhold <strong>{formatAUD(ex.withTFT)}</strong>;
                not claiming it, withhold <strong>{formatAUD(ex.noTFT)}</strong>. The calculator above returns exactly those
                two figures, because it runs the same Schedule 1 formulas.
              </p>
              <p>
                &quot;Gross earnings&quot; means your ordinary weekly pay before tax, including taxable allowances,
                casual loading and overtime paid in that run &mdash; but excluding employer superannuation, which is
                paid on top of your wage and never withheld from it. If your payslip shows a different figure from
                this table, our guide to <Link href="/understanding-your-payslip/">understanding your payslip</Link>{" "}
                walks through the usual causes.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid fortnightly or monthly?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO schedule with different withholding amounts.</p>
                    <Link href="/fortnightly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Fortnightly tax table (NAT 1006) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/monthly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Monthly tax table (NAT 1007) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="threshold-columns">
              <h2>&quot;With Tax-Free Threshold&quot; vs &quot;Without&quot; — What the Columns Mean</h2>
              <p>
                The first {formatAUD(18_200)} you earn in a financial year is tax-free, but only one employer can
                apply that threshold to your pay. Claiming it spreads roughly {formatAUD(350)} a week of tax-free
                income across your pays, which is why column 2 is so much lower than column 3.
              </p>
              <ul>
                <li><strong>Column 2 &mdash; tax-free threshold claimed.</strong> Use this for your main job. Withholding does not start until your weekly earnings pass about {formatAUD(362)}, and it builds in the Medicare levy with low-income shading.</li>
                <li><strong>Column 3 &mdash; no tax-free threshold.</strong> Use this for a second or subsequent job, or where the payee has not claimed the threshold. Withholding starts at the very first dollar. At {formatAUD(800)} a week, column 2 withholds {formatAUD(example800tft.totalWithheld)} while column 3 withholds {formatAUD(example800noTft.totalWithheld)} &mdash; a difference of {formatAUD(example800noTft.totalWithheld - example800tft.totalWithheld)} a week.</li>
              </ul>
              <p>
                Claiming the threshold on two jobs at once is the classic way to end up with a tax bill: each employer
                withholds as though the other did not exist, so between them they under-withhold by thousands across the
                year. Our <Link href="/second-job-tax-calculator/">second job tax calculator</Link> shows the size of the gap.
                Note also that when you use column 3, the ATO says to allow <em>no</em> tax offsets and make <em>no</em> Medicare
                levy adjustment.
              </p>
            </section>

            <section id="stsl">
              <h2>What the STSL Column Adds</h2>
              <p>
                STSL means &quot;study and training support loans&quot; and covers HELP, VET Student Loan, Financial
                Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. If you ticked the
                study loan box on your Tax file number declaration, your employer adds a repayment component on top of
                the ordinary withholding.
              </p>
              <p>
                That component is <strong>not</strong> the annual HECS repayment divided by 52. It comes from{" "}
                <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">{ATO_SCHEDULE_8.nat} (Schedule 8)</a>,
                which has its own coefficients applied to the same weekly earnings figure. At {formatAUD(1_500)} a week with
                the threshold claimed, the income tax component is {formatAUD(example1500stsl.paygWithheld)} and the loan
                component is {formatAUD(example1500stsl.stslWithheld)}, for {formatAUD(example1500stsl.totalWithheld)} total and{" "}
                {formatAUD(example1500stsl.netPerPeriod)} in hand. See the{" "}
                <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> for how withholding relates to your actual
                annual repayment obligation.
              </p>
            </section>

            <section id="foreign-residents">
              <h2>Weekly Tax Table for Foreign Residents</h2>
              <p>
                Foreign residents for tax purposes use ATO Scale 3. There is no tax-free threshold and no Medicare
                levy, so withholding begins at 30 cents in the dollar from the first dollar earned. The ATO publishes
                these bands, and the table beneath them shows the resulting weekly amounts:
              </p>
              <ForeignResidentTable
                frequency="weekly"
                amounts={WEEKLY_TABLE_ROWS}
                bands={WEEKLY_FOREIGN_BANDS}
                caption="Weekly PAYG withholding for foreign residents, 2026-27, by gross weekly earnings"
              />
              <p>
                At {formatAUD(1_000)} a week a foreign resident has {formatAUD(example1000Foreign.totalWithheld)} withheld
                against a resident&apos;s {formatAUD(example1000.totalWithheld)}. Foreign residents cannot claim tax offsets to
                reduce withholding &mdash; if one is claimed on a <em>Withholding declaration</em>, the employer ignores it.
                A foreign resident who has not provided a valid TFN is withheld at a flat {NO_TFN_RATES.foreignResident * 100}%
                instead. Workers on a working holiday maker visa are a separate case again and use Schedule 15 (NAT 75531)
                for every payment, including lump sums.
              </p>
            </section>

            <section id="no-tfn">
              <h2>What to Do If the Employee Has No TFN</h2>
              <p>
                A payee who has not quoted a tax file number, has not claimed an exemption from quoting one, and has not
                told you they have applied for one must be withheld at the penalty rates: <strong>{NO_TFN_RATES.resident * 100}%</strong> for
                a resident and <strong>{NO_TFN_RATES.foreignResident * 100}%</strong> for a foreign resident, ignoring cents. There is no
                threshold and no graduated scale &mdash; it is a flat rate on every dollar.
              </p>
              <p>
                If the payee states on their <em>Tax file number declaration</em> that they have applied for a TFN or made an
                enquiry with the ATO, they have <strong>28 days</strong> to supply it before those rates begin. Separately, if you have
                not received a valid declaration within 14 days of the employment starting, you must report that to the ATO
                through STP Phase 2 using a tax treatment code beginning with &quot;N&quot;. While a no-TFN rate applies, allow no tax
                offsets, make no Medicare levy adjustment, and withhold no study loan component.
              </p>
            </section>

            <section id="53-pays">
              <h2>The 53-Pay Year Problem</h2>
              <p>
                {ATO_WEEKLY.nat} is built on <strong>{WEEKLY_EXTRA_PAY.standardPayCount} pays a year</strong>. Depending on which day
                of the week you are paid, a financial year occasionally contains{" "}
                <strong>{WEEKLY_EXTRA_PAY.extraPayCount} weekly pay days</strong>. The table has no way of knowing, so the extra pay is
                withheld exactly like an ordinary week &mdash; and across the year slightly too little tax is collected. The
                shortfall does not disappear; it appears as a smaller refund or an unexpected bill on the tax assessment.
              </p>
              <p>
                Employers should tell payees when a 53-pay year is coming. A payee who would rather not be caught out can ask
                payroll to withhold an additional amount from every pay, using the ATO&apos;s published table:
              </p>
              <ExtraPayTable frequency="weekly" schedule={WEEKLY_EXTRA_PAY} />
              <p>
                This is voluntary and requested by the payee &mdash; the employer cannot impose it. Fortnightly payroll has the same
                issue in a <Link href="/fortnightly-tax-table/">27-pay year</Link>; monthly payroll never does, because twelve calendar
                months always means twelve pays.
              </p>
            </section>

            <section id="when-to-use">
              <h2>When to Use the Weekly Tax Table</h2>
              <p>
                Use {ATO_WEEKLY.nat} for anything you pay an individual on a weekly basis: salary and wages, allowances and
                leave loading, paid parental leave, directors&apos; fees, payments to labour-hire workers and religious
                practitioners, government education or training payments, and periodical compensation or accident payments made
                because someone cannot work.
              </p>
              <p>Use a different schedule when:</p>
              <ul>
                <li><strong>The pay cycle differs</strong> &mdash; use the <Link href="/fortnightly-tax-table/">fortnightly table (NAT 1006)</Link> or the <Link href="/monthly-tax-table/">monthly table (NAT 1007)</Link>.</li>
                <li><strong>You are paying a bonus, commission or back payment</strong> spanning more than one pay period &mdash; use <Link href="/schedule-5-tax-table/">Schedule 5 (NAT 3348)</Link>.</li>
                <li><strong>The worker holds a working holiday maker visa</strong> &mdash; use Schedule 15 (NAT 75531) for every payment.</li>
                <li><strong>You are paying out unused leave or a redundancy on termination</strong> &mdash; use Schedule 7 or Schedule 11, and see our <Link href="/final-pay-calculator/">final pay calculator</Link>.</li>
                <li><strong>The payee is a senior or pensioner claiming SAPTO</strong> &mdash; use Schedule 9 (NAT 4466).</li>
              </ul>
            </section>

            <section id="how-much-tax-per-week">
              <h2>How Much Tax Is Withheld From Your Weekly Pay?</h2>
              <p>
                Weekly PAYG withholding for 2026-27 works out to roughly <strong>{Math.round((example1000.totalWithheld / 1_000) * 100)}%</strong> of
                gross pay at {formatAUD(1_000)} a week, rising to about{" "}
                <strong>{Math.round((example1500.totalWithheld / 1_500) * 100)}%</strong> at {formatAUD(1_500)} a week as more income falls
                into the 30% bracket. Three worked examples using the 2026-27 rates:
              </p>
              <ul>
                <li><strong>{formatAUD(1_000)}/week, tax-free threshold, no loan</strong> &mdash; {formatAUD(example1000.totalWithheld)} withheld, {formatAUD(example1000.netPerPeriod)} take-home.</li>
                <li><strong>{formatAUD(1_500)}/week with a HECS-HELP debt</strong> &mdash; {formatAUD(example1500stsl.paygWithheld)} PAYG plus {formatAUD(example1500stsl.stslWithheld)} STSL, leaving {formatAUD(example1500stsl.netPerPeriod)}.</li>
                <li><strong>{formatAUD(800)}/week second job (no threshold)</strong> &mdash; {formatAUD(example800noTft.totalWithheld)} withheld from the first dollar.</li>
              </ul>
              <p>
                Withholding already includes the 2% Medicare levy and assumes you earn the same amount for all 52 weeks. Compare
                these with the annual view in our <Link href="/income-tax-calculator/">income tax calculator</Link>, or check the
                marginal rates in the <Link href="/tax-brackets/">tax brackets guide</Link>.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Weekly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026 the marginal rate on income between $18,201 and $45,000 fell from{" "}
                <strong>16% to 15%</strong> under the legislated cost-of-living tax cuts. The ATO reissued all 15 withholding
                schedules and 12 tax tables to match, and also lifted the Medicare levy low-income thresholds and re-indexed the
                study and training loan repayment thresholds. The 2026-27 weekly table therefore withholds slightly less than the
                2025-26 version &mdash; up to about <strong>$5 a week</strong> ({formatAUD(268)} a year) for anyone earning $45,000 or more.
                A further cut to 14% is legislated for 1 July 2027. See the full timeline in our{" "}
                <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
              <p>
                If you are still using a 2025-26 printed table or an old payroll setting, your employees are being over-withheld.
                Employers must apply the current-year table from the first pay run on or after 1 July.
              </p>
            </section>

            <section id="ato-downloads">
              <h2>Official ATO Weekly Tax Table PDF and Spreadsheet</h2>
              <p>
                The ATO publishes {ATO_WEEKLY.nat} both as a printable PDF look-up table and as a spreadsheet look-up tool where
                you type in weekly earnings and read off both columns. Most people searching for the PDF only need one or two
                amounts &mdash; the calculator at the top of this page gives the same answer instantly &mdash; but the source documents
                are linked directly below.
              </p>
              <AtoDownloads doc={ATO_WEEKLY} also={[ATO_SCHEDULE_1, ATO_SCHEDULE_8]} />
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; how the whole schedule system works, including no-TFN and working holiday rates.</li>
                <li><Link href="/fortnightly-tax-table/">Fortnightly tax table (NAT 1006)</Link> &mdash; withholding amounts for 26-pay cycles.</li>
                <li><Link href="/monthly-tax-table/">Monthly tax table (NAT 1007)</Link> &mdash; withholding amounts for 12-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table (NAT 3348)</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/weekly-pay-calculator/">Weekly pay calculator</Link> &mdash; your full weekly take-home breakdown from an annual salary.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> &mdash; how the STSL column affects your repayments.</li>
              </ul>
            </section>

            <TaxTableFaqSection
              heading="Weekly Tax Table — Frequently Asked Questions"
              mirrorHeading="Weekly tax table (NAT 1005) questions and answers"
              faqs={WEEKLY_TAX_TABLE_FAQS}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Every withholding amount on this page is computed at render time from the ATO&apos;s published{" "}
                  <a href={ATO_SCHEDULE_1.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 1 ({ATO_SCHEDULE_1.nat})</a>{" "}
                  coefficient method: weekly earnings are truncated to whole dollars and 99 cents added, the scale&apos;s
                  <em> a</em> and <em>b</em> coefficients are applied as y = a&middot;x &minus; b, and the result is rounded to the
                  nearest dollar. Study loan components use the separate{" "}
                  <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 8 ({ATO_SCHEDULE_8.nat})</a> coefficients,
                  not the annual repayment schedule divided back. This reproduces the printed {ATO_WEEKLY.nat} look-up table
                  exactly, including the ATO&apos;s own worked example of {formatAUD(ex.earnings, 2)} &rarr; {formatAUD(ex.withTFT)}{" "}
                  and {formatAUD(ex.noTFT)}, which is asserted in our automated tests. The coefficients were checked digit for
                  digit against the ATO&apos;s {ATO_WEEKLY.nat} spreadsheet look-up tool on {SITE_CONFIG.lastVerified}. Figures assume
                  no tax offset claimed through a <em>Withholding declaration</em> and no Medicare levy adjustment; both reduce
                  withholding and are applied by your employer, not by this page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("weekly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table (NAT 1006)" },
              { href: "/monthly-tax-table/", label: "Monthly Tax Table (NAT 1007)" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 — Bonuses (NAT 3348)" },
              { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
