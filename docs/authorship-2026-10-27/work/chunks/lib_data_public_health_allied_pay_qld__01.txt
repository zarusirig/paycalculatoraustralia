// =============================================================================
// Queensland — Queensland Health (hospital and health services).
//
// Health practitioners (pharmacists, radiographers and medical imaging
// technologists, physiotherapists, occupational therapists, psychologists,
// sonographers and others) are one HP stream, HP1 to HP8.
//
// WHICH TABLE IS IN FORCE ON 23 OCTOBER 2026
// ------------------------------------------
// The Health Practitioners and Dental Officers (Queensland Health) Certified
// Agreement (No. 4) 2022 (HPDO4, CB/2023/43) set its last rise from
// 17 October 2024 and passed its nominal expiry on 16 October 2025. Its
// replacement (HPDO5) went to arbitration in the QIRC in June 2026.
//
// Meanwhile the QIRC reprinted the Health Practitioners and Dental Officers
// (Queensland Health) Award – State 2015 "as at 1 September 2026" after the
// 2026 State Wage Case general ruling (matter B/2026/59 and B/2026/60,
// certified 11 September 2026). Those award rates are now HIGHER than the
// HPDO4 rates at all 24 pay points from HP3.0 to HP8.5, compared one by one
// on 23 October 2026 (HP3.0: award $3,213 a fortnight against HPDO4
// $3,030.00; HP8.5: $9,721 against $9,580.00). Queensland Health's own wage-rate page
// lists the same figures as "Wage rates from 1 September 2026" (HP1.4
// $2,736.00 a fortnight), so these are the rates being paid. Firecrawl cannot
// read health.qld.gov.au; the page was confirmed through a Firecrawl search
// result, and every figure below is copied from the QIRC award reprint.
//
// The award prints fortnightly rates rounded to the dollar, and an annual
// salary "for reference purposes only" (fortnightly x 26.089). Both are
// copied as printed. HP3.8 is a transitional pay point open only to staff
// classified PO3 in January 2008 (cl 12.10), so it is left out.
// =============================================================================

import type { StatePublicHealthPay } from "./types";

const VERIFIED = "23 October 2026";

