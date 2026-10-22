import Link from "next/link";
import { MEDICARE_LEVY, formatAUD } from "@/lib/constants";
import { afterTax, annualFromWeekly, headlineRow, rowAnnual, type Occupation } from "@/lib/data/job-pay-rates";
import {
  PUBLIC_HEALTH_PAY_VERIFIED_ON,
  annualIsPublished,
  annualOf,
  fortnightlyOf,
  notVerifiedFor,
  publicPayFor,
  type AlliedProfession,
  type StateScaleForProfession,
} from "@/lib/data/public-health-allied-pay";
import { HEADING_FONT, TableShell } from "./job-pay-shared";

// Public hospital pay by state, for the health job pages (23 Oct 2026).
//
// The answer box and the tables read the same rows from
// lib/data/public-health-allied-pay, so the box can only quote figures the
// tables print. Take-home pay comes from the site's tax engine (afterTax).

function money(n: number): string {
  return formatAUD(n, 2);
}

/**
 * The answer box at the top of a health job page: the JSA median, the ATO
 * average taxable income, the award minimum and the public hospital pay range
 * in each verified state, each state linked to its full table.
 */
export function PublicHospitalAnswerBox({ occ }: { occ: Occupation }) {
  if (!occ.publicHospital) return null;
  const rows = publicPayFor(occ.publicHospital.profession);
  if (rows.length === 0) return null;
  const headline = occ.award ? headlineRow(occ) : null;
  const atoRows = occ.ato ? occ.ato.rows.slice(0, occ.ato.takeHomeRows ?? 1) : [];
  const next = rows.filter((r) => r.instrument.nextIncrease !== null);
  return (
    <section
      id="salary-answer"
      aria-labelledby="salary-answer-heading"
      className="mb-6 rounded-xl border border-eucalyptus/40 bg-white p-5 shadow-sm"
    >
      <h2 id="salary-answer-heading" className="mb-1 text-lg font-bold text-navy" style={HEADING_FONT}>
        {occ.answerQuestion ?? `How much does a ${occ.name.toLowerCase()} earn in Australia?`}
      </h2>
      <p className="mb-4 text-sm text-warmgray">Full-time pay before tax. Each figure links to its source or table.</p>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {occ.median ? (
          <div className="border-b border-sandstone-dark/20 pb-2">
            <dt className="text-sm text-warmgray">
              <a href="#actual-earnings" className="hover:text-eucalyptus-dark hover:underline">
                Median pay, all employers
              </a>
            </dt>
            <dd className="text-base font-semibold text-navy">
              {formatAUD(occ.median.medianWeekly)} a week{" "}
              <span className="text-sm font-normal text-warmgray">
                (about {formatAUD(annualFromWeekly(occ.median.medianWeekly))} a year, Jobs and Skills Australia)
              </span>
            </dd>
          </div>
        ) : null}
        {atoRows.map((r) => (
          <div key={r.code} className="border-b border-sandstone-dark/20 pb-2">
            <dt className="text-sm text-warmgray">
              <a href="#ato-income" className="hover:text-eucalyptus-dark hover:underline">
                {r.title}: average taxable income
              </a>
            </dt>
            <dd className="text-base font-semibold text-navy">
              {formatAUD(r.avgTaxableIncome)}{" "}
              <span className="text-sm font-normal text-warmgray">({occ.ato!.incomeYear} tax returns, ATO)</span>
            </dd>
          </div>
        ))}
        {headline && occ.award ? (
          <div className="border-b border-sandstone-dark/20 pb-2">
            <dt className="text-sm text-warmgray">
              <a href="#pay-rates" className="hover:text-eucalyptus-dark hover:underline">
                Award minimum, private employers
              </a>
            </dt>
            <dd className="text-base font-semibold text-navy">
              {money(headline.hourly)} an hour{" "}
              <span className="text-sm font-normal text-warmgray">
                ({formatAUD(rowAnnual(headline))} a year, {occ.award.code})
              </span>
            </dd>
          </div>
        ) : null}
      </dl>
      <h3 className="mb-2 mt-5 text-base font-bold text-navy">Public hospital pay by state</h3>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.anchor} className="border-b border-sandstone-dark/20 pb-2">
            <dt className="text-sm text-warmgray">
              <a href={`#${r.anchor}`} className="hover:text-eucalyptus-dark hover:underline">
                {r.state.code}: {r.state.employer}
              </a>
            </dt>
            <dd className="text-base font-semibold text-navy">
              {formatAUD(r.entryAnnual)} to {formatAUD(r.topAnnual)}
              <span className="block text-xs font-normal text-warmgray">
                {r.entry.label} to {r.top.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      {next.length > 0 ? (
        <p className="mt-4 text-sm text-navy">
          <strong>Next scheduled rise:</strong>{" "}
          {next.map((r) => `${r.state.code}, ${r.instrument.nextIncrease}`).join("; ")}. No other state instrument sets
          one yet.
        </p>
      ) : null}
      <p className="mt-3 text-sm">
        <a href="#public-hospital-pay" className="font-medium text-eucalyptus-dark hover:underline">
          See every grade, with fortnightly and after-tax pay
        </a>
      </p>
    </section>
  );
}

