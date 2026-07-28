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
import { FORTNIGHTLY_TAX_TABLE_FAQS } from "./fortnightly-tax-table-faqs";
import {
  ATO_FORTNIGHTLY,
  ATO_SCHEDULE_1,
  ATO_SCHEDULE_8,
  ATO_WORKED_EXAMPLES,
  FORTNIGHTLY_EXTRA_PAY,
  FORTNIGHTLY_FOREIGN_BANDS,
  FORTNIGHTLY_TABLE_ROWS,
} from "./ato-schedules";

const SOURCES_LIST: SourceLink[] = [
  { title: `${ATO_FORTNIGHTLY.title} (${ATO_FORTNIGHTLY.nat})`, url: ATO_FORTNIGHTLY.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_1.title} (${ATO_SCHEDULE_1.nat})`, url: ATO_SCHEDULE_1.pageUrl, publisher: SOURCES.ato.name },
  { title: `${ATO_SCHEDULE_8.title} (${ATO_SCHEDULE_8.nat})`, url: ATO_SCHEDULE_8.pageUrl, publisher: SOURCES.ato.name },
];

const ex = ATO_WORKED_EXAMPLES.fortnightly;
const example2000 = calculatePAYGWithholding(2_000, "fortnightly");
const example3000 = calculatePAYGWithholding(3_000, "fortnightly");
const example3000stsl = calculatePAYGWithholding(3_000, "fortnightly", { hasSTSL: true });
const example1600noTft = calculatePAYGWithholding(1_600, "fortnightly", { claimsTaxFreeThreshold: false });
const example1600tft = calculatePAYGWithholding(1_600, "fortnightly");
const example2000Foreign = calculatePAYGWithholding(2_000, "fortnightly", { foreignResident: true });

export default function FortnightlyTaxTablePage() {
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
            <li><span className="font-medium text-navy" aria-current="page">Fortnightly Tax Table</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Fortnightly Tax Table 2026-27 (ATO NAT 1006) — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The fortnightly tax table &mdash; published by the ATO as <strong>{ATO_FORTNIGHTLY.nat}</strong> &mdash; sets out how
            much tax your employer withholds from each fortnightly pay under the PAYG system. For 2026-27, earning{" "}
            {formatAUD(2_000)} a fortnight with the tax-free threshold means {formatAUD(example2000.totalWithheld)} withheld
            and {formatAUD(example2000.netPerPeriod)} take-home.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">
            {ATO_FORTNIGHTLY.nat} published {ATO_FORTNIGHTLY.published} &middot; applies to payments made from {PAYG_TABLES_UPDATED} &middot; includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="lookup">
              <h2>Fortnightly Tax Table Lookup — Check Your Withholding Instantly</h2>
              <p>
                Enter your gross fortnightly pay to see the PAYG amount that should be withheld this
                financial year, including the study loan (STSL) component if you have a HECS-HELP debt.
              </p>
              <TaxTableLookupWidget frequency="fortnightly" defaultGross={3_000} />
            </section>

            <section id="fortnightly-tax-table-2026-27">
              <h2>Fortnightly Tax Table 2026-27 (NAT 1006)</h2>
              <p>
                The table below shows PAYG withholding for common fortnightly earnings under the 2026-27
                resident rates, in the three most-used {ATO_FORTNIGHTLY.nat} columns: claiming the tax-free
                threshold (column 2 of the ATO table), claiming it with a study loan, and not claiming it
                (column 3, typical for a <Link href="/second-job-tax-calculator/">second job</Link>).
                Fortnightly is Australia&apos;s most common pay cycle &mdash; 26 pays a year.
              </p>
              <WithholdingTable
                frequency="fortnightly"
                amounts={FORTNIGHTLY_TABLE_ROWS}
                caption="Fortnightly PAYG withholding amounts for 2026-27 by gross fortnightly earnings, ATO NAT 1006"
              />
              <p className="text-sm text-warmgray-light">
                Every figure is computed at page load from the ATO Schedule 1 coefficients, so it reproduces
                the printed {ATO_FORTNIGHTLY.nat} look-up table exactly &mdash; including the property that every
                amount is an even number of dollars.{" "}
                <Link href="/fortnightly-pay-calculator/">Calculate your exact fortnightly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Fortnightly Tax Table</h2>
              <p>
                The ATO&apos;s printed table has three numbered columns: column 1 is fortnightly earnings, column 2 is
                the amount to withhold <em>with</em> the tax-free threshold, and column 3 is the amount <em>without</em> it.
                The employer&apos;s process for one pay run is:
              </p>
              <ol>
                <li>Add allowances and irregular payments to normal fortnightly earnings, then <strong>ignore the cents</strong>.</li>
                <li>Find that whole-dollar figure in column 1; if it is not listed, use the next lower amount.</li>
                <li>Read across to column 2 or column 3, depending on the Tax file number declaration.</li>
                <li>Subtract any tax offset claimed on a <em>Withholding declaration</em>, converted to a fortnightly value.</li>
                <li>Subtract any Medicare levy adjustment the payee is entitled to.</li>
                <li>Add the study and training support loan component if the payee has one.</li>
              </ol>
              <p>
                The ATO&apos;s own worked example: fortnightly earnings of {formatAUD(ex.earnings, 2)} are looked up as{" "}
                {formatAUD(ex.lookup)} after ignoring cents. Claiming the tax-free threshold, withhold{" "}
                <strong>{formatAUD(ex.withTFT)}</strong>; not claiming it, withhold <strong>{formatAUD(ex.noTFT)}</strong>. The
                calculator above returns exactly those two figures, and both are asserted in our automated tests.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid weekly or monthly instead?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO schedule with different withholding amounts.</p>
                    <Link href="/weekly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Weekly tax table (NAT 1005) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/monthly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Monthly tax table (NAT 1007) <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="even-dollars">
              <h2>Why Every Fortnightly Amount Is an Even Number of Dollars</h2>
              <p>
                {ATO_FORTNIGHTLY.nat} is not calculated independently &mdash; it is <em>derived</em> from the weekly schedule.
                The ATO halves the fortnightly earnings to get a weekly equivalent, applies the weekly Schedule 1 formula,
                rounds that weekly result to the nearest dollar, and only then doubles it. Doubling a whole number always
                produces an even number, so a genuine {ATO_FORTNIGHTLY.nat} figure is <strong>never an odd dollar amount</strong>.
              </p>
              <p>
                This is a useful audit check. If a payroll system or online calculator shows an odd fortnightly withholding
                figure, it is not applying the schedule &mdash; it has almost certainly annualised your pay, run the annual tax
                scale, and divided by 26. That shortcut also tends to subtract the full Low Income Tax Offset, which the ATO
                scales deliberately do not deliver through withholding, and it under-withholds badly at the low end. The same
                rule applies to the study loan component, which is likewise derived weekly and doubled.
              </p>
            </section>

            <section id="threshold-columns">
              <h2>&quot;With Tax-Free Threshold&quot; vs &quot;Without&quot; — What the Columns Mean</h2>
              <p>
                The first {formatAUD(18_200)} of annual income is tax-free, but only one employer may apply it. Claiming the
                threshold spreads about {formatAUD(700)} a fortnight of tax-free income across your pays, which is the entire
                reason column 2 sits so far below column 3.
              </p>
              <ul>
                <li><strong>Column 2 &mdash; tax-free threshold claimed.</strong> The normal column for your main job. Nothing is withheld until fortnightly earnings pass roughly {formatAUD(724)}, and the 2% Medicare levy is built in with its low-income shading.</li>
                <li><strong>Column 3 &mdash; no tax-free threshold.</strong> Used for second jobs and anyone who has not claimed the threshold. Withholding starts from the first dollar. At {formatAUD(1_600)} a fortnight, column 2 withholds {formatAUD(example1600tft.totalWithheld)} while column 3 withholds {formatAUD(example1600noTft.totalWithheld)} &mdash; {formatAUD(example1600noTft.totalWithheld - example1600tft.totalWithheld)} more per pay.</li>
              </ul>
              <p>
                Claiming the threshold at two jobs simultaneously is the most common cause of an unexpected tax bill: each
                employer withholds as though the other did not exist. Our{" "}
                <Link href="/second-job-tax-calculator/">second job tax calculator</Link> shows the size of the gap. When column
                3 applies, the ATO says to allow <em>no</em> tax offsets and make <em>no</em> Medicare levy adjustment.
              </p>
            </section>

            <section id="stsl">
              <h2>What the STSL Column Adds</h2>
              <p>
                STSL stands for &quot;study and training support loans&quot; and covers HELP, VET Student Loan, Financial
                Supplement, Student Start-up Loan and Australian Apprenticeship Support Loan debts. Ticking the study loan box
                on your Tax file number declaration adds a repayment component on top of the ordinary withholding.
              </p>
              <p>
                That component comes from{" "}
                <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">{ATO_SCHEDULE_8.nat} (Schedule 8)</a>,
                which has its own coefficient table &mdash; it is not the annual HECS repayment divided by 26. Since FY2025-26,
                student loan repayments have used a marginal system rather than a flat percentage of total income. At{" "}
                {formatAUD(3_000)} a fortnight with the threshold claimed, the income tax is{" "}
                {formatAUD(example3000stsl.paygWithheld)} and the loan component is {formatAUD(example3000stsl.stslWithheld)},
                for {formatAUD(example3000stsl.totalWithheld)} total. See our{" "}
                <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> for how withholding compares with your actual
                annual repayment.
              </p>
            </section>

            <section id="foreign-residents">
              <h2>Fortnightly Tax Table for Foreign Residents</h2>
              <p>
                Foreign residents for tax purposes use ATO Scale 3. There is no tax-free threshold and no Medicare levy, so
                withholding starts at 30 cents in the dollar from the first dollar. The ATO publishes these bands, and the
                table beneath shows the resulting fortnightly amounts:
              </p>
              <ForeignResidentTable
                frequency="fortnightly"
                amounts={FORTNIGHTLY_TABLE_ROWS}
                bands={FORTNIGHTLY_FOREIGN_BANDS}
                caption="Fortnightly PAYG withholding for foreign residents, 2026-27, by gross fortnightly earnings"
              />
              <p>
                At {formatAUD(2_000)} a fortnight a foreign resident has {formatAUD(example2000Foreign.totalWithheld)} withheld
                against a resident&apos;s {formatAUD(example2000.totalWithheld)}. Foreign residents cannot claim tax offsets to
                reduce withholding, so an offset claimed on a <em>Withholding declaration</em> is ignored. A foreign resident who
                has not provided a valid TFN is withheld at a flat {NO_TFN_RATES.foreignResident * 100}% instead. Working holiday
                maker visa holders use Schedule 15 (NAT 75531) for every payment, including lump sums.
              </p>
            </section>

            <section id="no-tfn">
              <h2>What to Do If the Employee Has No TFN</h2>
              <p>
                A payee who has not quoted a tax file number, has not claimed an exemption from quoting one, and has not advised
                that they have applied for one must be withheld at the penalty rates:{" "}
                <strong>{NO_TFN_RATES.resident * 100}%</strong> for a resident and{" "}
                <strong>{NO_TFN_RATES.foreignResident * 100}%</strong> for a foreign resident, ignoring cents. It is a flat rate on
                every dollar &mdash; no threshold, no graduated scale.
              </p>
              <p>
                If the payee states on their <em>Tax file number declaration</em> that they have applied for a TFN or made an enquiry
                with the ATO, they have <strong>28 days</strong> to supply it before those rates begin. Separately, if no valid
                declaration arrives within 14 days of the employment starting, the employer must report that through STP Phase 2
                using a tax treatment code beginning with &quot;N&quot;. While a no-TFN rate applies, allow no tax offsets, make no
                Medicare levy adjustment, and withhold no study loan component.
              </p>
            </section>

            <section id="27-pays">
              <h2>The 27-Pay Year Problem</h2>
              <p>
                {ATO_FORTNIGHTLY.nat} is built on <strong>{FORTNIGHTLY_EXTRA_PAY.standardPayCount} pays a year</strong>. Depending
                on where the pay date falls, a financial year sometimes contains{" "}
                <strong>{FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days</strong>. The table cannot know that, so the extra
                pay is withheld exactly like an ordinary fortnight &mdash; and across the year slightly too little tax is collected.
                The shortfall shows up as a smaller refund, or a bill, on the tax assessment.
              </p>
              <p>
                Employers should tell payees when a 27-pay year is coming. A payee who would rather not be caught out can ask
                payroll to withhold an additional amount from every pay, using the ATO&apos;s published table:
              </p>
              <ExtraPayTable frequency="fortnightly" schedule={FORTNIGHTLY_EXTRA_PAY} />
              <p>
                This is voluntary and must be requested by the payee &mdash; an employer cannot impose it. Weekly payroll faces the
                same issue in a <Link href="/weekly-tax-table/">53-pay year</Link>; monthly payroll never does, because twelve
                calendar months always means exactly twelve pays.
              </p>
            </section>

            <section id="when-to-use">
              <h2>When to Use the Fortnightly Tax Table</h2>
              <p>
                Use {ATO_FORTNIGHTLY.nat} for anything paid to an individual on a fortnightly basis: salary and wages, allowances
                and leave loading, paid parental leave, directors&apos; fees, payments to labour-hire workers and religious
                practitioners, government education or training payments, and periodical compensation or accident payments made
                because someone is unable to work.
              </p>
              <p>Use a different schedule when:</p>
              <ul>
                <li><strong>The pay cycle differs</strong> &mdash; use the <Link href="/weekly-tax-table/">weekly table (NAT 1005)</Link> or the <Link href="/monthly-tax-table/">monthly table (NAT 1007)</Link>.</li>
                <li><strong>You are paying a bonus, commission or back payment</strong> covering more than one pay period &mdash; use <Link href="/schedule-5-tax-table/">Schedule 5 (NAT 3348)</Link>.</li>
                <li><strong>The worker holds a working holiday maker visa</strong> &mdash; use Schedule 15 (NAT 75531) for every payment.</li>
                <li><strong>You are paying unused leave or a redundancy on termination</strong> &mdash; use Schedule 7 or Schedule 11, and see our <Link href="/final-pay-calculator/">final pay calculator</Link>.</li>
                <li><strong>The payee is a senior or pensioner claiming SAPTO</strong> &mdash; use Schedule 9 (NAT 4466).</li>
              </ul>
            </section>

            <section id="how-much-tax-per-fortnight">
              <h2>How Much Tax Is Withheld From Your Fortnightly Pay?</h2>
              <p>
                Under the 2026-27 fortnightly tax table, withholding at {formatAUD(2_000)} a fortnight is{" "}
                {formatAUD(example2000.totalWithheld)} ({Math.round((example2000.totalWithheld / 2_000) * 100)}% of gross), and at{" "}
                {formatAUD(3_000)} a fortnight {formatAUD(example3000.totalWithheld)} (
                {Math.round((example3000.totalWithheld / 3_000) * 100)}%). The percentage climbs with income because each extra
                dollar above roughly {formatAUD(45_000 / 26)} a fortnight (annualised $45,000) is withheld at the 30% marginal rate
                plus the Medicare levy. Check where your income lands in the{" "}
                <Link href="/tax-brackets/">tax brackets guide</Link>, or model a salary change with the{" "}
                <Link href="/income-tax-calculator/">income tax calculator</Link>.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Fortnightly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026 the marginal rate on income between $18,201 and $45,000 dropped from{" "}
                <strong>16% to 15%</strong> under the legislated cost-of-living tax cuts, and the ATO reissued all 15 withholding
                schedules and 12 tax tables &mdash; including {ATO_FORTNIGHTLY.nat} &mdash; to match. The same update raised the
                Medicare levy low-income thresholds and re-indexed the study and training loan repayment thresholds. Compared with
                2025-26, withholding falls by up to about <strong>{formatAUD(268 / 26)} per fortnight</strong> for anyone earning
                $45,000 a year or more. A further cut to 14% arrives on 1 July 2027 &mdash; details in our{" "}
                <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
            </section>

            <section id="ato-downloads">
              <h2>Official ATO Fortnightly Tax Table PDF and Spreadsheet</h2>
              <p>
                The ATO publishes {ATO_FORTNIGHTLY.nat} both as a printable PDF look-up table and as a spreadsheet look-up tool
                where you enter fortnightly earnings and read off both columns. The calculator at the top of this page gives the
                same answer instantly, but the source documents are linked directly below.
              </p>
              <AtoDownloads doc={ATO_FORTNIGHTLY} also={[ATO_SCHEDULE_1, ATO_SCHEDULE_8]} />
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; the full schedule system explained.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table (NAT 1005)</Link> &mdash; withholding for 52-pay cycles.</li>
                <li><Link href="/monthly-tax-table/">Monthly tax table (NAT 1007)</Link> &mdash; withholding for 12-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table (NAT 3348)</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/fortnightly-pay-calculator/">Fortnightly pay calculator</Link> &mdash; your full fortnightly take-home breakdown.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> &mdash; how the STSL column affects your repayments.</li>
              </ul>
            </section>

            <TaxTableFaqSection
              heading="Fortnightly Tax Table — Frequently Asked Questions"
              mirrorHeading="Fortnightly tax table (NAT 1006) questions and answers"
              faqs={FORTNIGHTLY_TAX_TABLE_FAQS}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Every withholding amount on this page is computed at render time from the ATO&apos;s published{" "}
                  <a href={ATO_SCHEDULE_1.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 1 ({ATO_SCHEDULE_1.nat})</a>{" "}
                  coefficient method: fortnightly earnings are halved and truncated to a weekly equivalent, the scale&apos;s
                  <em> a</em> and <em>b</em> coefficients are applied as y = a&middot;x &minus; b, the weekly result is rounded to the
                  nearest dollar, and that figure is doubled &mdash; which is why every amount here is even. Study loan components
                  use the separate{" "}
                  <a href={ATO_SCHEDULE_8.pageUrl} target="_blank" rel="noopener noreferrer">Schedule 8 ({ATO_SCHEDULE_8.nat})</a> coefficients,
                  not the annual repayment schedule divided back. This reproduces the printed {ATO_FORTNIGHTLY.nat} look-up table
                  exactly, including the ATO&apos;s own worked example of {formatAUD(ex.earnings, 2)} &rarr; {formatAUD(ex.withTFT)}{" "}
                  and {formatAUD(ex.noTFT)}, which is asserted in our automated tests. The coefficients were checked digit for digit
                  against the ATO&apos;s {ATO_FORTNIGHTLY.nat} spreadsheet look-up tool on {SITE_CONFIG.lastVerified}. Figures assume
                  no tax offset claimed through a <em>Withholding declaration</em> and no Medicare levy adjustment; both reduce
                  withholding and are applied by your employer, not by this page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("fortnightly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/weekly-tax-table/", label: "Weekly Tax Table (NAT 1005)" },
              { href: "/monthly-tax-table/", label: "Monthly Tax Table (NAT 1007)" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 — Bonuses (NAT 3348)" },
              { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
