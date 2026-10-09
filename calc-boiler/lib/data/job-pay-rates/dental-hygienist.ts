// Dental hygienist — Health Professionals and Support Services Award 2020
// [MA000027] (T5, wave 3; "dental hygienist salary" 1,600/mo AU, found in the
// T5 keyword check). Penalties live in health-professionals-common.ts; the
// rate tables are the 1 October 2026 structure in
// health-professionals-oct-2026.ts.
//
// Rolled 9 October 2026 to determination PR814029 (from the first full pay
// period starting on or after 1 October 2026), read 9 October 2026:
// https://www.fwc.gov.au/documents/awardsandorders/pdf/pr814029.pdf
// Schedule B.3 lists "Dental Hygienist" at AQF Level 7 only, so a newly
// registered hygienist is "AQF Level 7—1st year". The old diploma (pay point
// 1) and degree (pay point 2) entry points no longer apply.
//
// Median: Jobs and Skills Australia, ANZSCO 4112 Dental Hygienists,
// Technicians and Therapists, $2,210 a week / $55 an hour (ABS SEEH May 2025),
// read 23 September 2026. The unit group also includes dental technicians,
// prosthetists and therapists; the page says so.

import { firstYear, levelsParagraph } from "./allied-health-g3";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, jsaUrl } from "./common";
import { HPSS_OCT_2026_NOTICES, hpssOct2026Label, hpssOct2026Occupation } from "./health-professionals-oct-2026";
import type { MedianEarnings } from "./types";

const MEDIAN: MedianEarnings = {
  anzscoCode: "4112",
  anzscoTitle: "Dental Hygienists, Technicians and Therapists",
  medianWeekly: 2_210,
  medianHourly: 55,
  allOccupationsWeekly: ALL_OCCUPATIONS_MEDIAN_WEEKLY,
  url: jsaUrl("4112-dental-hygienists-technicians-and-therapists"),
};

/** Schedule B.3 of the award as varied by PR814029 (read 9 October 2026). */
const AQF = 7;
const F = firstYear(AQF);

export const DENTAL_HYGIENIST = hpssOct2026Occupation(AQF, {
  slug: "dental-hygienist",
  name: "Dental Hygienist",
  plural: "dental hygienists",
  headlineLabel: hpssOct2026Label(AQF),
  why: "a first-year dental hygienist at AQF Level 7, the award's standard qualification level for the profession",
  coverage: [
    "Dental hygienists employed by private dental practices, dental groups and other national-system health employers are covered by the Health Professionals and Support Services Award 2020 [MA000027], which lists Dental Hygienist among its health professionals (Schedule B).",
    `From the first full pay period starting on or after 1 October 2026, Level 1 pay depends on the AQF level of the profession's standard minimum qualification and your years of experience at Level 1. Schedule B sets dental hygiene at AQF Level 7, so a newly registered hygienist starts on ${F.hourly} an hour, rising to ${F.later[0]} in the 2nd and 3rd years, ${F.later[1]} in the 4th to 6th years and ${F.later[2]} from the 7th year.`,
    levelsParagraph("hygienists"),
    "Dental hygienists in public dental services are paid under state awards or enterprise agreements, and a hygienist working as a contractor on a percentage of billings has no award minimum.",
  ],
  median: MEDIAN,
  notices: [
    ...HPSS_OCT_2026_NOTICES,
    "Dental assistants are covered by the same award but in the Support Services stream, on much lower rates — see the dental assistant page.",
  ],
  faqs: [
    {
      q: "What is the award rate for a dental hygienist in 2026?",
      a: `A first-year dental hygienist must be paid at least ${F.hourly} an hour, or ${F.weekly} a week, under the Health Professionals and Support Services Award from the first full pay period starting on or after 1 October 2026 — ${F.annual} a year full-time before tax. The rate rises with experience, to ${F.later[2]} an hour from the 7th year at Level 1.`,
    },
    {
      q: "What is the casual rate for a dental hygienist?",
      a: `A casual first-year dental hygienist earns at least ${F.casual} an hour including the 25% casual loading. Casuals get 175% of the minimum hourly rate on weekends and 275% on public holidays.`,
    },
    {
      q: "Do dental hygienists get paid more on Saturdays?",
      a: `Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time staff — ${F.weekend} an hour for a first-year hygienist.`,
    },
    {
      q: "Can a dental hygienist be paid a percentage of billings?",
      a: "If you are an employee, whatever the pay arrangement you must still receive at least the award minimum for the hours you work. A genuine contractor is not covered by the award.",
    },
    {
      q: "What do dental hygienists actually earn?",
      a: "Jobs and Skills Australia reports median full-time earnings of $2,210 a week for dental hygienists, technicians and therapists (ABS, May 2025). That unit group also includes dental technicians, prosthetists and therapists, so it is a guide rather than a hygienist-only figure.",
    },
  ],
  related: [
    { href: "/job-pay-rates/dental-assistant/", label: "Dental Assistant Pay Rates" },
    { href: "/healthcare-worker-pay/", label: "Healthcare Worker Pay" },
    { href: "/contractor-vs-employee-calculator/", label: "Contractor vs Employee Calculator" },
  ],
});
