"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  calculatePAYGWithholding,
  WEEKLY_TABLE_AMOUNTS,
  PAYG_TABLES_UPDATED,
} from "@/lib/constants/payg-withholding";
import TaxTableLookupWidget from "./lookup-widget";
import WithholdingTable from "./withholding-table";
import TaxTablesSidebar from "./sidebar";

const SOURCES_LIST: SourceLink[] = [
  { title: "Weekly tax table (NAT 1005)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly", publisher: SOURCES.ato.name },
  { title: "Tax tables overview", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Statement of formulas (NAT 1004)", url: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-statement-of-formulas-for-calculating-amounts-to-be-withheld", publisher: SOURCES.ato.name },
];

// Worked examples computed from the shared engine so prose never drifts.
const example1000 = calculatePAYGWithholding(1_000, "weekly");
const example1500 = calculatePAYGWithholding(1_500, "weekly");
const example1500stsl = calculatePAYGWithholding(1_500, "weekly", { hasSTSL: true });
const example800noTft = calculatePAYGWithholding(800, "weekly", { claimsTaxFreeThreshold: false });

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
            Weekly Tax Table 2026-27 — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The weekly tax table shows how much tax your employer must withhold from your weekly
            pay under the ATO&apos;s PAYG system. For 2026-27, a worker earning {formatAUD(1_000)} a week and
            claiming the tax-free threshold has about {formatAUD(example1000.totalWithheld)} withheld, taking
            home {formatAUD(example1000.netPerPeriod)}.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)</p>
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
              <h2>Weekly Tax Table 2026-27</h2>
              <p>
                The table below lists PAYG withholding amounts for common weekly earnings under the
                2026-27 resident rates, in the three most-used columns: claiming the tax-free threshold
                (column 2 of the ATO table), claiming the threshold with a study loan, and not claiming
                the threshold (for a <Link href="/second-job-tax-calculator/">second job</Link>).
              </p>
              <WithholdingTable
                frequency="weekly"
                amounts={WEEKLY_TABLE_AMOUNTS}
                caption="Weekly PAYG withholding amounts for 2026-27 by gross weekly earnings"
              />
              <p className="text-sm text-warmgray-light">
                *Derived from the annualised ATO formulas; the printed ATO table may differ by a few dollars
                due to coefficient rounding. <Link href="/weekly-pay-calculator/">Calculate your exact weekly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Weekly Tax Table</h2>
              <p>
                Employers read the weekly tax table by finding the row matching the employee&apos;s gross
                weekly earnings, then choosing the column that matches the employee&apos;s TFN declaration.
                Three details decide the correct column:
              </p>
              <ul>
                <li><strong>Tax-free threshold claimed</strong> &mdash; the standard column for your main job. The first $18,200 of annual income is tax-free, which reduces weekly withholding by roughly $55&ndash;$70 compared with not claiming it.</li>
                <li><strong>Study or training loan (STSL)</strong> &mdash; if you ticked the HECS-HELP/STSL box, your employer withholds an additional loan repayment component once your weekly pay exceeds the repayment threshold (about {formatAUD(67_000 / 52)} a week in annual terms).</li>
                <li><strong>No tax-free threshold</strong> &mdash; used for second and subsequent jobs. Withholding starts from the first dollar at the 15% rate plus Medicare levy.</li>
              </ul>
              <p>
                The gross earnings figure means your ordinary weekly pay before tax, including taxable
                allowances and casual loading, but excluding employer superannuation. If your payslip
                shows a different withholding figure than the table, check which columns apply on our
                guide to <Link href="/understanding-your-payslip/">understanding your payslip</Link>.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid fortnightly or monthly?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO table with different withholding amounts.</p>
                    <Link href="/fortnightly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Fortnightly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/monthly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Monthly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-much-tax-per-week">
              <h2>How Much Tax Is Withheld From Your Weekly Pay?</h2>
              <p>
                Weekly PAYG withholding for 2026-27 works out to roughly <strong>13&ndash;14%</strong> of gross pay at
                {" "}{formatAUD(1_000)} a week, rising to about <strong>{Math.round((example1500.totalWithheld / 1_500) * 100)}%</strong> at {formatAUD(1_500)} a week as more
                income falls into the 30% bracket. Three worked examples using the 2026-27 rates:
              </p>
              <ul>
                <li><strong>{formatAUD(1_000)}/week, tax-free threshold, no loan</strong> &mdash; about {formatAUD(example1000.totalWithheld)} withheld, {formatAUD(example1000.netPerPeriod)} take-home.</li>
                <li><strong>{formatAUD(1_500)}/week with a HECS-HELP debt</strong> &mdash; about {formatAUD(example1500stsl.paygWithheld)} PAYG plus {formatAUD(example1500stsl.stslWithheld)} STSL, leaving {formatAUD(example1500stsl.netPerPeriod)}.</li>
                <li><strong>{formatAUD(800)}/week second job (no threshold)</strong> &mdash; about {formatAUD(example800noTft.totalWithheld)} withheld from the first dollar.</li>
              </ul>
              <p>
                The withholding already includes the 2% Medicare levy and assumes you earn the same amount
                for all 52 weeks. Compare these amounts with the annual view in our{" "}
                <Link href="/income-tax-calculator/">income tax calculator</Link> or check the marginal rates in the{" "}
                <Link href="/tax-brackets/">tax brackets guide</Link>.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Weekly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026, the marginal rate on income between $18,201 and $45,000 fell from
                {" "}<strong>16% to 15%</strong> under the legislated cost-of-living tax cuts. The ATO reissued every PAYG
                withholding schedule to match, so the 2026-27 weekly tax table withholds slightly less than
                the 2025-26 version &mdash; up to about <strong>$5 a week</strong> ({formatAUD(268)} a year) for anyone earning
                $45,000 or more. A further cut to 14% is legislated for 1 July 2027. See the full timeline in
                our <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
              <p>
                If you are still using a 2025-26 printed table or an old payroll setting, your employees are
                being over-withheld. Employers must apply the current-year table from the first pay run on or
                after 1 July.
              </p>
            </section>

            <section id="weekly-table-pdf">
              <h2>Weekly Tax Table PDF — Do You Still Need One?</h2>
              <p>
                The ATO publishes the official weekly tax table as a downloadable PDF (<strong>NAT 1005</strong>) on
                {" "}<a href="https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly" target="_blank" rel="noopener noreferrer">ato.gov.au</a>, alongside
                a printable lookup version for employers without payroll software. Most people searching for the
                PDF only need one or two amounts &mdash; the interactive lookup above gives the same answer instantly,
                and this page prints cleanly if you need a paper copy for a specific pay range.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; how the whole schedule system works, including no-TFN and working holiday rates.</li>
                <li><Link href="/fortnightly-tax-table/">Fortnightly tax table</Link> &mdash; withholding amounts for 26-pay cycles.</li>
                <li><Link href="/monthly-tax-table/">Monthly tax table</Link> &mdash; withholding amounts for 12-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/weekly-pay-calculator/">Weekly pay calculator</Link> &mdash; your full weekly take-home breakdown from an annual salary.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> &mdash; how the STSL column affects your repayments.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="which-column" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Which column of the weekly tax table applies to me?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Use the &quot;tax-free threshold&quot; column for your main job, the &quot;no tax-free threshold&quot; column for a second job, and the STSL column if you told your employer you have a HECS-HELP or other study loan. Your TFN declaration answers decide the column — not your employer&apos;s preference.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="includes-medicare" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does the weekly tax table include the Medicare levy?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The standard weekly tax table builds the 2% Medicare levy into every withholding amount. It does not include the Medicare Levy Surcharge, which is assessed on your tax return if you earn above the threshold without private hospital cover.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="overtime" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is overtime taxed using the weekly tax table?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes — overtime paid in a normal pay run is simply added to that week&apos;s gross earnings and withheld using the same table row for the higher amount. It can push that week into a higher withholding band, but any over-withholding comes back as a refund at tax time. Lump-sum back payments and bonuses use the separate Schedule 5 method instead.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-different" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why is my payslip withholding slightly different from this table?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Payroll software uses the ATO coefficient formulas, which round differently from simplified tables (including this one — our figures are derived from the annualised formulas and can vary by a few dollars). Salary sacrifice, extra voluntary withholding, or a withholding variation will also change the amount. If the gap is large, check your TFN declaration settings with payroll.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ato-official" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Where is the official ATO weekly tax table?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The official weekly tax table (NAT 1005) is published on ato.gov.au and updated each 1 July. This page mirrors the 2026-27 amounts in an easier-to-search format; for payroll compliance purposes, always confirm against the current ATO publication.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Withholding amounts on this page are derived by annualising weekly earnings and applying the
                  FY2026-27 resident tax scale (15% rate on $18,201&ndash;$45,000 from 1 July 2026), the Low Income Tax
                  Offset, and the Medicare levy with low-income shading, then dividing back to a weekly amount &mdash;
                  the same architecture as the ATO Statement of Formulas (NAT 1004). Printed ATO tables may differ
                  by small rounding amounts. Always verify payroll-critical figures against the current ATO publication.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("weekly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
              { href: "/monthly-tax-table/", label: "Monthly Tax Table" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 (Bonuses)" },
              { href: "/weekly-pay-calculator/", label: "Weekly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
