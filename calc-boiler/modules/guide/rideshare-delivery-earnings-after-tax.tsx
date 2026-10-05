import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { MEDICARE_LEVY, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { CENTS_PER_KM_RATES, CPK_KM_CAP, CURRENT_CPK_YEAR } from "@/lib/constants/cents-per-km";
import {
  GIG_TAX_SOURCES,
  GIG_TAX_VERIFIED_ON,
  GST_REGISTRATION_THRESHOLD,
  RIDE_SOURCING_TAX_INVOICE_THRESHOLD,
  gigTax,
} from "@/lib/constants/gig-tax";
import GigTaxCalculator from "@/modules/calculator/gig-tax-calculator";
import { RIDESHARE_AFTER_TAX_FAQS } from "./rideshare-delivery-earnings-after-tax-faqs";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";

// /rideshare-delivery-earnings-after-tax/ (Oct 2026 trending set, item 15).
// Passes the border only as a contractor-tax and GST calculator: it never says
// what drivers earn. Worked examples use made-up figures and say so.

const SOURCES_LIST: SourceLink[] = [
  { title: "Ride-sourcing (tax obligations)", url: GIG_TAX_SOURCES.rideSourcing, publisher: "Australian Taxation Office" },
  { title: "Registering for GST", url: GIG_TAX_SOURCES.registeringGst, publisher: "Australian Taxation Office" },
  { title: "Sharing economy: providing services", url: GIG_TAX_SOURCES.providingServices, publisher: "Australian Taxation Office" },
  { title: "Sharing economy: preparing for a potential tax bill", url: GIG_TAX_SOURCES.taxBill, publisher: "Australian Taxation Office" },
  { title: "Sharing economy and tax", url: GIG_TAX_SOURCES.sharingEconomy, publisher: "Australian Taxation Office" },
  { title: "Cents per kilometre method", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/motor-vehicle-and-car-expenses/expenses-for-a-car-you-own-or-lease/cents-per-kilometre-method", publisher: "Australian Taxation Office" },
];

const CPK = CENTS_PER_KM_RATES[CURRENT_CPK_YEAR];
const KM_CAP = CPK_KM_CAP.toLocaleString("en-AU");

// Made-up illustration 1: GST-registered rideshare driver.
const A = gigTax({ grossPayments: 60_000, expenses: 18_000, expensesIncludeGst: true, gstRegistered: true });
// Made-up illustration 2: unregistered delivery rider with a second job.
const B = gigTax({ grossPayments: 20_000, expenses: 6_000, expensesIncludeGst: false, gstRegistered: false, otherIncome: 50_000 });

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default function RideshareDeliveryAfterTaxPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/gig-economy-pay-guide/", label: "Gig Economy" }, { label: "Rideshare & Delivery Earnings After Tax" }]} />

      <PageHeader title="Rideshare & Delivery Earnings After Tax in Australia">
        <p>
          <strong>Uber, DoorDash and other gig payments arrive with no tax taken out, so what you keep depends on your profit, your GST status and what you set aside.</strong> Rideshare drivers must register for GST from the first trip; delivery workers only at {formatAUD(GST_REGISTRATION_THRESHOLD, 0)} GST turnover. Income tax is on profit at the normal resident rates plus the Medicare levy. Enter your own numbers below. This page does not say what drivers earn.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Rideshare GST", v: "From trip 1", s: "ABN and GST, whatever you earn" },
          { k: "Delivery GST", v: formatAUD(GST_REGISTRATION_THRESHOLD, 0), s: "GST turnover threshold" },
          { k: "Tax invoice", v: `Over ${formatAUD(RIDE_SOURCING_TAX_INVOICE_THRESHOLD, 2)}`, s: "Rideshare fares, if the passenger asks" },
          { k: "Car cents per km", v: `${Math.round(CPK * 100)}c`, s: `${CURRENT_CPK_YEAR}, up to ${KM_CAP} km` },
        ]}
      />

      <div className="mb-12"><GigTaxCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-it-works">How Gig Income Is Taxed</H2>
            <p>
              The ATO treats everything you receive for rideshare or delivery work as assessable income, whether you are an employee, a contractor or in business, and even for a one-off payment. As a contractor you are paid in full: no PAYG tax is withheld, no super is added, and you get no paid leave. The tax shows up when you lodge your return, which is why the ATO says you might end up with a tax bill.
            </p>
            <p>
              The tax is worked out on your <strong>profit</strong>: income less the expenses you can claim for the work. The resident rates for 2026-27 apply to your total taxable income, including any wages from another job:
            </p>
            <DataTable
              head={["Taxable income", "Tax on that slice"]}
              align={["l", "r"]}
              rows={TAX_BRACKETS.map((b) => [
                b.max === Infinity ? `Over ${formatAUD(b.min - 1, 0)}` : `${formatAUD(b.min === 0 ? 0 : b.min - 1, 0)} to ${formatAUD(b.max, 0)}`,
                b.rate === 0 ? "Nil" : pct(b.rate),
              ])}
              caption={<>2026-27 resident rates, from the ATO. The {pct(MEDICARE_LEVY.rate)} Medicare levy is on top, with a low income offset (LITO) of up to $700 that can cancel tax at lower incomes. See <Link href="/tax-brackets/">tax brackets</Link> and <Link href="/low-income-tax-offset/">LITO</Link>.</>}
            />
          </section>

          <section>
            <H2 id="abn-gst">ABN and GST: Rideshare vs Delivery</H2>
            <DataTable
              head={["", "Rideshare (passengers)", "Delivery (food, groceries)"]}
              rows={[
                ["ABN", "Required from the first trip", "Usually needed to work as a contractor"],
                ["GST registration", "Required from the first trip, whatever you earn", `Required once GST turnover reaches ${formatAUD(GST_REGISTRATION_THRESHOLD, 0)}; optional below it`],
                ["GST on payments", "GST applies to every dollar you earn", "Only if registered"],
                ["BAS", "Monthly or quarterly once registered", "Only if registered"],
                ["Tax invoice", `For fares over ${formatAUD(RIDE_SOURCING_TAX_INVOICE_THRESHOLD, 2)} if a passenger asks`, "As the platform or customer requires"],
                ["Income tax", "On profit, in your tax return", "On profit, in your tax return"],
              ]}
              caption={<>ATO, <a href={GIG_TAX_SOURCES.rideSourcing} target="_blank" rel="noopener noreferrer">ride-sourcing</a> and <a href={GIG_TAX_SOURCES.registeringGst} target="_blank" rel="noopener noreferrer">registering for GST</a>, read {GIG_TAX_VERIFIED_ON}. GST turnover is your gross business income (not profit) less GST.</>}
            />
            <p>
              The rideshare rule is the unusual one. The ATO requires registration for taxi and limousine travel, including ride-sourcing, regardless of turnover, so a driver who clears a few thousand dollars a year still needs an ABN, GST registration and a BAS. Delivery isn&rsquo;t in that category, so the ordinary threshold applies. If you also have other business income, it counts toward the turnover. Once you pass the threshold you register within 21 days. Penalties and interest can apply if you don&rsquo;t register when required.
            </p>
          </section>

          <section>
            <H2 id="gst-working">How GST Works Out for a Registered Driver</H2>
            <p>
              Fares include GST, which is one-eleventh of the amount you receive. You hold it for the ATO, then deduct the GST in your business purchases (a credit), such as the GST in fuel, a service or part of your phone plan. Only the business-use part of a mixed-use cost counts. The GST you collected, less the credits, is paid with your BAS. For income tax, your income is the amount <em>excluding</em> GST and your expenses are the amount excluding the GST you reclaim, so the GST isn&rsquo;t double counted.
            </p>
          </section>

          <section>
            <H2 id="expenses">Expenses You Can Claim</H2>
            <p>
              Claim costs that relate to earning the income, apportioned for private use, and keep records (the ATO&rsquo;s free myDeductions tool in the ATO app is one way). For rideshare the ATO is specific: claim only deductions related to transporting passengers for a fare and apportion expenses to the time you are providing the service. Typical categories are fuel or charging, registration and insurance share, servicing and tyres, car cleaning, a phone and data share, platform fees if you report gross payments, and a tax agent&rsquo;s fee.
            </p>
            <p>
              For the car there are two methods. <strong>Cents per kilometre</strong> is {Math.round(CPK * 100)}c a km for {CURRENT_CPK_YEAR}, capped at {KM_CAP} business km a year, so the most you can claim that way is {formatAUD(CPK * CPK_KM_CAP, 0)}, without keeping receipts for the car running costs (you must still be able to show how you worked out the kilometres). The <strong>logbook method</strong> applies your business-use percentage, from a 12-week logbook, to the actual car costs, and has no kilometre cap. A driver covering many kilometres usually compares the two. See <Link href="/cents-per-km/">cents per km</Link> for the details.
            </p>
          </section>

          <section>
            <H2 id="worked-examples">Two Worked Examples (Made-Up Figures)</H2>
            <p>
              These are invented to show how the pieces fit together. They are not typical earnings and not a target. The calculator above will do the same sums on yours.
            </p>
            <DataTable
              head={["", "Example A: rideshare, GST-registered", "Example B: delivery, not registered, also has a job"]}
              align={["l", "r", "r"]}
              rows={[
                ["Payments for the year", formatAUD(60_000, 0), formatAUD(20_000, 0)],
                ["Expenses (A includes GST)", formatAUD(18_000, 0), formatAUD(6_000, 0)],
                ["GST collected less credits", formatAUD(A.gstPayable, 0), "n/a"],
                ["Profit counted for income tax", formatAUD(A.netBusinessIncome, 0), formatAUD(B.netBusinessIncome, 0)],
                ["Other taxable income", "None", formatAUD(50_000, 0)],
                ["Income tax on the profit", formatAUD(A.extraIncomeTax, 0), formatAUD(B.extraIncomeTax, 0)],
                ["Medicare levy on the profit", formatAUD(A.extraMedicare, 0), formatAUD(B.extraMedicare, 0)],
                ["Set aside for the ATO", formatAUD(A.setAside, 0), formatAUD(B.setAside, 0)],
                ["Left after expenses and tax", formatAUD(A.inPocketAfterTax, 0), formatAUD(B.inPocketAfterTax, 0)],
              ]}
              caption={<>2026-27 resident rates and Medicare levy; private hospital cover assumed; no HELP debt. In Example B the delivery profit sits on top of a wage, so it is taxed at that wage&rsquo;s marginal rate, which is why the share set aside is higher than for a sole earner.</>}
            />
            <p>
              In Example A the share of payments set aside works out to {pct(A.setAsideShare)}, and in Example B to {pct(B.setAsideShare)}. Those two percentages are the point: the share isn&rsquo;t fixed, so a blanket &ldquo;put 25% aside&rdquo; rule can leave you short or over-saving. Use your own figures.
            </p>
          </section>

          <section>
            <H2 id="paying">Paying the Tax Without a Surprise</H2>
            <ul>
              <li><strong>Keep a separate account</strong> for tax money and move your set-aside amount in each week.</li>
              <li><strong>Prepay the ATO.</strong> The ATO says you can make a prepayment regularly or once off, at any time and as often as you like, towards a potential bill. It stays on your account until used unless you ask for a refund.</li>
              <li><strong>BAS dates.</strong> If you are GST-registered, lodge your activity statement monthly or quarterly and pay the GST then.</li>
              <li><strong>Check any HELP debt.</strong> Compulsory repayments are worked out on your total income at tax time; see the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>.</li>
              <li><strong>Super is yours to arrange.</strong> No platform pays it. Personal contributions you claim as a deduction are taxed at 15% in the fund; see the <Link href="/superannuation-calculator/">super calculator</Link> and <Link href="/concessional-contributions-cap/">concessional contributions cap</Link>.</li>
            </ul>
          </section>

          <section>
            <H2 id="floor">If You Deliver Food or Groceries</H2>
            <p>
              Since 17 August 2026 delivery workers on apps also have a legal minimum hourly rate for engaged time, before costs. See the <Link href="/delivery-driver-pay-rate/">delivery driver pay rate guide</Link> for the rates and a calculator that checks a payout against the floor. The tax sums above apply to what you actually receive.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/delivery-driver-pay-rate/">Delivery Driver Pay Rate</Link>: the $31.30 an hour minimum</li>
              <li><Link href="/gig-economy-pay-guide/">Gig Economy Pay Guide</Link>: ABN, BAS and deductions in more detail</li>
              <li><Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link>: convert a contractor rate to a salary</li>
              <li><Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link></li>
              <li><Link href="/cents-per-km/">Cents per Km</Link> and <Link href="/employee-vs-sole-trader-vs-company/">Employee vs Sole Trader vs Company</Link></li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link></li>
            </ul>
          </section>

          <FaqSection faqs={RIDESHARE_AFTER_TAX_FAQS} label="Rideshare and delivery tax" />

          <PageFooter
            slug="rideshare-delivery-earnings-after-tax"
            lastVerified={GIG_TAX_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>If registered for GST, GST collected = payments ÷ 11 and credits = expenses ÷ 11 (when expenses include GST). Income for tax = payments − GST collected; deductions = expenses − credits. Profit = income − deductions. Tax on the profit is the 2026-27 resident income tax (after the low income offset) and Medicare levy on your other income plus profit, minus the same on your other income alone, plus any HELP repayment. Set aside = that tax + GST payable. Left after tax = payments − expenses − GST payable − tax.</p>
              <p>General information, not advice. The calculator ignores other deductions and offsets, the Medicare levy surcharge thresholds beyond the cover question, PAYG instalments, losses carried forward and the personal services income rules. A tax agent can confirm your position. The worked examples use made-up figures and say nothing about what drivers earn.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/delivery-driver-pay-rate/", label: "Delivery Driver Pay Rate" },
          { href: "/gig-economy-pay-guide/", label: "Gig Economy Pay Guide" },
          { href: "/contractor-pay-calculator/", label: "Contractor Pay Calculator" },
          { href: "/cents-per-km/", label: "Cents per Km" },
          { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
        ]} />
      </div>
    </div></div>
  );
}
