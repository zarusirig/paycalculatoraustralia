// G3 (wave 4, 24 Sep 2026) — six more health professionals on the Health
// Professionals and Support Services Award 2020 [MA000027]: radiographer,
// sonographer, speech pathologist, audiologist, podiatrist and dietitian.
//
// Keyword demand (DataForSEO Labs, AU, 24 Sep 2026): radiographer salary 3,600
// (+ "radiographer salary australia" 1,000); sonographer salary 3,600 +
// sonographer pay 3,600 + "sonographer salary australia" 1,300; speech
// pathologist salary 3,600; podiatrist salary 1,000; audiologist salary 880;
// dietitian salary 720. All KD 0.
//
// Rolled 9 October 2026 to the structure in force from the first full pay
// period starting on or after 1 October 2026 (determination PR814029, read
// 9 October 2026 from
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf and the
// consolidated award at awards.fairwork.gov.au/MA000027.html). Level 1 pay is
// now set by the AQF level Schedule B.3 gives the profession, and years of
// experience at Level 1. Schedule B.3, verbatim: "Audiologist" AQF Level 9;
// "Dietitian" AQF Level 7, 8, 9; "Medical Imaging Technologist (MIT)
// (including: Medical Radiographer; Magnetic Resonance Imaging Technologist)"
// AQF Level 7; "Podiatrist" AQF Level 7; "Sonographer" AQF Level 8; "Speech
// Pathologist" AQF Level 7, 8, 9.
//
// Every dollar figure below is read from the rate tables (health-
// professionals-oct-2026.ts), never re-typed or scaled here. Where a
// profession lists more than one AQF level, pages headline the lowest (the
// least a qualified graduate can be paid) and table the others.
//
// Imaging practices. Cl 13.2(c)–(d) set special ordinary-hours spans for
// private medical imaging practices (7.00 am–9.00 pm Mon–Fri and 8.00 am–1.00
// pm Sat for 5.5-day practices; 7.00 am–9.00 pm Mon–Sun for 7-day practices),
// quoted on the radiographer and sonographer pages.

import {
  HPSS_OCT_2026_FIRST_YEAR_PENALTIES,
  hpssOct2026Level1Rows,
  hpssOct2026SeniorRows,
  type HpssAqfLevel,
} from "./health-professionals-oct-2026";
import type { OccupationFaq } from "./types";

const money = (n: number) => `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dollars = (n: number) => `$${n.toLocaleString("en-AU")}`;
/** Full-time annual equivalent, 52 weeks to the dollar — the same rule as index.ts annualFromWeekly (not imported: index imports this file). */
const annualFromWeekly = (weekly: number) => Math.round(weekly * 52);

/** Published figures for a 1st-year Level 1 employee at one AQF level, formatted for prose. */
export function firstYear(aqf: HpssAqfLevel) {
  const rows = hpssOct2026Level1Rows(aqf);
  const r = rows[0];
  const p = HPSS_OCT_2026_FIRST_YEAR_PENALTIES[aqf];
  return {
    label: r.label,
    weekly: money(r.weekly),
    hourly: money(r.hourly),
    annual: dollars(annualFromWeekly(r.weekly)),
    casual: money(r.casualHourly!),
    weekend: money(p.weekend),
    publicHoliday: money(p.publicHoliday),
    /** Hourly rates for the 2nd–3rd, 4th–6th and 7th year+ bands. */
    later: rows.slice(1).map((x) => money(x.hourly)),
  };
}

export const IMAGING_HOURS_NOTICE =
  "Private medical imaging practices have their own ordinary-hours span (cl 13.2(c)–(d)): 7.00 am to 9.00 pm Monday to Friday and 8.00 am to 1.00 pm Saturday in a 5.5-day practice, or 7.00 am to 9.00 pm every day in a 7-day practice. Work inside that span is ordinary time; weekend penalty rates still apply to Saturday and Sunday hours.";

/** The level definitions every HPSS page uses (Schedule A.2, from 1 October 2026). */
export function levelsParagraph(plural: string): string {
  return `Level 2 is for ${plural} working as a senior clinician, specialist, supervisor or educator (Level 2.1 with under 5 years in that role, 2.2 with 5 or more); level 3 is an advanced clinician, senior specialist or section manager; level 4 is a manager (Schedule A.2).`;
}

const aqfList = (aqfs: readonly HpssAqfLevel[]) =>
  aqfs.length === 1 ? `AQF Level ${aqfs[0]}` : `AQF Level ${aqfs.slice(0, -1).join(", ")} or ${aqfs[aqfs.length - 1]}`;

/** How Level 1 pay works for the profession, with its first-year and later rates. */
export function entryParagraph(profession: string, aqfs: readonly HpssAqfLevel[]): string {
  const f = firstYear(aqfs[0]);
  const which =
    aqfs.length === 1
      ? `Schedule B sets ${profession} at AQF Level ${aqfs[0]}, so a new graduate starts on the AQF Level ${aqfs[0]} 1st-year rate (${f.hourly} an hour)`
      : `Schedule B lists ${profession} at ${aqfList(aqfs)}, and you are paid at the level of the listed qualification you hold — a new graduate at AQF Level ${aqfs[0]} starts on ${f.hourly} an hour`;
  return `From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience in the profession at Level 1. ${which}, rising to ${f.later[0]} in the 2nd and 3rd years, ${f.later[1]} in the 4th to 6th years and ${f.later[2]} from the 7th year. An employer that requires a higher qualification must pay at that qualification's AQF level (cl B.2(d)).`;
}

