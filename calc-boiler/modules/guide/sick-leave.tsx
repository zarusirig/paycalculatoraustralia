import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { SICK_LEAVE, SICK_LEAVE_SOURCES as SRC, SICK_LEAVE_VERIFIED_ON, annualSickLeaveHours, sickLeavePerPayPeriod } from "@/lib/constants/sick-leave";
import SickLeaveCalculator from "@/modules/calculator/sick-leave-calculator";
import { SICK_LEAVE_FAQS } from "./sick-leave-faqs";
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

// /sick-leave-calculator/ (G3, wave 4): paid sick and carer's leave under the
// NES. Rules and sources: lib/constants/sick-leave.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Paid sick and carer's leave", url: SRC.paid, publisher: SOURCES.fwo.name },
  { title: "Payment for sick and carer's leave", url: SRC.payment, publisher: SOURCES.fwo.name },
  { title: "Notice and medical certificates", url: SRC.evidence, publisher: SOURCES.fwo.name },
  { title: "Unpaid carer's leave", url: SRC.unpaidCarers, publisher: SOURCES.fwo.name },
  { title: "Cashing out sick and carer's leave", url: SRC.cashingOut, publisher: SOURCES.fwo.name },
  { title: "Final pay", url: SRC.finalPay, publisher: SOURCES.fwo.name },
  { title: "Sick and carer's leave and compassionate leave fact sheet", url: SRC.factSheet, publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009, sections 95–107", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

const WEEKLY_HOURS = [7.6, 15.2, 19, 22.8, 30.4, 38] as const;
const FT_HOURS = annualSickLeaveHours(SICK_LEAVE.standardFullTimeHours);
const fmtH = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")}`;

export default function SickLeavePage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/annual-leave-guide/", label: "Leave" }, { label: "Sick Leave Calculator" }]} />

      <PageHeader title="Sick Leave Calculator: Personal/Carer's Leave in Australia">
        <p>
          <strong>Full-time employees get 10 days of paid sick and carer&rsquo;s leave a year; part-time employees get the same pro rata.</strong> It builds up at 1/26 of your ordinary hours from your first day, so a 38-hour week earns {FT_HOURS} hours a year and a 19-hour week earns {annualSickLeaveHours(19)}. Carer&rsquo;s leave comes out of the same balance. Casuals get no paid sick leave but can take unpaid carer&rsquo;s leave. Unused leave rolls over every year and is not paid out when you leave.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Full-time", v: `${SICK_LEAVE.fullTimeDaysPerYear} days`, s: `${FT_HOURS} hours a year on a 38-hour week` },
          { k: "Accrual rate", v: "1/26", s: "Of ordinary hours worked, from day one" },
          { k: "Casuals", v: "Unpaid only", s: `${SICK_LEAVE.unpaidCarersDaysPerOccasion} days unpaid carer's leave per occasion` },
          { k: "When you leave", v: "Not paid out", s: "Unlike annual leave" },
        ]}
      />

      <div className="mb-12"><SickLeaveCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-much">How Much Sick Leave Do You Get?</H2>
            <p>
              The National Employment Standards (Fair Work Act s 96) give every full-time and part-time employee 10 days of paid personal/carer&rsquo;s leave for each year of service. Because it is worked out on ordinary hours, not days, a part-time employee gets exactly the share of 10 days that their hours are of full-time. How you spread the hours doesn&rsquo;t matter: 38 hours over four days earns the same {FT_HOURS} hours as 38 hours over five.
            </p>
            <DataTable
              head={["Ordinary hours a week", "Sick leave a year", "Each fortnight"]}
              align={["l", "r", "r"]}
              rows={WEEKLY_HOURS.map((w) => [`${w} hours`, `${fmtH(annualSickLeaveHours(w))} hours`, `${fmtH(sickLeavePerPayPeriod(w, 2))} hours`])}
              caption={<>1/26 of a year&rsquo;s ordinary hours (52 weeks). The Fair Work Ombudsman&rsquo;s own example: 38 hours a week earns 76 hours, 19 hours earns 38. Your award or agreement can give more.</>}
            />
          </section>

          <section>
            <H2 id="sick-vs-carers">Sick Leave vs Carer&rsquo;s Leave vs Personal Leave</H2>
            <p>They are the same entitlement. &ldquo;Personal/carer&rsquo;s leave&rdquo; is the legal name; you use it either as <strong>sick leave</strong>, when you can&rsquo;t work because of your own illness or injury (including stress and pregnancy-related illness), or as <strong>carer&rsquo;s leave</strong>, to care for or support a member of your immediate family or household who is sick, injured or has an unexpected emergency.</p>
            <p>Immediate family means your spouse or former spouse, de facto partner or former de facto partner, child, parent, grandparent, grandchild or sibling, and the same relatives of your spouse or de facto partner. Anyone who lives in your household also counts.</p>
            <p>When your paid balance runs out, you can take {SICK_LEAVE.unpaidCarersDaysPerOccasion} days of <strong>unpaid</strong> carer&rsquo;s leave each time a family or household member needs care. Casuals, who have no paid balance, can take the same unpaid carer&rsquo;s leave on each occasion.</p>
          </section>

          <section>
            <H2 id="pay">How Sick Leave Is Paid</H2>
            <p>
              A sick day is paid at your <strong>base pay rate</strong> for the ordinary hours you would have worked. The base rate leaves out incentive payments, bonuses, loadings, allowances, overtime and penalty rates. If you usually work overtime on Wednesdays and call in sick on a Wednesday, you are paid for your normal hours only (the Fair Work Ombudsman&rsquo;s example). Your award or agreement may pay more.
            </p>
            <p>
              On your <Link href="/understanding-your-payslip/">payslip</Link>, sick leave often shows as its own line with a running balance in hours. Check that the balance grows each pay: on a 38-hour week it should rise by about {fmtH(sickLeavePerPayPeriod(38, 2))} hours a fortnight. To see what a pay period nets after tax, use the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="evidence">Medical Certificates and Notice</H2>
            <p>
              You must tell your employer as soon as you can, which may be after the leave has started, and say how long you expect to be off. Your employer can ask for evidence for as little as 1 day or less off work. The evidence has to convince a reasonable person that you were genuinely entitled to the leave: a medical certificate or a statutory declaration are both examples. If you don&rsquo;t give evidence when asked, you may not be paid for the leave. Your award or enterprise agreement can set specific rules.
            </p>
          </section>

          <section>
            <H2 id="accrual">When Sick Leave Does and Doesn&rsquo;t Accrue</H2>
            <DataTable
              head={["You are on", "Sick leave keeps accruing?"]}
              rows={[
                ["Paid annual leave, paid sick or carer's leave", "Yes"],
                ["Long service leave", "Yes"],
                ["Community service leave, including jury duty", "Yes"],
                ["Unpaid annual leave or unpaid sick or carer's leave", "No"],
                ["Unpaid parental leave", "No"],
                ["Unpaid family and domestic violence leave", "No"],
              ]}
              caption={<>Fair Work Ombudsman, <a href={SRC.paid} target="_blank" rel="noopener noreferrer">paid sick and carer&rsquo;s leave</a>, read {SICK_LEAVE_VERIFIED_ON}.</>}
            />
          </section>

          <section>
            <H2 id="leaving">Is Sick Leave Paid Out When You Leave?</H2>
            <p>
              No. Unused sick and carer&rsquo;s leave isn&rsquo;t paid out when your employment ends, unlike unused annual leave, which is (see the <Link href="/leave-calculator/">leave payout calculator</Link> and <Link href="/final-pay-calculator/">final pay calculator</Link>). Cashing out during employment is also restricted: only the {SICK_LEAVE.cashOutAwards.join(" and ")} allow it among modern awards, or an enterprise agreement that says so, and only with a separate written agreement each time that leaves you at least {SICK_LEAVE.cashOutMinimumRemainingDays} days of untaken leave.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/compassionate-leave/">Compassionate Leave</Link>: 2 days paid bereavement leave, separate from sick leave</li>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link>: four weeks a year and how it accrues</li>
              <li><Link href="/leave-loading-calculator/">Leave Loading Calculator</Link>: the 17.5% on annual leave</li>
              <li><Link href="/long-service-leave-calculator/">Long Service Leave Calculator</Link>: by state</li>
              <li><Link href="/casual-loading-calculator/">Casual Loading Calculator</Link>: what casuals get instead of leave</li>
            </ul>
          </section>

          <FaqSection faqs={SICK_LEAVE_FAQS} label="Sick leave" />

          <PageFooter
            slug="sick-leave-calculator"
            lastVerified={SICK_LEAVE_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Sick leave earned = ordinary hours a week × weeks of service × 1/26, which is the Fair Work Ombudsman&rsquo;s method (10 days a year for full-time; 76 hours on a 38-hour week). Weeks of service = years × 52 + months × 52/12; leave out any time on unpaid leave. The balance is earned minus taken, valued at the base hourly rate you enter. Days are hours divided by your average day length.</p>
              <p>This is the National Employment Standards minimum for national-system employees. Your award, enterprise agreement or contract can give more. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/compassionate-leave/", label: "Compassionate Leave" },
          { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
          { href: "/leave-calculator/", label: "Leave Payout Calculator" },
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}
