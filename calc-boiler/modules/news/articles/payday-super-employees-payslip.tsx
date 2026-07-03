import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function PaydaySuperEmployeesPayslip() {
  return (
    <>
      <p className="lead">
        Payday super, which started 1 July 2026, doesn&apos;t change your pay rate — but it changes
        how often super guarantee is calculated and paid. Here&apos;s what to actually look for on
        your payslip now that super moves with every pay run instead of once a quarter.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Super calculated", before: "Per quarter", after: "Per payday" },
          { label: "Super shown on payslip", after: "Accrued amount for that pay period" },
          { label: "Fund deposit timing", after: "Within 7 business days of payday" },
          { label: "Super guarantee rate", after: "12% of ordinary time earnings" },
        ]}
      />

      <h2>What should appear on your payslip now</h2>
      <p>
        Your payslip should still show a super guarantee line for each pay period — the same as
        before — calculated as 12% of your ordinary time earnings for that pay run. What&apos;s
        changed is the obligation behind it: employers must now pay that amount to your fund within
        7 business days, rather than bundling several pay periods together and paying once a
        quarter. If you&apos;re unsure what each line on your payslip means, our{" "}
        <Link href="/understanding-your-payslip/">understanding your payslip guide</Link> breaks
        down every standard field. Some payroll systems also add a short note or reference number
        confirming when the contribution was sent to your fund, though this isn&apos;t mandatory —
        the safest way to confirm payment is still checking directly with your super fund rather than
        relying solely on the payslip wording.
      </p>

      <h2>Why quarterly super statements are disappearing</h2>
      <p>
        Some employers previously issued a super summary once a quarter alongside the SBSCH payment
        run. Because contributions now move with every payday, that quarterly summary is being
        replaced by payday-level reporting — you should be able to see contributions reflected in
        your fund&apos;s app or member portal within days of each pay, rather than waiting until the
        next quarter to confirm the money arrived. This is a meaningful shift for employees who
        change jobs or work multiple casual roles, since each employer&apos;s contributions now show
        up close to when they were earned, making it far easier to spot a gap while it&apos;s still
        recent rather than discovering a shortfall months later.
      </p>

      <h2>What to do if a contribution looks wrong or missing</h2>
      <p>
        Check your fund&apos;s transaction history a week or so after payday. If the expected
        contribution hasn&apos;t appeared, first confirm the amount and date on your payslip, then
        raise it with your payroll or HR contact — employers now have a firm 7-business-day
        deadline, so a missed payment is easier to identify and escalate than under the old
        quarterly cycle. See our{" "}
        <Link href="/news/payday-super-starts-july-2026/">guide to how payday super works for employers</Link>{" "}
        for the deadline and penalty rules behind that obligation.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Your take-home pay itself isn&apos;t affected by payday super — only your super guarantee
        timing is. More frequent contributions mean your balance starts earning investment returns
        sooner, which compounds meaningfully over a career. Use our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to model how
        regular, on-time contributions affect your balance at retirement, and keep an eye on your
        payslip each pay cycle to confirm the new system is working as it should. If you switch
        jobs, remember to check that your new employer has your correct fund details from your first
        payday, since a delay there can flow through to the 7-business-day deadline for your first
        contribution.
      </p>
    </>
  );
}
