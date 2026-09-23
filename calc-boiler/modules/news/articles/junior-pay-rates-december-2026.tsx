import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import { EMPLOYMENT } from "@/lib/constants/australian-tax";
import { CASUAL_LOADING, JUNIOR_TRANSITION_SCHEDULES, PENDING_JUNIOR_CHANGE } from "@/lib/constants/junior-rates";
import { FAST_FOOD_LEVEL_1 } from "@/lib/constants/minimum-wage";

const money = (n: number) => formatAUD(n, 2);
const r2 = (n: number) => Math.round(n * 100 + Number.EPSILON) / 100;
/** Award junior hourly rate: percentage of the adult WEEKLY rate, then ÷ 38 (Fair Work's rounding). */
const juniorHourly = (adultWeekly: number, pct: number) => r2((adultWeekly * pct) / 100 / EMPLOYMENT.standardWeeklyHours);

const HOURS = 15; // a casual working three 5-hour shifts a week

export default function JuniorPayRatesDecember2026() {
  const P = PENDING_JUNIOR_CHANGE;
  const ff = JUNIOR_TRANSITION_SCHEDULES.fastFood;
  const retail = JUNIOR_TRANSITION_SCHEDULES.retail;
  const pharmacy = JUNIOR_TRANSITION_SCHEDULES.pharmacy;
  const dec = ff.rows[0];
  const ages = [
    { age: "18", now: ff.present.age18, dec: dec.age18 },
    { age: "19", now: ff.present.age19, dec: dec.age19 },
    { age: "20", now: ff.present.age20, dec: dec.age20 },
  ];
  const w = FAST_FOOD_LEVEL_1.weekly;
  const casual19Now = r2(juniorHourly(w, ff.present.age19) * (1 + CASUAL_LOADING));
  const casual19Dec = r2(juniorHourly(w, dec.age19) * (1 + CASUAL_LOADING));
  const lastStep = ff.rows[ff.rows.length - 1];

  return (
    <>
      <p className="lead">
        Workers aged 18 to 20 in retail, fast food and pharmacy start moving to the full adult rate from{" "}
        <strong>{P.earliestStart}</strong>. The Fair Work Commission settled the timetable on{" "}
        {P.implementationDecidedOn} ({P.implementationDecision}): the first step lifts an 18-year-old fast food
        worker from {ff.present.age18}% to {dec.age18}% of the adult rate, and more steps follow every six to twelve
        months until {lastStep.effective}. Only employees with {P.serviceQualifier} qualify.
      </p>

      <NewsKeyFacts
        title={`Fast Food Level 1 junior hourly rates, more than 6 months' service`}
        rows={ages.map((a) => ({
          label: `Age ${a.age}`,
          before: `${a.now}% — ${money(juniorHourly(w, a.now))}`,
          after: `${a.dec}% — ${money(juniorHourly(w, a.dec))} from ${dec.effective}`,
        }))}
      />

      <h2>What the Commission decided</h2>
      <p>
        The Shop, Distributive and Allied Employees&apos; Association applied to remove junior rates for adults aged
        18 and over. In its principal decision ({P.decision}, {P.decidedOn}) the Commission agreed that 18 to
        20-year-olds with more than six months with their employer should get the adult rate, and the August
        implementation decision set how fast. The determinations say they come into operation on {P.earliestStart}
        and apply to each employee from their first full pay period starting on or after that date. Rates for
        under-18s do not change, and neither do rates for 18 to 20-year-olds with six months&apos; service or less.
        Service with a previous employer counts where there has been a transfer of business.
      </p>

      <h2>The timetable for each award</h2>
      <div className="overflow-x-auto not-prose my-6 rounded-xl border border-sandstone-dark/20">
        <table className="min-w-full text-sm text-navy">
          <thead className="bg-sandstone text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">From</th>
              <th className="px-4 py-2 font-semibold">Fast food (18 / 19 / 20)</th>
              <th className="px-4 py-2 font-semibold">Retail levels 1–3 (18 / 19)</th>
              <th className="px-4 py-2 font-semibold">Pharmacy assistants (18 / 19 / 20)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            <tr>
              <td className="px-4 py-2">Now</td>
              <td className="px-4 py-2">{ff.present.age18}% / {ff.present.age19}% / {ff.present.age20}%</td>
              <td className="px-4 py-2">{retail.present.age18}% / {retail.present.age19}%</td>
              <td className="px-4 py-2">{pharmacy.present.age18}% / {pharmacy.present.age19}% / {pharmacy.present.age20}%</td>
            </tr>
            {ff.rows.map((r, i) => {
              const rr = retail.rows[i];
              const ph = pharmacy.rows.find((x) => x.effective === r.effective);
              return (
                <tr key={r.effective}>
                  <td className="px-4 py-2">{r.effective}</td>
                  <td className="px-4 py-2">{r.age18}% / {r.age19}% / {r.age20}%</td>
                  <td className="px-4 py-2">{rr.age18}% / {rr.age19}%</td>
                  <td className="px-4 py-2">{ph ? `${ph.age18}% / ${ph.age19}% / ${ph.age20}%` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>
        Retail 20-year-olds with more than six months&apos; service already get {retail.present.age20}%, so in retail
        only 18 and 19-year-olds move, and only at retail employee levels 1 to 3. Pharmacy follows a separate
        schedule agreed with the Pharmacy Guild for pharmacy assistants levels 1 and 2 — a five-point first step in December 2026, then steps of up to ten points each 1 July to 2029 —
        which the Commission adopted by consent.
      </p>

      <h2>Worked example: a 19-year-old casual in fast food</h2>
      <p>
        A Level 1 fast food employee aged 19 who has worked for the same business for more than six months is on{" "}
        {ff.present.age19}% of the adult rate of {money(w)} a week. As a casual, that is {money(casual19Now)} an hour
        including the {Math.round(CASUAL_LOADING * 100)}% loading. From their first full pay period on or after{" "}
        {dec.effective} it becomes {dec.age19}%, or <strong>{money(casual19Dec)} an hour</strong> — about{" "}
        {money(r2((casual19Dec - casual19Now) * HOURS))} more for a {HOURS}-hour week before tax, before any weekend or
        evening penalties. Hourly figures here apply the percentage to the adult weekly rate and divide by 38.
      </p>
      <p>
        To check your own rate, see our <Link href="/junior-pay-rates/">junior pay rates</Link> guide and the{" "}
        <Link href="/fast-food-award-rates/">fast food</Link>, <Link href="/retail-award-rates/">retail</Link> and{" "}
        <Link href="/pharmacy-award-rates/">pharmacy</Link> award pages, or work out a week&apos;s pay with the{" "}
        <Link href="/casual-loading-calculator/">casual loading calculator</Link>.
      </p>
    </>
  );
}
