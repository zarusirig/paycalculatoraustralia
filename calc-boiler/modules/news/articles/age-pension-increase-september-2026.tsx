import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  AGE_PENSION_RATES,
  DEEMING_SEPTEMBER_2026,
  JOBSEEKER_RATES,
  MARCH_2026,
  SEPTEMBER_2026,
  WORK_BONUS,
  agePensionFortnightly,
  assessableAfterWorkBonus,
  deemedIncomeAnnual,
} from "@/lib/constants/centrelink-income-test";

const money = (n: number) => formatAUD(n, 2);
const pct = (r: number) => `${(r * 100).toFixed(2).replace(/0$/, "")}%`;

// Worked examples.
const WAGES_FORTNIGHT = 600; // a pensioner working about 8 hours a week
const SAVINGS = 250_000; // a single pensioner's financial assets

export default function AgePensionIncreaseSeptember2026() {
  const mar = AGE_PENSION_RATES[MARCH_2026].maxFortnightly;
  const sep = AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly;
  const singleRise = Math.round((sep.single.total - mar.single.total) * 100) / 100;
  const coupleRise = Math.round((sep.coupleCombined.total - mar.coupleCombined.total) * 100) / 100;
  const jsMar = JOBSEEKER_RATES[MARCH_2026].maxFortnightly;
  const jsSep = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly;
  const D = DEEMING_SEPTEMBER_2026;

  // Example 1: part-time wages, Work Bonus, no savings.
  const assessable = assessableAfterWorkBonus(WAGES_FORTNIGHT, 0);
  const ex1Before = agePensionFortnightly(assessable, "single", AGE_PENSION_RATES[MARCH_2026]);
  const ex1After = agePensionFortnightly(assessable, "single", AGE_PENSION_RATES[SEPTEMBER_2026]);

  // Example 2: savings only, old deeming vs new deeming (income test only).
  const deemedOld = deemedIncomeAnnual(SAVINGS, D.thresholds.single, D.previousLowerRate, D.previousUpperRate) / 26;
  const deemedNew = deemedIncomeAnnual(SAVINGS) / 26;
  const ex2Before = agePensionFortnightly(deemedOld, "single", AGE_PENSION_RATES[MARCH_2026]);
  const ex2After = agePensionFortnightly(deemedNew, "single", AGE_PENSION_RATES[SEPTEMBER_2026]);

  return (
    <>
      <p className="lead">
        The maximum Age Pension rose by <strong>{money(singleRise)} a fortnight</strong> for singles and{" "}
        <strong>{money(coupleRise)} a fortnight</strong> for couples combined on 20 September 2026, taking the
        full single rate to <strong>{money(sep.single.total)}</strong>. On the same day Centrelink&apos;s
        deeming rates rose half a percentage point, to {pct(D.lowerRate)} and {pct(D.upperRate)}, which claws
        back part of the increase for pensioners with savings.
      </p>

      <NewsKeyFacts
        title="What changed on 20 September 2026"
        rows={[
          { label: "Age Pension, single (max, per fortnight)", before: money(mar.single.total), after: money(sep.single.total) },
          { label: "Age Pension, couple each", before: money(mar.coupleEach.total), after: money(sep.coupleEach.total) },
          { label: "Age Pension, couple combined", before: money(mar.coupleCombined.total), after: money(sep.coupleCombined.total) },
          { label: "JobSeeker, single no children", before: money(jsMar.single), after: money(jsSep.single) },
          { label: "JobSeeker, partnered (each)", before: money(jsMar.partnered), after: money(jsSep.partnered) },
          { label: "Deeming rates", before: `${pct(D.previousLowerRate)} / ${pct(D.previousUpperRate)}`, after: `${pct(D.lowerRate)} / ${pct(D.upperRate)}` },
        ]}
      />

      <h2>Who gets the increase</h2>
      <p>
        Services Australia says the rise applies to the Age Pension, Carer Payment and Disability Support
        Pension, which share the same maximum rate. The single total is made up of the basic rate (
        {money(sep.single.basic)}), the Pension Supplement ({money(sep.single.supplement)}) and the Energy
        Supplement ({money(sep.single.energy)}), which did not change. Services Australia says you don&apos;t need
        to do anything: the higher rate applies automatically from 20 September.
      </p>
      <p>
        JobSeeker Payment was indexed on the same day. A single person with no children now gets up to{" "}
        {money(jsSep.single)} a fortnight, up {money(Math.round((jsSep.single - jsMar.single) * 100) / 100)}, and
        a single parent or someone aged 55 or over on payment for nine months or more gets up to{" "}
        {money(jsSep.singleWithChildren)}. Student payments (Austudy and Youth Allowance for students) index
        on 1 January, so they did not change.
      </p>

      <h2>Why part-pensioners on wages get the full rise</h2>
      <p>
        The income test free area ({formatAUD(AGE_PENSION_INCOME_TEST.single.freeArea)} a fortnight for a single)
        and the 50c taper did not move — they index on 1 July. So a part-pensioner whose only other income is
        wages gets the whole increase. Take a single pensioner earning {formatAUD(WAGES_FORTNIGHT)} a fortnight.
        The Work Bonus takes out the first {formatAUD(WORK_BONUS.fortnightlyCredit)}, leaving{" "}
        {formatAUD(assessable)} assessable, and the pension goes from {money(ex1Before)} to{" "}
        <strong>{money(ex1After)}</strong> a fortnight.
      </p>

      <h2>Where deeming eats into it</h2>
      <p>
        Deeming assumes your savings, shares and account-based super earn a set rate, whatever they really
        earn. From 20 September the first {formatAUD(D.thresholds.single)} of a single person&apos;s financial
        assets ({formatAUD(D.thresholds.couple)} combined for a couple) is deemed at {pct(D.lowerRate)}, and
        everything above that at {pct(D.upperRate)}, up from {pct(D.previousLowerRate)} and{" "}
        {pct(D.previousUpperRate)}.
      </p>
      <p>
        A single pensioner with {formatAUD(SAVINGS)} in the bank and no other income is now deemed to earn{" "}
        {money(deemedNew)} a fortnight, up from {money(deemedOld)}. Under the income test alone, their pension
        goes from {money(ex2Before)} to <strong>{money(ex2After)}</strong> — a rise of{" "}
        {money(Math.round((ex2After - ex2Before) * 100) / 100)}, not {money(singleRise)}. These examples ignore
        the assets test, which can pay a lower rate; Centrelink pays whichever test gives less.
      </p>

      <h2>Check your own payment</h2>
      <p>
        Your next payment amount shows in your Centrelink online account or the Express Plus app. To model
        wages, savings and the Work Bonus yourself, use the{" "}
        <Link href="/age-pension-income-test-calculator/">Age Pension income test calculator</Link>; for
        JobSeeker, the <Link href="/jobseeker-payment-calculator/">JobSeeker payment calculator</Link> already
        uses the 20 September rates. Payday timing is on the{" "}
        <Link href="/centrelink-payment-dates/">Centrelink payment dates</Link> page, and the rest of the
        income test rules are in our <Link href="/centrelink-income-test/">Centrelink income test guide</Link>.
      </p>
    </>
  );
}
