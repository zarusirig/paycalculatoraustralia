// Queensland — Queensland Corrective Services custodial correctional officers:
// NOT VERIFIED (J8, 9 Oct 2026).
//
// What was read on 9 October 2026:
// - Queensland Corrective Services – Correctional Employees' Certified
//   Agreement 2021 (Matter No. CB/2022/47): "nominal expiry date of 31 August
//   2025". Its Appendix 1 rates stop at 1 September 2024.
// - The QIRC "Public service agreements" page lists that 2021 agreement and no
//   replacement for custodial correctional staff.
// - Correctional Employees Award – State 2015, reprint as at 1 September 2026
//   (B/2026/59 and B/2026/60), clause 12.2(a): award minimum rates that
//   "include the arbitrated wage adjustment payable under the 1 September 2026
//   Declaration of General Ruling". Those are award minimums, not a confirmed
//   statement of what Queensland Corrective Services pays.
//
// Per the no-guessing rule this file ships with empty scales; the hub shows a
// "not yet verified" card with links to the official sources.

import type { ServicePayJurisdiction } from "../types";

export const QLD_PRISON_OFFICER_PAY: ServicePayJurisdiction = {
  occupation: "prison-officer",
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  nameInSentence: "Queensland",
  employer: "Queensland Corrective Services",
  agreementName: "Queensland Corrective Services – Correctional Employees' Certified Agreement 2021",
  agreementUrl: "https://www.qirc.qld.gov.au/sites/default/files/2022_cb47.pdf",
  ratesEffectiveFrom: "",
  nextIncrease: null,
  verifiedOn: "9 October 2026",

  scales: [],
  traineePay: [],
  penalties: [],
  notices: [
    "The certified agreement for Queensland custodial correctional officers passed its nominal expiry date on 31 August 2025, and its last printed pay rates applied from 1 September 2024. The QIRC's public service agreements page lists no replacement agreement.",
  ],
  unverified: [
    "We could not find a current certified agreement or official pay table that prints what Queensland Corrective Services pays custodial correctional officers in 2026, so we do not publish a pay scale for Queensland.",
    "The Correctional Employees Award – State 2015 prints minimum rates as at 1 September 2026, including the 1 September 2026 general ruling. Those are award minimums rather than a confirmed salary table, so they are not reproduced here. Check the QIRC award and agreement pages, or Queensland Corrective Services, for current pay.",
  ],
  sources: [
    {
      title: "Queensland Corrective Services – Correctional Employees' Certified Agreement 2021 (CB/2022/47)",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2022_cb47.pdf",
    },
    {
      title: "Correctional Employees Award – State 2015, reprint as at 1 September 2026",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/correctional_010926.pdf",
    },
    {
      title: "Public service agreements",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/agreements/public-service-agreements",
    },
  ],
  faqs: [],
};
