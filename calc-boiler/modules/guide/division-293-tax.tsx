import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { DIVISION_293_FAQS } from "@/modules/guide/division-293-tax-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { MEDICARE_LEVY, SITE_CONFIG, SOURCES, SUPER_GUARANTEE, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { CONTRIBUTIONS_TAX_RATE, DIVISION_293, annualSuperGuarantee, division293Estimate } from "@/lib/constants/super-contributions";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const THRESHOLD = formatAUD(DIVISION_293.threshold);
const RATE = pct(DIVISION_293.rate);
const FUND_RATE = pct(CONTRIBUTIONS_TAX_RATE);
/** Contributions tax plus Division 293. */
const SUPER_TOTAL_RATE = CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate;
const TOP_RATE = TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
const TOP_WITH_ML = TOP_RATE + MEDICARE_LEVY.rate;

// "Who is affected" example: a salary with some salary sacrifice. SG is worked
// out on the salary before the sacrifice; the sacrifice lowers taxable income.
const EX_SALARY = 230_000;
const EX_SACRIFICE = 2_400;
const EX_SG = annualSuperGuarantee(EX_SALARY);
const EX_CONCESSIONAL = EX_SG + EX_SACRIFICE;
const EX_TAXABLE = EX_SALARY - EX_SACRIFICE;
const EX_COMBINED = EX_TAXABLE + EX_CONCESSIONAL;
const EX_TAXED = Math.min(Math.max(0, EX_COMBINED - DIVISION_293.threshold), EX_CONCESSIONAL);
const EX_TAX = division293Estimate(EX_TAXABLE, EX_CONCESSIONAL);

// Worked examples table: taxable income treated as Division 293 income.
const TABLE_CONTRIBUTIONS = 30_000;
const TABLE_EXAMPLES = [
  { label: "Example A", income: 260_000 },
  { label: "Example B", income: 300_000 },
  { label: "Example C", income: 245_000 },
  { label: "Example D", income: 350_000 },
].map((e) => {
  const combined = e.income + TABLE_CONTRIBUTIONS;
  const excess = Math.max(0, combined - DIVISION_293.threshold);
  const taxed = Math.min(excess, TABLE_CONTRIBUTIONS);
  return { ...e, combined, excess, taxed, tax: division293Estimate(e.income, TABLE_CONTRIBUTIONS) };
});

function ExampleExplained({ label }: { label: string }) {
  const e = TABLE_EXAMPLES.find((x) => x.label === label)!;
  return (
    <p>
      <strong>{e.label} explained:</strong> Taxable income of {formatAUD(e.income)} plus {formatAUD(TABLE_CONTRIBUTIONS)} super = {formatAUD(e.combined)}. The excess over {THRESHOLD} is {formatAUD(e.excess)}. The lesser of {formatAUD(e.excess)} (excess) and {formatAUD(TABLE_CONTRIBUTIONS)} (contributions) is {formatAUD(e.taxed)}. Division 293 tax = {formatAUD(e.taxed)} x {RATE} = <strong>{formatAUD(e.tax)}</strong>.
    </p>
  );
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Division 293 tax", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-293-tax-on-concessional-contributions-by-high-income-earners", publisher: SOURCES.ato.name },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers", publisher: SOURCES.ato.name },
];

