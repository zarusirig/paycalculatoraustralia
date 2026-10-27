// =============================================================================
// South Australia — SA Health and other SA public sector agencies.
//
// Allied Health Professionals, Assistants and Psychologists Enterprise
// Agreement 2025, approved by the South Australian Employment Tribunal on
// 11 August 2025 (ET-25-02906), in force from 11 August 2025 for a nominal 48
// months. Varied on 14 April 2026 (ET-26-00567) to clause 3.4 (parties bound)
// and the signing page only; the pay schedule is unchanged.
//
// Appendix 1, Schedule 2.1 (Allied Health Professionals) prints annual
// salaries for five dates (clause 19.1). Every figure below is the column
// "First full pay period on or after 1/5/2026", the one in force on
// 23 October 2026. `nextAnnual` is the next printed column, "First full pay
// period on or after 1/5/2027". (A further column, 1/5/2028, also exists.)
//
// Appendix 3 lists the professions covered, including Pharmacist,
// Physiotherapist, Occupational Therapist, Psychologist, Radiographer and
// Sonographer. Read 23 October 2026 from the SAET copy.
// =============================================================================

import type { StatePublicHealthPay } from "./types";

const VERIFIED = "23 October 2026";

export const SA_PUBLIC_HEALTH_PAY: StatePublicHealthPay = {
  state: "sa",
  code: "SA",
  name: "South Australia",
  employer: "SA Health",
  instruments: [
    {
      id: "sa-ahp-2025",
      name: "Allied Health Professionals, Assistants and Psychologists Enterprise Agreement 2025",
      tribunal: "South Australian Employment Tribunal",
      ratesFrom: "the first full pay period on or after 1 May 2026",
      column: "First full pay period on or after 1/5/2026",
      source: {
        title: "Allied Health Professionals, Assistants and Psychologists Enterprise Agreement 2025, Appendix 1 Schedule 2.1",
        publisher: "South Australian Employment Tribunal",
        url: "https://www.saet.sa.gov.au/app/uploads/2025/08/2906AHPEAOrderUndertaking.pdf",
      },
      extraSources: [
        {
          title: "Allied Health Professionals, Assistants and Psychologists Enterprise Agreement 2025: variation (14 April 2026)",
          publisher: "South Australian Employment Tribunal",
          url: "https://www.saet.sa.gov.au/app/uploads/2026/04/Allied-Health-Professionals-Assistants-and-Psychologists-Enterprise-Agreement-2025-Variation.pdf",
        },
      ],
      verifiedOn: VERIFIED,
      nextIncrease: "the first full pay period on or after 1 May 2027",
      status:
        "The agreement came into force on 11 August 2025 for a nominal four years and already prints the rates for May 2027 and May 2028.",
      proof:
        "Approval order: \"This Agreement shall come into force on and from 11 August 2025 and have a nominal life extending for a period of 48 months.\" Clause 19.1: salaries \"will operate from the first full pay period (ffpp) to commence on or after the dates specified ... 19.1.1. 1 May 2025 19.1.2. 1 May 2026 19.1.3. 1 May 2027 19.1.4. 1 May 2028\". Schedule 2.1 row: \"AHP-1 | 3 year degree | $68,478 | $71,217 | $73,710 | $76,290 | $78,197\".",
    },
  ],
  scales: [
    {
      id: "sa-allied-health-professionals",
      state: "sa",
      professions: ["pharmacist", "radiographer", "physiotherapist", "psychologist", "occupational-therapist", "sonographer"],
      instrumentId: "sa-ahp-2025",
      title: "Allied health professionals, AHP-1 to AHP-6",
      annualBasis: "published",
      steps: [
        { label: "AHP-1, increment 1 (3-year degree start)", annual: 73_710, nextAnnual: 76_290 },
        { label: "AHP-1, increment 2 (4-year degree start)", annual: 76_828, nextAnnual: 79_517 },
        { label: "AHP-1, increment 3", annual: 79_944, nextAnnual: 82_742 },
        { label: "AHP-1, increment 4", annual: 84_620, nextAnnual: 87_582 },
        { label: "AHP-1, increment 5", annual: 89_981, nextAnnual: 93_130 },
        { label: "AHP-2, increment 1", annual: 94_997, nextAnnual: 98_322 },
        { label: "AHP-2, increment 2", annual: 98_113, nextAnnual: 101_547 },
        { label: "AHP-2, increment 3", annual: 101_621, nextAnnual: 105_178 },
        { label: "AHP-2, increment 4", annual: 105_129, nextAnnual: 108_809 },
        { label: "AHP-2, increment 5", annual: 109_023, nextAnnual: 112_839 },
        { label: "AHP-2, increment 6", annual: 110_052, nextAnnual: 113_904 },
        { label: "AHP-3, increment 1", annual: 112_139, nextAnnual: 116_064 },
        { label: "AHP-3, increment 2", annual: 115_259, nextAnnual: 119_293 },
        { label: "AHP-3, increment 3", annual: 119_153, nextAnnual: 123_323 },
        { label: "AHP-3, increment 4", annual: 120_284, nextAnnual: 124_494 },
        { label: "AHP-4, increment 1", annual: 123_048, nextAnnual: 127_355 },
        { label: "AHP-4, increment 2", annual: 126_164, nextAnnual: 130_580 },
        { label: "AHP-4, increment 3", annual: 129_674, nextAnnual: 134_213 },
        { label: "AHP-4, increment 4", annual: 133_957, nextAnnual: 138_645 },
        { label: "AHP-5, increment 1", annual: 137_075, nextAnnual: 141_873 },
        { label: "AHP-5, increment 2", annual: 140_204, nextAnnual: 145_111 },
        { label: "AHP-5, increment 3", annual: 145_006, nextAnnual: 150_081 },
        { label: "AHP-5, increment 4", annual: 149_922, nextAnnual: 155_169 },
        { label: "AHP-6", annual: 164_617, nextAnnual: 170_379 },
      ],
      entry: "AHP-1, increment 1 (3-year degree start)",
      entryRule:
        "Appendix 2: a job that needs a three-year degree starts on AHP-1, increment 1, and a four-year degree on increment 2. A two-year master's after a degree in another field starts on increment 3. After 12 months on the top AHP-1 increment, you move to AHP-2, increment 1, unless the employer finds you are not yet meeting the AHP-1 requirements.",
      top: "AHP-6",
      topNote: "AHP-6 is the top level, for professionals recognised across the state or nationally in their discipline",
      professionNotes: {
        psychologist:
          "A psychologist with a two-year master's in psychology starts on AHP-2, increment 1. A psychologist can apply to move up to AHP-3 once they hold Psychology Board approved supervisor training and are performing well (Appendix 2).",
      },
    },
  ],
};
