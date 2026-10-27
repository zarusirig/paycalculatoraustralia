import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { getTrade } from "@/lib/data/apprentice-pay";
import {
  ADULT_FAQ_ANSWERS,
  STAGES,
  headlineRate,
  spokeAdultRate,
  type ApprenticeSpoke,
} from "@/lib/data/apprentice-pay/spokes";
import type { ApprenticeStage } from "@/lib/data/apprentice-pay";
import type { Faq } from "./t3-shared";

// Shared by the spoke page body and its FAQPage JSON-LD. Rates come from
// lib/data/apprentice-pay (awards and FWO pay guides read 9 October 2026); tax
// from the site's single 2026-27 engine.

const f2 = (n: number) => formatAUD(n, 2);

export interface StageTakeHome {
  stage: ApprenticeStage;
  /** Annual gross at the headline minimum for 38 hours, 52 weeks. */
  annual: number;
  /** Weekly take-home, resident, private hospital cover, no HELP debt. */
  weekly: number;
}

/**
 * Take-home at the headline minimum, 38 hours a week, all year. For building trades that is the FWO pay guide
 * rate on a general building site, which includes the all-purpose tool and industry allowances; for every other
 * trade it is the award wage without allowances.
 */
export function stageTakeHome(spoke: ApprenticeSpoke, stage: ApprenticeStage, year12: "completed" | "not-completed"): StageTakeHome {
  const r = headlineRate(spoke, stage, year12);
  const annual = Math.round(r.hourly * 38 * 52);
  const b = calculatePayBreakdown({ grossSalary: annual, hasPrivateHealth: true });
  return { stage, annual, weekly: b.weekly };
}

/** Plural lower-case noun for sentences: "carpenters", "chefs". */
export const workers = (s: ApprenticeSpoke) => `${s.label.toLowerCase()}s`;

export function spokeFaqs(spoke: ApprenticeSpoke): Faq[] {
  const trade = getTrade(spoke.tradeSlug)!;
  const split = trade.junior.some((r) => r.year12 !== "either");
  const label = spoke.label.toLowerCase();
  const y1y = headlineRate(spoke, 1, "completed");
  const y1n = headlineRate(spoke, 1, "not-completed");
  const y4y = headlineRate(spoke, 4, "completed");
  const y4n = headlineRate(spoke, 4, "not-completed");
  const th1 = stageTakeHome(spoke, 1, "completed");
  const th4 = stageTakeHome(spoke, 4, "completed");
  const adult1 = spokeAdultRate(spoke, 1);
  const adult4 = spokeAdultRate(spoke, 4);
  const w = workers(spoke);
  const pg = spoke.payGuide;

  let firstAnswer: string;
  if (pg) {
    const r1y = headlineRate(spoke, 1, "completed", "residential");
    const r1n = headlineRate(spoke, 1, "not-completed", "residential");
    firstAnswer = `From 1 July 2026 the minimum for a first-year apprentice ${label} on a general building, civil or engineering construction site is ${f2(y1n.hourly)} an hour (${f2(y1n.weekly)} a week) without Year 12 and ${f2(y1y.hourly)} an hour (${f2(y1y.weekly)} a week) with it. That includes the $${pg.toolAllowance.toFixed(2)} tool allowance and the $67.15 industry allowance, which the award pays apprentices for all purposes. On residential building work it is ${f2(r1n.hourly)} and ${f2(r1y.hourly)} an hour.`;
  } else if (split) {
    firstAnswer = `From 1 July 2026 the award minimum for a first-year apprentice ${label} is ${f2(y1n.hourly)} an hour (${f2(y1n.weekly)} a week) if they did not complete Year 12 and ${f2(y1y.hourly)} an hour (${f2(y1y.weekly)} a week) if they did, for a 38-hour week. ${trade.includesAllowances ? "That rate already includes the all-purpose allowances." : "Allowances are paid on top where they apply."} An enterprise agreement or the employer may pay more.`;
  } else {
    firstAnswer = `From 1 July 2026 the award minimum for a first-year apprentice ${label} is ${f2(y1y.hourly)} an hour (${f2(y1y.weekly)} a week for 38 hours), with no difference for Year 12 completion. Allowances are paid on top where they apply, and an enterprise agreement or the employer may pay more.`;
  }
  const first: Faq = { q: `How much does a first-year apprentice ${label} earn?`, a: firstAnswer };

  const fourth: Faq = {
    q: `How much does a fourth-year apprentice ${label} earn?`,
    a: pg
      ? `The minimum in fourth year is ${f2(y4y.hourly)} an hour (${f2(y4y.weekly)} a week) on a general building site and ${f2(headlineRate(spoke, 4, "completed", "residential").hourly)} an hour on residential work, from 1 July 2026, with or without Year 12. Both include the tool and industry allowances.`
      : split && y4n.hourly !== y4y.hourly
        ? `The award minimum in fourth year is ${f2(y4n.hourly)} an hour (${f2(y4n.weekly)} a week) without Year 12 and ${f2(y4y.hourly)} an hour (${f2(y4y.weekly)} a week) with it, from 1 July 2026. That is before any allowances that sit outside the rate.`
        : `The award minimum in fourth year is ${f2(y4y.hourly)} an hour (${f2(y4y.weekly)} a week, about ${formatAUD(Math.round(y4y.hourly * 38 * 52), 0)} a year for 38 hours), from 1 July 2026. ${trade.includesAllowances ? "That rate already includes the all-purpose allowances." : "That is before any allowances that sit outside the rate."}`,
  };

  const afterTax: Faq = {
    q: `How much do apprentice ${w} earn after tax?`,
    a: `On the ${pg ? "general building site minimum, which includes the tool and industry allowances," : "award wage alone"} for 38 hours a week all year, a first-year apprentice ${label} (Year 12 completed) earns about ${formatAUD(th1.annual, 0)} a year before tax and takes home about ${f2(th1.weekly)} a week. In fourth year the same hours give about ${formatAUD(th4.annual, 0)} gross and ${f2(th4.weekly)} a week after tax and the Medicare levy. These use the 2026-27 resident rates, private hospital cover and no HELP debt, and leave out ${pg ? "overtime and other allowances" : "allowances and overtime"}.`,
  };

  const adult: Faq = {
    q: `Do adult apprentice ${w} get paid more than juniors?`,
    a: adult1 && adult4
      ? `Under the award, an apprentice who starts at 21 or older is paid ${f2(adult1.hourly)} an hour in first year and ${f2(adult4.hourly)} an hour in fourth year (from 1 July 2026), against ${f2(y1y.hourly)} and ${f2(y4y.hourly)} for a junior with Year 12. Someone already employed by the same employer before the apprenticeship usually cannot be paid less than they were. An enterprise agreement can differ.`
      : (ADULT_FAQ_ANSWERS[spoke.slug] ??
        "The award's rates for a start at 21 or older work differently and are not set as a simple table on this page. Check the adult apprentice section above and the award clause it names, and ask your employer which rule they applied to you."),
  };

  const rise: Faq = {
    q: `When does an apprentice ${label}'s pay go up?`,
    a: `Two things lift it. The wage steps up at each stage of the apprenticeship, usually each year, and earlier where the award lets an apprentice move up when they complete enough of their training plan for the ${spoke.qualification.title}. And every award minimum rises each 1 July with the Fair Work Commission's Annual Wage Review, from the first full pay period starting on or after that date.`,
  };

  return [first, fourth, afterTax, adult, ...spoke.faqs, rise];
}

export { STAGES };
