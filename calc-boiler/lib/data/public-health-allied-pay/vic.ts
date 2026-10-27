// =============================================================================
// Victoria — public health services (Fair Work Commission enterprise
// agreements; Victorian public hospitals are in the national system).
//
// 1. Allied Health Professionals (Victorian Public Sector) (Single Interest
//    Employers) Enterprise Agreement 2021-2026, AE518146 (AG2022/4550),
//    approved 11 November 2022, operative 18 November 2022, nominal expiry
//    28 February 2026. Pays physiotherapists, occupational therapists,
//    radiographers (medical imaging technologists) and sonographers.
//    Appendix 2 Part A, column "1-MAR-25": clause 28.1(d) "2% effective from
//    FFPPOA 1 March 2025" is the last rise it sets.
//
// 2. Medical Scientists, Pharmacists and Psychologists Victorian Public Sector
//    (Single Interest Employers) Enterprise Agreement 2021-2025, AE518208
//    (AG2022/4538), operative 28 November 2022, nominal expiry 30 November
//    2025. Schedule 2, column "FFPPOA 1-Dec-24": clause 51.1(e)(iv) is the last
//    rise it sets.
//
// Both agreements keep operating after their nominal expiry until replaced.
// The FWC's list of agreements approved from 1 January to 26 October 2026
// (agreements2026.xlsx, generated 26 October 2026) has no replacement for
// either. The Victorian Government announced a new deal for HSU Victoria No. 4
// members (hospital pharmacists, psychologists and others) on 20 August 2026;
// it was not approved as at 26 October 2026, so its rates are not shown.
//
// The full text was read on 23 October 2026 from the copy hosted by Western
// Health, a covered Victorian public health service (the same approach as
// lib/data/nursing-pay/vic.ts). The text carries the FWC decision and the
// AE number on its cover pages.
//
// Grade 1 AHP1 years: the agreement abolished old Grade 1 years 1 and 7 and
// renumbered the rest (Appendix 2 Part B). "Grade 1, year 1" below is the
// translated year 1 ($1,357.50 at 1 March 2025), shown in Appendix 2 Part A as
// "2 1". The "rate if employee doesn't translate" row is left out.
//
// Radiographer intern rows are left out on purpose: the FWC approval carries
// an employer undertaking that ties a 3-year-degree radiographer's rate to the
// federal Health Professionals award, which was restructured on 1 October
// 2026, so the printed intern figure may not be what an intern is paid.
// =============================================================================

import type { StatePublicHealthPay } from "./types";

const VERIFIED = "23 October 2026";

const FWC_2022_LIST = {
  title: "Fair Work Commission list of agreements approved in 2022 (AE518146 and AE518208)",
  publisher: "Fair Work Commission",
  url: "https://www.fwc.gov.au/documents/agreements/resources/agreements2022.xlsx",
};

const FWC_2026_LIST = {
  title: "Fair Work Commission list of agreements approved from 1 January to 26 October 2026 (no replacement agreement)",
  publisher: "Fair Work Commission",
  url: "https://www.fwc.gov.au/documents/agreements/resources/agreements2026.xlsx",
};

const AWARD_FLOOR_NOTE =
  "If the modern award that covers your job sets a higher minimum than your agreement rate, you must be paid at least the award rate.";

