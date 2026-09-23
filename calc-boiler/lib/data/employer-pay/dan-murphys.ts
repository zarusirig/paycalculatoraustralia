// Dan Murphy's — in-store team members, including The Cellar by Dan Murphy's,
// W for Wine (Vaucluse) and Swanbourne Cellars.
//
// Instrument: the SAME agreement as bws.ts — Endeavour Group Retail Agreement
// 2025 (AG2025/2853, AE531119). Everything is imported from bws.ts except:
//   - Duty Manager, a Dan Murphy's-only classification (cl 4.1.1: $30.07 →
//     2026 formula $30.07 x 1.0475 = $31.50; casual $39.38);
//   - the in-charge allowance, which is BWS Team Members only (cl 5.2).

import type { EmployerPay, RateRow } from "./types";
import { BWS_PAY, ENDEAVOUR_SENIOR_TEAM_MEMBER, ENDEAVOUR_TEAM_MEMBER } from "./bws";

const DUTY_MANAGER: RateRow = {
  level: "Duty Manager (Dan Murphy's only)",
  description: "Works as a Duty Manager at Dan Murphy's, above Senior Team Member level (Appendix A)",
  hourly: 31.5,
  casualHourly: 39.38,
};

export const DAN_MURPHYS_PAY: EmployerPay = {
  ...BWS_PAY,
  slug: "dan-murphys",
  name: "Dan Murphy's",
  employerEntity: "Endeavour Group Limited, trading as Dan Murphy's",
  rates: [ENDEAVOUR_TEAM_MEMBER, ENDEAVOUR_SENIOR_TEAM_MEMBER, DUTY_MANAGER],
  notices: [
    "Dan Murphy's and BWS staff share one agreement, the Endeavour Group Retail Agreement 2025, so their rates are the same apart from Dan Murphy's Duty Manager level. The agreement prints its starting rates ($27.26 an hour for a Team Member) and lifts them each July by the Retail Award's Annual Wage Review percentage — 4.75% in 2026. The 2026 figures here are our calculation from that rule, rounded to the cent.",
    "When it approved the agreement, the Fair Work Commission compared Team Member with Retail Award Levels 1 and 2, Senior Team Member with Levels 3 and 4 and Duty Manager with Level 6. In 2026 all three stay above those award rates ($28.45, $29.45 and $31.11).",
    "Staff who were on Retail Employee Level 2 under the Dan Murphy's Agreement 2019 when the new agreement started keep a higher base rate (undertakings 5 and 7): about $28.81 an hour in 2026 by the same formula.",
  ],
  faqs: [
    {
      q: "How much does Dan Murphy's pay an hour in 2026?",
      a: "A Dan Murphy's Team Member is paid about $28.55 an hour, or $35.69 as a casual, from the first full pay period on or after 1 July 2026. A Senior Team Member gets about $29.83 and a Duty Manager about $31.50. These apply the 2026 Annual Wage Review increase of 4.75% to the rates printed in the Endeavour Group Retail Agreement 2025.",
    },
    {
      q: "Is Dan Murphy's pay the same as BWS?",
      a: "Yes, apart from the Duty Manager level, which only Dan Murphy's has. Both are run by Endeavour Group and covered by the Endeavour Group Retail Agreement 2025 (AE531119), which replaced their separate 2019 agreements.",
    },
    {
      q: "Does Dan Murphy's pay junior rates?",
      a: "No. The Endeavour Group agreement pays the adult rate to every team member regardless of age.",
    },
    {
      q: "What does Dan Murphy's pay on Sundays and public holidays?",
      a: "Between 9am and 11pm on a Sunday, permanent staff get base + 50% and casuals base + 75% (about $42.83 and $49.96 an hour for a Team Member). Public holidays pay base + 125%, or base + 150% for casuals.",
    },
    {
      q: "When does the Dan Murphy's agreement expire?",
      a: "Its nominal expiry date is 30 June 2029. Until then, rates rise from the first full pay period on or after each 1 July by the percentage the Annual Wage Review gives the General Retail Industry Award.",
    },
  ],
};
