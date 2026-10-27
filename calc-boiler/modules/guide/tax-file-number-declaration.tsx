import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import { TAX_FREE_THRESHOLD, TAX_BRACKETS, MEDICARE_LEVY } from "@/lib/constants/australian-tax";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FaqAccordion from "@/components/common/faq-accordion";
import { TFN_DECLARATION_FAQS } from "./tax-file-number-declaration-faqs";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  // Question numbering verified 23 Sep 2026 against the ATO paper form instructions:
  // Q1 TFN, Q2–6 personal details, Q7 basis of pay, Q8 residency, Q9 tax-free threshold, Q10 study and training loans.
  { title: "Paper TFN declaration form for payees (NAT 3092)", url: "https://www.ato.gov.au/forms-and-instructions/tfn-declaration/paper-tfn-declaration-form-for-payees", publisher: SOURCES.ato.name },
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding", publisher: SOURCES.ato.name },
  { title: "Tax-free threshold", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/how-to-claim-the-tax-free-threshold", publisher: SOURCES.ato.name },
  { title: "Withholding declaration (NAT 3093)", url: "https://www.ato.gov.au/forms-and-instructions/withholding-declaration", publisher: SOURCES.ato.name },
  { title: "TFN declaration: payer information and obligations", url: "https://www.ato.gov.au/forms-and-instructions/tfn-declaration/payer-information-and-obligations", publisher: SOURCES.ato.name },
  { title: "Study and training loan obligations", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans", publisher: SOURCES.ato.name },
];

// No-TFN withholding rates (resident = top marginal rate + Medicare levy) rendered from constants.
const pctOf = (n: number) => `${Math.round(n * 100)}%`;
const RES = pctOf(NO_TFN_RATES.resident);
const FOREIGN = pctOf(NO_TFN_RATES.foreignResident);
const TOP_RATE = pctOf(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate);
const MEDICARE = pctOf(MEDICARE_LEVY.rate);

export default function TaxFileNumberDeclarationPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">TFN Declaration Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax File Number Declaration: How to Complete It Correctly
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            A Tax File Number (TFN) declaration is the ATO form you give each new employer when you start a job. Your answers on it set how much PAYG tax your employer withholds from each pay. A wrong answer to the residency, tax-free threshold or study loan question can mean too much or too little tax is withheld. This guide takes you through the form question by question, then covers the common mistakes, the penalty withholding rate and when to submit a new declaration.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: What Is a TFN Declaration */}
            <section id="what-is-tfn-declaration">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a TFN Declaration?</h2>
              <p>
                A Tax File Number (TFN) declaration is an official ATO form (NAT 3092) that you must provide to each new employer when you start a job. It tells your employer your TFN, your residency status for tax purposes, whether you claim the tax-free threshold, and whether you have a study or training loan debt such as HECS-HELP or a VET Student Loan.
              </p>
              <p>
                Your employer uses the information on your TFN declaration to calculate the correct amount of <strong>PAYG tax withholding</strong> from each pay. If you do not quote your TFN, claim an exemption or tell your employer you have applied for one, your employer must withhold tax at <strong>{RES}</strong> from every dollar you earn ({FOREIGN} if you are a foreign resident).
              </p>
              <p>
                The form can be completed on paper or electronically through your employer&apos;s payroll system. Give it to your employer after you start work, never with a job application. Your employer then sends the information to the ATO. If your employer has no declaration from you within <strong>14 days</strong> of starting to pay you, it must still tell the ATO.
              </p>
            </section>

            {/* SECTION 2: Step-by-Step */}
            <section id="step-by-step">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step: How to Complete Your TFN Declaration</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 1: Your Tax File Number</h3>
              <p>
                Enter your 9-digit TFN. If you don&apos;t know your TFN, you can find it on previous tax returns, correspondence from the ATO, or your myGov account. If you are a new Australian resident and don&apos;t yet have a TFN, you can apply for one through the ATO. If you tick the box saying you have applied for a TFN, you have 28 days to give it to your employer.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Don&apos;t Have Your TFN Yet?</strong>
                  <br />
                  If you have applied for a TFN but haven&apos;t received it yet, tick the &ldquo;I have made a separate application&rdquo; box. Your employer must withhold at the standard rates for 28 days while you wait. If you have not given your TFN after 28 days, the {RES} rate ({FOREIGN} for foreign residents) applies to future payments.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Questions 2&ndash;6: Personal Details</h3>
              <p>
                Enter your name, any previous family name, your address, email address and date of birth. These must match the details the ATO holds for your TFN. If you have recently changed your name (e.g., after marriage), update your details with the ATO first to avoid processing delays.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 7: On What Basis Are You Paid?</h3>
              <p>
                Select one: full-time employment, part-time employment, casual employment, labour hire, or superannuation or annuity income stream. Check with your employer if you are not sure which applies.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 8: Residency Status</h3>
              <p>
                Select whether you are an Australian resident for tax purposes, a foreign resident, or a working holiday maker. Your residency status sets your tax rates and whether you can claim the tax-free threshold. Residency for tax purposes is different from visa status: you can be a tax resident even on a temporary visa if you meet the residency tests. Working holiday makers (subclass 417 and 462 visas) tick the working holiday maker box, and special tax rates apply (see our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link>). Foreign residents do not receive the tax-free threshold and are taxed at foreign resident rates. See our <Link href="/non-resident-tax/">Non-Resident Tax Guide</Link> if you are unsure which residency status applies to you.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 9: Tax-Free Threshold</h3>
              <p>
                This question asks whether you claim the tax-free threshold from this employer. The tax-free threshold means the first <strong>${TAX_FREE_THRESHOLD.toLocaleString("en-AU")}</strong> of your annual income is tax-free. Answering &ldquo;Yes&rdquo; tells your employer to apply the threshold in your PAYG withholding, so less tax is deducted from each pay. See our <Link href="/tax-free-threshold/">Tax-Free Threshold Guide</Link> for more detail.
              </p>
              <p>
                <strong>Rules for claiming the tax-free threshold:</strong>
              </p>
              <ul>
                <li><strong>One job:</strong> Claim the tax-free threshold at that job. Answer &ldquo;Yes&rdquo;.</li>
                <li><strong>Multiple jobs:</strong> Claim the tax-free threshold at your <strong>main job only</strong> (the ATO says this is usually the payer who pays you the highest salary or wage). Answer &ldquo;No&rdquo; at all other jobs, unless your total income from all sources will be less than the threshold.</li>
                <li><strong>Government payments:</strong> If you receive a taxable payment such as JobSeeker, Youth Allowance or Austudy, the ATO says you are likely to be already claiming the threshold from that payment.</li>
                <li><strong>Foreign residents and working holiday makers:</strong> Answer &ldquo;No&rdquo; (unless you are a foreign resident receiving an Australian Government pension or allowance).</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Question 10: HECS-HELP and Other Study Loans</h3>
              <p>
                Tick &ldquo;Yes&rdquo; if you have any of the following debts:
              </p>
              <ul>
                <li>Higher Education Loan Program (HELP) debt, including HECS-HELP</li>
                <li>VET Student Loan (VSL)</li>
                <li>Financial Supplement (FS)</li>
                <li>Student Start-up Loan (SSL), including ABSTUDY SSL</li>
                <li>Australian Apprenticeship Support Loan (AASL), formerly Trade Support Loan</li>
              </ul>
              <p>
                When you tick &ldquo;Yes&rdquo;, your employer withholds additional amounts each pay period to cover your compulsory repayment. If you do not declare your debt here and earn above the compulsory repayment threshold, you will owe the repayment as a lump sum when you lodge your tax return. Once your debt is fully repaid, give your employer a withholding declaration so the extra withholding stops. See our <Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> for repayment thresholds and rates.
              </p>
            </section>

            {/* SECTION 3: Common Mistakes */}
            <section id="common-mistakes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common TFN Declaration Mistakes</h2>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Mistake</th>
                        <th className="px-6 py-4">Consequence</th>
                        <th className="px-6 py-4">How to Fix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Claiming tax-free threshold at 2 jobs</td>
                        <td className="px-6 py-4">Under-withholding. Tax debt at end of year.</td>
                        <td className="px-6 py-4">Give your second employer a withholding declaration that stops the threshold claim</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not declaring HECS-HELP debt</td>
                        <td className="px-6 py-4">No HECS withheld from pay. Lump sum HECS bill at tax time.</td>
                        <td className="px-6 py-4">Give your employer a withholding declaration declaring the debt</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not quoting your TFN</td>
                        <td className="px-6 py-4">{RES} withholding rate on every dollar earned ({FOREIGN} for foreign residents)</td>
                        <td className="px-6 py-4">Provide TFN to employer; refund comes via tax return</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Wrong residency status</td>
                        <td className="px-6 py-4">Incorrect tax rates applied; potential debt or penalty</td>
                        <td className="px-6 py-4">Give your employer a withholding declaration with the correct status</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Not updating after getting HECS debt</td>
                        <td className="px-6 py-4">HECS not withheld from ongoing pay</td>
                        <td className="px-6 py-4">Give your current employer a withholding declaration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>The {RES} Penalty Rate</strong>
                  <br />
                  If you don&apos;t quote your TFN or claim an exemption, your employer <strong>must</strong> withhold tax at {RES} (the {TOP_RATE} top marginal rate plus the {MEDICARE} Medicare levy) from every dollar you earn, or {FOREIGN} if you are a foreign resident. If you told your employer you have applied for a TFN, this starts after 28 days. This withholding is a legal obligation on your employer, not a choice. You can recover the excess tax when you lodge your annual tax return, but it means reduced pay in the meantime.
                </p>
              </div>
            </section>

            {/* SECTION 4: When to Submit a New One */}
            <section id="when-to-submit-new">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When to Submit a New TFN Declaration</h2>
              <p>
                Give a TFN declaration to each new employer. If your circumstances change while you stay with the same employer, give that employer a withholding declaration (NAT 3093) instead. It overrides your earlier declaration:
              </p>
              <ul>
                <li><strong>Starting a new job</strong>: A new TFN declaration for each new payer you start work with.</li>
                <li><strong>Acquiring a HECS-HELP debt</strong>: A withholding declaration if you start studying and take on a HECS loan while employed.</li>
                <li><strong>Paying off your HECS debt</strong>: A withholding declaration to stop the additional withholding.</li>
                <li><strong>Changing your tax-free threshold claim</strong>: A withholding declaration if you get a second job or leave a job and want to move the threshold to a different employer.</li>
                <li><strong>Changing residency status</strong>: A withholding declaration if you become or cease to be an Australian resident for tax purposes.</li>
                <li><strong>Name change</strong>: Update your details with the ATO first, then tell your employer.</li>
              </ul>
              <p>
                You do <strong>not</strong> need to submit a new TFN declaration each financial year or if your salary changes with the same employer. The declaration stays in effect until you give a new declaration or leave the employer.
              </p>
              <p>
                For a checklist of the forms and details to sort out when you start a new job, see our <Link href="/new-job-checklist/">New Job Checklist</Link>. If this is your first ever job, our <Link href="/first-job-pay-guide/">First Job Pay Guide</Link> explains tax, super and each line on your first payslip.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={TFN_DECLARATION_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Information is sourced from the ATO&apos;s official TFN declaration form (NAT 3092), withholding declaration (NAT 3093) and PAYG withholding guidelines. Tax rates and thresholds are for FY{SITE_CONFIG.financialYear}. The {RES} penalty withholding rate comprises the {TOP_RATE} top marginal rate plus the {MEDICARE} Medicare levy. For a question about your own TFN declaration, contact the ATO on 13 28 61.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-file-number-declaration"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/second-job-tax-calculator/" label="Second Job Tax Calculator" />
                    <SidebarLink href="/hecs-help-calculator/" label="HECS-HELP Guide" />
                    <SidebarLink href="/first-job-pay-guide/" label="First Job Pay Guide" />
                    <SidebarLink href="/new-job-checklist/" label="New Job Checklist" />
                    <SidebarLink href="/payg-withholding-tables/" label="PAYG Withholding Tables" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how your TFN declaration choices affect your take-home pay, including tax-free threshold and HECS withholding.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Income Tax Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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
