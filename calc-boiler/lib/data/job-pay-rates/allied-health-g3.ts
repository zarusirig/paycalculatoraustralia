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
// Coverage. Schedule B of the consolidated award (read 24 September 2026 via a
// Firecrawl scrape of awards.fairwork.gov.au/MA000027.html, "incorporates all
// amendments up to and including 1 July 2026") lists, verbatim: "Audiologist",
// "Dietician", "Medical Imaging Technologist (MIT) (including: Medical
// Radiographer; Ultrasonographer; Magnetic Resonance Imaging Technologist;
// Nuclear Medicine Technologist; and Radiation Therapist)", "Podiatrist",
// "Sonographer" and "Speech Pathologist". The rates are therefore the shared
// HPSS_TABLES (cl 17.2–17.5 and Schedule C.2.3), which the same scrape
// confirmed unchanged: pay point 2 (3 year degree entry) $1,219.50 / $32.09,
// pay point 3 (4 year degree entry) $1,273.40 / $33.51.
//
// Headline row. The award starts a new graduate "at the pay point matching
// their qualification" (cl 17.2 labels: diploma, 3-year degree, 4-year degree,
// masters, PhD). We do not assert which degree is typical for each profession
// (not verified), so every page headlines Level 1 pay point 2 — the lowest
// degree-entry point, i.e. the least a degree-qualified graduate can be paid —
// and states the higher entry points for four-year, masters and PhD graduates.
//
// Imaging practices. Cl 13.2(c)–(d) set special ordinary-hours spans for
// private medical imaging practices (7.00 am–9.00 pm Mon–Fri and 8.00 am–1.00
// pm Sat for 5.5-day practices; 7.00 am–9.00 pm Mon–Sun for 7-day practices),
// quoted on the radiographer and sonographer pages.

import type { OccupationFaq } from "./types";

/** Level 1 pay point 2 ("3 year degree entry"), cl 17.2 and Schedule C.2.3. */
export const PP2 = { weekly: "$1,219.50", hourly: "$32.09", annual: "$63,414", casual: "$40.11", weekend: "$48.14", publicHoliday: "$80.23" } as const;
/** Other level 1 entry points, cl 17.2. */
export const PP3_HOURLY = "$33.51";
export const PP4_HOURLY = "$34.66";
export const PP5_HOURLY = "$37.76";
export const PP6_HOURLY = "$39.10";

export const IMAGING_HOURS_NOTICE =
  "Private medical imaging practices have their own ordinary-hours span (cl 13.2(c)–(d)): 7.00 am to 9.00 pm Monday to Friday and 8.00 am to 1.00 pm Saturday in a 5.5-day practice, or 7.00 am to 9.00 pm every day in a 7-day practice. Work inside that span is ordinary time; weekend penalty rates still apply to Saturday and Sunday hours.";

/** The four level definitions every HPSS page uses (Schedule A.2). */
export function levelsParagraph(plural: string): string {
  return `Level 2 is for ${plural} who work independently on routine matters; level 3 is experienced and handles novel or complex work; level 4 carries senior or management responsibility (Schedule A.2).`;
}

export function entryParagraph(): string {
  return `Health professionals are graded from level 1 to level 4. Level 1 is the entry level for new graduates, who start at the pay point matching their qualification (cl 17.2): a three-year degree at pay point 2 (${PP2.hourly} an hour), a four-year degree at pay point 3 (${PP3_HOURLY}), a masters degree at pay point 4 (${PP4_HOURLY}) and a PhD at pay point 5 (${PP5_HOURLY}). Full-time employees then move up one pay point a year until pay point 6 (${PP6_HOURLY}).`;
}

/** The FAQs every G3 page shares, worded for the occupation. */
export function sharedFaqs(name: string, plural: string): OccupationFaq[] {
  const lower = name.toLowerCase();
  return [
    {
      q: `What is the award rate for a ${lower} in 2026?`,
      a: `A new-graduate ${lower} with a three-year degree must be paid at least ${PP2.hourly} an hour, or ${PP2.weekly} a week, under the Health Professionals and Support Services Award from the first full pay period on or after 1 July 2026 — ${PP2.annual} a year full-time before tax. A four-year degree starts at ${PP3_HOURLY} and a masters degree at ${PP4_HOURLY} an hour.`,
    },
    {
      q: `What is the casual rate for a ${lower}?`,
      a: `A casual ${lower} at level 1 pay point 2 earns at least ${PP2.casual} an hour including the 25% casual loading. Casuals get 175% of the minimum hourly rate on weekends and 275% on public holidays.`,
    },
    {
      q: `Do ${plural} get paid more on weekends?`,
      a: `Yes. Ordinary hours between midnight Friday and midnight Sunday are paid at 150% of the minimum hourly rate for full-time and part-time staff — ${PP2.weekend} an hour at level 1 pay point 2. Public holidays are 250% (${PP2.publicHoliday}).`,
    },
    {
      q: `How much does a senior ${lower} earn under the award?`,
      a: "Level 3, for experienced practitioners handling complex work, runs from $45.89 to $52.19 an hour ($1,743.90 to $1,983.20 a week). Level 4 senior and management roles run from $55.57 to $71.19 an hour.",
    },
  ];
}