export default function Division293TaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Division 293 Tax</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Division 293 Tax: The Extra Super Tax for High Income Earners
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            If your income plus concessional super contributions exceed {THRESHOLD}, Division 293 adds an extra {RATE} tax to some or all of those contributions. The sections below show how the ATO calculates the tax, with worked examples, how to pay the assessment, and how to manage it.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: What Is Div 293 */}
            <section id="what-is-div-293">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Division 293 Tax?</h2>
              <p>
                Division 293 is an additional <strong>{RATE} tax</strong> on concessional (before-tax) superannuation contributions for individuals whose combined income and concessional super contributions exceed <strong>{THRESHOLD}</strong> in a financial year.
              </p>
              <p>
                Concessional super contributions are normally taxed at just <strong>{FUND_RATE}</strong> inside your super fund, compared to your marginal tax rate of up to {pct(TOP_RATE)} on regular income. Division 293 adds another {RATE}, bringing the total tax on super contributions to <strong>{pct(SUPER_TOTAL_RATE)}</strong> for high-income earners. This partially closes the tax advantage that higher earners receive from the concessional super tax rate.
              </p>
              <p>
                The {THRESHOLD} threshold was reduced from $300,000 on 1 July 2017. It is not indexed, meaning bracket creep gradually draws more taxpayers into Division 293 each year.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Who Is Affected?</strong>
                  <br />
                  Division 293 applies when your income and concessional contributions for Division 293 purposes add up to more than {THRESHOLD}. Example: you earn a {formatAUD(EX_SALARY)} salary, salary sacrifice {formatAUD(EX_SACRIFICE)} and have no fringe benefits or investment losses. Your employer pays {pct(SUPER_GUARANTEE.rate)} SG of {formatAUD(EX_SG)} on the full salary, so your concessional contributions are {formatAUD(EX_CONCESSIONAL)}. The sacrifice lowers your taxable income to {formatAUD(EX_TAXABLE)}, so your combined amount is {formatAUD(EX_COMBINED)}. You pay Division 293 tax on the {formatAUD(EX_TAXED)} above the threshold: {RATE} of that is {formatAUD(EX_TAX)}.
                </p>
              </div>
            </section>

            {/* SECTION 2: How Calculated */}
            <section id="how-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Division 293 Tax Calculated?</h2>
              <p>
                The ATO calculates Division 293 tax after you lodge your tax return. The formula uses two amounts:
              </p>
              <ol>
                <li><strong>Income for Division 293 purposes</strong>: your taxable income, reportable fringe benefits and total net investment losses (similar to income for Medicare levy surcharge (MLS) purposes).</li>
                <li><strong>Low-tax contributed amounts</strong>: your concessional (before-tax) super contributions, including employer SG, salary sacrifice, and personal deductible contributions.</li>
              </ol>
              <p>
                The additional {RATE} tax applies to the <strong>lesser of</strong>:
              </p>
              <ul>
                <li>Your total concessional super contributions, or</li>
                <li>The amount by which your income + super exceeds {THRESHOLD}</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Examples</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Scenario</th>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4">Super Contributions</th>
                        <th className="px-6 py-4">Combined</th>
                        <th className="px-6 py-4">Div 293 Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TABLE_EXAMPLES.map((e) => (
                      <tr key={e.label}>
                        <td className="px-6 py-4 font-medium">{e.label}</td>
                        <td className="px-6 py-4">{formatAUD(e.income)}</td>
                        <td className="px-6 py-4">{formatAUD(TABLE_CONTRIBUTIONS)}</td>
                        <td className="px-6 py-4">{formatAUD(e.combined)}</td>
                        <td className="px-6 py-4 font-semibold">{formatAUD(e.tax)}</td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <ExampleExplained label="Example A" />
              <ExampleExplained label="Example C" />
            </section>

            {/* SECTION 3: How to Pay */}
            <section id="how-to-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Pay Division 293 Tax</h2>
              <p>
                After you lodge your tax return, the ATO will issue a <strong>Division 293 tax assessment notice</strong> if you are liable. You then have two options for paying the tax:
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Option 1: Pay From Your Super Fund</h3>
              <p>
                You can elect to release money from your super fund to pay the Division 293 tax. You lodge an election form (online in ATO online services: Super, then Manage, then Division 293 election) within <strong>60 days</strong> of the date of your Division 293 assessment. The ATO then sends your nominated super fund a <strong>release authority</strong>, and the fund pays the amount to the ATO. The 60 days give you time to decide; they do not change the due date for the tax. You cannot withdraw an election once it is made. Paying from super keeps your cash but lowers your super balance.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Option 2: Pay From Personal Funds</h3>
              <p>
                You can pay the Division 293 assessment directly using BPAY, credit card, or direct debit, just like any other ATO debt. The tax is due 21 days after the ATO gives you the notice of assessment, and the due date is printed on the notice. If the tax relates to contributions to a defined benefit fund, the ATO defers that part until a benefit is paid from the fund. Paying from personal funds preserves your super balance but reduces your available cash.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Tip</strong>
                  <br />
                  Releasing the amount from super is your choice: you can elect to have it paid from your super fund, or pay it yourself. If you don&apos;t pay by the due date on the notice, general interest charge applies. Set a reminder when you receive the assessment so you decide before the due date.
                </p>
              </div>
            </section>

            {/* SECTION 4: Strategies */}
            <section id="strategies">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Strategies to Manage Division 293</h2>
              <p>
                Division 293 cannot be avoided if your income alone exceeds the threshold. These strategies manage its impact:
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Reduce Concessional Contributions</h3>
              <p>
                If your income alone exceeds {THRESHOLD}, your mandatory employer SG contributions will trigger Division 293 regardless. However, you can choose not to make additional salary sacrifice contributions to limit the amount subject to the extra tax. The trade-off is losing the tax-advantaged super growth.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Consider Non-Concessional Contributions</h3>
              <p>
                Non-concessional (after-tax) contributions do not count towards Division 293 income. If you want to boost your super balance without triggering additional Division 293 tax, after-tax contributions (up to the {formatAUD(SUPER_GUARANTEE.nonConcessionalCap)} annual cap in FY{SITE_CONFIG.financialYear}) are an alternative. These contributions enter your super fund tax-free.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Timing of Income</h3>
              <p>
                If you have discretionary income (e.g., from a business or investments), timing the realisation of capital gains or business profits can help manage whether you cross the {THRESHOLD} threshold in a given year. This requires careful planning with a qualified tax adviser.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Despite Division 293, Super Is Still Tax-Effective</h3>
              <p>
                Even with Division 293, the total tax on super contributions is <strong>{pct(SUPER_TOTAL_RATE)}</strong>, still lower than the top marginal rate of <strong>{pct(TOP_RATE)}</strong> (plus {pct(MEDICARE_LEVY.rate)} Medicare levy = {pct(TOP_WITH_ML)}). For someone in the top tax bracket, super contributions still save {Math.round((TOP_WITH_ML - SUPER_TOTAL_RATE) * 100)} cents in every dollar compared with taking the money as salary. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to see the income tax a salary sacrifice saves (it does not apply the extra super tax).
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={DIVISION_293_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Division 293 thresholds and calculations are sourced from the Australian Taxation Office. Worked examples assume {formatAUD(TABLE_CONTRIBUTIONS)} of concessional contributions, within the FY{SITE_CONFIG.financialYear} cap of {formatAUD(SUPER_GUARANTEE.concessionalCap)}, and the {pct(SUPER_GUARANTEE.rate)} SG rate. Your own result also depends on your reportable fringe benefits, net investment losses and contributions across multiple super funds. Consult a qualified tax adviser for personalised Division 293 planning.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("division-293-tax"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Model your super tax</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Compare your take-home pay, income tax and total super with and without salary sacrifice. The calculator does not apply Division 293. Use the worked examples on this page for that tax.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Salary Sacrifice Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
