import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { COMPASSIONATE_LEAVE, COMPASSIONATE_SOURCES as SRC, COMPASSIONATE_VERIFIED_ON } from "@/lib/constants/compassionate-leave";
import CompassionateLeaveCalculator from "@/modules/calculator/compassionate-leave-calculator";
import { COMPASSIONATE_LEAVE_FAQS } from "./compassionate-leave-faqs";
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

// /compassionate-leave/ (G3, wave 4). Rules and sources:
// lib/constants/compassionate-leave.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Compassionate and bereavement leave", url: SRC.compassionate, publisher: SOURCES.fwo.name },
  { title: "Sick and carer's leave and compassionate leave fact sheet", url: SRC.factSheet, publisher: SOURCES.fwo.name },
  { title: "Family and domestic violence leave", url: SRC.fdv, publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009, sections 12, 16 and 104–106", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

export default function CompassionateLeavePage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/annual-leave-guide/", label: "Leave" }, { label: "Compassionate Leave" }]} />

      <PageHeader title="Compassionate Leave in Australia: 2 Days Bereavement Leave and Pay">
        <p>
          <strong>Every employee gets {COMPASSIONATE_LEAVE.daysPerOccasion} days of compassionate leave each time a member of their immediate family or household dies or develops a life-threatening illness or injury, and after a stillbirth or miscarriage.</strong> Full-time and part-time employees are paid at their base rate for the hours they would have worked; casuals get the same leave unpaid. It is also called bereavement leave, it doesn&rsquo;t come out of sick or annual leave, and there is no yearly cap.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Each occasion", v: `${COMPASSIONATE_LEAVE.daysPerOccasion} days`, s: "One block, two single days, or as agreed" },
          { k: "Full-time & part-time", v: "Paid", s: "Base rate for the ordinary hours you'd have worked" },
          { k: "Casuals", v: "Unpaid", s: "Same 2 days per occasion" },
          { k: "Family & domestic violence", v: `${COMPASSIONATE_LEAVE.fdvDaysPerYear} days paid`, s: "A separate yearly entitlement, casuals included" },
        ]}
      />

      <div className="mb-12"><CompassionateLeaveCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="when">When Can You Take Compassionate Leave?</H2>
            <p>Under the National Employment Standards (Fair Work Act s 104) you can take compassionate leave when:</p>
            <ul>
              <li>a member of your immediate family or household <strong>dies</strong>, or contracts or develops a <strong>life-threatening illness or injury</strong>;</li>
              <li>a baby in your immediate family or household is <strong>stillborn</strong>; or</li>
              <li>you, or your current spouse or de facto partner, have a <strong>miscarriage</strong>.</li>
            </ul>
            <p>Each of these is a separate occasion with its own {COMPASSIONATE_LEAVE.daysPerOccasion} days. If you are already on annual leave or another type of leave when it happens, you can switch to compassionate leave for those days.</p>
          </section>

          <section>
            <H2 id="family">Who Counts as Immediate Family?</H2>
            <DataTable
              head={["Relationship", "Compassionate leave?"]}
              rows={[
                ["Spouse, former spouse, de facto or former de facto partner", "Yes"],
                ["Child, parent, grandparent, grandchild, sibling", "Yes"],
                ["The same relatives of your spouse or de facto partner", "Yes"],
                ["Step-relations and adoptive relations", "Yes"],
                ["Anyone who lives in your household", "Yes"],
                ["Aunt, uncle or cousin (not in your household)", "Only if your employer agrees"],
              ]}
              caption={<>Fair Work Ombudsman, <a href={SRC.compassionate} target="_blank" rel="noopener noreferrer">compassionate and bereavement leave</a>, read {COMPASSIONATE_VERIFIED_ON}.</>}
            />
          </section>

          <section>
            <H2 id="pay">How Compassionate Leave Is Paid</H2>
            <p>
              Full-time and part-time employees are paid at their <strong>base pay rate</strong> for the ordinary hours they would have worked during the leave. Incentive payments, bonuses, loadings, monetary allowances, overtime and penalty rates are left out, so a rostered Saturday is paid at the base rate, not the Saturday rate. On a 38-hour, 5-day week that is 2 days of 7.6 hours: at $32 an hour, $486.40 before tax. Casual employees take the same leave unpaid. Compassionate leave can&rsquo;t be cashed out.
            </p>
            <p>
              Check the leave and its pay on your <Link href="/understanding-your-payslip/">payslip</Link>. Your award or enterprise agreement may give extra days or pay; check yours with our <Link href="/enterprise-agreement/">enterprise agreement guide</Link>.
            </p>
          </section>

          <section>
            <H2 id="evidence">Notice and Evidence</H2>
            <p>
              Tell your employer as soon as you can (this can be after the leave has started), including how long you expect to be off. Your employer can ask for evidence, such as a death or funeral notice or a statutory declaration, but the request has to be reasonable. If you don&rsquo;t give the notice or evidence asked for, you may not get compassionate leave.
            </p>
          </section>

          <section>
            <H2 id="vs-sick-leave">Compassionate Leave vs Sick and Carer&rsquo;s Leave</H2>
            <DataTable
              head={["", "Compassionate leave", "Sick and carer's leave"]}
              rows={[
                ["How much", "2 days per occasion", "10 days a year (full-time), pro rata part-time"],
                ["Builds up over time?", "No", "Yes, and carries over"],
                ["Casuals", "Unpaid", "Unpaid carer's leave only (2 days per occasion)"],
                ["Used for", "Death, life-threatening illness or injury, stillbirth, miscarriage", "Your own illness or injury, or caring for family"],
              ]}
            />
            <p>
              If someone close to you is seriously ill but the illness isn&rsquo;t life-threatening, the leave to care for them is <Link href="/sick-leave-calculator/">carer&rsquo;s leave</Link>, which comes out of your sick leave balance.
            </p>
          </section>

          <section>
            <H2 id="fdv">Family and Domestic Violence Leave</H2>
            <p>
              Separately, every employee, including casuals, can take {COMPASSIONATE_LEAVE.fdvDaysPerYear} days of <strong>paid family and domestic violence leave</strong> each year if they are experiencing family and domestic violence. The full {COMPASSIONATE_LEAVE.fdvDaysPerYear} days is available from your first day, resets on your work anniversary and doesn&rsquo;t accumulate. It is standalone leave: it doesn&rsquo;t come out of sick, annual or compassionate leave. The <a href={SRC.fdv} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a> explains how it is paid and the notice rules. For support, call 1800RESPECT on 1800 737 732.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/sick-leave-calculator/">Sick Leave Calculator</Link>: personal/carer&rsquo;s leave balance</li>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link>: four weeks a year</li>
              <li><Link href="/parental-leave-pay/">Paid Parental Leave</Link>: government Parental Leave Pay</li>
              <li><Link href="/long-service-leave-calculator/">Long Service Leave Calculator</Link>: by state</li>
            </ul>
          </section>

          <FaqSection faqs={COMPASSIONATE_LEAVE_FAQS} label="Compassionate leave" />

          <PageFooter
            slug="compassionate-leave"
            lastVerified={COMPASSIONATE_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Compassionate leave pay = base hourly rate × ordinary hours you would have worked each day × days taken (up to 2 per occasion). Casuals: $0, because the NES leave is unpaid for them. The worked example uses 7.6 hours a day (a 38-hour, 5-day week).</p>
              <p>Rules are the National Employment Standards as the Fair Work Ombudsman states them, read {COMPASSIONATE_VERIFIED_ON}. Your award, enterprise agreement or contract can give more. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/sick-leave-calculator/", label: "Sick Leave Calculator" },
          { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
          { href: "/parental-leave-pay/", label: "Paid Parental Leave" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}
