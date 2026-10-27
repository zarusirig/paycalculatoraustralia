// =============================================================================
// Western Australia — WA health system (WA Health hospitals and health
// services).
//
// WA Health System - HSUWA - PACTS Industrial Agreement 2024, registered by the
// Western Australian Industrial Relations Commission on 19 March 2025 (AG 23
// of 2025, [2025] WAIRC 00175). Clause 21.5 puts every listed health
// profession (pharmacist, physiotherapist, occupational therapist,
// psychologist, medical imaging technologist, sonographer and others) on the
// one Professional Division scale in Schedule 2, P-1.1 to P-9.
//
// Every figure is the Schedule 2 column "On and from 1 July 2026" (3.75%), the
// last of the agreement's three rises (5% from 1 July 2024, 4% from 1 July
// 2025). The agreement expires on 30 June 2027 (clause 6.2) and sets no
// later rise. Read 23 October 2026 from the WAIRC copy.
// =============================================================================

import type { StatePublicHealthPay } from "./types";

const VERIFIED = "23 October 2026";

export const WA_PUBLIC_HEALTH_PAY: StatePublicHealthPay = {
  state: "wa",
  code: "WA",
  name: "Western Australia",
  employer: "WA Health",
  instruments: [
    {
      id: "wa-pacts-2024",
      name: "WA Health System - HSUWA - PACTS Industrial Agreement 2024",
      tribunal: "Western Australian Industrial Relations Commission",
      ratesFrom: "1 July 2026",
      column: "On and from 1 July 2026 (3.75%)",
      source: {
        title: "WA Health System - HSUWA - PACTS Industrial Agreement 2024, clause 21.5 and Schedule 2",
        publisher: "Western Australian Industrial Relations Commission",
        url: "https://downloads.wairc.wa.gov.au/agreements/wah043.pdf",
      },
      extraSources: [
        {
          title: "WA Health System - HSUWA - PACTS Industrial Agreement 2024 (agreement record WAH043)",
          publisher: "Western Australian Industrial Relations Commission",
          url: "https://www.wairc.wa.gov.au/resources/agreements?id=WAH043",
        },
      ],
      verifiedOn: VERIFIED,
      nextIncrease: null,
      status: "The agreement expires on 30 June 2027 and sets no rise after 1 July 2026.",
      proof:
        "Cover: \"FILE NO/S | AG 23 OF 2025 | CITATION NO. | 2025 WAIRC 00175 | Result | Agreement registered\". Clause 6.2: \"The expiry date of this Agreement is 30 June 2027.\" Schedule 2 header: \"Classification and increment | Existing Rate | On and from 1 July 2024 | On and from 1 July 2025 | On and from 1 July 2026\" with \"5% | 4% | 3.75%\"; row \"P-1.1 | $80,963 | $85,011 | $88,411 | $91,726\".",
    },
  ],
  scales: [
    {
      id: "wa-professional-division",
      state: "wa",
      professions: ["pharmacist", "radiographer", "physiotherapist", "psychologist", "occupational-therapist", "sonographer"],
      instrumentId: "wa-pacts-2024",
      title: "Health professionals, Professional Division P-1 to P-9",
      annualBasis: "published",
      steps: [
        { label: "P-1.1", annual: 91_726 },
        { label: "P-1.2", annual: 96_492 },
        { label: "P-1.3", annual: 101_865 },
        { label: "P-1.4", annual: 106_989 },
        { label: "P-1.5", annual: 114_816 },
        { label: "P-1.6", annual: 124_147 },
        { label: "P-2.1", annual: 127_194 },
        { label: "P-2.2", annual: 131_101 },
        { label: "P-2.3", annual: 135_150 },
        { label: "P-3.1", annual: 141_071 },
        { label: "P-3.2", annual: 145_918 },
        { label: "P-4.1", annual: 153_774 },
        { label: "P-4.2", annual: 158_894 },
        { label: "P-5.1", annual: 164_510 },
        { label: "P-5.2", annual: 173_830 },
        { label: "P-6.1", annual: 181_045 },
        { label: "P-6.2", annual: 188_388 },
        { label: "P-7", annual: 199_120 },
        { label: "P-8", annual: 205_947 },
        { label: "P-9", annual: 213_729 },
      ],
      entry: "P-1.1",
      entryRule:
        "Under clause 21.5(b), a three-year degree starts on P-1.1 and a four-year degree on P-1.2. A graduate-entry master's that qualifies you for the profession starts on the same step as the bachelor's degree for that profession. A further master's or a PhD starts on P-1.3. Higher levels are set by the position's classification (clause 21.5(e)).",
      top: "P-9",
      topNote: "P-9 is the top of the Professional Division scale",
      professionNotes: {
        psychologist:
          "Clause 21.6: a clinical psychologist registrar starts on P-1.5 and moves to P-1.6 in the second year; a clinical psychologist starts on P-2.3 and rises each year to P-4.2.",
      },
    },
  ],
};
