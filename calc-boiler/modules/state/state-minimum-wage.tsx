import Link from "next/link";
import { EMPLOYMENT, formatAUD } from "@/lib/constants";
import { QLD_STATE_WAGE_CASE_2026, WA_STATE_MINIMUM_WAGE, roundCents } from "@/lib/constants/minimum-wage";
import { H2 } from "./state-sections";

// "Minimum wage and state awards" block for the eight /pay-calculator-<state>/
// pages. Who sits outside the national system comes from the Fair Work
// Ombudsman's "Fair Work system" page (read 5 Oct 2026). State wage-case
// figures come from lib/constants/minimum-wage.ts (QLD, WA) and, for NSW, the
// NSW Industrial Relations Commission's State Wage Case 2026 [2026] NSWIRComm
// 16 (orders made 25 August 2026, read 5 Oct 2026). A state with no state-set
// minimum is said to have none only where the FWO page says its private sector
// is in the national system; nothing else is asserted.

export type StateKey = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";

const FWO_SYSTEM_URL = "https://www.fairwork.gov.au/about-us/workplace-laws/fair-work-system";

/** Plain-English summary of who is outside the national system, per the FWO page. */
const STATE_SYSTEM: Record<StateKey, { name: string; outside: string }> = {
  nsw: { name: "New South Wales", outside: "State public sector and local government employees are not covered by the national system and remain under the NSW state system. Most private-sector employees are in the national system." },
  vic: { name: "Victoria", outside: "Most employees in Victoria are covered by the national system, including state government employees with some exceptions such as senior public servants. There is no separate Victorian minimum wage." },
  qld: { name: "Queensland", outside: "State public sector and local government employees are not covered by the national system and remain under the Queensland state system. Most private-sector employees are in the national system." },
  wa: { name: "Western Australia", outside: "Western Australian State public sector employers and local government entities, plus sole traders, partnerships, other unincorporated entities and non-trading corporations, are covered by the state system. Employees of trading companies are in the national system." },
  sa: { name: "South Australia", outside: "State public sector and local government employees are not covered by the national system and remain under the South Australian state system. Most private-sector employees are in the national system." },
  tas: { name: "Tasmania", outside: "State public sector employees remain under the Tasmanian state system. Local government employees are covered by the national system, as are most private-sector employees." },
  act: { name: "the ACT", outside: "Generally, all employees and employers in the ACT are covered by the national system, so there is no separate ACT minimum wage." },
  nt: { name: "the Northern Territory", outside: "Generally, all employees and employers in the Northern Territory are covered by the national system, so there is no separate NT minimum wage." },
};

export default function StateMinimumWage({ state }: { state: StateKey }) {
  const s = STATE_SYSTEM[state];
  const money = (v: number) => formatAUD(v, 2);
  const qld = QLD_STATE_WAGE_CASE_2026;
  const qmwHourly = roundCents(qld.qmwWeekly / EMPLOYMENT.standardWeeklyHours);
  return (
    <section id="state-minimum-wage">
      <H2>Minimum wage and state awards in {s.name}</H2>
      <p className="mb-3 text-warmgray">
        The National Minimum Wage is{" "}
        <strong className="text-navy">{money(EMPLOYMENT.minimumWageHourly)} an hour</strong> ({money(EMPLOYMENT.minimumWageWeekly)} for a{" "}
        {EMPLOYMENT.standardWeeklyHours}-hour week) from 1 July 2026, and it applies to adults in the national system whatever the state. Most
        people earn an award rate above it: see{" "}
        <Link href="/minimum-wage-australia/" className="text-eucalyptus-dark hover:underline">what the minimum wage in Australia is</Link>{" "}
        and the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates guide</Link>.
      </p>
      <p className="mb-3 text-warmgray">{s.outside}</p>
      {state === "wa" && (
        <p className="mb-3 text-warmgray">
          For employees in the WA state system, the adult State Minimum Wage is{" "}
          <strong className="text-navy">{money(WA_STATE_MINIMUM_WAGE.weekly)} a week ({money(WA_STATE_MINIMUM_WAGE.hourly)} an hour)</strong> from{" "}
          {WA_STATE_MINIMUM_WAGE.operativeFrom}, set by the {WA_STATE_MINIMUM_WAGE.setBy}, up {(WA_STATE_MINIMUM_WAGE.increase * 100).toFixed(2)}%.
        </p>
      )}
      {state === "qld" && (
        <p className="mb-3 text-warmgray">
          The Queensland Industrial Relations Commission&rsquo;s State Wage Case 2026 (Declaration of General Ruling, [2026] QIRC 281, delivered {qld.deliveredOn}) lifted
          state award wages for full-time adults by {(qld.increase * 100).toFixed(2)}% and set the Queensland Minimum Wage at{" "}
          <strong className="text-navy">{money(qld.qmwWeekly)} a week</strong>, operative from {qld.operativeFrom}. An award-free part-time or casual
          employee in the state system gets that weekly figure divided by 38, about {money(qmwHourly)} an hour. This applies to employees in the Queensland
          state system, not to the private-sector employees who are covered by the {money(EMPLOYMENT.minimumWageHourly)} national rate.
        </p>
      )}
      {state === "nsw" && (
        <p className="mb-3 text-warmgray">
          The NSW Industrial Relations Commission&rsquo;s State Wage Case 2026 ([2026] NSWIRComm 16, orders made 25 August 2026) adopted the Fair Work
          Commission&rsquo;s 4.75% increase for NSW state minimum rates awards, from the first full pay period on or after 1 July 2026 for most of them and
          1 September 2026 for a few. If you are paid under a NSW state award, check the current rate schedule on the{" "}
          <a href="https://irc.nsw.gov.au/content/dcj/ctsd/irc/irc/major-cases-and-decisions/state-wage-case-2026.html" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">NSW IRC State Wage Case 2026</a> page.
        </p>
      )}
      <p className="text-sm text-warmgray-light">
        Source:{" "}
        <a href={FWO_SYSTEM_URL} target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman, Fair Work system</a>, read 5 October 2026.
        Check with Fair Work or your state industrial commission if you are unsure which system covers your employer.
      </p>
    </section>
  );
}
