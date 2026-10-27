// Bakers Delight — sales staff, bakers and apprentice bakers in Bakers Delight
// bakeries. Almost every bakery is run by a franchisee; Bakers Delight Holdings
// Ltd is the franchisor and runs a small number of bakeries itself.
//
// Instrument: General Retail Industry Award 2020 (MA000004). Adult rates,
// junior percentages, Table 12 penalties and overtime are imported from iga.ts
// (cl 17.1 Table 4 from 1 July 2026) so the Retail Award pages cannot drift
// apart. What is unique here was read from the award on 22 October 2026:
//   - cl 4.2(e): the general retail industry includes "bakery shops at which
//     the predominant activity is baking products for sale on the premises".
//   - Schedule A.4.3(b): "baker, pastry cook" is an indicative Level 4 title
//     for an employee using a trade qualification most of the week.
//   - cl 24.2: for a baking production employee, shiftwork means a shift
//     starting at or after midnight and before 6.00am.
//   - cl 25.2: baking production early morning shift rate 112.5% (casual
//     137.5%) for a shift starting 2.00am to 6.00am; night shift rate 130%
//     (casual 155%) for a start between midnight and 2.00am. cl 25.2(c): these
//     apply instead of shiftwork and overtime for up to 38 hours a week and
//     9 hours a day.
//
// Coverage evidence (researched 22 October 2026) — STRONG:
//   - Fair Work Ombudsman media release, 17 July 2023 ("Bakers Delight
//     franchisor faces Court"): 142 staff in "sales and baking roles" at three
//     Hobart bakeries run by franchisee Make Dough Enterprises were underpaid
//     $1.25m because the franchisee kept paying a 2012 agreement's rates
//     "rather than increasing pay rates annually to ensure they were at least
//     equivalent to minimum rates listed in the General Retail Industry
//     Award". The FWO sued the franchisor under the Fair Work Act's franchisor
//     liability provisions (s 558B).
//   - Full Court, Bakers Delight Holdings Ltd v Fair Work Ombudsman [2025]
//     FCAFC 144: the franchisor's appeal on whether the FWO could rely on the
//     s 557C reverse onus failed. Liability itself was still before the
//     Federal Court when this page was written.
//   - bakersdelight.com.au/pages/franchising: "more than 700 bakeries located
//     across Australia, North America and New Zealand"; franchisees get
//     "guidance on employment, pay, and management".
//   - Old agreements: Bakers Delight Holdings made WorkChoices-era collective
//     agreements in 2006 and told staff in February 2017 it would pay its
//     company bakeries Retail Award rates while it applied to end them; some
//     franchisees had their own (the Hobart 2012 agreement, a 2016 Warnbro
//     agreement). None of those can pay a base rate below the award (s 206).
//
// Dollars derived here (half-up to the cent, re-derived in the B2 test):
//   Level 1 $27.81: early morning 112.5% $31.29 (casual $38.24); night 130%
//   $36.15 (casual $43.11). Level 4 $29.45: 112.5% $33.13 (casual $40.49);
//   130% $38.29 (casual $45.65).

import type { EmployerPay } from "./types";
import { IGA_PAY } from "./iga";

const FWO_2023_URL =
  "https://www.fairwork.gov.au/newsroom/media-releases/2023-media-releases/july-2023/20230717-bakers-delight-franchisor-litigation-media-release";
const FRANCHISING_URL = "https://www.bakersdelight.com.au/pages/franchising";

