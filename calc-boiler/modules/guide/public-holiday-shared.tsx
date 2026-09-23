// Presentational pieces shared by /public-holiday-pay/ and its state pages,
// plus the small link the award pages print on their public holiday rows.
// Server components. Tables are plain semantic HTML (caption, scoped headers,
// <time datetime>) — no Event markup: a public holiday is not an event.

import Link from "next/link";
import {
  PUBLIC_HOLIDAY_AWARD_RATES,
  formatHolidayDate,
  pctLabel,
  type HolidayYear,
  type PublicHolidayDate,
  type RegionalHolidayTable,
} from "@/lib/data/public-holidays";
import { TableShell } from "./job-pay-shared";

const KIND_LABEL: Record<PublicHolidayDate["kind"], string> = {
  statewide: "Whole state",
  additional: "Additional day",
  "part-day": "Part day",
  regional: "Part of state",
  limited: "Some employers",
};

export function HolidayYearTable({ year, code }: { year: HolidayYear; code: string }) {
  return (
    <>
      <TableShell caption={`${code} public holidays ${year.year}`} minWidth="30rem">
        <thead className="bg-navy text-white">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Public holiday
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Date {year.year}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Applies
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/10 bg-white">
          {year.holidays.map((h) => (
            <tr key={`${h.date}-${h.name}`} className={h.kind === "statewide" ? "" : "bg-sandstone/40"}>
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-navy">
                {h.name}
                {h.note ? <span className="block text-xs font-normal text-warmgray">{h.note}</span> : null}
              </th>
              <td className="whitespace-nowrap px-4 py-2.5 text-navy">
                <time dateTime={h.date}>{formatHolidayDate(h.date, false)}</time>
                {h.hours ? <span className="block text-xs text-warmgray">{h.hours}</span> : null}
              </td>
              <td className="px-4 py-2.5 text-xs text-warmgray">{KIND_LABEL[h.kind]}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      {year.omitted?.length ? (
        <ul className="-mt-2 mb-6 text-sm text-warmgray">
          {year.omitted.map((o) => (
            <li key={o.name}>
              <strong className="text-navy">{o.name}:</strong> not shown. {o.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function RegionalTable({ table }: { table: RegionalHolidayTable }) {
  const years = Array.from(new Set(table.rows.flatMap((r) => r.dates.map((d) => d.date.slice(0, 4))))).sort();
  return (
    <>
      <TableShell caption={table.title} minWidth="32rem">
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-3">
              Holiday
            </th>
            {years.map((y) => (
              <th key={y} scope="col" className="px-4 py-3">
                {y}
              </th>
            ))}
            <th scope="col" className="px-4 py-3">
              Where
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/10 bg-white">
          {table.rows.map((r) => (
            <tr key={`${r.name}-${r.area}`}>
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-navy">
                {r.name}
                {r.note ? <span className="block text-xs font-normal text-warmgray">{r.note}</span> : null}
              </th>
              {years.map((y) => {
                const d = r.dates.find((x) => x.date.startsWith(y));
                return (
                  <td key={y} className="whitespace-nowrap px-4 py-2.5 text-navy">
                    {d ? <time dateTime={d.date}>{formatHolidayDate(d.date, false)}</time> : <span className="text-warmgray-light">–</span>}
                  </td>
                );
              })}
              <td className="px-4 py-2.5 text-xs text-warmgray">{r.area}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      <p className="-mt-2 text-sm text-warmgray">
        {table.footnote ? `${table.footnote} ` : ""}Source:{" "}
        <a href={table.sourceUrl} target="_blank" rel="noreferrer noopener">
          {table.sourceTitle}
        </a>
        .
      </p>
    </>
  );
}

/** The 14 awards' public holiday rates, permanent and casual, as multiples of the base rate. */
export function AwardPublicHolidayTable() {
  return (
    <TableShell caption="Public holiday pay rates by modern award" minWidth="40rem">
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-4 py-3">
            Award
          </th>
          <th scope="col" className="px-4 py-3">
            Full-time / part-time
          </th>
          <th scope="col" className="px-4 py-3">
            Casual
          </th>
          <th scope="col" className="px-4 py-3">
            Notes
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/10 bg-white">
        {PUBLIC_HOLIDAY_AWARD_RATES.map((a) => (
          <tr key={a.key}>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              <Link href={a.href} className="text-eucalyptus-dark hover:underline">
                {a.shortName}
              </Link>
              <span className="block text-xs font-normal text-warmgray">
                {a.code}
                {a.clause ? ` · ${a.clause}` : ""}
              </span>
            </th>
            <td className="px-4 py-3 font-semibold text-navy">{pctLabel(a.permanent)}</td>
            <td className="px-4 py-3 font-semibold text-navy">
              {pctLabel(a.casual)}
              {a.casualCompounded ? (
                <span className="block text-xs font-normal text-warmgray">({pctLabel(a.casualAsPrinted)} of casual rate)</span>
              ) : null}
            </td>
            <td className="px-4 py-3 text-xs text-warmgray">{a.note ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

/** Small link printed under an award page's public holiday row. */
export function PublicHolidayRowLink() {
  return (
    <Link href="/public-holiday-pay/" className="mt-1 block text-xs font-normal text-eucalyptus-dark hover:underline">
      Public holiday pay calculator &amp; dates by state →
    </Link>
  );
}
