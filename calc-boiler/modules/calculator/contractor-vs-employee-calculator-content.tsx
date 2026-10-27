// The static long-form content on /contractor-vs-employee-calculator/. A server
// component, so it ships as HTML; the client module
// (contractor-vs-employee-calculator.tsx) renders it via `children`.

import Link from "next/link";
import { ChevronRight, ShieldAlert } from "lucide-react";
import FaqAccordion from "@/components/common/faq-accordion";
import { CONTRACTOR_VS_EMPLOYEE_FAQS, SHAM_MAX_BUSINESS, SHAM_MAX_INDIVIDUAL, SHAM_MAX_SMALL_BUSINESS } from "@/modules/calculator/contractor-vs-employee-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  EMPLOYMENT,
  formatAUD,
  formatNegAUD,
  formatPercent,
  MEDICARE_LEVY,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
  TAX_BRACKETS,
} from "@/lib/constants";
import { GST_REGISTRATION_THRESHOLD } from "@/lib/constants/gig-tax";

// ---------------------------------------------------------------------------
// Figures below are derived from lib/constants so they roll over each 1 July.
// The page previously hand-typed FY2025-26 values (16% bracket, $30,000
// concessional cap, $120,000 non-concessional cap, $93,000 MLS threshold) and
// a worked example whose employee tax ($22,788) did not reconcile.
// ---------------------------------------------------------------------------
const FY = SITE_CONFIG.financialYear;
const CC_CAP = formatAUD(SUPER_GUARANTEE.concessionalCap);
const NCC_CAP = formatAUD(SUPER_GUARANTEE.nonConcessionalCap);
const MLS_SINGLE = formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1);
const MLS_FAMILY = formatAUD(MEDICARE_LEVY.surcharge.familyTier1.min - 1);
const SG_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);
const MEDICARE_PCT = formatPercent(MEDICARE_LEVY.rate, 0);
const GST_THRESHOLD = formatAUD(GST_REGISTRATION_THRESHOLD);
// NES leave as a share of a 52-week salary: 4 weeks annual leave (4/52) and
// 10 days personal leave (10/260 weekdays).
const AL_SHARE = EMPLOYMENT.annualLeaveWeeks / EMPLOYMENT.weeksPerYear;
const PL_SHARE = EMPLOYMENT.personalLeaveDays / (EMPLOYMENT.weeksPerYear * 5);


// Worked example: $100,000 gross, $3,000 expenses, self-funded SG-rate super.
const EX_GROSS = 100_000;
const EX_EXPENSES = 3_000;
const EX_SUPER = Math.round(EX_GROSS * SUPER_GUARANTEE.rate);
const EX_AL = Math.round(EX_GROSS * AL_SHARE);
const EX_PL = Math.round(EX_GROSS * PL_SHARE);
const EX_LEAVE = EX_AL + EX_PL;
const exTax = (taxable: number) => Math.max(0, calculateIncomeTax(taxable) - calculateLITO(taxable));
const EX_EMP_TAX = exTax(EX_GROSS);
const EX_EMP_MEDICARE = Math.round(EX_GROSS * MEDICARE_LEVY.rate);
const EX_EMP_NET = EX_GROSS - EX_EMP_TAX - EX_EMP_MEDICARE;
const EX_CON_TAXABLE = EX_GROSS - EX_EXPENSES - EX_SUPER;
const EX_CON_TAX = exTax(EX_CON_TAXABLE);
const EX_CON_MEDICARE = Math.round(EX_CON_TAXABLE * MEDICARE_LEVY.rate);
const EX_CON_NET = EX_CON_TAXABLE - EX_CON_TAX - EX_CON_MEDICARE;
const EX_EMP_TOTAL = EX_EMP_NET + EX_SUPER + EX_LEAVE;
const EX_CON_TOTAL = EX_CON_NET + EX_SUPER;
// Contract rate (in $100 steps) at which the contractor's package, with the
// same expenses and self-funded super at the SG rate, matches the employee's.
const conTotalAt = (gross: number) => {
  const sup = Math.round(gross * SUPER_GUARANTEE.rate);
  const taxable = gross - EX_EXPENSES - sup;
  return taxable - exTax(taxable) - Math.round(taxable * MEDICARE_LEVY.rate) + sup;
};
const EX_MATCH = (() => {
  let g = EX_GROSS;
  while (conTotalAt(g) < EX_EMP_TOTAL) g += 100;
  return g;
})();
const EX_MATCH_PCT = `${Math.round((EX_MATCH / EX_GROSS - 1) * 100)}%`;

