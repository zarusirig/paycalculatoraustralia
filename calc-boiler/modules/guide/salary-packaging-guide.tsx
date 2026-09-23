"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { MEDICARE_LEVY, SITE_CONFIG, SOURCES, calculatePayBreakdown, formatAUD, formatPercent } from "@/lib/constants";
import {
  FBT,
  FBT_CAPS,
  FBT_CAPS_SOURCES,
  NOVATED_LEASE_SOURCES,
  capFaceValue,
  reportableFringeBenefitsAmount,
  salaryPackagingBenefit,
} from "@/lib/constants/novated-lease";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Fringe benefits tax — rates and thresholds (Table 5: capping thresholds)", url: FBT_CAPS_SOURCES.ratesAndThresholds, publisher: SOURCES.ato.name },
  { title: "Fringe benefits tax — a guide for employers, ch 6.3–6.5 (capping, salary packaged entertainment)", url: FBT_CAPS_SOURCES.fbtGuideChapter6, publisher: SOURCES.ato.name },
  { title: "Salary sacrificing for employees", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/salary-sacrificing-for-employees", publisher: SOURCES.ato.name },
  { title: "Reportable fringe benefits for employees", url: NOVATED_LEASE_SOURCES.reportableFringeBenefits, publisher: SOURCES.ato.name },
  { title: "Family Assistance Guide 3.2.3 — adjusted fringe benefits total", url: "https://guides.dss.gov.au/family-assistance-guide/3/2/3", publisher: "Department of Social Services" },
];

// Every cap is a GROSSED-UP value (ATO FBT rates and thresholds, Table 5).
// Face values are what the cap buys in GST-free expenses such as rent or
// mortgage repayments, i.e. the cap divided by the type 2 gross-up rate.
const PBI_CAP = FBT_CAPS.pbiAndHealthPromotionCharity; // $30,000
const HOSPITAL_CAP = FBT_CAPS.hospitalAndAmbulance; // $17,000
const ENT_CAP = FBT_CAPS.salaryPackagedEntertainment; // $5,000
const PBI_FACE = capFaceValue(PBI_CAP); // about $15,900
const HOSPITAL_FACE = capFaceValue(HOSPITAL_CAP); // about $9,010
const ENT_FACE_TYPE2 = capFaceValue(ENT_CAP); // about $2,650
const ENT_FACE_TYPE1 = capFaceValue(ENT_CAP, FBT.grossUpType1); // about $2,404
const PBI_RFBA = reportableFringeBenefitsAmount(PBI_FACE);
const HOSPITAL_RFBA = reportableFringeBenefitsAmount(HOSPITAL_FACE);
/** Centrelink counts RFBA from s57A employers at (1 − FBT rate) for FTB, CCS and PLP. */
const CENTRELINK_FACTOR = 1 - FBT.rate;
const MLS_SINGLE_THRESHOLD = MEDICARE_LEVY.surcharge.tier1.min - 1;

