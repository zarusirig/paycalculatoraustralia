import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import {
  NES_NOTICE_BANDS,
  NOTICE_SOURCES as SRC,
  NOTICE_VERIFIED_ON,
  WHOLE_OF_INCOME_CAP,
  paymentInLieu,
} from "@/lib/constants/notice-pilon";
import { ETP_RATES, REDUNDANCY_TAX_2026_27 } from "@/lib/constants/redundancy";
import PilonCalculator from "@/modules/calculator/pilon-calculator";
import { PILON_FAQS } from "./payment-in-lieu-of-notice-faqs";
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
import FeaturedImage from "@/components/common/featured-image";

// /payment-in-lieu-of-notice/ — NES notice table and the tax and super
// treatment of PILON. It does not rebuild /final-pay-calculator/ (the whole
// final pay) or the redundancy and termination-payment tax pages; it links to
// them. Rules and sources: lib/constants/notice-pilon.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Dismissal: notice of termination and payment in lieu of notice", url: SRC.dismissal, publisher: SOURCES.fwo.name },
  { title: "Notice of termination and redundancy pay fact sheet", url: SRC.factSheet, publisher: SOURCES.fwo.name },
  { title: "Employment termination payments for employees", url: SRC.atoEtp, publisher: "Australian Taxation Office" },
  { title: "How ETP components are taxed", url: SRC.atoEtpComponents, publisher: "Australian Taxation Office" },
  { title: "What payments are qualifying earnings", url: SRC.atoQualifyingEarnings, publisher: "Australian Taxation Office" },
  { title: "Fair Work Act 2009, section 117", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

const pct = (n: number) => formatPercent(n, 0);

export default function PilonPage() {
  const example = paymentInLieu({ yearsOfService: 6, over45: false, weeklyPay: 2_000, otherTaxableIncome: 90_000 });
  const over = paymentInLieu({ yearsOfService: 6, over45: true, weeklyPay: 2_000, otherTaxableIncome: 90_000 });
  const SG = pct(SUPER_GUARANTEE.rate);

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/final-pay-calculator/", label: "Final Pay" }, { label: "Payment in Lieu of Notice" }]} />

      <PageHeader title="Payment in Lieu of Notice Australia: Notice Periods, Tax and Super">
        <p>
          <strong>If your employer ends your job on the spot, it must pay you what you would have earned by working the notice period.</strong> Under the National Employment Standards that is 1 to 4 weeks depending on your continuous service, plus 1 week if you are over 45 with at least 2 years of service. The payment must include your regular overtime, penalties, allowances and loadings. The ATO taxes it as an employment termination payment and the employer must pay {SG} super on it. The calculator below works out all three.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Notice", v: "1–4 weeks", s: "By years of continuous service" },
          { k: "Over 45, 2+ years", v: "+1 week", s: "Extra week of notice under the NES" },
          { k: "Tax", v: `${pct(ETP_RATES.underPreservationAge)} / ${pct(ETP_RATES.atOrOverPreservationAge)}`, s: "ETP rate to the cap, incl. Medicare levy" },
          { k: "Super", v: SG, s: "Payable on the payment (ordinary time earnings)" },
        ]}
      />

      <div className="mb-12"><PilonCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="notice-period">How Much Notice Must an Employer Give?</H2>
            <p>
              When an employer dismisses an employee, the NES require a minimum notice period, based on the employee&rsquo;s continuous service on the day notice is given. The employee can work the notice period or the employer can pay it out. The notice period starts the day after the employer tells the employee and ends on the last day of employment.
            </p>
            <DataTable
              head={["Continuous service", "Minimum notice"]}
              align={["l", "r"]}
              rows={NES_NOTICE_BANDS.map((b) => [b.label, `${b.weeks} week${b.weeks === 1 ? "" : "s"}`])}
              caption={<>Fair Work Ombudsman, <a href={SRC.dismissal} target="_blank" rel="noopener noreferrer">Dismissal</a> (content last updated 28 August 2026), read {NOTICE_VERIFIED_ON}. Employees over 45 years old with at least 2 years of continuous service get one extra week on top of the figure above.</>}
            />
            <p>
              An award, enterprise agreement or employment contract can set longer notice but cannot provide for less than the NES. Continuous service counts unpaid leave such as unpaid parental leave, and does not count unauthorised absence. Time worked as a casual usually does not count towards continuous service for notice. Employees are entitled to notice even during probation.
            </p>
          </section>

          <section>
            <H2 id="what-is-pilon">What Is Payment in Lieu of Notice?</H2>
            <p>
              Payment in lieu of notice (PILON) happens when your employment ends on the day you are given notice and you are paid what you would have been paid had you worked out the notice period. The amount must equal the full amount you would have been paid. That means it includes incentive-based payments and bonuses, loadings, monetary allowances, overtime, penalty rates and any other separately identifiable amounts, not just your base rate.
            </p>
            <p>
              Because employment ends on your last working day, you stop accruing leave from that day. An employer can also combine the two: let you work part of the notice and pay out the rest. For example, if a worker with 5 months of service is told on a Tuesday that they have 1 week of notice, works until Friday and is paid out the remaining 2 days, their final pay includes the hours worked, 2 days of payment in lieu, and their unused annual leave up to that Friday (the Fair Work Ombudsman&rsquo;s own example).
            </p>
          </section>

          <section>
            <H2 id="worked-example">Worked Example: 6 Years of Service on $2,000 a Week</H2>
            <p>
              Dana has worked for 6 years, normally earns {formatAUD(2_000)} a week including regular allowances, and has {formatAUD(90_000)} of other taxable income so far this year. She is told her job is ending today.
            </p>
            <ul>
              <li>Notice: more than 5 years is <strong>{example.noticeWeeks} weeks</strong>.</li>
              <li>Payment in lieu: {example.noticeWeeks} × {formatAUD(2_000)} = <strong>{formatAUD(example.gross)}</strong>.</li>
              <li>Tax: Dana has {formatAUD(example.concessionalCap)} left under the whole-of-income cap, so the whole payment is taxed at {pct(example.concessionalRate)} (including Medicare levy, under preservation age): about {formatAUD(example.tax)}, leaving {formatAUD(example.net)}.</li>
              <li>Super on top: {SG} × {formatAUD(example.gross)} = <strong>{formatAUD(example.superGuarantee)}</strong>, paid to her fund.</li>
            </ul>
            <p>
              If Dana were over 45 the notice would be {over.noticeWeeks} weeks, and the payment {formatAUD(over.gross)}. Her unused annual leave, any long service leave and any redundancy pay are paid separately; see the <Link href="/final-pay-calculator/">final pay calculator</Link> for the whole picture.
            </p>
          </section>

          <section>
            <H2 id="tax">How Payment in Lieu of Notice Is Taxed</H2>
            <p>
              The ATO lists payments in lieu of notice among the payments that can make up an employment termination payment (ETP). A payment in lieu is a <strong>non-excluded</strong> ETP, so its taxable component is concessionally taxed up to the <em>smaller</em> of two caps:
            </p>
            <ul>
              <li>the <strong>ETP cap</strong>, {formatAUD(REDUNDANCY_TAX_2026_27.etpCap)} for 2026-27; and</li>
              <li>the <strong>whole-of-income cap</strong>, {formatAUD(WHOLE_OF_INCOME_CAP)} (not indexed), reduced by your other taxable income in the year, such as the wages you earned before you left.</li>
            </ul>
            <DataTable
              head={["Part of the payment", "Tax rate"]}
              align={["l", "r"]}
              rows={[
                ["Up to the cap, not yet at preservation age", `${pct(ETP_RATES.underPreservationAge)} (incl. Medicare levy)`],
                ["Up to the cap, at or past preservation age", `${pct(ETP_RATES.atOrOverPreservationAge)} (incl. Medicare levy)`],
                ["Above the cap", `${pct(ETP_RATES.aboveCap)} (45% plus 2% Medicare levy)`],
              ]}
              caption={<>ATO, <a href={SRC.atoEtpComponents} target="_blank" rel="noopener noreferrer">How ETP components are taxed</a> (last updated 5 June 2026), read {NOTICE_VERIFIED_ON}. The whole-of-income cap applies to non-excluded ETPs like a payment in lieu. Preservation age is 60 for people born after 30 June 1964.</>}
            />
            <p>
              The effect depends on your income. Someone on {formatAUD(90_000)} gets the 32% rate on a payment in lieu, similar to the 32% marginal rate on salary at that level. Someone already above $180,000 for the year has no concessional cap left, so the whole payment is taxed at the top rate. The <Link href="/termination-payment-tax-calculator/">termination payment tax calculator</Link> covers redundancy, severance and other ETPs in full. The tax your employer withholds is an estimate and the final tax is settled in your return.
            </p>
          </section>

          <section>
            <H2 id="super">Super on Payment in Lieu of Notice</H2>
            <p>
              Unlike unused leave, a payment in lieu of notice attracts super. The ATO treats it, for all termination reasons, as ordinary time earnings and qualifying earnings, so the employer must pay super guarantee on it. The ATO&rsquo;s worked example is a $10,000 payment in lieu of 4 weeks&rsquo; wages: super guarantee of $10,000 × {SG} = {formatAUD(10_000 * SUPER_GUARANTEE.rate)}. A redundancy payment above the tax-free limit, severance pay and unused leave on termination are not qualifying earnings. See <Link href="/super-guarantee-rate-history/">super guarantee rate history</Link> and <Link href="/superannuation-calculator/">the super calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="not-the-same">Notice, Redundancy Pay and Final Pay</H2>
            <p>
              Notice is one part of what you are owed when you leave. Redundancy pay is a separate amount based on years of service and is paid in addition to notice (see the <Link href="/redundancy-pay-calculator/">redundancy pay calculator</Link>). Final pay also includes wages owed, unused annual leave with any loading and, in some cases, long service leave (see <Link href="/leave-calculator/">leave payout calculator</Link> and <Link href="/long-service-leave-calculator/">long service leave calculator</Link>). To check the notice and redundancy entitlements in your award, the Fair Work Ombudsman also publishes a <a href={SRC.calculator} target="_blank" rel="noopener noreferrer">notice and redundancy calculator</a>.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/final-pay-calculator/">Final Pay Calculator</Link>: everything owed when you leave</li>
              <li><Link href="/termination-payment-tax-calculator/">Termination Payment Tax Calculator</Link>: ETP and redundancy tax</li>
              <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link>: NES severance by years of service</li>
              <li><Link href="/leave-calculator/">Leave Payout Calculator</Link>: unused annual leave and loading</li>
              <li><Link href="/annual-leave-calculator/">Annual Leave Calculator</Link>: your balance and what it is worth</li>
            </ul>
          </section>

          <FaqSection faqs={PILON_FAQS} label="Payment in lieu of notice" />

          <PageFooter
            slug="payment-in-lieu-of-notice"
            lastVerified={NOTICE_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Notice weeks come from the Fair Work Ombudsman&rsquo;s NES table, using continuous service on the day notice is given, with one extra week for an employee over 45 years old with at least 2 years of continuous service. The payment in lieu is the weeks paid out × normal weekly pay. Tax is estimated on the ATO&rsquo;s ETP treatment for a non-excluded payment: the concessional rate (32%, or 17% from preservation age, both including the Medicare levy) up to the smaller of the ETP cap and ($180,000 less other taxable income), and 47% above it. Super is the super guarantee rate on the payment.</p>
              <p>Assumes an Australian resident and a payment made in 2026-27. It does not model unused leave, long service leave, redundancy pay, or the 12-month rule. Your award, agreement or contract may give more notice. General information, not legal or tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
          { href: "/redundancy-pay-calculator/", label: "Redundancy Pay Calculator" },
          { href: "/leave-calculator/", label: "Leave Payout Calculator" },
          { href: "/termination-payment-tax-calculator/", label: "Termination Payment Tax" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}
