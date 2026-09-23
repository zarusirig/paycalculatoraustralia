// Western Australia — DFES career firefighter pay. NOT VERIFIED.
//
// What was read on 24 September 2026:
//  - Western Australian Fire Service Enterprise Bargaining Agreement 2023
//    (WAIRC AG 35/2023, registered 6 December 2023). Clause 3(2): "This
//    Agreement will expire on 8 June 2025." Its last scheduled increase was
//    from the first pay period on or after 9 June 2024.
//  - DFES "Career firefighting" page, which still prints "Current Firefighter
//    Rates of Pay (Inclusive of Allowances) … effective on and from June 2024".
//  - WAIRC agreements list: no replacement Fire Service agreement registered.
//  - A 12 December 2025 WA Opposition media release reporting that WAIRC
//    proceedings produced "an immediate administrative pay increase for
//    firefighters" while bargaining continued.
//
// Because an administrative increase was paid after June 2024 and no official
// DFES or WAIRC table of the increased rates could be found, the June 2024
// table is treated as superseded and NOT published. Nothing is estimated.

import type { ServicePayJurisdiction } from "../types";

export const WA_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  nameInSentence: "Western Australia",
  employer: "Department of Fire and Emergency Services (DFES) WA",
  agreementName: "Western Australian Fire Service Enterprise Bargaining Agreement 2023",
  agreementUrl: "https://www.wairc.wa.gov.au/resources/agreements?id=WES335",
  ratesEffectiveFrom: "",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  scales: [],

  traineePay: [],
  penalties: [],
  notices: [
    "The Western Australian Fire Service Enterprise Bargaining Agreement 2023 expired on 8 June 2025. Its last scheduled pay increase took effect in June 2024.",
    "Bargaining for a replacement agreement between DFES and the United Professional Firefighters Union of WA has run since 2025. In December 2025 Western Australian Industrial Relations Commission proceedings resulted in an interim (administrative) pay increase while bargaining continued, but no replacement agreement had been registered with the WAIRC when we checked on 24 September 2026.",
    "DFES's careers page describes the roster as four days on, four days off: two 10-hour day shifts (0800–1800) followed by two 14-hour night shifts (1800–0800), an average of 42 hours a week, paid for 40 hours with the extra two hours accruing as additional annual leave.",
  ],
  unverified: [
    "Current WA career firefighter pay rates are not shown. DFES's careers page still prints rates effective from June 2024, but an administrative pay increase was granted in December 2025, so those figures are out of date. No official DFES or WAIRC table of the rates after that increase could be found.",
    "Check the DFES careers page and the WAIRC agreements register for the current rates and any new agreement.",
  ],
  sources: [
    {
      title: "Western Australian Fire Service Enterprise Bargaining Agreement 2023 (AG 35/2023) — WAIRC agreement register",
      publisher: "Western Australian Industrial Relations Commission",
      url: "https://www.wairc.wa.gov.au/resources/agreements?id=WES335",
    },
    {
      title: "Western Australian Fire Service Enterprise Bargaining Agreement 2023 — registered agreement and order ([2023] WAIRC 00945)",
      publisher: "Western Australian Industrial Relations Commission (copy hosted by the UPFU of WA)",
      url: "https://www.ufuofwa.net.au/wp-content/uploads/2023/12/AG-35-2023-Order-Agreement-registered-2023-WAIRC-00945-6-December-2023.pdf",
    },
    {
      title: "Career firefighting — current firefighter rates of pay",
      publisher: "Department of Fire and Emergency Services WA",
      url: "https://www.dfes.wa.gov.au/careers-and-volunteering/career-firefighting",
    },
    {
      title: "Firefighters' Industrial Outcome Highlights Ongoing Safety and Workforce Concerns (media release, 12 December 2025)",
      publisher: "WA Parliamentary Opposition (Shadow Minister for Emergency Services)",
      url: "https://loop.wa.gov.au/2025/12/12/firefighters-industrial-outcome-highlights-ongoing-safety-and-workforce-concerns/",
    },
  ],
  faqs: [],
};