// Worked example, on the current income year's tax engine.
const EXAMPLE_SALARY = 80_000;
const HIGHER_SALARY = 150_000;
function example(packaged: number) {
  const b = calculatePayBreakdown({ grossSalary: EXAMPLE_SALARY, salarySacrifice: packaged });
  return { packaged, taxable: b.taxableIncome, tax: b.totalDeductions, cash: b.takeHomePay, total: b.takeHomePay + packaged };
}
const EX_NONE = example(0);
const EX_PBI = example(PBI_FACE);
const EX_HOSPITAL = example(HOSPITAL_FACE);
const PBI_BENEFIT = salaryPackagingBenefit(EXAMPLE_SALARY, PBI_FACE);
const HOSPITAL_BENEFIT = salaryPackagingBenefit(EXAMPLE_SALARY, HOSPITAL_FACE);
const PBI_BENEFIT_HIGH = salaryPackagingBenefit(HIGHER_SALARY, PBI_FACE);
const HOSPITAL_BENEFIT_HIGH = salaryPackagingBenefit(HIGHER_SALARY, HOSPITAL_FACE);
const EXAMPLE_ROWS: { label: string; pick: (e: ReturnType<typeof example>) => number; bold?: boolean }[] = [
  { label: "Gross salary", pick: () => EXAMPLE_SALARY },
  { label: "Packaged living expenses (pre-tax)", pick: (e) => e.packaged },
  { label: "Taxable income", pick: (e) => e.taxable },
  { label: "Income tax and Medicare levy", pick: (e) => e.tax },
  { label: "Cash in hand (taxable income − tax)", pick: (e) => e.cash },
  { label: "Total to spend (cash + packaged expenses)", pick: (e) => e.total, bold: true },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function SalaryPackagingGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Salary Packaging Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Packaging Guide — Benefits Beyond Novated Leases
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Salary packaging extends far beyond novated car leases. Not-for-profit employees, public hospital staff, and charities workers can access FBT-exempt benefits worth thousands each year — from meal entertainment to portable devices and self-education expenses.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is">
              <h2>What Is Salary Packaging?</h2>
              <p>
                Salary packaging is an arrangement where your employer pays for certain expenses or benefits from your <strong>pre-tax salary</strong>, reducing your taxable income. While the terms &quot;salary packaging&quot; and &quot;salary sacrifice&quot; are often used interchangeably, salary packaging is the broader concept — it covers all pre-tax benefits including living expenses, meal entertainment, novated leases, portable devices, and superannuation contributions.
              </p>
              <p>
                Salary sacrifice specifically refers to redirecting pre-tax salary into superannuation. Salary packaging encompasses the full range of benefits an employer can provide from pre-tax earnings. The distinction matters because different benefits have different FBT treatment, caps, and eligibility rules.
              </p>
              <p>
                In the private sector, salary packaging options are generally limited to superannuation, novated leases, and portable electronic devices. The real power of salary packaging emerges in the <strong>not-for-profit (NFP)</strong> and <strong>public hospital</strong> sectors, where special FBT exemptions allow employees to package everyday living expenses tax-free.
              </p>
            </section>

            <section id="who-can-access">
              <h2>Who Can Access Salary Packaging?</h2>
              <p>
                All employees can access some form of salary packaging, but the range and value of benefits varies dramatically by employer type. The ATO classifies employers into categories that determine FBT exemptions:
              </p>
              <ul>
                <li><strong>Public benevolent institutions (PBIs) and health promotion charities</strong> — Registered charities such as community services and disability organisations, endorsed by the ATO. FBT-exempt cap: <strong>{formatAUD(PBI_CAP)} grossed-up</strong> per employee per FBT year, which covers about <strong>{formatAUD(PBI_FACE)}</strong> of rent, mortgage or other GST-free expenses</li>
                <li><strong>Public and not-for-profit hospitals and public ambulance services</strong> — FBT-exempt cap: <strong>{formatAUD(HOSPITAL_CAP)} grossed-up</strong>, which covers about <strong>{formatAUD(HOSPITAL_FACE)}</strong> of GST-free expenses. An organisation that is both a PBI and a hospital uses the hospital cap</li>
                <li><strong>Rebatable employers</strong> — Certain registered charities and other non-government not-for-profit organisations. They get a {formatPercent(FBT.rate, 0)} FBT <em>rebate</em>, not an exemption, on up to {formatAUD(FBT_CAPS.rebatableEmployer)} grossed-up per employee, so FBT is reduced rather than removed</li>
                <li><strong>Private sector employers</strong> — Salary packaging limited to super, novated leases (with FBT unless EV), and portable devices</li>
              </ul>
              <p>
                Exempt and rebatable employers can also offer a separate <strong>{formatAUD(ENT_CAP)} grossed-up cap</strong> for salary-packaged meal entertainment and entertainment facility leasing expenses, on top of the general cap.
              </p>
              <p>
                Every one of these caps is a <strong>grossed-up</strong> value, not the amount of expenses you can package. For GST-free expenses such as rent and mortgage repayments, the grossed-up value is the amount packaged multiplied by the type 2 gross-up rate of <strong>{FBT.grossUpType2}</strong>, which is why a {formatAUD(PBI_CAP)} cap buys about {formatAUD(PBI_FACE)} and a {formatAUD(HOSPITAL_CAP)} cap about {formatAUD(HOSPITAL_FACE)}. Where your employer can claim GST credits on a benefit, the higher type 1 rate of {FBT.grossUpType1} applies and the cap covers less. The caps are per employee per FBT year and are <strong>not</strong> reduced if you only work part of the year.
              </p>
            </section>

            <section id="fbt-exempt-benefits">
              <h2>FBT-Exempt Benefits</h2>
              <p>
                The following salary packaging benefits are exempt from Fringe Benefits Tax, making them the most tax-effective options available:
              </p>

              <h3>NFP Living Expenses (about {formatAUD(PBI_FACE)} or {formatAUD(HOSPITAL_FACE)})</h3>
              <p>
                Employees of PBIs and health promotion charities can salary package about {formatAUD(PBI_FACE)} of everyday living expenses per FBT year ({FBT.yearStart} to {FBT.yearEnd}) free of FBT. Employees of public and not-for-profit hospitals and public ambulance services can package about {formatAUD(HOSPITAL_FACE)}. Commonly packaged expenses include:
              </p>
              <ul>
                <li>Rent or mortgage repayments</li>
                <li>Grocery and household bills</li>
                <li>Personal loan repayments</li>
                <li>Credit card payments</li>
                <li>School fees and childcare costs</li>
                <li>Health insurance premiums</li>
              </ul>
              <p>
                On a {formatAUD(EXAMPLE_SALARY)} salary at FY{SITE_CONFIG.financialYear} rates, packaging the full PBI amount leaves you about <strong>{formatAUD(PBI_BENEFIT)} a year</strong> better off, and the full hospital amount about <strong>{formatAUD(HOSPITAL_BENEFIT)}</strong>. On {formatAUD(HIGHER_SALARY)} (a 37% marginal rate before packaging) the figures rise to about {formatAUD(PBI_BENEFIT_HIGH)} and {formatAUD(HOSPITAL_BENEFIT_HIGH)}. These are before any fee your packaging provider charges.
              </p>

              <h3>Meal Entertainment (separate {formatAUD(ENT_CAP)} grossed-up cap)</h3>
              <p>
                Employees of PBIs, health promotion charities, public and not-for-profit hospitals, public ambulance services and rebatable employers can also package meal entertainment and entertainment facility leasing expenses up to a separate <strong>{formatAUD(ENT_CAP)} grossed-up cap</strong> on top of the general cap. In face value that is about <strong>{formatAUD(ENT_FACE_TYPE2)}</strong> of meals where the employer does not claim GST credits (type 2 gross-up), or about <strong>{formatAUD(ENT_FACE_TYPE1)}</strong> where it does (type 1). The widely quoted &quot;{formatAUD(ENT_FACE_TYPE2)}&quot; is the first of these, not the cap itself. Qualifying expenses include:
              </p>
              <ul>
                <li>Restaurant and cafe meals, and food and drink provided as entertainment</li>
                <li>Catering for social events</li>
                <li>Accommodation or travel connected with that entertainment</li>
                <li>Hire of a venue or facility for entertainment (entertainment facility leasing)</li>
              </ul>
              <p>
                The meal entertainment benefit does <strong>not</strong> cover regular grocery shopping or work lunches eaten alone at your desk. The expense must have an entertainment or social component.
              </p>

              <h3>Portable Electronic Devices</h3>
              <p>
                All employees — regardless of employer type — can salary package <strong>one portable electronic device per category per FBT year</strong> when the device is used primarily for work. Eligible categories include:
              </p>
              <ul>
                <li>Laptop or notebook computer</li>
                <li>Tablet device</li>
                <li>Mobile phone</li>
                <li>GPS navigation device</li>
                <li>Portable printer</li>
              </ul>
              <p>
                A $2,000 laptop packaged at the 30% marginal rate saves <strong>$600</strong> in income tax. The device must be used primarily (more than 50%) for employment duties.
              </p>

              <h3>Self-Education Expenses</h3>
              <p>
                Employer-provided education that is sufficiently connected to the employee&apos;s current role is an exempt benefit. This includes course fees, textbooks, and related travel for work-related education. The education must maintain or improve skills required in the employee&apos;s <strong>current</strong> employment — courses for a completely new career direction do not qualify.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Model Your Salary Package</h3>
                  <p className="text-navy text-sm mb-3">See how salary sacrifice into super affects your take-home pay, tax, and long-term wealth at your exact salary level.</p>
                  <Link href="/salary-sacrifice-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Use our Salary Sacrifice Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="how-it-affects-pay">
              <h2>How Salary Packaging Affects Your Pay</h2>
              <p>
                The worked example below compares two employees earning <strong>{formatAUD(EXAMPLE_SALARY)}</strong> on FY{SITE_CONFIG.financialYear} tax rates: one at a PBI who packages the full <strong>{formatAUD(PBI_FACE)}</strong> of rent or mortgage covered by the {formatAUD(PBI_CAP)} grossed-up cap, and one at a public hospital who packages the full <strong>{formatAUD(HOSPITAL_FACE)}</strong> covered by the {formatAUD(HOSPITAL_CAP)} cap. Meal entertainment is left out.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Component</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Without packaging</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">PBI employee ({formatAUD(PBI_FACE)})</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Public hospital employee ({formatAUD(HOSPITAL_FACE)})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXAMPLE_ROWS.map((row, i) => (
                        <tr key={row.label} className={row.bold ? "bg-eucalyptus-light/30" : `border-b border-sandstone-dark/10${i % 2 ? " bg-sandstone/30" : ""}`}>
                          <td className={`p-3 text-navy ${row.bold ? "font-bold" : "font-medium"}`}>{row.label}</td>
                          {[EX_NONE, EX_PBI, EX_HOSPITAL].map((e, j) => (
                            <td key={j} className={`p-3 text-navy text-right${row.bold ? " font-bold" : ""}`}>{formatAUD(row.pick(e))}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The PBI employee ends up with <strong>{formatAUD(PBI_BENEFIT)}</strong> more to spend each year and the public hospital employee <strong>{formatAUD(HOSPITAL_BENEFIT)}</strong> more, because the packaged amount pays for expenses they would otherwise have paid from after-tax income. The PBI saving is larger because its cap is larger, not because the tax treatment differs. Both figures are before packaging provider fees, and the PBI figure includes the small low income tax offset that applies once taxable income falls to {formatAUD(EX_PBI.taxable)}.
              </p>
            </section>

            <section id="rfba-reporting">
              <h2>RFBA Reporting — How It Affects Other Obligations</h2>
              <p>
                When you salary package benefits (other than super), your employer reports the grossed-up taxable value as a <strong>Reportable Fringe Benefits Amount (RFBA)</strong> on your income statement. While RFBA does not increase your income tax, it is added back for the following means-tested calculations:
              </p>
              <ul>
                <li><strong>Centrelink income tests</strong> — Services Australia adds RFBA to your adjusted taxable income (ATI) for Family Tax Benefit, Child Care Subsidy and Parental Leave Pay. RFBA from a PBI, health promotion charity, public or not-for-profit hospital or public ambulance service is counted at {formatPercent(CENTRELINK_FACTOR, 0)} (1 minus the FBT rate), which strips out the gross-up. See our <Link href="/centrelink-income-test/">Centrelink Income Test Guide</Link></li>
                <li><strong>HECS-HELP repayments</strong> — The ATO includes the full RFBA in repayment income, potentially pushing you above a repayment threshold</li>
                <li><strong>Medicare Levy Surcharge</strong> — RFBA is included in the income test for the MLS, which applies to singles with MLS income over {formatAUD(MLS_SINGLE_THRESHOLD)} in FY{SITE_CONFIG.financialYear} who don&apos;t hold private hospital cover</li>
                <li><strong>Child support assessments</strong> — The Child Support Agency includes RFBA in adjusted taxable income</li>
              </ul>
              <p>
                The RFBA is always grossed up at the type 2 rate ({FBT.grossUpType2}), so it is close to the cap, not to what you spent. A PBI employee who packages {formatAUD(PBI_FACE)} of rent has an RFBA of about <strong>{formatAUD(PBI_RFBA)}</strong>; a public hospital employee who packages {formatAUD(HOSPITAL_FACE)} has an RFBA of about <strong>{formatAUD(HOSPITAL_RFBA)}</strong>. This amount appears on your income statement but does <strong>not</strong> increase the tax you owe — it only affects the income tests listed above.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> — Model the tax impact of sacrificing into super</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> — Deep dive into salary sacrifice into superannuation</li>
                <li><Link href="/novated-lease-guide/">Novated Lease Guide</Link> — Compare EV and ICE novated lease structures</li>
                <li><Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link> — Full FBT rates, exemptions, and employer obligations</li>
                <li><Link href="/centrelink-income-test/">Centrelink Income Test</Link> — How adjusted taxable income affects government payments</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="difference" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between salary packaging and salary sacrifice?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary packaging is the broad term for any arrangement where your employer provides benefits from your pre-tax salary — including living expenses, meal entertainment, novated leases, and devices. Salary sacrifice specifically refers to redirecting pre-tax salary into superannuation. All salary sacrifice is salary packaging, but not all salary packaging is salary sacrifice.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="eligibility" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Who can package living expenses free of FBT, and how much?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Employees of public benevolent institutions (PBIs) and health promotion charities have a {formatAUD(PBI_CAP)} grossed-up cap per FBT year, about {formatAUD(PBI_FACE)} of rent, mortgage or other GST-free expenses. Employees of public and not-for-profit hospitals and public ambulance services have a {formatAUD(HOSPITAL_CAP)} grossed-up cap, about {formatAUD(HOSPITAL_FACE)}. Both can add a separate {formatAUD(ENT_CAP)} grossed-up cap for salary-packaged meal entertainment. Rebatable employers get a partial FBT rebate rather than an exemption. Private sector employees cannot access these caps — their packaging options are limited to super, novated leases, and portable devices.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="meal-ent" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What counts as meal entertainment?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Meal entertainment includes restaurant and cafe dining, takeaway food and drink, catering for social functions, and food consumed at entertainment venues. It does <strong>not</strong> include regular grocery shopping, meals eaten at your desk, or sustenance food purchased during work travel. The expense must have a social or entertainment element.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="centrelink" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary packaging affect my Centrelink payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    It can. Services Australia adds your reportable fringe benefits amount (RFBA) to adjusted taxable income for Family Tax Benefit, Child Care Subsidy and Parental Leave Pay. For RFBA from a PBI, health promotion charity, public or not-for-profit hospital or public ambulance service, Centrelink counts only {formatPercent(CENTRELINK_FACTOR, 0)} of it (1 minus the {formatPercent(FBT.rate, 0)} FBT rate). A PBI employee&apos;s RFBA of about {formatAUD(PBI_RFBA)} is therefore counted as about {formatAUD(Math.round(PBI_RFBA * CENTRELINK_FACTOR))} — roughly the amount packaged — so income for these tests ends up close to what it would have been without packaging.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary packaging reduce my HECS-HELP repayments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No — it usually increases them. HECS-HELP repayments are based on repayment income, which is taxable income plus the full grossed-up RFBA plus other reportable items. Packaging {formatAUD(PBI_FACE)} at a PBI lowers taxable income by {formatAUD(PBI_FACE)} but adds an RFBA of about {formatAUD(PBI_RFBA)}, so repayment income rises by about {formatAUD(PBI_RFBA - PBI_FACE)}. At a public hospital the rise is about {formatAUD(HOSPITAL_RFBA - HOSPITAL_FACE)}.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="devices" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can private sector employees salary package a laptop?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Portable electronic devices used primarily for work are FBT-exempt regardless of employer type. You can package one laptop, one tablet, one mobile phone, and one GPS device per FBT year (1 April to 31 March). The device must be used more than 50% for employment duties. A $2,500 laptop at the 30% tax bracket saves $750 in income tax.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fbt-year" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When does the FBT year run?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The FBT year runs from <strong>{FBT.yearStart} to {FBT.yearEnd}</strong>, which is different from the financial year (1 July to 30 June). The current FBT year is {FBT.yearLabel}. The {formatAUD(PBI_CAP)}, {formatAUD(HOSPITAL_CAP)} and {formatAUD(ENT_CAP)} grossed-up caps reset on 1 April each year. They are not pro-rated: the ATO applies the full cap even if you only work for the employer for part of the FBT year.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>FBT capping thresholds are from the ATO&apos;s &quot;Fringe benefits tax — rates and thresholds&quot; (Table 5, unchanged for the FBT years ending 31 March 2023 to 31 March 2027) and chapter 6 of the ATO&apos;s FBT guide for employers, checked {FBT_CAPS_SOURCES.verifiedOn}. The caps are grossed-up values; face-value figures divide them by the type 2 gross-up rate ({FBT.grossUpType2}), or the type 1 rate ({FBT.grossUpType1}) where stated. The worked example uses FY{SITE_CONFIG.financialYear} resident tax rates, the low income tax offset and the 2% Medicare levy from the site&apos;s shared tax engine, and ignores packaging provider fees. NFP packaging caps are per FBT year (1 April to 31 March), not per financial year.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-packaging-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/fringe-benefits-tax/" label="Fringe Benefits Tax Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Guide" />
                    <SidebarLink href="/novated-lease-guide/" label="Novated Lease Guide" />
                    <SidebarLink href="/centrelink-income-test/" label="Centrelink Income Test" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your package</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Model different salary sacrifice amounts and see the exact impact on your take-home pay and tax savings.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open Calculator
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
