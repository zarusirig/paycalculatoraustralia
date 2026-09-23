import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { GIG_ECONOMY_FAQS } from "./gig-economy-pay-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";

// Tax + Medicare on net gig income from the FY2026-27 engine (resident, LITO
// and Medicare low-income shading applied, no HECS/MLS). The old hardcoded
// table used the 16% rate with no LITO, overstating tax at $30,000 by ~$1,200.
const GIG_ROWS = [30_000, 50_000, 75_000, 100_000].map((income) => {
  const tax = calculatePayBreakdown({ grossSalary: income }).totalDeductions;
  return { income, tax, pct: tax / income };
});
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Gig economy and tax", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare", publisher: SOURCES.ato.name },
  { title: "Apply for an ABN", url: "https://www.abr.gov.au/business-super-funds-charities/applying-abn", publisher: SOURCES.ato.name },
  { title: "Business Activity Statements", url: "https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/business-activity-statements-bas", publisher: SOURCES.ato.name },
  { title: "Employee or contractor", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/employee-or-independent-contractor", publisher: SOURCES.ato.name },
];

export default function GigEconomyPayGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Gig Economy Pay Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Gig Economy Pay Guide — Tax &amp; Pay for Uber, Delivery &amp; Freelance Workers</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Working for Uber, Deliveroo, DoorDash, or freelancing? You are running a business, and the tax rules are different from employment. This guide covers ABN registration, GST obligations, quarterly BAS, deductions, and super — everything gig workers need to manage their tax.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: Employee or Contractor? ───── */}
            <section id="employee-or-contractor">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employee or Contractor?</h2>
              <p>
                The distinction between employee and independent contractor determines your entire tax structure. Most gig platform workers — Uber drivers, Deliveroo riders, Airtasker providers, freelancers — are classified as <strong>independent contractors</strong>, not employees. This means:
              </p>
              <ul>
                <li><strong>No PAYG tax withholding</strong> — you receive gross income with no tax deducted. You are responsible for setting aside money for tax.</li>
                <li><strong>No employer super contributions</strong> — you must arrange your own superannuation (or go without).</li>
                <li><strong>No paid leave</strong> — no annual leave, sick leave, or public holiday pay.</li>
                <li><strong>You can claim business deductions</strong> — expenses related to earning your gig income are deductible against that income.</li>
                <li><strong>You need an ABN</strong> — an Australian Business Number is required to operate as a sole trader.</li>
              </ul>
              <p>
                The ATO uses a multi-factor test to determine your classification. If you are unsure, see our detailed <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Guide</Link> or use our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> to compare the financial impact.
              </p>
            </section>

            {/* ───── SECTION 2: Setting Up ───── */}
            <section id="setting-up">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Setting Up as a Gig Worker</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Getting an ABN</h3>
              <p>
                Apply for an ABN for free at <a href="https://www.abr.gov.au" target="_blank" rel="noopener noreferrer">abr.gov.au</a>. Processing is usually immediate for straightforward applications. You need your TFN, personal details, and a description of your business activity. Your ABN is used on invoices, tax returns, and when registering for GST. Without an ABN, payers must withhold <strong>47%</strong> from your payments.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>GST Registration</h3>
              <p>
                GST registration is <strong>mandatory for all rideshare (taxi/ride-booking) drivers</strong> regardless of income. This is a special rule — Uber, DiDi, Ola, and other rideshare drivers must register for GST from their very first trip. For all other gig workers (delivery riders, freelancers, Airtasker providers), GST registration is required once your <strong>annual turnover reaches $75,000</strong>.
              </p>
              <p>
                When registered for GST, you charge GST (10%) on your services and remit it to the ATO via quarterly BAS (Business Activity Statements). You can claim GST credits on business expenses.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Setting Aside for Tax</h3>
              <p>
                As a gig worker, no one withholds tax from your income. A common approach is to set aside <strong>25-30% of gross income</strong> into a separate bank account for tax. This covers income tax, Medicare levy, and GST (if registered). The exact percentage depends on your total annual income:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Annual Gig Income</th><th className="px-5 py-3 text-right">Approx. Tax + Medicare</th><th className="px-5 py-3 text-right">Set Aside %</th><th className="px-5 py-3 text-right">Set Aside per $1,000</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">$18,200 or less</td><td className="px-5 py-3 text-right">$0</td><td className="px-5 py-3 text-right">0%</td><td className="px-5 py-3 text-right">$0</td></tr>
                      {GIG_ROWS.map((r) => (
                        <tr key={r.income}><td className="px-5 py-3">{formatAUD(r.income)}</td><td className="px-5 py-3 text-right">{formatAUD(r.tax)}</td><td className="px-5 py-3 text-right">~{Math.round(r.pct * 100)}%</td><td className="px-5 py-3 text-right">{formatAUD(r.pct * 1000)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Calculate Your Tax as a Gig Worker</h3>
                    <p className="text-navy text-sm mb-3">Enter your expected gig income to see your tax bill, Medicare levy, and take-home amount.</p>
                    <Link href="/income-tax-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Income Tax Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 3: How Tax Works ───── */}
            <section id="how-tax-works">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Tax Works for Gig Workers</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>No Automatic Withholding</h3>
              <p>
                Unlike employees, gig platforms do not withhold tax from your payments. You receive the full gross amount (minus platform fees). This means your bank account looks healthier during the year, but you owe a lump sum at tax time if you have not set money aside.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Quarterly BAS (Business Activity Statements)</h3>
              <p>
                If you are registered for GST, you must lodge a <strong>quarterly BAS</strong> reporting your GST collected and GST credits claimed. BAS is due on the 28th of the month following each quarter: 28 October, 28 February, 28 April, and 28 July. Late lodgment attracts penalties.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>PAYG Instalments</h3>
              <p>
                Once the ATO receives your first tax return showing business income, they may enrol you in <strong>PAYG instalments</strong>. This requires you to make quarterly pre-payments of estimated income tax, smoothing out your tax bill throughout the year instead of one large payment at tax time. PAYG instalments are reported on your BAS.
              </p>
            </section>

            {/* ───── SECTION 4: Deductions by Platform ───── */}
            <section id="deductions-by-platform">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Deductions by Gig Type</h2>
              <p>
                As a sole trader, you can deduct expenses that are <strong>directly related to earning your gig income</strong>. The deductions available vary significantly by the type of gig work you do.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Rideshare Drivers (Uber, DiDi, Ola)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction</th><th className="px-5 py-3">Details</th><th className="px-5 py-3 text-right">Typical Annual Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Car expenses (logbook method)</td><td className="px-5 py-3">Fuel, servicing, registration, insurance, depreciation — business % only</td><td className="px-5 py-3 text-right">$5,000 – $15,000</td></tr>
                      <tr><td className="px-5 py-3">Phone and data</td><td className="px-5 py-3">Business-use % of phone plan for navigation and ride apps</td><td className="px-5 py-3 text-right">$300 – $800</td></tr>
                      <tr><td className="px-5 py-3">Platform fees</td><td className="px-5 py-3">Commission and service fees charged by the platform</td><td className="px-5 py-3 text-right">Already deducted from income</td></tr>
                      <tr><td className="px-5 py-3">Phone mount, charger, dashcam</td><td className="px-5 py-3">Accessories used for rideshare work</td><td className="px-5 py-3 text-right">$50 – $300</td></tr>
                      <tr><td className="px-5 py-3">Cleaning supplies</td><td className="px-5 py-3">Car interior cleaning products, car washes</td><td className="px-5 py-3 text-right">$200 – $500</td></tr>
                      <tr><td className="px-5 py-3">Tolls and parking</td><td className="px-5 py-3">Tolls incurred during rideshare trips (not personal)</td><td className="px-5 py-3 text-right">$500 – $2,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Delivery Riders (Deliveroo, DoorDash, Uber Eats)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction</th><th className="px-5 py-3">Details</th><th className="px-5 py-3 text-right">Typical Annual Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Vehicle expenses</td><td className="px-5 py-3">Car: logbook method. Bicycle/e-bike: repairs, maintenance, depreciation</td><td className="px-5 py-3 text-right">$500 – $5,000</td></tr>
                      <tr><td className="px-5 py-3">Delivery bag/thermal bag</td><td className="px-5 py-3">Insulated bags for food delivery</td><td className="px-5 py-3 text-right">$50 – $150</td></tr>
                      <tr><td className="px-5 py-3">Phone and data</td><td className="px-5 py-3">Business-use % for delivery apps and navigation</td><td className="px-5 py-3 text-right">$200 – $600</td></tr>
                      <tr><td className="px-5 py-3">Protective gear</td><td className="px-5 py-3">Helmet, gloves, high-vis vest, rain gear</td><td className="px-5 py-3 text-right">$100 – $400</td></tr>
                      <tr><td className="px-5 py-3">Phone mount and accessories</td><td className="px-5 py-3">Bike/car mount, portable charger</td><td className="px-5 py-3 text-right">$30 – $100</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Freelancers (Web Design, Writing, Consulting)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Deduction</th><th className="px-5 py-3">Details</th><th className="px-5 py-3 text-right">Typical Annual Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Home office (actual cost)</td><td className="px-5 py-3">Electricity, internet, phone — business-use % of actual bills</td><td className="px-5 py-3 text-right">$1,000 – $3,000</td></tr>
                      <tr><td className="px-5 py-3">Computer equipment</td><td className="px-5 py-3">Laptop, monitor, keyboard, mouse — depreciate if over $300</td><td className="px-5 py-3 text-right">$500 – $2,000</td></tr>
                      <tr><td className="px-5 py-3">Software subscriptions</td><td className="px-5 py-3">Adobe, Figma, accounting software, project management tools</td><td className="px-5 py-3 text-right">$500 – $2,000</td></tr>
                      <tr><td className="px-5 py-3">Professional development</td><td className="px-5 py-3">Courses, books, conferences related to your freelance work</td><td className="px-5 py-3 text-right">$200 – $2,000</td></tr>
                      <tr><td className="px-5 py-3">Marketing and website</td><td className="px-5 py-3">Domain, hosting, advertising, business cards</td><td className="px-5 py-3 text-right">$200 – $1,000</td></tr>
                      <tr><td className="px-5 py-3">Professional indemnity insurance</td><td className="px-5 py-3">Insurance covering your professional services</td><td className="px-5 py-3 text-right">$300 – $1,500</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ───── SECTION 5: Super as Gig Worker ───── */}
            <section id="super-gig-worker">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Superannuation as a Gig Worker</h2>
              <p>
                As an independent contractor, <strong>no one pays super for you</strong>. This is one of the biggest financial differences between employment and gig work. There is no compulsory SG contribution from the platform.
              </p>
              <p>
                You can (and should) make voluntary super contributions. <strong>Personal concessional contributions</strong> are tax-deductible — you claim the deduction in your tax return by submitting a &quot;Notice of Intent to Claim&quot; to your super fund. Contributions are taxed at <strong>15%</strong> in the fund, compared to your marginal rate (which could be 30-45%). The annual concessional contributions cap is <strong>$30,000</strong>.
              </p>
              <p>
                For example, a gig worker earning $80,000 in the 30% bracket who contributes $10,000 to super saves <strong>$1,500 in tax</strong> (30% marginal rate minus 15% super tax = 15% x $10,000). See our <Link href="/superannuation-guide/">Superannuation Guide</Link> for detailed contribution strategies.
              </p>
            </section>

            {/* ───── SECTION 6: Gig + Employment Combined ───── */}
            <section id="gig-plus-employment">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Gig Work Plus Employment</h2>
              <p>
                Many gig workers also hold a regular job. If you earn employment income <strong>and</strong> gig income, both are combined for tax purposes. Your total assessable income determines your marginal tax rate. Key considerations:
              </p>
              <ul>
                <li><strong>Your employer withholds tax based on your employment income only.</strong> They do not know about your gig income. This means your withholding may be insufficient, leading to a tax debt at year end.</li>
                <li><strong>Request additional withholding</strong> by lodging a <strong>PAYG withholding variation</strong> with the ATO, or voluntarily increase your withholding amount with your employer.</li>
                <li><strong>Business deductions from gig work</strong> can only be offset against your gig income (or total income if you are a sole trader reporting in your individual tax return). You cannot salary sacrifice your gig income.</li>
                <li><strong>GST obligations</strong> are based on your gig/business turnover only — your employment income is not included in the $75,000 GST threshold calculation.</li>
              </ul>
              <p>
                Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> with your combined income to estimate total tax liability, then compare against the PAYG already withheld by your employer to see if you need to set extra aside. For a deeper look at structuring, see <Link href="/employee-vs-sole-trader-vs-company/">Employee vs Sole Trader vs Company</Link>.
              </p>
            </section>

            {/* ───── SECTION 7: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={GIG_ECONOMY_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Gig economy tax information is sourced from the Australian Taxation Office (ATO). Tax calculations use FY{SITE_CONFIG.financialYear} resident tax brackets, with LITO and the Medicare levy low-income shading applied. Deduction ranges are estimates based on typical gig worker claims. GST rules for rideshare services are per ATO Taxation Determination. Individual circumstances vary — consult a registered tax agent for personalised advice.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("gig-economy-pay-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee Guide" /><SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee Calculator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/employee-vs-sole-trader-vs-company/" label="Employee vs Sole Trader vs Company" /><SidebarLink href="/tax-deductions-guide/" label="Tax Deductions Guide" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">What&apos;s your gig tax bill?</h3><p className="text-sky-100 text-sm mb-4">Enter your expected gig income to calculate tax, Medicare, and how much to set aside.</p><Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Income Tax Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }
