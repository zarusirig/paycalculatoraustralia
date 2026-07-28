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
import AtoDownloads from "./ato-downloads";
import TaxTableFaqSection from "./faq-section";
import TaxTablesSidebar from "./sidebar";
import { MONTHLY_TAX_TABLE_FAQS } from "./monthly-tax-table-faqs";
import {
  ATO_MONTHLY,
  ATO_SCHEDULE_1,
  ATO_SCHEDULE_8,
  ATO_WORKED_EXAMPLES,
  MONTHLY_FOREIGN_BANDS,
  MONTHLY_TABLE_ROWS,
} from "./ato-schedules";

const SOURCES_LIST: SourceLink[] = [
  { title: `${ATO_MONTHLY.title} (${ATO_MONTHLY.nat})`, url: ATO_MONTHLY.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: ATO_SCHEDULE_1.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_8.title} (${ATO_SCHEDULE_8.nat})`, url: ATO_SCHEDULE_8.pageUrl, publisher: SOURCES.ato.name },
];

const ex = ATO_WORKED_EXAMPLES.monthly;
const example6500 = calculatePAYGWithholding(6_500, "monthly");
const example8000 = calculatePAYGWithholding(8_000, "monthly");
const example8000stsl = calculatePAYGWithholding(8_000, "monthly", { hasSTSL: true });
const example6500noTft = calculatePAYGWithholding(6_500, "monthly", { claimsTaxFreeThreshold: false });
const example6500Foreign = calculatePAYGWithholding(6_500, "monthly", { foreignResident: true });

// The weekly-times-four error, quantified from the engine rather than asserted.
const weeklyEquivalentOfMonth = calculatePAYGWithholding(6_500 / 4, "weekly").totalWithheld * 4;

export default function MonthlyTaxTablePage() {
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
            <li><span className="font-medium text-navy" aria-current="page">Monthly Tax Table</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Monthly Tax Table 2026-27 (ATO NAT 1007) — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The monthly tax table &mdash; published by the ATO as <strong>{ATO_MONTHLY.nat}</strong> &mdash; shows the PAYG amount
            your employer withholds from each monthly salary payment. For 2026-27, a worker on {formatAUD(6_500)} a month who
            claims the tax-free threshold has {formatAUD(example6500.totalWithheld)} withheld, taking
            home {formatAUD(example6500.netPerPeriod)}.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">
            {ATO_MONTHLY.nat} published {ATO_MONTHLY.published} &middot; applies to payments made from {PAYG_TABLES_UPDATED} &middot; includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="lookup">
              <h2>Monthly Tax Table Lookup — Check Your Withholding Instantly</h2>
              <p>
                Enter your gross monthly salary to see the PAYG amount that should be withheld under
                the 2026-27 rates, including the study loan (STSL) component if you have a HECS-HELP debt.
              </p>
              <TaxTableLookupWidget frequency="monthly" defaultGross={6_500} />
            </section>

            <section id="monthly-tax-table-2026-27">
              <h2>Monthly Tax Table 2026-27 (NAT 1007)</h2>
              <p>
                The table below lists PAYG withholding for common monthly salaries under the 2026-27 resident
                rates, in the three most-used {ATO_MONTHLY.nat} columns: claiming the tax-free threshold
                (column 2 of the ATO table), claiming it with a study loan, and not claiming it (column 3).
                Monthly pay cycles &mdash; 12 pays a year &mdash; are most common in salaried professional roles.
              </p>
              <WithholdingTable
                frequency="monthly"
                amounts={MONTHLY_TABLE_ROWS}
                caption="Monthly PAYG withholding amounts for 2026-27 by gross monthly earnings, ATO NAT 1007"
              />
              <p className="text-sm text-warmgray-light">
                Every figure is computed at page load from the ATO Schedule 1 coefficients, so it reproduces
                the printed {ATO_MONTHLY.nat} look-up table exactly.{" "}
                <Link href="/monthly-pay-calculator/">Calculate your exact monthly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Monthly Tax Table</h2>
              <p>
                The ATO&apos;s printed table has three numbered columns: column 1 is monthly earnings, column 2 is the
                amount to withhold <em>with</em> the tax-free threshold, and column 3 is the amount <em>without</em> it.
                The employer&apos;s process for one pay run is:
              </p>
              <ol>
                <li>Add allowances and irregular payments to the normal monthly earnings. Unlike the weekly and fortnightly tables, the ATO tells you to keep the <strong>cents</strong>.</li>
                <li>Find that amount in column 1; if it is not listed, use the next lower figure.</li>
                <li>Read across to column 2 or column 3, depending on the Tax file number declaration.</li>
                <li>Subtract any tax offset claimed on a <em>Withholding declaration</em>, converted to a monthly value.</li>
                <li>Subtract any Medicare levy adjustment the payee is entitled to.</li>
                <li>Add the study and training support loan component if the payee has one.</li>
              </ol>
              <p>
                The ATO&apos;s own worked example: a payee earns {formatAUD(ex.earnings, 2)} in a month. Claiming the tax-free
                threshold, withhold <strong>{formatAUD(ex.withTFT)}</strong>; not claiming it, withhold{" "}
                <strong>{formatAUD(ex.noTFT)}</strong>. The calculator above returns exactly those two figures, and both are
                asserted in our automated tests.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid weekly or fortnightly instead?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO schedule with different withholding amounts.</p>
                    <Link href="/weekly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Weekly tax table (NAT 1005) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/fortnightly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Fortnightly tax table (NAT 1006) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="why-not-times-four">
              <h2>Why Monthly Withholding Is Not the Weekly Amount Times Four</h2>
              <p>
                {ATO_MONTHLY.nat}, like every other tax table, is derived from the weekly schedule &mdash; but the conversion is
                not a factor of four. A year has 52 weeks and 12 months, so the average month is about{" "}
                <strong>4.33 weeks</strong>. The ATO converts monthly earnings to a weekly equivalent by multiplying by 3 and
                dividing by 13, applies the weekly Schedule 1 formula, rounds to the nearest dollar, then converts back by
                multiplying by 13 and dividing by 3.
              </p>
              <p>
                The difference is not trivial. On {formatAUD(6_500)} a month, the correct withholding is{" "}
                {formatAUD(example6500.totalWithheld)}; treating the month as four weeks of {formatAUD(6_500 / 4)} would give
                about {formatAUD(weeklyEquivalentOfMonth)} &mdash; roughly {formatAUD(example6500.totalWithheld - weeklyEquivalentOfMonth)} short
                every month, and around {formatAUD((example6500.totalWithheld - weeklyEquivalentOfMonth) * 12)} across the year.
              </p>
              <p>
                There is one more monthly-only quirk worth knowing: if the monthly earnings figure ends in exactly{" "}
                <strong>33 cents</strong>, the ATO tells you to add one cent before converting. It exists purely to stop a
                rounding artefact in the 3&thinsp;&divide;&thinsp;13 conversion, and payroll software applies it automatically.
              </p>
            </section>

            <section id="threshold-columns">
              <h2>&quot;With Tax-Free Threshold&quot; vs &quot;Without&quot; — What the Columns Mean</h2>
              <p>
                The first {formatAUD(18_200)} of annual income is tax-free, but only one employer may apply it. Claiming the
                threshold spreads roughly {formatAUD(18_200 / 12)} a month of tax-free income across your pays, which is why
                column 2 sits so far below column 3.
              </p>
              <ul>
                <li><strong>Column 2 &mdash; tax-free threshold claimed.</strong> The normal column for your main job, with the 2% Medicare levy and its low-income shading already built in.</li>
                <li><strong>Column 3 &mdash; no tax-free threshold.</strong> Used for a <Link href="/second-job-tax-calculator/">second job</Link> or where the threshold has not been claimed; withholding applies from the first dollar. At {formatAUD(6_500)} a month, column 2 withholds {formatAUD(example6500.totalWithheld)} while column 3 withholds {formatAUD(example6500noTft.totalWithheld)} &mdash; {formatAUD(example6500noTft.totalWithheld - example6500.totalWithheld)} more per pay.</li>
              </ul>
              <p>
                Salary sacrifice changes the input rather than the column: if you sacrifice into super or a novated lease, the
                table is applied to the reduced gross, so withholding falls. See the{" "}
                <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> for the combined effect. When column
                3 applies, the ATO says to allow <em>no</em> tax offsets and make <em>no</em> Medicare levy adjustment.
              </p>
            </section>

            <section id="stsl">
              <h2>What the STSL Column Adds</h2>
              <p>
                STSL means &quot;study and training support loans&quot; and covers HELP, VET Student Loan, Financial Supplement,
                Student Start-up Loan and Australian Apprenticeship Support Loan debts. Ticking the study loan box on your Tax
                file number declaration adds a repayment component on top of the ordinary withholding.
              </p>
              <p>
                That component comes from{" "}
                <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">{ATO_SCHEDULE_8.nat} (Schedule 8)</a>,
                which has its own coefficients applied to the same weekly equivalent &mdash; it is not the annual HECS repayment
                divided by 12. At {formatAUD(8_000)} a month with the threshold claimed, the income tax is{" "}
                {formatAUD(example8000stsl.paygWithheld)} and the loan component is {formatAUD(example8000stsl.stslWithheld)}, for{" "}
                {formatAUD(example8000stsl.totalWithheld)} total. Our{" "}
                <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> shows how withholding compares with your actual
                annual repayment obligation.
              </p>
            </section>

            <section id="foreign-residents">
              <h2>Monthly Tax Table for Foreign Residents</h2>
              <p>
                Foreign residents for tax purposes use ATO Scale 3. There is no tax-free threshold and no Medicare levy, so
                withholding starts at 30 cents in the dollar from the first dollar earned. The ATO publishes these bands, and the
                table beneath shows the resulting monthly amounts:
              </p>
              <ForeignResidentTable
                frequency="monthly"
                amounts={MONTHLY_TABLE_ROWS}
                bands={MONTHLY_FOREIGN_BANDS}
                caption="Monthly PAYG withholding for foreign residents, 2026-27, by gross monthly earnings"
              />
              <p>
                At {formatAUD(6_500)} a month a foreign resident has {formatAUD(example6500Foreign.totalWithheld)} withheld against
                a resident&apos;s {formatAUD(example6500.totalWithheld)}. Foreign residents cannot claim tax offsets to reduce
                withholding, so an offset claimed on a <em>Withholding declaration</em> is ignored. A foreign resident who has not
                provided a valid TFN is withheld at a flat {NO_TFN_RATES.foreignResident * 100}% instead. Working holiday maker visa
                holders use Schedule 15 (NAT 75531) for every payment.
              </p>
            </section>

            <section id="no-tfn">
              <h2>What to Do If the Employee Has No TFN</h2>
              <p>
                A payee who has not quoted a tax file number, has not claimed an exemption from quoting one, and has not advised
                that they have applied for one must be withheld at{" "}
                <strong>{NO_TFN_RATES.resident * 100}%</strong> if they are a resident and{" "}
                <strong>{NO_TFN_RATES.foreignResident * 100}%</strong> if they are a foreign resident, ignoring cents. It is a flat
                rate on every dollar &mdash; no threshold, no graduated scale.
              </p>
              <p>
                If the payee states on their <em>Tax file number declaration</em> that they have applied for a TFN or made an enquiry
                with the ATO, they have <strong>28 days</strong> to supply it before those rates begin. Separately, if no valid
                declaration arrives within 14 days of the employment starting, the employer must report that through STP Phase 2 with
                a tax treatment code beginning with &quot;N&quot;. While a no-TFN rate applies, allow no tax offsets, make no Medicare
                levy adjustment, and withhold no study loan component.
              </p>
            </section>

            <section id="no-13th-pay">
              <h2>Monthly Payroll Never Has an Extra-Pay Year</h2>
              <p>
                Weekly and fortnightly payroll both hit a recurring problem: the weekly table assumes 52 pays but a financial year
                sometimes has <Link href="/weekly-tax-table/">53</Link>, and the fortnightly table assumes 26 but a year sometimes
                has <Link href="/fortnightly-tax-table/">27</Link>. In those years the extra pay is withheld like an ordinary one,
                too little tax is collected across the year, and the payee gets a smaller refund or an unexpected bill. The ATO
                publishes an optional additional withholding table for both cycles so a payee can ask payroll to make up the gap.
              </p>
              <p>
                Monthly payroll is immune. Twelve calendar months always means exactly twelve pay days, so the number of pays never
                diverges from what {ATO_MONTHLY.nat} assumes. If you are choosing a pay cycle, that is a genuine, if small,
                administrative advantage &mdash; there is no year in which you need to warn staff about a withholding shortfall.
              </p>
            </section>

            <section id="when-to-use">
              <h2>When to Use the Monthly Tax Table</h2>
              <p>
                Use {ATO_MONTHLY.nat} for anything paid to an individual on a monthly basis: salary and wages, allowances and leave
                loading, paid parental leave, directors&apos; fees, payments to labour-hire workers and religious practitioners,
                government education or training payments, and periodical compensation or accident payments made because someone is
                unable to work.
              </p>
              <p>Use a different schedule when:</p>
              <ul>
                <li><strong>The pay cycle differs</strong> &mdash; use the <Link href="/weekly-tax-table/">weekly table (NAT 1005)</Link> or the <Link href="/fortnightly-tax-table/">fortnightly table (NAT 1006)</Link>.</li>
                <li><strong>You are paying a bonus, commission or back payment</strong> covering more than one pay period &mdash; use <Link href="/schedule-5-tax-table/">Schedule 5 (NAT 3348)</Link>.</li>
                <li><strong>The worker holds a working holiday maker visa</strong> &mdash; use Schedule 15 (NAT 75531) for every payment.</li>
                <li><strong>You are paying unused leave or a redundancy on termination</strong> &mdash; use Schedule 7 or Schedule 11, and see our <Link href="/final-pay-calculator/">final pay calculator</Link>.</li>
                <li><strong>The payee is a senior or pensioner claiming SAPTO</strong> &mdash; use Schedule 9 (NAT 4466).</li>
              </ul>
            </section>

            <section id="how-much-tax-per-month">
              <h2>How Much Tax Is Withheld From Your Monthly Salary?</h2>
              <p>
                Under the 2026-27 monthly tax table, withholding at {formatAUD(6_500)} a month (a {formatAUD(78_000)} salary) is{" "}
                {formatAUD(example6500.totalWithheld)} &mdash; roughly {Math.round((example6500.totalWithheld / 6_500) * 100)}% of gross.
                At {formatAUD(8_000)} a month ({formatAUD(96_000)} a year) it rises to {formatAUD(example8000.totalWithheld)} (
                {Math.round((example8000.totalWithheld / 8_000) * 100)}%), because every dollar above the annualised $45,000 threshold
                is withheld at 30% plus the Medicare levy. Model your own salary in the{" "}
                <Link href="/income-tax-calculator/">income tax calculator</Link>, or see the full marginal scale in the{" "}
                <Link href="/tax-brackets/">tax brackets guide</Link>.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Monthly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026 the marginal rate on income between $18,201 and $45,000 fell from{" "}
                <strong>16% to 15%</strong> under the legislated cost-of-living tax cuts, so the reissued {ATO_MONTHLY.nat} withholds
                up to about <strong>{formatAUD(268 / 12)} less per month</strong> than 2025-26 for anyone earning $45,000 a year or more.
                The same update lifted the Medicare levy low-income thresholds and re-indexed the study and training loan repayment
                thresholds across all 15 withholding schedules. A further cut to 14% is legislated for 1 July 2027 &mdash; see our{" "}
                <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
            </section>

            <section id="ato-downloads">
              <h2>Official ATO Monthly Tax Table PDF and Spreadsheet</h2>
              <p>
                The ATO publishes {ATO_MONTHLY.nat} both as a printable PDF look-up table and as a spreadsheet look-up tool where you
                enter monthly earnings including cents and read off both columns. The calculator at the top of this page gives the same
                answer instantly, but the source documents are linked directly below.
              </p>
              <AtoDownloads doc={ATO_MONTHLY} also={[ATO_SCHEDULE_1, ATO_SCHEDULE_8]} />
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; the full schedule system explained.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table (NAT 1005)</Link> &mdash; withholding for 52-pay cycles.</li>
                <li><Link href="/fortnightly-tax-table/">Fortnightly tax table (NAT 1006)</Link> &mdash; withholding for 26-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table (NAT 3348)</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/monthly-pay-calculator/">Monthly pay calculator</Link> &mdash; your full monthly take-home breakdown.</li>
                <li><Link href="/understanding-your-payslip/">Understanding your payslip</Link> &mdash; where withholding appears on your payslip.</li>
              </ul>
            </section>

            <TaxTableFaqSection
              heading="Monthly Tax Table — Frequently Asked Questions"
              mirrorHeading="Monthly tax table (NAT 1007) questions and answers"
              faqs={MONTHLY_TAX_TABLE_FAQS}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Every withholding amount on this page is computed at render time from the ATO&apos;s published{" "}
                  <a href={ATO_SCHEDULE_1.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 1 ({ATO_SCHEDULE_1.nat})</a>{" "}
                  coefficient method: monthly earnings are converted to a weekly equivalent (&times;&nbsp;3 &divide;&nbsp;13, with the
                  ATO&apos;s 33-cent adjustment), the scale&apos;s <em>a</em> and <em>b</em> coefficients are applied as
                  y = a&middot;x &minus; b, the weekly result is rounded to the nearest dollar, and it is converted back
                  (&times;&nbsp;13 &divide;&nbsp;3) and rounded again. Study loan components use the separate{" "}
                  <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 8 ({ATO_SCHEDULE_8.nat})</a> coefficients,
                  not the annual repayment schedule divided back. This reproduces the printed {ATO_MONTHLY.nat} look-up table exactly,
                  including the ATO&apos;s own worked example of {formatAUD(ex.earnings, 2)} &rarr; {formatAUD(ex.withTFT)} and{" "}
                  {formatAUD(ex.noTFT)}, which is asserted in our automated tests. The coefficients were checked digit for digit against
                  the ATO&apos;s {ATO_MONTHLY.nat} spreadsheet look-up tool on {SITE_CONFIG.lastVerified}. Figures assume no tax offset
                  claimed through a <em>Withholding declaration</em> and no Medicare levy adjustment; both reduce withholding and are
                  applied by your employer, not by this page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("monthly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/weekly-tax-table/", label: "Weekly Tax Table (NAT 1005)" },
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table (NAT 1006)" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 — Bonuses (NAT 3348)" },
              { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