export const VIC_PUBLIC_HEALTH_PAY: StatePublicHealthPay = {
  state: "vic",
  code: "VIC",
  name: "Victoria",
  employer: "Victorian public health services",
  instruments: [
    {
      id: "vic-ahp-2021-2026",
      name: "Allied Health Professionals (Victorian Public Sector) (Single Interest Employers) Enterprise Agreement 2021-2026",
      tribunal: "Fair Work Commission",
      ratesFrom: "the first full pay period on or after 1 March 2025",
      column: "1-MAR-25",
      source: {
        title: "Allied Health Professionals (Victorian Public Sector) (Single Interest Employers) Enterprise Agreement 2021-2026 (AE518146), Appendix 2",
        publisher: "Western Health (a covered Victorian public health service)",
        url: "https://westernhealth.org.au/sites/default/files/2025-08/Health%20Professionals%20VPS%20Agreement%202021%20-%202026.pdf",
      },
      extraSources: [FWC_2022_LIST, FWC_2026_LIST],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status:
        "The agreement passed its nominal expiry date on 28 February 2026 and keeps operating until it is replaced. No replacement had been approved by the Fair Work Commission as at 26 October 2026.",
      proof:
        "FWC decision [6]: \"The Agreement is approved and, in accordance with s.54 of the Act, will operate from 18 November 2022. The nominal expiry date of the Agreement is 28 February 2026.\" <AE518146 PR747842>. Clause 28.1(d): \"2% effective from FFPPOA 1 March 2025.\" Appendix 2 Part A header \"1-MAR-25\"; row \"Grade 1 | 2 | $1,254.10 | $1,279.20 | 2 1 | $1,279.20 | $1,304.80 | $1,330.90 | $1,357.50\".",
    },
    {
      id: "vic-mspp-2021-2025",
      name: "Medical Scientists, Pharmacists and Psychologists Victorian Public Sector (Single Interest Employers) Enterprise Agreement 2021-2025",
      tribunal: "Fair Work Commission",
      ratesFrom: "the first full pay period on or after 1 December 2024",
      column: "FFPPOA 1-Dec-24",
      source: {
        title: "Medical Scientists, Pharmacists and Psychologists Victorian Public Sector (Single Interest Employers) Enterprise Agreement 2021-2025 (AE518208), Schedule 2",
        publisher: "Western Health (a covered Victorian public health service)",
        url: "https://westernhealth.org.au/sites/default/files/2026-02/Medical%20Scientist%20Pharmacists%20%20Psychologists%20Enterprise%20Agreement%202021-25.pdf",
      },
      extraSources: [
        FWC_2022_LIST,
        FWC_2026_LIST,
        {
          title: "Labor Backs Health Professionals With Pay Rise (20 August 2026)",
          publisher: "Premier of Victoria",
          url: "https://www.premier.vic.gov.au/labor-backs-health-professionals-pay-rise",
        },
      ],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status:
        "The agreement passed its nominal expiry date on 30 November 2025 and keeps operating until it is replaced. The Victorian Government announced a new deal on 20 August 2026 that covers hospital pharmacists and psychologists, but it had not been approved by the Fair Work Commission as at 26 October 2026, so these are still the rates in force.",
      proof:
        "FWC decision [5]: \"The Agreement is approved and, in accordance with s.54 of the Act, will operate from 28 November 2022. The nominal expiry date of the Agreement is 30 November 2025.\" <AE518208 PR748024>. Clause 51.1(e)(iv): \"2% effective first full pay period on or after (FFPPOA) 1 December 2024.\" Schedule 2 header \"FFPPOA 1-Dec-24\"; row \"SW5 | Pharmacists | 1 | 1 | $1,212.50 | $1,236.80 | $1,261.50 | $1,286.70 | $1,312.40\". Premier of Victoria, 20 August 2026: \"The agreement covers medical scientists, hospital pharmacists, psychologists, dietitians, medical physicists, genetic counsellors, perfusionists and audiologists.\"",
    },
  ],
  scales: [
    {
      id: "vic-pharmacists",
      state: "vic",
      professions: ["pharmacist"],
      instrumentId: "vic-mspp-2021-2025",
      title: "Hospital pharmacists",
      annualBasis: "weekly x 52",
      steps: [
        { label: "Pharmacist intern", weekly: 1049.9, note: "before registration" },
        { label: "Grade 1, year 1", weekly: 1312.4 },
        { label: "Grade 1, year 2", weekly: 1388 },
        { label: "Grade 1, year 3", weekly: 1518.8 },
        { label: "Grade 1, year 4", weekly: 1592.5 },
        { label: "Grade 1, year 5", weekly: 1672.1 },
        { label: "Grade 1, year 6", weekly: 1765.1 },
        { label: "Grade 2, year 1", weekly: 1816.9 },
        { label: "Grade 2, year 2", weekly: 1871.1 },
        { label: "Grade 2, year 3", weekly: 1906.7 },
        { label: "Grade 2, year 4", weekly: 2055.9 },
        { label: "Grade 3, year 1", weekly: 2092.7 },
        { label: "Grade 3, year 2", weekly: 2164.6 },
        { label: "Grade 3, year 3", weekly: 2221.5 },
        { label: "Grade 3, year 4", weekly: 2382.8 },
        { label: "Grade 4, years 1 and 2", weekly: 2452.6 },
        { label: "Grade 4, years 3 and 4", weekly: 2580.6 },
        { label: "Grade 4, year 5", weekly: 2852.1 },
        { label: "Director of Pharmacy, Group 1", weekly: 3605.9 },
      ],
      entry: "Grade 1, year 1",
      entryRule:
        "A registered pharmacist starts on Grade 1, year 1, the first year of experience after registration. A pharmacist with a Master of Science or Master of Pharmaceutical Science is entitled to start on Grade 1, year 3 (Schedule 3, clause 7.3). A pharmacist intern is paid 80% of the Grade 1, year 1 rate (clause 7.2).",
      top: "Director of Pharmacy, Group 1",
      topNote: "the Director of Pharmacy at a Group 1 health service is the top pharmacist rate in the agreement",
      notes: [AWARD_FLOOR_NOTE],
    },
    {
      id: "vic-psychologists",
      state: "vic",
      professions: ["psychologist"],
      instrumentId: "vic-mspp-2021-2025",
      title: "Psychologists",
      annualBasis: "weekly x 52",
      steps: [
        { label: "Grade 1, year 1", weekly: 1202.6, note: "provisional psychologist" },
        { label: "Grade 1, year 2", weekly: 1261.8 },
        { label: "Grade 1, year 3", weekly: 1334.1 },
        { label: "Grade 1, year 4", weekly: 1436.4 },
        { label: "Grade 1, year 5", weekly: 1511.2 },
        { label: "Grade 1, year 6", weekly: 1580.8 },
        { label: "Grade 1, year 7", weekly: 1664.8 },
        { label: "Grade 1, year 8", weekly: 1748.5 },
        { label: "Grade 2, year 1", weekly: 1816.9, note: "registered psychologist entry" },
        { label: "Grade 2, year 2", weekly: 1871.1 },
        { label: "Grade 2, year 3", weekly: 1906.7 },
        { label: "Grade 2, year 4", weekly: 2055.9 },
        { label: "Grade 3, year 1", weekly: 2082.3 },
        { label: "Grade 3, year 2", weekly: 2163.8 },
        { label: "Grade 3, year 3", weekly: 2241.3 },
        { label: "Grade 3, year 4", weekly: 2382.8 },
        { label: "Grade 4, year 1", weekly: 2371.2 },
        { label: "Grade 4, year 2", weekly: 2438.7 },
        { label: "Grade 4, year 3", weekly: 2551.3 },
        { label: "Grade 4, year 4", weekly: 2656.4 },
        { label: "Grade 4, year 5", weekly: 2852.1 },
        { label: "Grade 5", weekly: 3224.7 },
        { label: "Grade 6, Psychologist Director", weekly: 3605.9 },
      ],
      entry: "Grade 2, year 1",
      entryRule:
        "Grade 1 is for provisional psychologists (interns): a 4+2 intern starts on Grade 1, year 1 and a 5+1 intern on year 2 (Schedule 3, clause 9.1). Grade 2 is the entry level for a psychologist with general registration (clause 10). Grade 3 needs at least five years' experience as a Grade 2 (clause 11).",
      top: "Grade 6, Psychologist Director",
      topNote: "Grade 6 is the Psychologist Director",
      notes: [AWARD_FLOOR_NOTE],
    },
    {
      id: "vic-allied-health",
      state: "vic",
      professions: ["physiotherapist", "occupational-therapist", "radiographer"],
      instrumentId: "vic-ahp-2021-2026",
      title: "Allied health professionals (physiotherapists, occupational therapists, radiographers and others)",
      annualBasis: "weekly x 52",
      steps: [
        { label: "Grade 1, year 1", weekly: 1357.5 },
        { label: "Grade 1, year 2", weekly: 1426.4 },
        { label: "Grade 1, year 3", weekly: 1513.7 },
        { label: "Grade 1, year 4", weekly: 1579.6 },
        { label: "Grade 1, year 5", weekly: 1651.4 },
        { label: "Grade 2, year 1", weekly: 1735.3 },
        { label: "Grade 2, year 2", weekly: 1814.9 },
        { label: "Grade 2, year 3", weekly: 1926.4 },
        { label: "Grade 2, year 4", weekly: 1994.7 },
        { label: "Grade 3A, year 1", weekly: 1997.8 },
        { label: "Grade 3A, year 2", weekly: 2026 },
        { label: "Grade 3A, year 3", weekly: 2048.2 },
        { label: "Grade 3A, year 4", weekly: 2112 },
        { label: "Grade 3, year 1", weekly: 2002.6 },
        { label: "Grade 3, year 2", weekly: 2073 },
        { label: "Grade 3, year 3", weekly: 2128.4 },
        { label: "Grade 3, year 4", weekly: 2288.1 },
        { label: "Grade 4, year 1", weekly: 2424.6 },
        { label: "Grade 4, year 2", weekly: 2506.3 },
        { label: "Grade 4, year 3", weekly: 2588.7 },
        { label: "Grade 4, year 4", weekly: 2671.7 },
        { label: "Grade 5", weekly: 3014.4 },
        { label: "Grade 6", weekly: 3273.3 },
        { label: "Grade 7", weekly: 3660.3 },
      ],
      entry: "Grade 1, year 1",
      entryRule:
        "A new graduate starts on Grade 1, year 1, and moves up one year for each 12 months of experience. A graduate with a relevant master's starts on Grade 1, year 2 and one with a doctorate on year 4 (clause 85.5). Clause 85.7 applies in a rural or regional health service or a community health centre: there, a four-year degree (or a three-year degree with honours or a 12-month internship) starts on year 2. Grade 1 has five years after the agreement removed the old years 1 and 7.",
      top: "Grade 7",
      topNote: "Grade 7 is the highest allied health grade in the agreement",
      notes: [
        "These rates have not changed since 1 March 2025.",
        AWARD_FLOOR_NOTE,
        "Grade 3 years 3B and 4B, paid only to allied health managers, are not shown.",
      ],
    },
    {
      id: "vic-sonographers",
      state: "vic",
      professions: ["sonographer"],
      instrumentId: "vic-ahp-2021-2026",
      title: "Sonographers",
      annualBasis: "weekly x 52",
      steps: [
        { label: "Grade 1, year 1", weekly: 1276.7, note: "student sonographer" },
        { label: "Grade 1, year 2", weekly: 1357.5 },
        { label: "Grade 1, year 3", weekly: 1426.4 },
        { label: "Grade 1, year 4", weekly: 1513.7 },
        { label: "Grade 2, year 1", weekly: 1651.4, note: "trainee sonographer" },
        { label: "Grade 2, year 2", weekly: 1735.3 },
        { label: "Grade 2, year 3", weekly: 1814.9 },
        { label: "Grade 3, year 1", weekly: 2002.6, note: "accredited sonographer" },
        { label: "Grade 3, year 2", weekly: 2073 },
        { label: "Grade 3, year 3", weekly: 2128.4 },
        { label: "Grade 3, year 4", weekly: 2288.1 },
        { label: "Grade 4, year 1", weekly: 2424.6 },
        { label: "Grade 4, year 2", weekly: 2506.3 },
        { label: "Grade 4, year 3", weekly: 2588.7 },
        { label: "Grade 4, year 4", weekly: 2671.7 },
        { label: "Grade 5", weekly: 3014.4 },
        { label: "Grade 6", weekly: 3273.3 },
        { label: "Grade 7", weekly: 3660.3 },
      ],
      entry: "Grade 3, year 1",
      entryRule:
        "Grade 1 is a student sonographer and Grade 2 a trainee sonographer who has finished at least half of a recognised course and 12 months of clinical experience. Grade 3 is a sonographer who has finished a course recognised by the Australian Sonographer Accreditation Registry and can join its register of accredited medical sonographers (Appendix 4, Section D).",
      top: "Grade 7",
      topNote: "Grade 7 is the highest allied health grade in the agreement",
      notes: ["These rates have not changed since 1 March 2025.", AWARD_FLOOR_NOTE],
    },
  ],
};
