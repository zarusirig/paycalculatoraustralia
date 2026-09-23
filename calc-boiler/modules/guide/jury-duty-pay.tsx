import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { JURY_DUTY_PAID_DAYS, JURY_DUTY_SOURCES as SRC, JURY_DUTY_VERIFIED_ON, STATE_JURY_PAGES } from "@/lib/constants/jury-duty";
import JuryDutyPayCalculator from "@/modules/calculator/jury-duty-pay-calculator";
import { JURY_DUTY_PAY_FAQS } from "./jury-duty-pay-faqs";
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

// /jury-duty-pay/ (G3, wave 4). Sources: lib/constants/jury-duty.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Jury duty", url: SRC.fwo, publisher: SOURCES.fwo.name },
  { title: "Community service leave", url: SRC.communityServiceLeave, publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009, sections 108–112", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

export default function JuryDutyPayPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/annual-leave-guide/", label: "Leave" }, { label: "Jury Duty Pay" }]} />

      <PageHeader title="Jury Duty Pay in Australia: What Your Employer and the Court Pay">
        <p>
          <strong>Full-time and part-time employees must be paid by their employer for the first {JURY_DUTY_PAID_DAYS} days they miss work for jury duty, at their base pay for the ordinary hours they would have worked.</strong> If your employer asks for proof of the court&rsquo;s jury payment and you give it, they only pay the difference (&ldquo;make-up pay&rdquo;). Casuals can take the leave but aren&rsquo;t paid by their employer under the National Employment Standards.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Employer pays", v: `${JURY_DUTY_PAID_DAYS} days`, s: "First 10 workdays missed, full-time and part-time" },
          { k: "With court evidence", v: "Make-up pay", s: "Base pay minus the court payment" },
          { k: "Casuals", v: "Unpaid by employer", s: "Can still take the leave; court and state law may pay" },
          { k: "Type of leave", v: "Community service", s: "Includes jury selection, travel and rest" },
        ]}
      />

      <div className="mb-12"><JuryDutyPayCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-paid">How Jury Duty Pay Works</H2>
            <p>Your employer&rsquo;s obligation depends on whether they ask for evidence of the court payment:</p>
            <DataTable
              head={["Your employer…", "What they pay for the first 10 days"]}
              rows={[
                ["Doesn't ask for evidence of the court payment", "Your base pay for the ordinary hours you'd have worked"],
                ["Asks, and you give the evidence (even if the court pays $0)", "Make-up pay: base pay minus the court payment"],
                ["Asks, and you don't give it", "Nothing"],
              ]}
              caption={<>Full-time and part-time employees. The court payment excludes expense allowances. Fair Work Ombudsman, <a href={SRC.fwo} target="_blank" rel="noopener noreferrer">jury duty</a>, read {JURY_DUTY_VERIFIED_ON}.</>}
            />
            <p>The {JURY_DUTY_PAID_DAYS} days count days <em>absent from work</em>, not days on the jury. A part-time employee who works Monday to Wednesday and sits on a 15-day trial misses 9 workdays, and is paid make-up pay for all 9.</p>
          </section>

          <section>
            <H2 id="examples">Worked Examples (Fair Work Ombudsman)</H2>
            <DataTable
              head={["", "Julie (full-time)", "Samuel (part-time, Mon–Wed)"]}
              rows={[
                ["Base pay per day", "$300", "$250"],
                ["Court payment per day", "$90", "$90"],
                ["Jury service", "15 days", "15 days"],
                ["Workdays missed", "15", "9"],
                ["Employer make-up pay", "$210 × 10 days = $2,100", "$160 × 9 days = $1,440"],
                ["Court pays", "$90 × 15 = $1,350", "$90 × 15 = $1,350"],
              ]}
              caption={<>The calculator above reproduces both examples exactly.</>}
            />
          </section>

          <section>
            <H2 id="notice">Notice and Evidence</H2>
            <p>Tell your employer about the jury duty, and how long you expect to be away, as soon as possible. If they ask, give evidence that you will attend or have attended. For make-up pay, they can also ask you to show that you took all necessary steps to get any court payment, and the total the court paid or will pay.</p>
          </section>

          <section>
            <H2 id="states">State and Territory Jury Pay</H2>
            <p>Each state and territory sets its own juror payments, and its jury laws apply where they are more generous than the NES, for example by paying casuals. Check yours:</p>
            <ul>
              {STATE_JURY_PAGES.map((s) => (
                <li key={s.state}><strong>{s.state}:</strong> <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a></li>
              ))}
            </ul>
          </section>

          <section>
            <H2 id="payslip">Jury Duty on Your Payslip</H2>
            <p>Make-up pay is paid by your employer through payroll, so check it appears on your <Link href="/understanding-your-payslip/">payslip</Link> for the right number of days. Paid sick and carer&rsquo;s leave keeps accruing while you are on community service leave (see the <Link href="/sick-leave-calculator/">sick leave calculator</Link>).</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/sick-leave-calculator/">Sick Leave Calculator</Link>: personal/carer&rsquo;s leave balance</li>
              <li><Link href="/compassionate-leave/">Compassionate Leave</Link>: 2 days per occasion</li>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link>: four weeks a year</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: your normal pay after tax</li>
            </ul>
          </section>

          <FaqSection faqs={JURY_DUTY_PAY_FAQS} label="Jury duty pay" />

          <PageFooter
            slug="jury-duty-pay"
            lastVerified={JURY_DUTY_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Employer pay = up to {JURY_DUTY_PAID_DAYS} workdays missed × (base daily pay, or base daily pay minus the court&rsquo;s daily payment when evidence was requested and given, or $0 if requested and not given). Court pay = days of jury service × the court&rsquo;s daily payment. Casual employer pay = $0 under the NES. Tested against the Fair Work Ombudsman&rsquo;s two worked examples.</p>
              <p>We don&rsquo;t publish court payment amounts: they are set by each state and territory. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/sick-leave-calculator/", label: "Sick Leave Calculator" },
          { href: "/compassionate-leave/", label: "Compassionate Leave" },
          { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}
