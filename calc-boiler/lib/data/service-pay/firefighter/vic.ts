// Victoria — Fire Rescue Victoria (FRV) career firefighter pay.
//
// Source of every figure: Fire Rescue Victoria, "What you will get in return"
// (frv.vic.gov.au/what-you-will-get-return), the official recruitment page,
// which prints "current gross salary pay rates" as WEEKLY rates for Recruit
// Firefighter to Qualified Firefighter. Page marked "Updated 15 July 2026".
// Read on 24 September 2026.
//
// Why the recruitment page and not the agreement: FRV operational staff are
// still covered by the Fire Rescue Victoria Operational Employees Interim
// Enterprise Agreement 2020, whose wage table (clause 133) stops at 1 May 2019.
// The FRV page's rates are exactly the 1 May 2019 agreement rates plus two
// further 2.5% increases (e.g. Qualified Firefighter $1,655.07 × 1.025 × 1.025
// = $1,738.86), so the page is consistent with the agreement — but no official
// document read states the date those later increases took effect, so
// `ratesEffectiveFrom` says so rather than inventing a date.
//
// Annual figures are weekly × 52.143, rounded to the dollar; each `note`
// quotes FRV's published weekly rate. Ranks above Qualified Firefighter
// (Senior/Leading Firefighter, Station Officer) are NOT published by FRV at
// current rates and are deliberately left out.

import type { ServicePayJurisdiction } from "../types";

export const VIC_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  employer: "Fire Rescue Victoria",
  agreementName:
    "Fire Rescue Victoria — current gross salary pay rates (What you will get in return); underlying instrument: Fire Rescue Victoria Operational Employees Interim Enterprise Agreement 2020",
  agreementUrl: "https://www.frv.vic.gov.au/what-you-will-get-return",
  ratesEffectiveFrom: "15 July 2026 (the date FRV published them; FRV does not say when they took effect)",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "firefighters",
      title: "Recruit to Qualified Firefighter (FRV published rates)",
      intro:
        "FRV's current weekly rates for a career firefighter from the 20-week recruit course to Qualified Firefighter, which takes 36 months' service and a certificate of proficiency.",
      stepHeading: "Position level",
      steps: [
        {
          label: "Recruit Firefighter",
          salary: 58_066,
          note: "$1,113.60 per week — during the 20-week training course",
        },
        {
          label: "Firefighter Level 1",
          salary: 80_959,
          note: "$1,552.63 per week — on completion of the recruit course",
        },
        {
          label: "Firefighter Level 2",
          salary: 82_457,
          note: "$1,581.36 per week — on completion of 12 months' service and all required modules",
        },
        {
          label: "Firefighter Level 3",
          salary: 84_139,
          note: "$1,613.62 per week — on completion of 24 months' service and all required modules",
        },
        {
          label: "Qualified Firefighter",
          salary: 90_669,
          note: "$1,738.86 per week — on completion of 36 months' service and a certificate of proficiency",
        },
      ],
    },
  ],
  entryStep: "Recruit Firefighter",
  topStep: "Qualified Firefighter",

  traineePay: [
    "Recruit Firefighters are paid $1,113.60 per week during the 20-week FRV Recruit Course at the FRV Training Academy in Craigieburn (about $58,066 a year).",
    "On finishing the recruit course, firefighters move to Firefighter Level 1 at $1,552.63 per week and keep training on station for three years to become a Qualified Firefighter.",
    "A probationary period applies from the start of the recruit course.",
  ],
  penalties: [
    "FRV firefighters work the 10/14 shift system: two day shifts (8am–6pm), then two night shifts (6pm–8am), then four days off, over an eight-day cycle.",
    "Firefighters receive nine weeks' rostered annual leave a year, taken in two blocks.",
  ],
  notices: [
    "FRV operational employees are still covered by the Fire Rescue Victoria Operational Employees Interim Enterprise Agreement 2020, which is past its nominal expiry. The agreement's own wage table ends with the 1 May 2019 increase.",
    "A replacement operational agreement has not been made. The United Firefighters' Union applied to the Fair Work Commission for an intractable bargaining declaration in July 2023 (matter B2023/771) and the declaration was made on 4 October 2023; the Commission's case page, last updated 1 May 2026, shows no workplace determination has been published yet.",
    "When a new agreement or determination is made, pay could rise and may be back-dated. The rates here are FRV's own published current rates, not a forecast.",
  ],
  unverified: [
    "The date the current FRV rates took effect is not stated on FRV's page or in the 2020 agreement, so no effective date is given.",
    "Senior Firefighter, Leading Firefighter, Station Officer and higher ranks are not published by FRV at current rates. The 2020 agreement shows them only at 1 May 2019 rates, which are out of date, so they are not shown.",
    "Allowances, overtime and the Emergency Services Superannuation Scheme contribution are not included.",
  ],
  sources: [
    {
      title: "What you will get in return (firefighter recruitment — remuneration and entitlements)",
      publisher: "Fire Rescue Victoria",
      url: "https://www.frv.vic.gov.au/what-you-will-get-return",
    },
    {
      title: "United Firefighters' Union of Australia — application for an intractable bargaining declaration (B2023/771)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/hearings-decisions/major-cases/united-firefighters-union-australia-application-intractable",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in Victoria?",
      a: "Fire Rescue Victoria pays a Qualified Firefighter $1,738.86 a week, about $90,669 a year, on its current published rates. Firefighters on the way to qualification earn $1,552.63 (Level 1) to $1,613.62 (Level 3) a week.",
    },
    {
      q: "What is a recruit firefighter's salary in Victoria?",
      a: "A Recruit Firefighter with Fire Rescue Victoria is paid $1,113.60 a week, about $58,066 a year, during the 20-week recruit course. Pay rises to $1,552.63 a week (Firefighter Level 1) once the course is finished.",
    },
    {
      q: "How much does a station officer earn in Victoria?",
      a: "FRV does not publish current Station Officer rates. The operational agreement's own table stops at 1 May 2019, so we do not show a Station Officer salary for Victoria.",
    },
    {
      q: "Why haven't Victorian firefighters had a new agreement?",
      a: "FRV firefighters are still on the Interim Enterprise Agreement 2020, which is past its expiry date. Bargaining for a replacement has gone to the Fair Work Commission as intractable bargaining, and no new determination had been published when we checked on 24 September 2026.",
    },
  ],
};