export const BAKERS_DELIGHT_PAY: EmployerPay = {
  ...IGA_PAY,
  slug: "bakers-delight",
  name: "Bakers Delight",
  employerEntity:
    "The franchisee that owns your bakery. Most Bakers Delight bakeries are franchised; Bakers Delight Holdings Ltd is the franchisor and runs a small number of bakeries itself.",
  industry: "bakery",
  instrument: {
    ...IGA_PAY.instrument,
    coverage:
      "The General Retail Industry Award covers bakery shops that bake what they sell (cl 4.2(e)), so it sets the minimum pay for Bakers Delight sales staff, bakers and apprentices. Your employer is the franchisee that owns your bakery, or Bakers Delight Holdings at a company bakery. A franchisee with its own approved enterprise agreement pays under that agreement instead, but it cannot pay a base rate below the award.",
  },
  nextIncrease: {
    date: "First full pay period on or after 1 December 2026 (sales staff aged 18 and 19)",
    detail:
      "Determination PR813655 applies to sales staff at Levels 1 to 3 with more than 6 months' service. An 18-year-old goes from 70% to 75% of the adult rate, or $20.86 an hour at Level 1. A 19-year-old goes from 80% to 85%, or $23.64. Bakers and other Level 4 staff are already on adult rates at any age. Adult rates next move with the 2027 Annual Wage Review.",
  },
  verifiedOn: "22 October 2026",
  rates: IGA_PAY.rates.map((r, i) => {
    if (i === 0) {
      return { ...r, description: "Sales assistant: serving customers, slicing and bagging bread, the till, incidental cleaning; also an unqualified baking assistant" };
    }
    if (r.level === "Retail employee level 3") {
      return { ...r, description: "Opens or closes the bakery, secures cash, or is second in charge to the manager" };
    }
    if (r.level === "Retail employee level 4") {
      return { ...r, description: "Qualified baker or pastry cook using the trade for most of the week (Schedule A.4.3(b)); assistant bakery manager" };
    }
    return r;
  }),
  juniorNote:
    "Retail Award junior percentages (cl 17.2) apply to sales staff at Levels 1 to 3 only. A qualified baker is Level 4, so a junior baker gets the full adult rate. Apprentice bakers are paid a percentage of the Level 4 rate under the award's apprentice schedule instead.",
  penalties: [
    ...IGA_PAY.penalties,
    { when: "Baking production: shift starting 2am to 6am", permanent: "112.5%", casual: "137.5%", note: "Early morning shift rate, cl 25.2(a)" },
    { when: "Baking production: shift starting midnight to 2am", permanent: "130%", casual: "155%", note: "Night shift rate, cl 25.2(b)" },
  ],
  penaltyNotes: [
    "The first five rows are the award's Table 12 rates for ordinary hours (cl 22.1). The percentage is of the minimum hourly rate for your level. The casual column already includes the 25% loading.",
    "The Retail Award has separate rates for early starts in baking production. A baking production employee whose shift starts between 2am and 6am gets 112.5% for the whole shift (casual 137.5%). One who starts between midnight and 2am gets 130% (casual 155%). For a Level 1 baking assistant that is $31.29 and $36.15 an hour ($38.24 and $43.11 casual); for a Level 4 baker $33.13 and $38.29 ($40.49 and $45.65 casual). These rates replace the shiftwork and overtime rates for up to 38 hours a week and 9 hours a day (cl 25.2(c)).",
    "For a Level 1 sales assistant, weekday evenings after 6pm and Saturdays pay $34.76 an hour ($41.72 casual), Sundays $41.72 ($48.67 casual) and public holidays $62.57 ($69.53 casual).",
  ],
  notices: [
    "These are the General Retail Industry Award minimums for bakery shops. Your employer is the franchisee that owns your bakery, not Bakers Delight Holdings, unless you work at one of the company's own bakeries. Franchisees can pay more; they cannot pay less.",
    "In July 2023 the Fair Work Ombudsman went to court over $1.25 million in underpayments to 142 mostly young sales and baking staff at three Hobart bakeries. The franchisee had kept paying the rates in its 2012 agreement instead of lifting them to the Retail Award each year. The Ombudsman also sued Bakers Delight Holdings as the franchisor, and in 2025 the Full Federal Court rejected the company's appeal on a point of law in that case. An old agreement cannot be used to pay a base rate below the award (Fair Work Act s 206).",
    "If your payslip names an enterprise agreement, that agreement sets your penalties and allowances, but every base rate in it must be at least the award rate for your level.",
  ],
  unverified: [
    "Whether your particular franchisee has its own enterprise agreement. Agreements are registered under the franchisee's company name, which we cannot search bakery by bakery.",
    "Apprentice baker rates: the award pays apprentices a percentage of the Level 4 rate (Schedule B.4 and B.5) that depends on the apprenticeship year and when it started. Not transcribed here.",
    "Bakery manager salaries, which franchisees set by contract.",
    "The current status of Bakers Delight Holdings' 2006 collective agreements, which the company applied to end in 2017 and again in 2019.",
  ],
  sources: [
    { title: "General Retail Industry Award 2020 (MA000004), consolidated to 1 July 2026: cl 4.2(e), cl 22, cl 24 to 25, Schedule A", publisher: "Fair Work Commission", url: IGA_PAY.instrument.url },
    { title: "Bakers Delight franchisor faces Court (17 July 2023)", publisher: "Fair Work Ombudsman", url: FWO_2023_URL },
    { title: "Franchising with Bakers Delight (more than 700 bakeries; employment and pay guidance for franchisees)", publisher: "Bakers Delight Holdings", url: FRANCHISING_URL },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
  ],
  faqs: [
    {
      q: "How much does Bakers Delight pay an hour in 2026?",
      a: "Bakers Delight bakeries fall under the General Retail Industry Award. From the first full pay period on or after 1 July 2026, an adult sales assistant at Level 1 must get at least $27.81 an hour ($34.76 casual). A qualified baker at Level 4 must get at least $29.45 ($36.81 casual), plus the early-start rates below.",
    },
    {
      q: "What do Bakers Delight bakers get for early starts?",
      a: "The Retail Award has early morning and night shift rates for Bakers Delight baking production staff. A shift that starts between 2am and 6am is paid at 112.5% for the whole shift, which is $33.13 an hour for a Level 4 baker ($40.49 casual). A shift that starts between midnight and 2am is paid at 130%, or $38.29 ($45.65 casual). These apply instead of overtime for up to 9 hours a day and 38 hours a week.",
    },
    {
      q: "Who is my employer at Bakers Delight?",
      a: "Usually the franchisee that owns your bakery, not Bakers Delight Holdings. The chain has more than 700 bakeries, almost all franchised, and each franchisee hires and pays its own staff. Your payslip must show the employer's legal name and the award or agreement you are paid under.",
    },
    {
      q: "How much does Bakers Delight pay a 15 or 16 year old?",
      a: "At Level 1 under the Retail Award, a sales assistant under 16 is paid 45% of the adult rate, which is $12.51 an hour ($15.64 casual). A 16-year-old gets 50%, or $13.91 ($17.39 casual). These figures are our arithmetic from the award percentages; junior rates do not apply to a qualified baker at Level 4.",
    },
    {
      q: "Was Bakers Delight taken to court over underpayments?",
      a: "Yes. In 2023 the Fair Work Ombudsman alleged 142 staff at three Hobart bakeries were underpaid $1.25 million between 2017 and 2020. It sued the franchisor as well as the former franchisee. The Full Federal Court dismissed Bakers Delight Holdings' appeal on a legal point in 2025. The case is about past pay, not the current award rates on this page.",
    },
  ],
};