const pct0 = (r: number) => `${Math.round(r * 1000) / 10}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Employee or contractor", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/employee-or-independent-contractor", publisher: SOURCES.ato.name },
  { title: "Super for contractors", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/personal-super-contributions", publisher: SOURCES.ato.name },
  { title: "Registering for GST", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst", publisher: SOURCES.ato.name },
];

export default function ContractorVsEmployeeCalculatorContent() {
  return (
    <>
          {/* H2: How Does Contractor vs Employee Pay Compare? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Contractor vs Employee Pay Compare?</h2>
            <p className="mb-4 text-warmgray">
              A contractor earning the same gross rate as an employee takes home <strong>less cash and no entitlements</strong> unless the contract rate is about {EX_MATCH_PCT} higher (on a $100,000 rate, see the worked example below). Australian tax and employment law treats employees and contractors differently on income tax withholding, superannuation, the Medicare levy and leave entitlements. Those differences open a gap in total compensation value that the gross rate does not show.
            </p>
            <p className="mb-4 text-warmgray">
              On a <strong>$100,000</strong> gross rate, an employee&apos;s total package value (including {SG_PCT} superannuation guarantee paid by the employer) is <strong>{formatAUD(EX_GROSS + EX_SUPER)}</strong>. A contractor at the same $100,000 receives no employer super, no paid leave, and no workers compensation coverage. After self-funding super and covering business expenses, the contractor&apos;s disposable income drops below the employee&apos;s take-home pay. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see the exact income tax breakdown at any salary level.
            </p>
            <p className="mb-4 text-warmgray">
              This contractor vs employee calculator for FY{FY} applies the current Australian tax brackets, the <strong>{SG_PCT} SG rate</strong>, and the <strong>{MEDICARE_PCT} Medicare levy</strong> to compare an employee and a contractor on the same gross rate. Enter your gross income and annual business expenses above. The calculator takes those expenses, and self-funded super if you tick the box, off the contractor&apos;s taxable income. It then shows the approximate contract value you need to match the employee package.
            </p>
          </section>

          {/* H2: What Are the Key Differences? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Key Differences Between Contractors and Employees?</h2>
            <p className="mb-4 text-warmgray">
              Contractors and employees differ across <strong>7 core dimensions</strong>: tax collection, superannuation, Medicare, GST, leave, insurance, and expense deductions. The comparison table below summarises every difference that affects your take-home pay and total package value.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Factor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Contractor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Tax collection</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer withholds (PAYG)</td>
                    <td className="px-4 py-3 text-gray-700">You manage and lodge BAS</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Superannuation</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer pays {SG_PCT} on top</td>
                    <td className="px-4 py-3 text-gray-700">You fund your own (optional)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Medicare levy</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Deducted from pay automatically</td>
                    <td className="px-4 py-3 text-gray-700">You pay at tax time</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">GST</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Not applicable</td>
                    <td className="px-4 py-3 text-gray-700">Must charge 10% if registered ($75k+)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Leave entitlements</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">4 weeks annual + 10 days personal</td>
                    <td className="px-4 py-3 text-gray-700 text-ochre font-medium">None</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Insurance</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer provides workers comp</td>
                    <td className="px-4 py-3 text-gray-700 text-ochre font-medium">You arrange your own liability cover</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Expense deductions</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Limited work-related deductions</td>
                    <td className="px-4 py-3 text-gray-700">All legitimate business costs deductible</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Tax return complexity</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Simple individual return</td>
                    <td className="px-4 py-3 text-gray-700">Business schedule + quarterly BAS</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-warmgray text-sm">
              Employees get superannuation paid by the employer on top of salary, and paid leave under the Fair Work Act (work out what that leave is worth with the <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Leave Calculator</Link>). PAYG withholding collects their income tax from each pay instead of as a lump sum at tax time. Contractors give up these benefits in exchange for flexibility and wider business deductions.
            </p>
          </section>

          {/* H2: Who Uses This Calculator? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Contractor vs Employee Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This contractor vs employee calculator is built for <strong>4 primary user groups</strong> evaluating whether to work as an employee or operate under an ABN as a sole trader or contractor.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Employees considering contracting</strong>: IT professionals, consultants, and tradespeople offered a contract rate who want to verify whether the higher gross compensates for lost entitlements.</li>
              <li><strong>Contractors evaluating employment offers</strong>: Existing ABN holders offered a permanent role who want to compare the net financial position after accounting for super, leave, and insurance.</li>
              <li><strong>Employers setting contract rates</strong>: Hiring managers and HR teams determining a fair contractor day rate that equals their standard employee salary package.</li>
              <li><strong>Accountants and bookkeepers</strong>: Tax professionals advising clients on the financial implications of changing their engagement structure for the {FY} financial year.</li>
            </ul>
          </section>

          {/* H2: Tax Obligations */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Tax Obligations for Contractors vs Employees?</h2>
            <p className="mb-4 text-warmgray">
              Employees and contractors pay the same income tax rates under Australia&apos;s progressive tax brackets, but the <strong>method of collection, timing, and deduction opportunities differ significantly</strong>.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employee Tax Obligations</h3>
            <p className="mb-4 text-warmgray">
              Employers deduct income tax from each pay cycle through the &quot;PAYG Withholding&quot; system based on ATO tax tables. The employee&apos;s obligations are minimal: lodge a single annual tax return, claim limited work-related deductions, and pay the <strong>{MEDICARE_PCT} Medicare levy</strong> (deducted automatically). The employer handles super ({SG_PCT} SG rate), workers compensation insurance, and payroll tax. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> to see your exact after-tax income as an employee, or the <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Fortnightly Pay &amp; Tax Calculator Australia {FY}</Link> if you are paid fortnightly.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Contractor Tax Obligations</h3>
            <p className="mb-4 text-warmgray">
              Contractors operating under an ABN manage their own taxation. Key obligations include:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>PAYG instalments</strong>: quarterly income tax pre-payments to the ATO, calculated on estimated annual income.</li>
              <li><strong>GST registration</strong>: mandatory once your GST turnover reaches <strong>{GST_THRESHOLD}</strong>. The contractor charges clients 10% GST and remits it quarterly via a &quot;Business Activity Statement&quot; (BAS).</li>
              <li><strong>Medicare levy</strong>: <strong>{MEDICARE_PCT}</strong> of taxable income, paid at tax time. The &quot;Medicare Levy Surcharge&quot; of 1%&ndash;1.5% applies to contractors whose income for MLS purposes is above <strong>{MLS_SINGLE}</strong> (singles) or <strong>{MLS_FAMILY}</strong> (families) in {FY} without private hospital cover.</li>
              <li><strong>Superannuation</strong>: voluntary personal contributions are tax-deductible up to the <strong>{CC_CAP}</strong> concessional cap for FY{FY} (employer contributions count towards it too).</li>
              <li><strong>Annual tax return</strong>: includes a business schedule reporting all income, expenses, and deductions.</li>
            </ol>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY{FY} Income Tax Brackets for Both</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Taxable Income</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Marginal Rate</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tax on This Bracket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TAX_BRACKETS.map((b) => (
                    <tr key={b.min} className="hover:bg-sandstone/50">
                      <td className="px-4 py-3 text-navy">
                        {b.max === Infinity ? `${formatAUD(b.min)}+` : <>{formatAUD(b.min)} &ndash; {formatAUD(b.max)}</>}
                      </td>
                      <td className="px-4 py-3 text-gray-700"><strong>{pct0(b.rate)}</strong></td>
                      <td className="px-4 py-3 text-gray-700">
                        {b.max === Infinity
                          ? `${Math.round(b.rate * 100)}c per $1 over ${formatAUD(b.min - 1)}`
                          : formatAUD(Math.round((b.max - Math.max(b.min - 1, 0)) * b.rate))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-warmgray text-sm">
              Both employees and contractors apply these identical tax brackets. The difference is that contractors reduce their assessable income through business expense deductions before tax is calculated. See the full breakdown in our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link>.
            </p>
          </section>

          {/* H2: Which Is Better Financially? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Is Better Financially: Contractor or Employee?</h2>
            <p className="mb-4 text-warmgray">
              Employment is financially better at the same gross rate. On a $100,000 salary, a contractor needs to earn about <strong>{EX_MATCH_PCT} more</strong> ({formatAUD(EX_MATCH)}) to reach the same total package value after self-funded super, unpaid leave and {formatAUD(EX_EXPENSES)} of business expenses. Insurance and admin costs above that push the rate higher.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $100,000 Gross Rate</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Line Item</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Contractor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Gross Income</td>
                    <td className="px-4 py-3 text-right text-gray-700">$100,000</td>
                    <td className="px-4 py-3 text-right text-gray-700">$100,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Business Expenses</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$3,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Self-Funded Super ({SG_PCT})</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0 (employer pays)</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNegAUD(EX_SUPER)}</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Taxable Income</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatAUD(EX_GROSS)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatAUD(EX_CON_TAXABLE)}</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Income Tax</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNegAUD(EX_EMP_TAX)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNegAUD(EX_CON_TAX)}</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Medicare Levy ({MEDICARE_PCT})</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNegAUD(EX_EMP_MEDICARE)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNegAUD(EX_CON_MEDICARE)}</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50 bg-eucalyptus-light/20">
                    <td className="px-4 py-3 text-navy font-bold">Net Take-Home Cash</td>
                    <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(EX_EMP_NET)}</td>
                    <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">{formatAUD(EX_CON_NET)}</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Super Balance</td>
                    <td className="px-4 py-3 text-right text-gray-700">+{formatAUD(EX_SUPER)} (employer)</td>
                    <td className="px-4 py-3 text-right text-gray-700">+{formatAUD(EX_SUPER)} (self)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Paid Leave Value</td>
                    <td className="px-4 py-3 text-right text-gray-700">+{formatAUD(EX_LEAVE)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50 bg-sandstone">
                    <td className="px-4 py-3 text-navy font-bold">Total Package Value</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">{formatAUD(EX_EMP_TOTAL)}</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">{formatAUD(EX_CON_TOTAL)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 mb-4">
              <p className="text-navy font-medium">
                At the same $100,000 gross rate, the employee&apos;s total package value is <strong>{formatAUD(EX_EMP_TOTAL - EX_CON_TOTAL)} higher</strong> than the contractor&apos;s. The contractor needs to charge about <strong>{formatAUD(EX_MATCH)}</strong> (before GST, with the same {formatAUD(EX_EXPENSES)} of expenses) to match the employee&apos;s total package.
              </p>
            </div>
            <p className="text-warmgray">
              Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to model the long-term retirement impact of self-funding versus employer-funded super contributions across different salary levels.
            </p>
          </section>

          {/* H2: The True Cost Gap */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Hidden Costs Do Contractors Face?</h2>
            <p className="mb-4 text-warmgray">
              Contractors bear <strong>6 additional costs</strong> that an employer covers for employees at no charge. These hidden costs reduce the contractor&apos;s effective hourly rate and total compensation value.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Superannuation ({SG_PCT} SG)</strong>: Employer pays this in addition to base salary. Self-funding costs <strong>{formatAUD(EX_SUPER)}</strong> on a $100,000 income.</li>
              <li><strong>Annual leave (4 weeks)</strong>: About {formatPercent(AL_SHARE, 1)} of your yearly working value, equivalent to <strong>{formatAUD(EX_AL)}</strong> on a $100,000 salary.</li>
              <li><strong>Personal/sick leave (10 days)</strong>: About {formatPercent(PL_SHARE, 1)} of your yearly working value, equivalent to <strong>{formatAUD(EX_PL)}</strong> on a $100,000 salary.</li>
              <li><strong>Injury and illness cover</strong>: An employer&apos;s workers compensation policy covers its employees. In NSW a sole trader cannot cover themselves under a workers compensation policy, so you pay for your own personal accident or income protection insurance.</li>
              <li><strong>Professional indemnity / public liability</strong>: Premiums range from <strong>$400&ndash;$2,500</strong> per year for most professional services contractors.</li>
              <li><strong>Accounting and software</strong>: Bookkeeping, BAS lodgment, and accounting software cost <strong>$1,500&ndash;$4,000</strong> per year.</li>
            </ul>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4">
              <p className="text-navy font-medium">
                To match a $100,000 employee package, a contractor needs to charge about <strong>{formatAUD(EX_MATCH)}</strong> (before GST) to cover self-funded super, unpaid leave and {formatAUD(EX_EXPENSES)} of business expenses (worked example above). Insurance and admin costs above that push the rate higher.
              </p>
            </div>
          </section>

          {/* H2: When Does Contracting Pay Off? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Does Contracting Pay Off?</h2>
            <p className="mb-4 text-warmgray">
              On a $100,000 salary, contracting comes out ahead once the contract rate is more than about <strong>{EX_MATCH_PCT}</strong> above the employee salary ({formatAUD(EX_MATCH)} in the worked example). Below that, the lost super and paid leave outweigh the higher gross income.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3 flex items-center"><ChevronRight className="h-5 w-5 mr-1" /> Contracting is better when:</h3>
                <ul className="space-y-2 text-sm pl-2 border-l-2 border-eucalyptus-light">
                  <li>Your contract rate is <strong>{EX_MATCH_PCT}+ higher</strong> than the equivalent employee salary.</li>
                  <li>You can claim significant tax deductions (home office, equipment, travel).</li>
                  <li>You value flexibility and independence over job security.</li>
                  <li>You have multiple clients or streams of income.</li>
                </ul>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3 flex items-center"><ChevronRight className="h-5 w-5 mr-1" /> Employment is better when:</h3>
                <ul className="space-y-2 text-sm pl-2 border-l-2 border-sandstone-dark/20">
                  <li>The contract rate is close to the employee salary.</li>
                  <li>You value job security, sick leave, and paid holidays.</li>
                  <li>You don&apos;t want the administrative burden of BAS, tax, and insurance.</li>
                  <li>You need the protection of workers compensation.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* H2: Common Mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Mistakes When Comparing Contractor and Employee Pay?</h2>
            <p className="mb-4 text-warmgray">
              The most common mistake is comparing gross rates directly without adjusting for the gap in hidden entitlements and costs: <strong>{formatAUD(EX_EMP_TOTAL - EX_CON_TOTAL)}</strong> on a $100,000 rate in the worked example above. Five frequent errors distort the contractor vs employee calculation.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Ignoring superannuation</strong>: Employees receive {SG_PCT} super on top of their salary. A contractor earning $100,000 who skips super misses <strong>{formatAUD(EX_SUPER)}</strong> per year in retirement savings, compounding to over <strong>$400,000</strong> across a 20-year career at average fund returns.</li>
              <li><strong>Forgetting leave entitlements</strong>: Four weeks of annual leave and 10 days of personal leave represent <strong>{formatPercent(AL_SHARE + PL_SHARE, 1)}</strong> of an employee&apos;s salary value. Contractors who work every billable day to match income risk burnout without accounting for unpaid downtime.</li>
              <li><strong>Overlooking GST obligations</strong>: Contractors with a GST turnover of {GST_THRESHOLD} or more must register for GST and charge clients 10%. The GST you collect is not income: it belongs to the ATO. Spending GST revenue as personal income creates a debt at BAS time.</li>
              <li><strong>Underestimating admin costs</strong>: BAS lodgment, bookkeeping, insurance premiums, and software subscriptions cost <strong>$3,000&ndash;$6,000</strong> annually.</li>
              <li><strong>Assuming &quot;sham contracting&quot; is risk-free</strong>: The ATO applies a multi-factor test to determine genuine contractor status. Under the Fair Work Act, courts can order penalties of up to <strong>{SHAM_MAX_INDIVIDUAL}</strong> per contravention for individuals and up to <strong>{SHAM_MAX_BUSINESS}</strong> for larger businesses for sham contracting.</li>
            </ol>
          </section>

{/* Merged from /contractor-vs-employee-calculator/ on 2026-08-28 — the guide 301s here (GSC: same query network, split ranking). */}
                      {/* ============================================================ */}
            <section id="ato-multi-factor">
              <h2>How Does the ATO Determine Your Status?</h2>
              <p>
                The ATO applies a multi-factor test rooted in Australian common law. No single factor is decisive: the test looks at the whole working relationship across <strong>6 primary indicators</strong>.
              </p>
              <p>
                For tax and super, the High Court&apos;s 2022 decisions in <em>Construction, Forestry, Maritime, Mining and Energy Union v Personnel Contracting Pty Ltd</em> and <em>ZG Operations Australia Pty Ltd v Jamsek</em> still apply: courts look first at the terms of the written contract, provided those terms reflect a genuine arrangement and are not a sham. For Fair Work Act purposes, a definition of employment added on 26 August 2024 looks at the real substance, practical reality and true nature of the working relationship, including how the contract is performed in practice. That definition does not change who is an employee for tax, super or workers compensation. The 6 indicators the ATO evaluates are:
              </p>
              <ol>
                <li><strong>Ability to sub-contract or delegate:</strong> A contractor has the right to hire others to do the work. An employee performs the work personally.</li>
                <li><strong>Basis of payment:</strong> Contractors invoice for a result (fixed quote, per-project fee). Employees receive a regular wage or salary per hour, week, or month.</li>
                <li><strong>Equipment, tools, and other assets:</strong> Contractors supply their own tools, vehicles, and software. Employees use the employer&apos;s equipment.</li>
                <li><strong>Commercial risk:</strong> Contractors bear financial risk: they fix defects at their own cost and carry their own professional indemnity, public liability, and income protection insurance. Employees bear no such risk.</li>
                <li><strong>Control over the work:</strong> Contractors decide how, when, and where they perform the work. Employees follow the employer&apos;s directions on method, location, and hours.</li>
                <li><strong>Independence / integration:</strong> Contractors operate visibly as a separate business (own ABN, own branding, multiple clients). Employees are integrated into the employer&apos;s operations (wearing uniforms, using company email addresses, attending staff meetings).</li>
              </ol>
              <p>
                No set number of indicators decides the answer: the ATO weighs them across the whole relationship. A worker who fails most indicators (for example, using the employer&apos;s tools, working fixed rosters, having no right to delegate, and receiving hourly pay) is almost certainly an employee regardless of what the contract states. The ATO publishes a free Employee/Contractor Decision Tool on ato.gov.au that steps through each factor.
              </p>
              <div className="bg-sandstone border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6 text-sm">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="h-6 w-6 text-ochre mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-ochre mb-1">Beware of &lsquo;Sham Contracting&rsquo;</h3>
                    <p className="text-ochre">Intentionally classifying an employee as an independent contractor to avoid paying them super, leave, or minimum wage is illegal under the Fair Work Act. The business and its directors face civil penalties. The business must pay the annual leave the worker was owed, and the ATO recovers unpaid super from the business through the Superannuation Guarantee Charge.</p>
                  </div>
                </div>
              </div>
              <p>
                A classic sign of sham contracting is a business that makes a worker get an ABN before it gives them shifts, while still setting their hours and uniform the same way it does for its employees.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="comparison-table">
              <h2>Contractor vs Employee Comparison Table</h2>
              <p>
                Employees and contractors differ across <strong>12 key attributes</strong> covering tax, entitlements, risk, and work arrangements. The table below sets out each attribute side by side.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 w-1/3">Factor</th>
                        <th className="px-6 py-4 w-1/3 border-l">Employee</th>
                        <th className="px-6 py-4 w-1/3 border-l">Independent Contractor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Control over work</td>
                        <td className="px-6 py-4 border-l">Employer dictates the hours, location, and exactly <em>how</em> the work is done.</td>
                        <td className="px-6 py-4 border-l">Controls their own schedule and decides how to best achieve the requested result.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tools &amp; Equipment</td>
                        <td className="px-6 py-4 border-l">Employer provides base tools, laptops, vehicles, or gives an allowance.</td>
                        <td className="px-6 py-4 border-l">Provides all of their own commercial tools, software, and gear.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Commercial Risk</td>
                        <td className="px-6 py-4 border-l">Takes no financial risk. Employer is legally responsible for mistakes.</td>
                        <td className="px-6 py-4 border-l">Bears commercial risk. Must fix defects at their own expense and carry their own insurance.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Integration</td>
                        <td className="px-6 py-4 border-l">Seen as a representative or face of the employer&apos;s business (e.g. wearing a logo).</td>
                        <td className="px-6 py-4 border-l">Operates visibly as their own distinct business (quoting their own ABN).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Income tax</td>
                        <td className="px-6 py-4 border-l">Employer withholds PAYG tax each pay cycle. Employee lodges annual return.</td>
                        <td className="px-6 py-4 border-l">Receives full invoice amount. Must set aside ~30% and pay ATO directly via quarterly BAS or annual return.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">GST</td>
                        <td className="px-6 py-4 border-l">Not applicable. Employees do not charge GST.</td>
                        <td className="px-6 py-4 border-l">Must register and charge 10% GST if GST turnover is {GST_THRESHOLD} or more.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Superannuation</td>
                        <td className="px-6 py-4 border-l">Employer pays {SG_PCT} SG on top of gross salary (FY{FY}).</td>
                        <td className="px-6 py-4 border-l">Manages own super. Exception: employer pays SG if contractor is hired principally for labour.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Annual leave</td>
                        <td className="px-6 py-4 border-l">Entitled to 4 weeks (20 days) paid annual leave per year under the NES.</td>
                        <td className="px-6 py-4 border-l">No entitlement. Must factor unpaid time off into their hourly rate.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Sick / personal leave</td>
                        <td className="px-6 py-4 border-l">10 days paid personal/carer&apos;s leave per year.</td>
                        <td className="px-6 py-4 border-l">No entitlement. No pay when sick or caring for family.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Workers&apos; compensation</td>
                        <td className="px-6 py-4 border-l">Covered by employer&apos;s WorkCover policy.</td>
                        <td className="px-6 py-4 border-l">Must purchase own income protection and public liability insurance.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Delegation / sub-contracting</td>
                        <td className="px-6 py-4 border-l">Must perform work personally.</td>
                        <td className="px-6 py-4 border-l">Has the right to delegate work to others or sub-contract.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Termination</td>
                        <td className="px-6 py-4 border-l">Protected by unfair dismissal laws after minimum employment period (6 or 12 months).</td>
                        <td className="px-6 py-4 border-l">Contract ends per agreed terms. No unfair dismissal protection.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            {/* ============================================================ */}
            <section id="gst-obligations">
              <h2>What Are the GST Obligations for Contractors?</h2>
              <p>
                Contractors with a GST turnover of <strong>{GST_THRESHOLD} or more</strong> must register for GST, charge 10% on every invoice, and remit the collected GST to the ATO via quarterly or monthly BAS lodgements.
              </p>
              <p>
                If you quote $100/hour to a client, the invoice becomes $110 including GST. The client pays $110, you keep $100, and $10 goes to the ATO. Set the GST aside when the client pays you: it is due to the ATO with your BAS.
              </p>
              <p>
                If your GST turnover is under {GST_THRESHOLD}, GST registration is optional. Registering lets you claim GST credits on business expenses (equipment, software, insurance), which offset the GST you owe.
              </p>
              <p>
                Employees never interact with GST. Their salary is not subject to GST, and they do not lodge BAS returns. BAS lodgement is one of the hidden admin costs of contracting to count when you compare contractor vs employee arrangements.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="super-obligations">
              <h2>Super Entitlements for Contractors</h2>
              <p>
                Genuine independent contractors pay their own superannuation voluntarily, but the Superannuation Guarantee (Administration) Act 1992 creates an exception: employers must pay the <strong>{SG_PCT} Super Guarantee</strong> for any contractor hired &ldquo;wholly or principally for their personal labour and skills.&rdquo;
              </p>
              <p className="text-lg font-medium text-navy border-l-4 border-eucalyptus pl-4 py-1">
                If a contractor is hired wholly or principally for their personal labour and skills, the employer must still pay the {SG_PCT} Super Guarantee on top of their invoice.
              </p>
              <p>
                This exception targets sole traders who function economically like employees: a freelance web developer billing hourly, a sole-trader electrician on a long-term engagement, or a contract bookkeeper working 3 days per week for a single client. The test asks: is the hiring business paying for the contractor&apos;s personal effort, or for a deliverable that the contractor&apos;s business produces using any combination of staff and resources?
              </p>
              <p>
                If you hire a solo graphic designer on an hourly rate to do the design work personally, the ATO classifies them as an employee <strong>for superannuation purposes only</strong>. You must pay their super. If you hire a plumbing <em>company</em> to fix a roof and it sends any plumber from its staff, that is a genuine B2B contract and no super is owed.
              </p>
              <p>
                Contractors who do not receive employer super contributions can still make personal concessional (before-tax) contributions up to the <strong>{CC_CAP} annual cap</strong> and claim a full tax deduction. Non-concessional (after-tax) contributions are capped at <strong>{NCC_CAP} per year</strong> in FY{FY}. Read the full breakdown in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="sham-contracting">
              <h2>What Are the Risks of Sham Contracting?</h2>
              <p>
                Sham contracting occurs when an employer deliberately disguises an employment relationship as a contracting arrangement to avoid paying entitlements. Courts can impose maximum penalties per contravention of <strong>{SHAM_MAX_INDIVIDUAL}</strong> for individuals, <strong>{SHAM_MAX_SMALL_BUSINESS}</strong> for businesses with fewer than 15 employees, and <strong>{SHAM_MAX_BUSINESS}</strong> for larger businesses.
              </p>
              <p>
                Beyond the civil penalties, sham contracting triggers 3 additional financial consequences:
              </p>
              <ol>
                <li><strong>Backpayment of superannuation:</strong> The employer must pay all unpaid Super Guarantee amounts at {SG_PCT} (or the rate applicable at the time), plus the Superannuation Guarantee Charge (SGC). From 1 July 2026 that is the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60%; the charge is now tax-deductible. For earnings paid up to 30 June 2026 the old rules apply: 10% nominal interest, $20 per employee per quarter, and no deduction.</li>
                <li><strong>Backpayment of leave entitlements:</strong> The employer owes the annual leave the worker accrued as an employee, which can span multiple years (unused annual leave is paid out when employment ends), and any redundancy pay that applies. Sick and carer&apos;s leave is not paid out when employment ends. Long-service leave liabilities accrue after <strong>7 to 10 years</strong> depending on the state.</li>
                <li><strong>Backpayment of Award underpayments:</strong> If the worker was covered by a Modern Award, the employer must make up the difference between what was paid and the Award minimum, including overtime, penalty rates, and allowances. Review common Award structures on our <Link href="/award-rates/">Award Rates</Link> page.</li>
              </ol>
              <p>
                Industries with the highest rates of sham contracting enforcement include construction, cleaning, hospitality, transport and logistics, and IT consulting. The Fair Work Ombudsman conducts targeted audits in these sectors annually. In FY2025-26, the FWO recovered <strong>$453 million</strong> in underpaid wages for workers.
              </p>
              <p>
                To defend a sham contracting claim, the employer must prove that, when it made the representation, it reasonably believed the worker was engaged as a contractor. This &quot;reasonableness&quot; test replaced the old &quot;recklessness&quot; test from 27 February 2024. The onus falls on the employer.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="switching">
              <h2>How to Switch from Contractor to Employee</h2>
              <p>
                Switching from contractor to employee requires a formal transition covering <strong>5 administrative steps</strong>. The employer must restructure the legal arrangement, payroll registration, and insurance coverage.
              </p>
              <ol>
                <li><strong>Sign a new employment contract:</strong> The contractor agreement terminates and a written employment contract replaces it, specifying the role, salary, hours, and applicable Modern Award or Enterprise Agreement.</li>
                <li><strong>Register in the employer&apos;s PAYG system:</strong> The employee completes a Tax File Number (TFN) declaration. The employer begins withholding income tax each pay cycle using ATO withholding schedules. Learn more about the deduction process in our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> guide.</li>
                <li><strong>Commence Super Guarantee payments:</strong> The employer pays {SG_PCT} super on top of the agreed salary from the first day of employment. Since Payday Super began on {SUPER_GUARANTEE.paydaySuperStart}, the contribution must reach the fund within <strong>7 business days</strong> of each payday (20 business days for a new employee&apos;s first contribution).</li>
                <li><strong>Enrol in workers&apos; compensation insurance:</strong> State-based WorkCover schemes cover the new employee immediately. The employer absorbs this cost, which ranges from <strong>0.3% to 8%</strong> of payroll depending on the industry and state.</li>
                <li><strong>Adjust the pay rate:</strong> The gross salary is typically lower than the contractor&apos;s invoice rate because the employer now bears on-costs including super, leave accrual, and WorkCover. A contractor earning $78/hour commonly transitions to an employee salary of <strong>$100,000 to $105,000</strong> per year.</li>
              </ol>
              <p>
                Leave entitlements (annual leave, personal leave, long-service leave) begin accruing from day one of the employment relationship. The transition does not carry over any prior service as a contractor for leave-accrual purposes, unless the employer agrees otherwise in writing.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="insurance-and-leave">
              <h2>What Insurance and Leave Do Contractors Miss Out On?</h2>
              <p>
                Contractors receive <strong>zero paid leave</strong> and must purchase all workplace insurance at their own expense. These two costs are the largest hidden gap between contracting and employment income.
              </p>
              <ul>
                <li><strong>Annual leave:</strong> Employees receive 4 weeks (20 days) paid leave per year under the National Employment Standards. Contractors who take 4 weeks off sacrifice about <strong>{formatPercent(AL_SHARE, 1)}</strong> of their annual billable revenue.</li>
                <li><strong>Personal / carer&apos;s leave:</strong> Employees receive 10 days paid personal leave per year. Contractors receive nothing, so every day off for illness or caring responsibilities is lost income.</li>
                <li><strong>Long-service leave:</strong> Employees accrue long-service leave after 7 to 10 years (varies by state). Contractors have no equivalent entitlement.</li>
                <li><strong>Public holidays:</strong> Employees receive <strong>8 national public holidays</strong> paid (plus state-specific additions, totalling 10 to 13 days depending on the jurisdiction). Contractors forfeit this income or must work the day.</li>
                <li><strong>Workers&apos; compensation:</strong> Employers take out WorkCover insurance for their employees. True independent contractors must pay for their own income protection insurance (typically <strong>$800 to $2,500 per year</strong>) and public liability insurance (typically <strong>$400 to $1,500 per year</strong>).</li>
              </ul>
              <p>
                Lost paid leave alone is worth <strong>{formatAUD(EX_LEAVE)} a year</strong> on a $100,000 employee salary, before you pay for insurance. In the worked example above, a contractor needs about <strong>{EX_MATCH_PCT}</strong> more than the employee salary ({formatAUD(EX_MATCH)}) to match the full package.
              </p>
            </section>

                    {/* H2: Related Calculators */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Australian Tax Calculators</h2>
            <p className="mb-4 text-warmgray">
              Each calculator below models a single part of the contractor vs employee comparison in more detail: employee take-home pay, super, salary sacrifice, contractor pay, or your tax return.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/take-home-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Take-Home Pay Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Calculate your exact after-tax income as an employee with all deductions applied.</p>
              </Link>
              <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Superannuation Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Model employer SG contributions vs voluntary personal super payments and retirement projections.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Salary Sacrifice Calculator</h3>
                <p className="text-warmgray text-xs mt-1">See how pre-tax salary sacrifice reduces your taxable income and boosts your super balance.</p>
              </Link>
              <Link href="/contractor-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Contractor Pay Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Calculate your contractor take-home pay including GST, expenses, and self-funded super.</p>
              </Link>
              <Link href="/tax-return-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Tax Return Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Estimate your FY2025-26 tax refund or liability before lodging with the ATO.</p>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Calculations for the comparison are based on the following rules:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Employee:</strong> Tax is calculated on Gross. Super ({SG_PCT}) is added on top. Net = Gross − Tax − Medicare. Total value = Gross + Super.</li>
              <li><strong>Contractor:</strong> Taxable Income = Gross − Business Expenses − Self-Funded Super. Tax is calculated on this reduced Taxable Income, which shows the value of the deductions. Net Cash = Gross − Expenses − Super − Tax − Medicare. Total value = Net Cash + Super.</li>
            </ol>
          </MethodologyDisclosure>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={CONTRACTOR_VS_EMPLOYEE_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
          </section>

          <section className="bg-eucalyptus-light/30 rounded-2xl p-8 text-center mt-12">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Want the employee breakdown?</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">See exactly how your employee take-home pay is affected by tax, the Medicare levy, super, and HECS.</p>
            <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Go to Take-Home Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}
