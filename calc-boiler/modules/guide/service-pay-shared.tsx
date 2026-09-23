// Shared presentational pieces for the F5 pay-table clusters: /paramedic-pay/,
// /police-pay/, /firefighter-pay/, /air-traffic-controller-salary/ and
// /pilot-salary/. Server components.

import Link from "next/link";
import { Info } from "lucide-react";
import { formatAUD } from "@/lib/constants";
import { isExactTakeHome, nearestTakeHome, takeHomeHref } from "@/lib/data/service-pay";
import type { ServicePayScale } from "@/lib/data/service-pay/types";
import { HEADING_FONT, TableShell } from "./job-pay-shared";

/**
 * A salary that links to its take-home page. /take-home-pay-on/ runs in $1,000
 * steps to $150k and wider steps above, so where the salary has no page of its
 * own the link says it goes to the nearest one.
 */
export function SalaryLink({ salary }: { salary: number }) {
  const nearest = nearestTakeHome(salary);
  const label = isExactTakeHome(salary)
    ? `See take-home pay on ${formatAUD(salary)}`
    : `See take-home pay on ${formatAUD(nearest)}, the nearest page to ${formatAUD(salary)}`;
  return (
    <Link
      href={takeHomeHref(salary)}
      title={label}
      aria-label={label}
      className="font-medium text-navy underline decoration-eucalyptus/40 decoration-dotted underline-offset-4 transition-colors hover:text-eucalyptus-dark hover:decoration-eucalyptus"
    >
      {formatAUD(salary)}
    </Link>
  );
}

export function ScaleTable({ scale, caption }: { scale: ServicePayScale; caption: string }) {
  return (
    <div className="not-prose my-8">
      <h3 className="mb-2 text-xl font-bold text-navy" style={HEADING_FONT} id={scale.id}>
        {scale.title}
      </h3>
      <p className="mb-2 text-warmgray">{scale.intro}</p>
      {scale.effectiveFrom ? (
        <p className="mb-2 text-sm font-medium text-navy">Rates in this table apply from {scale.effectiveFrom}.</p>
      ) : null}
      <TableShell caption={caption}>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-5 py-3">
              {scale.stepHeading}
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Annual salary
            </th>
            <th scope="col" className="px-5 py-3">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {scale.steps.map((step) => (
            <tr key={`${scale.id}-${step.label}`}>
              <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                {step.label}
              </th>
              <td className="whitespace-nowrap px-5 py-3 text-right">
                <SalaryLink salary={step.salary} />
              </td>
              <td className="px-5 py-3 text-warmgray">{step.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}

export function RangeTable({
  rows,
  caption,
}: {
  rows: { id: string; title: string; low: number; high: number; steps: number }[];
  caption: string;
}) {
  return (
    <TableShell caption={caption} minWidth="30rem">
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-5 py-3">
            Pay table
          </th>
          <th scope="col" className="px-5 py-3 text-right">
            Rows
          </th>
          <th scope="col" className="px-5 py-3 text-right">
            From
          </th>
          <th scope="col" className="px-5 py-3 text-right">
            To
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row" className="px-5 py-3 text-left font-medium">
              <a href={`#${row.id}`} className="text-navy hover:text-eucalyptus-dark hover:underline">
                {row.title}
              </a>
            </th>
            <td className="px-5 py-3 text-right">{row.steps}</td>
            <td className="whitespace-nowrap px-5 py-3 text-right">
              <SalaryLink salary={row.low} />
            </td>
            <td className="whitespace-nowrap px-5 py-3 text-right">
              {row.high !== row.low ? <SalaryLink salary={row.high} /> : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

export function NoticeList({ notices }: { notices: string[] }) {
  if (notices.length === 0) return null;
  return (
    <div className="not-prose mb-8 space-y-3">
      {notices.map((notice) => (
        <div key={notice} className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" aria-hidden="true" />
          <p className="text-sm text-navy">{notice}</p>
        </div>
      ))}
    </div>
  );
}

export function TakeHomeLinkNote() {
  return (
    <p className="text-sm text-warmgray">
      Every salary links to its take-home figure. Take-home pages exist for every $1,000 up to $150,000 and in wider
      steps above that, so a salary without a page of its own links to the nearest one.
    </p>
  );
}