/** Notice for professions listed at more than one AQF level. */
export function multiAqfNotice(lower: string, aqfs: readonly HpssAqfLevel[]): string {
  const rest = aqfs.slice(1).map((a) => `AQF Level ${a} (${firstYear(a).hourly} an hour in the 1st year)`);
  return `Check your AQF level, not just your level: the headline is the AQF Level ${aqfs[0]} rate. A ${lower} whose qualification is at ${rest.join(" or ")} starts higher. In the Australian Qualifications Framework, Level 8 is a bachelor honours degree or graduate diploma and Level 9 a masters degree.`;
}

/** The FAQs every G3 page shares, worded for the occupation, at its lowest listed AQF level. */
export function sharedFaqs(name: string, plural: string, aqfs: readonly HpssAqfLevel[]): OccupationFaq[] {
  const lower = name.toLowerCase();
  const aqf = aqfs[0];
  const f = firstYear(aqf);
  const [l21, l22, l3, l4] = hpssOct2026SeniorRows();
  const others =
    aqfs.length > 1
      ? ` Graduates whose qualification is at ${aqfs.slice(1).map((a) => `AQF Level ${a}`).join(" or ")} start at ${aqfs.slice(1).map((a) => firstYear(a).hourly).join(" or ")} an hour.`
      : "";
  return [
    {
      q: `What is the award rate for a ${lower} in 2026?`,
      a: `A first-year ${lower} at AQF Level ${aqf} must be paid at least ${f.hourly} an hour, or ${f.weekly} a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026 — ${f.annual} a year full-time before tax.${others}`,
    },
    {
      q: `What is the casual rate for a ${lower}?`,
      a: `A casual first-year ${lower} at AQF Level ${aqf} earns at least ${f.casual} an hour including the 25% casual loading. Casuals get 175% of the minimum hourly rate on weekends and 275% on public holidays.`,
    },
    {
      q: `Do ${plural} get paid more on weekends?`,
      a: `Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time staff — ${f.weekend} an hour for a first-year ${lower} at AQF Level ${aqf}. Public holidays are 250% (${f.publicHoliday}).`,
    },
    {
      q: `How much does a senior ${lower} earn under the award?`,
      a: `A Level 2 senior clinician, specialist, supervisor or educator earns at least ${money(l21.hourly)} an hour (${money(l21.weekly)} a week) with under 5 years in the role and ${money(l22.hourly)} (${money(l22.weekly)}) with 5 years or more. Level 3 is ${money(l3.hourly)} an hour and Level 4 managers ${money(l4.hourly)} (${money(l4.weekly)} a week).`,
    },
  ];
}
