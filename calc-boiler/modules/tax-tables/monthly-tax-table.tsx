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
  MONTHLY_TABLE_AMOUNTS,
  PAYG_TABLES_UPDATED,
} from "@/lib/constants/payg-withholding";
import TaxTableLookupWidget from "./lookup-widget";
import WithholdingTable from "./withholding-table";
import TaxTablesSidebar from "./sidebar";

const SOURCES_LIST: SourceLink[] = [
  { title: "Monthly tax table (NAT 1007)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-monthly", publisher: SOURCES.ato.name },
  { title: "Tax tables overview", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Statement of formulas (NAT 1004)", url: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-statement-of-formulas-for-calculating-amounts-to-be-withheld", publisher: SOURCES.ato.name },
];

const example6500 = calculatePAYGWithholding(6_500, "monthly");
const example8000 = calculatePAYGWithholding(8_000, "monthly");
const example8000stsl = calculatePAYGWithholding(8_000, "monthly", { hasSTSL: true });

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
            Monthly Tax Table 2026-27 — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The monthly tax table shows the PAYG amount your employer withholds from each monthly
            salary payment. For 2026-27, a worker on {formatAUD(6_500)} a month who claims the tax-free
            threshold has about {formatAUD(example6500.totalWithheld)} withheld, taking
            home {formatAUD(example6500.netPerPeriod)}.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)</p>
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
              <h2>Monthly Tax Table 2026-27</h2>
              <p>
                The table below lists PAYG withholding for common monthly salaries under the 2026-27
                resident rates &mdash; claiming the tax-free threshold, claiming it with a study loan, and
                not claiming it. Monthly pay cycles (12 pays a year) are most common in salaried
                professional roles.
              </p>
              <WithholdingTable
                frequency="monthly"
                amounts={MONTHLY_TABLE_AMOUNTS}
                caption="Monthly PAYG withholding amounts for 2026-27 by gross monthly earnings"
              />
              <p className="text-sm text-warmgray-light">
                *Derived from the annualised ATO formulas; the printed ATO table may differ by a few dollars
                due to coefficient rounding. <Link href="/monthly-pay-calculator/">Calculate your exact monthly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Monthly Tax Table</h2>
              <p>
                Match your gross monthly salary to the nearest row, then choose the column that matches
                your TFN declaration. The ATO converts monthly earnings to weekly equivalents behind the
                scenes (monthly × 12 &divide; 52), which is why monthly amounts are not exactly weekly
                figures multiplied by four:
              </p>
              <ul>
                <li><strong>Tax-free threshold claimed</strong> &mdash; the standard column for your main job.</li>
                <li><strong>STSL column</strong> &mdash; adds the compulsory study loan repayment; at {formatAUD(8_000)} a month it adds about {formatAUD(example8000stsl.stslWithheld)} per pay.</li>
                <li><strong>No tax-free threshold</strong> &mdash; for a <Link href="/second-job-tax-calculator/">second job</Link>, withholding applies from the first dollar.</li>
              </ul>
              <p>
                Salary sacrifice reduces the gross amount the table is applied to &mdash; if you sacrifice into
                super or a novated lease, your withholding is calculated on the post-sacrifice figure. See the{" "}
                <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> for the combined effect.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid weekly or fortnightly instead?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO table with different withholding amounts.</p>
                    <Link href="/weekly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Weekly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/fortnightly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Fortnightly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-much-tax-per-month">
              <h2>How Much Tax Is Withheld From Your Monthly Salary?</h2>
              <p>
                Under the 2026-27 monthly tax table, withholding at {formatAUD(6_500)} a month (a $78,000
                salary) is about {formatAUD(example6500.totalWithheld)} &mdash; roughly {Math.round((example6500.totalWithheld / 6_500) * 100)}% of gross. At{" "}
                {formatAUD(8_000)} a month ($96,000 a year) it rises to about {formatAUD(example8000.totalWithheld)}{" "}
                ({Math.round((example8000.totalWithheld / 8_000) * 100)}%), because every dollar above the annualised $45,000 threshold is
                withheld at 30% plus the Medicare levy. Model your own salary in the{" "}
                <Link href="/income-tax-calculator/">income tax calculator</Link> or see the full marginal scale in
                the <Link href="/tax-brackets/">tax brackets guide</Link>.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Monthly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026 the marginal rate on income between $18,201 and $45,000 fell from
                {" "}<strong>16% to 15%</strong>, so the reissued monthly table (NAT 1007) withholds up to about{" "}
                <strong>{formatAUD(268 / 12)} less per month</strong> than 2025-26 for anyone earning $45,000 a year or
                more. A further cut to 14% is legislated for 1 July 2027 &mdash; see our{" "}
                <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; the full schedule system explained.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table</Link> &mdash; withholding for 52-pay cycles.</li>
                <li><Link href="/fortnightly-tax-table/">Fortnightly tax table</Link> &mdash; withholding for 26-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/monthly-pay-calculator/">Monthly pay calculator</Link> &mdash; your full monthly take-home breakdown.</li>
                <li><Link href="/understanding-your-payslip/">Understanding your payslip</Link> &mdash; where withholding appears on your payslip.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="four-weeks" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is monthly withholding just the weekly amount times four?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. A month is longer than four weeks, so the ATO converts monthly pay to a weekly equivalent by multiplying by 12 and dividing by 52 (about 4.33 weeks per month). Using weekly × 4 would understate your withholding.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="includes-medicare" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does the monthly tax table include the Medicare levy?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes — the 2% Medicare levy is built into every standard column. The Medicare Levy Surcharge is not included and is assessed on your annual tax return if you earn above the threshold without private hospital cover.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bonus-month" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why was so much tax withheld in the month I got my bonus?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If your employer adds a bonus to a normal monthly pay and withholds using this table, the combined amount is treated as if you earn it every month, which annualises you into a much higher bracket. The correct approach for bonuses is the Schedule 5 method, which spreads the payment across the year and usually withholds less.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ato-official" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Where is the official ATO monthly tax table?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The official monthly tax table (NAT 1007) is on ato.gov.au and is reissued each 1 July. This page mirrors the 2026-27 amounts in a searchable format; confirm payroll-critical figures against the current ATO publication.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Withholding amounts are derived by annualising monthly earnings (× 12) and applying the
                  FY2026-27 resident tax scale (15% rate on $18,201&ndash;$45,000 from 1 July 2026), the Low Income
                  Tax Offset, and the Medicare levy with low-income shading, then dividing back to a monthly amount &mdash;
                  the same architecture as the ATO Statement of Formulas (NAT 1004). Printed ATO tables may differ by
                  small rounding amounts. Always verify payroll-critical figures against the current ATO publication.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("monthly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/weekly-tax-table/", label: "Weekly Tax Table" },
              { href: "/fortnightly-tax-table/", label: "Fortnightly Tax Table" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 (Bonuses)" },
              { href: "/monthly-pay-calculator/", label: "Monthly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
