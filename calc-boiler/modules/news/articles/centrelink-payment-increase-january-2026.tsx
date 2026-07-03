import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function CentrelinkPaymentIncreaseJanuary2026() {
  return (
    <>
      <p className="lead">
        Centrelink payments for students, young people and carers rose from{" "}
        <strong>1 January 2026</strong>, the first indexation round of the year. Youth Allowance
        and Austudy climbed to <strong>$677.20</strong> a fortnight and Carer Allowance to{" "}
        <strong>$162.60</strong>, reaching more than a million recipients.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Youth Allowance / Austudy (single, away from home)", before: "$663.30", after: "$677.20" },
          { label: "ABSTUDY (independent single, 16–21)", after: "$677.20" },
          { label: "Carer Allowance", before: "$159.30", after: "$162.60" },
          { label: "Student income-free area", after: "$539/fortnight" },
          { label: "Recipients affected", after: "More than 1 million Australians" },
        ]}
      />

      <h2>What went up on 1 January</h2>
      <p>
        The Department of Social Services indexes a group of student and youth payments every 1
        January, separate from the pension indexation cycle. This round lifted Youth Allowance,
        Austudy, ABSTUDY, Youth Disability Support Pension and Carer Allowance, along with the
        income tests that apply to them. Youth Allowance and Austudy&apos;s single, away-from-home
        maximum basic rate rose by $13.90 to $677.20 a fortnight, and ABSTUDY&apos;s independent
        single rate for those aged 16 to 21 moved to match it. Other categories — living at home,
        living away with dependents, or partnered — also moved, though by different dollar
        amounts, since each rate is indexed against the same movement in the Consumer Price Index
        but starts from a different base.
      </p>
      <p>
        The Youth Disability Support Pension — the rate of Disability Support Pension paid to
        recipients under 21 — rose by up to $17.20 a fortnight, taking the rate for those living
        independently to $839.80. If you&apos;re not sure which category applies to you, your
        Centrelink online account shows your specific payment rate and the date it was last
        reviewed, rather than the general headline figures reported in the media.
      </p>

      <h2>Carer Allowance and student income tests</h2>
      <p>
        Around 680,000 people receiving Carer Allowance saw their fortnightly payment rise $3.30
        to $162.60. Because Carer Allowance is a supplementary payment rather than an
        income-support payment, it can be paid on top of Carer Payment, a wage, or another
        Centrelink payment, and it isn&apos;t means-tested against the recipient&apos;s own income
        the way most other payments are — instead it&apos;s tied to the care needs of the person
        being cared for. Alongside the rate rises, the student and apprentice income-free area
        increased to $539 a fortnight, and the upper income threshold — the point where the
        taper steps up from 50 cents to 60 cents in the dollar — rose to $646.
      </p>
      <p>
        These income test changes matter as much as the base rate rise for students working
        part-time. A higher income-free area means you can earn more before your payment starts
        reducing at all, and the higher taper thresholds mean more students juggling study and
        casual work stay eligible for at least a partial payment.
      </p>

      <h2>Why January is different from March and September</h2>
      <p>
        Age Pension, JobSeeker and other pension-type payments follow their own indexation
        timetable — 20 March and 20 September each year — so they weren&apos;t part of this round.
        January indexation instead targets younger claimants and carers, reflecting movements in
        the Consumer Price Index over the preceding six months. Family Tax Benefit and related
        family assistance payments follow a third cycle again, indexed each 1 July to align with
        the financial year. If you&apos;re on a pension-type payment, your next rate change lands
        on <Link href="/news/age-pension-increase-march-2026/">20 March 2026</Link>; if you get
        family payments, see what changed{" "}
        <Link href="/news/centrelink-changes-july-2026/">from 1 July</Link> instead.
      </p>

      <h2>Checking your own rate</h2>
      <p>
        Exact rates vary by your living arrangements, whether you have dependents, and your own
        and your parents&apos; income for many student payments. Log in to your Centrelink online
        account through myGov to see your updated rate and income test, and use our{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link> to understand
        how earnings from part-time or casual work interact with your payment. It&apos;s worth
        checking your MyGov inbox for a formal letter confirming your new rate, since the exact
        figure that lands in your account can differ slightly from the headline numbers reported
        here if you receive supplementary payments like Rent Assistance or Pharmaceutical
        Allowance on top of your base rate.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you combine a Centrelink payment with part-time or casual work, a small increase in
        your base rate can shift how much of your earnings get taxed away under the income test.
        Run your take-home pay through our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to see what a shift
        change or extra hours actually nets you once both tax and the Centrelink taper are
        accounted for, and check the current thresholds on the{" "}
        <Link href="/centrelink-income-test/">Centrelink income test guide</Link>.
      </p>
    </>
  );
}