export const QLD_PUBLIC_HEALTH_PAY: StatePublicHealthPay = {
  state: "qld",
  code: "QLD",
  name: "Queensland",
  employer: "Queensland Health",
  instruments: [
    {
      id: "qld-hpdo-award-2015-sep-2026",
      name: "Health Practitioners and Dental Officers (Queensland Health) Award – State 2015, reprint as at 1 September 2026",
      tribunal: "Queensland Industrial Relations Commission",
      ratesFrom: "1 September 2026, after the 2026 State Wage Case",
      column: "Award Rate1 Per Fortnight $2 | Annual Salary3 $2",
      source: {
        title: "Health Practitioners and Dental Officers (Queensland Health) Award – State 2015, reprint as at 1 September 2026, clause 12.3(a)",
        publisher: "Queensland Industrial Relations Commission",
        url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/health_practitioners_010926.pdf",
      },
      extraSources: [
        {
          title: "Health Practitioners and Dental Officers (Queensland Health) Certified Agreement (No. 4) 2022, reprint, Schedule 1",
          publisher: "Queensland Industrial Relations Commission",
          url: "https://www.qirc.qld.gov.au/sites/default/files/2024-11/2023_cb43_reprint_230924.pdf",
        },
        {
          title: "Health practitioners stream wage rates (wage rates from 1 September 2026)",
          publisher: "Queensland Health",
          url: "https://www.health.qld.gov.au/hrpolicies/wage-rates/health-practitioners",
        },
      ],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status:
        "The last certified agreement (HPDO4) expired on 16 October 2025. Arbitration for its replacement began in the Queensland Industrial Relations Commission in June 2026. Until it is decided, Queensland Health pays these award rates, which rose on 1 September 2026 and are higher than the old agreement rates.",
      proof:
        "Reprint certificate: \"Following the general ruling made by the Commission in the 2026 State Wage Case, the Health Practitioners and Dental Officers (Queensland Health) Award – State 2015 is hereby reprinted\" ... \"as at 1 September 2026.\" Clause 12.3(a) note 1: \"Includes the arbitrated wage adjustment payable under the 1 September 2026 Declaration of General Ruling.\" Note 3: \"Annual salaries (fortnightly rate x 26.089) are for reference purposes only.\" Row: \"HP3 | 0 |  | 3,213 | 83,824\". HPDO4 Schedule 1, \"Wage rates payable from 17 October 2024\": \"HP3 | 03 | ... | $3,030.00 | $79,051\". Queensland Health wage-rate page (Firecrawl search result, 23 October 2026): \"Wage rates from 1 September 2026 ; HP1 At age 21 · 2, $2,586.00 ; HP1 At age 21 · 3, $2,659.00 ; HP1 At age 21 · 4, $2,736.00\". Queensland Health careers page (same search): \"Arbitration for HPDO5 began in the Queensland Industrial Relations Commission (QIRC) in June 2026 and is continuing HPDO4 expired on 16 October 2025\".",
    },
  ],
  scales: [
    {
      id: "qld-health-practitioners",
      state: "qld",
      professions: ["pharmacist", "radiographer", "physiotherapist", "psychologist", "occupational-therapist", "sonographer"],
      instrumentId: "qld-hpdo-award-2015-sep-2026",
      title: "Health practitioners, HP3 to HP8",
      annualBasis: "published",
      steps: [
        { label: "HP3.0", fortnightly: 3213, annual: 83_824 },
        { label: "HP3.1", fortnightly: 3501, annual: 91_338 },
        { label: "HP3.2", fortnightly: 3700, annual: 96_529 },
        { label: "HP3.3", fortnightly: 3927, annual: 102_452 },
        { label: "HP3.4", fortnightly: 4073, annual: 106_260 },
        { label: "HP3.5", fortnightly: 4243, annual: 110_696 },
        { label: "HP3.6", fortnightly: 4419, annual: 115_287 },
        { label: "HP3.7", fortnightly: 4628, annual: 120_740 },
        { label: "HP4.1", fortnightly: 5086, annual: 132_689 },
        { label: "HP4.2", fortnightly: 5186, annual: 135_298 },
        { label: "HP4.3", fortnightly: 5317, annual: 138_715 },
        { label: "HP4.4", fortnightly: 5455, annual: 142_315 },
        { label: "HP5.1", fortnightly: 5725, annual: 149_360 },
        { label: "HP5.2", fortnightly: 5966, annual: 155_647 },
        { label: "HP6.1", fortnightly: 6356, annual: 165_822 },
        { label: "HP6.2", fortnightly: 6573, annual: 171_483 },
        { label: "HP7.1", fortnightly: 7211, annual: 188_128 },
        { label: "HP7.2", fortnightly: 7714, annual: 201_251 },
        { label: "HP8.1", fortnightly: 7986, annual: 208_347 },
        { label: "HP8.2", fortnightly: 8313, annual: 216_878 },
        { label: "HP8.3", fortnightly: 8681, annual: 226_479 },
        { label: "HP8.4", fortnightly: 9338, annual: 243_619 },
        { label: "HP8.5", fortnightly: 9721, annual: 253_611 },
      ],
      entry: "HP3.0",
      entryRule:
        "Clause 12.6(b) sets the starting pay point by the qualification the job needs. A health practitioner whose job needs a three-year degree starts on HP3.0. One whose job needs a four-year degree, or a two-year master's for registration or entry to the profession, starts on HP3.1. Pay rises one pay point for each 12 months within a level. Moving to HP4 and above is by merit selection for an advertised job.",
      top: "HP8.5",
      topNote: "HP8 jobs are filled by merit selection and the employer sets the pay point (clause 12.6(d))",
      notes: ["Annual figures are the award's reference salary: the fortnightly rate x 26.089, as printed."],
    },
  ],
};
