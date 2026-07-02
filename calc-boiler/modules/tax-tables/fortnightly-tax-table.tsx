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
  FORTNIGHTLY_TABLE_AMOUNTS,
  PAYG_TABLES_UPDATED,
} from "@/lib/constants/payg-withholding";
import TaxTableLookupWidget from "./lookup-widget";
import WithholdingTable from "./withholding-table";
import TaxTablesSidebar from "./sidebar";

const SOURCES_LIST: SourceLink[] = [
  { title: "Fortnightly tax table (NAT 1006)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-fortnightly", publisher: SOURCES.ato.name },
  { title: "Tax tables overview", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Statement of formulas (NAT 1004)", url: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-statement-of-formulas-for-calculating-amounts-to-be-withheld", publisher: SOURCES.ato.name },
];

const example2000 = calculatePAYGWithholding(2_000, "fortnightly");
const example3000 = calculatePAYGWithholding(3_000, "fortnightly");
const example3000stsl = calculatePAYGWithholding(3_000, "fortnightly", { hasSTSL: true });
const example1600noTft = calculatePAYGWithholding(1_600, "fortnightly", { claimsTaxFreeThreshold: false });

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
            Fortnightly Tax Table 2026-27 — PAYG Withholding Amounts
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-3">
            The fortnightly tax table sets out how much tax your employer withholds from each
            fortnightly pay under the ATO&apos;s PAYG system. For 2026-27, earning {formatAUD(2_000)} a
            fortnight with the tax-free threshold means about {formatAUD(example2000.totalWithheld)} withheld
            and {formatAUD(example2000.netPerPeriod)} take-home.
          </p>
          <p className="text-sm font-semibold text-eucalyptus-dark mb-6">Updated: {PAYG_TABLES_UPDATED} — includes the FY2026-27 rate cut (15% on $18,201&ndash;$45,000)</p>
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
              <h2>Fortnightly Tax Table 2026-27</h2>
              <p>
                The table below shows PAYG withholding for common fortnightly earnings under the 2026-27
                resident rates: claiming the tax-free threshold, claiming it with a study loan, and not
                claiming it (typical for a <Link href="/second-job-tax-calculator/">second job</Link>).
                Australia&apos;s most common pay cycle is fortnightly &mdash; 26 pays a year.
              </p>
              <WithholdingTable
                frequency="fortnightly"
                amounts={FORTNIGHTLY_TABLE_AMOUNTS}
                caption="Fortnightly PAYG withholding amounts for 2026-27 by gross fortnightly earnings"
              />
              <p className="text-sm text-warmgray-light">
                *Derived from the annualised ATO formulas; the printed ATO table may differ by a few dollars
                due to coefficient rounding. <Link href="/fortnightly-pay-calculator/">Calculate your exact fortnightly pay here.</Link>
              </p>
            </section>

            <section id="how-to-read">
              <h2>How to Read the Fortnightly Tax Table</h2>
              <p>
                Find the row matching your gross fortnightly earnings, then use the column that matches
                your TFN declaration. The ATO builds the fortnightly table by doubling weekly earnings,
                so a fortnightly figure always equals two weekly withholdings for half the pay:
              </p>
              <ul>
                <li><strong>Tax-free threshold claimed</strong> &mdash; the standard column for your main job, spreading the $18,200 annual threshold across 26 pays.</li>
                <li><strong>STSL column</strong> &mdash; adds the compulsory HECS-HELP/study loan repayment once your annualised income passes the repayment threshold. At {formatAUD(3_000)} a fortnight that adds about {formatAUD(example3000stsl.stslWithheld)} per pay.</li>
                <li><strong>No tax-free threshold</strong> &mdash; for second jobs; withholding starts from the first dollar. At {formatAUD(1_600)} a fortnight that means about {formatAUD(example1600noTft.totalWithheld)} withheld.</li>
              </ul>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Paid weekly or monthly instead?</h3>
                    <p className="text-navy text-sm mb-3">Each pay cycle has its own ATO table with different withholding amounts.</p>
                    <Link href="/weekly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline mr-4">
                      Weekly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <Link href="/monthly-tax-table/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Monthly tax table <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-much-tax-per-fortnight">
              <h2>How Much Tax Is Withheld From Your Fortnightly Pay?</h2>
              <p>
                Under the 2026-27 fortnightly tax table, withholding at {formatAUD(2_000)} a fortnight is about
                {" "}{formatAUD(example2000.totalWithheld)} ({Math.round((example2000.totalWithheld / 2_000) * 100)}% of gross), and at {formatAUD(3_000)} a fortnight about
                {" "}{formatAUD(example3000.totalWithheld)} ({Math.round((example3000.totalWithheld / 3_000) * 100)}%). The percentage climbs with income because each extra
                dollar above {formatAUD(45_000 / 26)} per fortnight (annualised $45,000) is withheld at the 30% marginal
                rate plus Medicare levy. Check where your income lands in the{" "}
                <Link href="/tax-brackets/">tax brackets guide</Link> or model a salary change with the{" "}
                <Link href="/income-tax-calculator/">income tax calculator</Link>.
              </p>
              <p>
                Note that 2026 is one of the years where some fortnightly-paid employees receive <strong>27 pays</strong>{" "}
                instead of 26, depending on their pay date. The table assumes 26 pays; an extra pay period can
                cause mild under-withholding that shows up as a smaller refund.
              </p>
            </section>

            <section id="what-changed">
              <h2>What Changed in the Fortnightly Tax Table for 2026-27?</h2>
              <p>
                From 1 July 2026 the marginal rate on income between $18,201 and $45,000 dropped from
                {" "}<strong>16% to 15%</strong> under the legislated cost-of-living tax cuts, and the ATO reissued the
                fortnightly table (NAT 1006) to match. Compared with 2025-26, withholding falls by up to about
                {" "}<strong>{formatAUD(268 / 26)} per fortnight</strong> for anyone earning $45,000 a year or more. A further cut
                to 14% arrives on 1 July 2027 &mdash; details in our{" "}
                <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Tax Tables and Calculators</h2>
              <ul>
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables hub</Link> &mdash; the full schedule system explained.</li>
                <li><Link href="/weekly-tax-table/">Weekly tax table</Link> &mdash; withholding for 52-pay cycles.</li>
                <li><Link href="/monthly-tax-table/">Monthly tax table</Link> &mdash; withholding for 12-pay cycles.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table</Link> &mdash; bonuses, commissions, and back payments.</li>
                <li><Link href="/fortnightly-pay-calculator/">Fortnightly pay calculator</Link> &mdash; your full fortnightly take-home breakdown.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> &mdash; how the STSL column affects your repayments.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="fortnightly-vs-weekly" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is fortnightly withholding just double the weekly amount?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Almost. The ATO derives the fortnightly table by doubling weekly earnings and doubling the weekly withholding, so it tracks the weekly table exactly apart from rounding. Splitting the same salary into weekly pays does not change your annual tax.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="27-pays" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens in a 27-fortnight year?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Some years contain 27 fortnightly pay days instead of 26. Because the table assumes 26 pays, the extra pay can leave you slightly under-withheld across the year. The ATO publishes an optional additional withholding amount employees can request from payroll to cover it.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="includes-medicare" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does the fortnightly tax table include the Medicare levy?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes — the standard columns build the 2% Medicare levy into every amount. The Medicare Levy Surcharge for higher earners without private hospital cover is not included; it is assessed on your tax return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is superannuation deducted using this table too?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Employer super (12% superannuation guarantee) is paid on top of your gross wage into your super fund and never appears in the withholding table. Only PAYG tax and any study loan component are withheld from your pay.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ato-official" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Where is the official ATO fortnightly tax table?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The official fortnightly tax table (NAT 1006) is published on ato.gov.au and reissued each 1 July. This page mirrors the 2026-27 amounts in a searchable format; confirm payroll-critical figures against the current ATO publication.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Withholding amounts are derived by annualising fortnightly earnings (× 26) and applying the
                  FY2026-27 resident tax scale (15% rate on $18,201&ndash;$45,000 from 1 July 2026), the Low Income Tax
                  Offset, and the Medicare levy with low-income shading, then dividing back to a fortnightly amount &mdash;
                  the same architecture as the ATO Statement of Formulas (NAT 1004). Printed ATO tables may differ by
                  small rounding amounts. Always verify payroll-critical figures against the current ATO publication.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("fortnightly-tax-table"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <TaxTablesSidebar
            links={[
              { href: "/weekly-tax-table/", label: "Weekly Tax Table" },
              { href: "/monthly-tax-table/", label: "Monthly Tax Table" },
              { href: "/schedule-5-tax-table/", label: "Schedule 5 (Bonuses)" },
              { href: "/fortnightly-pay-calculator/", label: "Fortnightly Pay Calculator" },
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />

        </div>
      </div>
    </div>
  );
}