function StateTable({ row, profession }: { row: StateScaleForProfession; profession: AlliedProfession }) {
  const { scale, instrument, state } = row;
  const anyWeekly = scale.steps.some((s) => typeof s.weekly === "number");
  const anyFortnightly = scale.steps.some((s) => fortnightlyOf(s) !== null);
  const anyNext = scale.steps.some((s) => typeof s.nextAnnual === "number");
  const professionNote = scale.professionNotes?.[profession];
  return (
    <section id={row.anchor} className="scroll-mt-24">
      <h3 style={HEADING_FONT}>
        {state.name}: {scale.title}
      </h3>
      <p>
        Set by the{" "}
        <a href={instrument.source.url} target="_blank" rel="noreferrer noopener">
          {instrument.name}
        </a>{" "}
        ({instrument.tribunal}). These rates apply from {instrument.ratesFrom}. {instrument.status}
      </p>
      <p>{scale.entryRule}</p>
      {professionNote ? <p>{professionNote}</p> : null}
      <TableShell minWidth="44rem" caption={`${state.name} public hospital pay: ${scale.title}`}>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-3">
              Grade and step
            </th>
            {anyWeekly ? (
              <th scope="col" className="px-4 py-3 text-right">
                Weekly
              </th>
            ) : null}
            {anyFortnightly ? (
              <th scope="col" className="px-4 py-3 text-right">
                Fortnightly
              </th>
            ) : null}
            <th scope="col" className="px-4 py-3 text-right">
              A year
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              After tax a year
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              After tax a fortnight
            </th>
            {anyNext ? (
              <th scope="col" className="px-4 py-3 text-right">
                From {instrument.nextIncrease?.replace(/^the first full pay period on or after /, "")}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {scale.steps.map((step) => {
            const annual = annualOf(step);
            const fortnightly = fortnightlyOf(step);
            const net = afterTax(annual);
            const isEntry = step.label === scale.entry;
            return (
              <tr key={step.label} className={isEntry ? "bg-eucalyptus-light/30" : undefined}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                  {step.label}
                  {step.note ? <span className="block text-xs font-normal text-warmgray">{step.note}</span> : null}
                </th>
                {anyWeekly ? (
                  <td className="px-4 py-3 text-right">{typeof step.weekly === "number" ? money(step.weekly) : "-"}</td>
                ) : null}
                {anyFortnightly ? (
                  <td className="px-4 py-3 text-right">
                    {fortnightly !== null ? formatAUD(fortnightly, typeof step.fortnightly === "number" ? 0 : 2) : "-"}
                    {fortnightly !== null && typeof step.fortnightly !== "number" ? (
                      <span className="block text-xs font-normal text-warmgray-light">weekly x 2</span>
                    ) : null}
                  </td>
                ) : null}
                <td className="px-4 py-3 text-right font-semibold text-navy">
                  {formatAUD(annual)}
                  {annualIsPublished(step) ? null : (
                    <span className="block text-xs font-normal text-warmgray-light">weekly x 52</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">{formatAUD(net.netAnnual)}</td>
                <td className="px-4 py-3 text-right">{formatAUD(net.netFortnightly)}</td>
                {anyNext ? (
                  <td className="px-4 py-3 text-right">
                    {typeof step.nextAnnual === "number" ? formatAUD(step.nextAnnual) : "-"}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </TableShell>
      {(scale.notes ?? []).length > 0 ? (
        <ul className="text-base">
          {(scale.notes ?? []).map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-sm text-warmgray">
        The shaded row is the start figure in the summary at the top of this page.{" "}
        {scale.topNote[0].toUpperCase() + scale.topNote.slice(1)}. Read from the source on {instrument.verifiedOn}.
      </p>
    </section>
  );
}

/** "Public hospital pay by state": one table per verified state, then the states not covered. */
export function PublicHospitalSection({ occ }: { occ: Occupation }) {
  if (!occ.publicHospital) return null;
  const { profession, intro } = occ.publicHospital;
  const rows = publicPayFor(profession);
  if (rows.length === 0) return null;
  const missing = notVerifiedFor(profession);
  const anyOverSurcharge = rows.some((r) => r.topAnnual >= MEDICARE_LEVY.surcharge.tier1.min);
  return (
    <section id="public-hospital-pay">
      <h2 style={HEADING_FONT}>Public hospital {occ.name.toLowerCase()} pay by state</h2>
      <p>{intro}</p>
      <p className="text-base">
        Yearly figures are the instrument&rsquo;s own salary, or the weekly rate x 52 where it sets weekly pay.
        Fortnightly figures are the published fortnightly rate, or the weekly rate x 2; scales that set only a yearly
        salary have no fortnightly column. After-tax pay uses 2026&ndash;27 resident tax rates, the Medicare levy and no
        HECS-HELP
        {anyOverSurcharge ? ", assuming private hospital cover above the Medicare levy surcharge threshold" : ""}, the
        same as our <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>. Shift penalties,
        allowances and super are on top.
      </p>
      {rows.map((r) => (
        <StateTable key={r.anchor} row={r} profession={profession} />
      ))}
      {missing.length > 0 ? (
        <>
          <h3 style={HEADING_FONT}>States not shown yet</h3>
          <ul>
            {missing.map((m) => (
              <li key={m.state}>
                <strong>{m.state}:</strong> {m.reason}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="text-sm text-warmgray">Every table was read from its source on {PUBLIC_HEALTH_PAY_VERIFIED_ON}.</p>
    </section>
  );
}

/** Sidebar line: the lowest and highest public hospital figure across states. */
export function publicHospitalRange(occ: Occupation): { low: number; high: number } | null {
  if (!occ.publicHospital) return null;
  const rows = publicPayFor(occ.publicHospital.profession);
  if (rows.length === 0) return null;
  return {
    low: Math.min(...rows.map((r) => r.entryAnnual)),
    high: Math.max(...rows.map((r) => r.topAnnual)),
  };
}
