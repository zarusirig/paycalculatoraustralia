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
        down every standard field.
      </p>

      <h2>Why quarterly super statements are disappearing</h2>
      <p>
        Some employers previously issued a super summary once a quarter alongside the SBSCH payment
        run. Because contributions now move with every payday, that quarterly summary is being
        replaced by payday-level reporting — you should be able to see contributions reflected in
        your fund&apos;s app or member portal within days of each pay, rather than waiting until the
        next quarter to confirm the money arrived.
      </p>

      <h2>What to do if a contribution looks wrong or missing</h2>
      <p>
        Check your fund&apos;s transaction history a week or so after payday. If the expected
        contribution hasn&apos;t appeared, first confirm the amount and date on your payslip, then
        raise it with your payroll or HR contact — employers now have a firm 7-business-day
        deadline, so a missed payment is easier to identify and escalate than under the old
        quarterly cycle.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Your take-home pay itself isn&apos;t affected by payday super — only your super guarantee
        timing is. More frequent contributions mean your balance starts earning investment returns
        sooner, which compounds meaningfully over a career. Use our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> to model how
        regular, on-time contributions affect your balance at retirement, and keep an eye on your
        payslip each pay cycle to confirm the new system is working as it should.
      </p>
    </>
  );
}
