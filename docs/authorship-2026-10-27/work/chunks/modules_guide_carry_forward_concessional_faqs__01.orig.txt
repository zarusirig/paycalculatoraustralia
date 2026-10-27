import { SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { CARRY_FORWARD } from "@/lib/constants/super-contributions";
import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Sources: ATO "Concessional
// contributions cap" (QC19749, last updated 2 Jul 2026) and "Personal super
// contributions", read 5 October 2026. See lib/constants/carry-forward.ts.

const CAP = formatAUD(SUPER_GUARANTEE.concessionalCap);
const LIMIT = formatAUD(CARRY_FORWARD.totalSuperBalanceLimit);

export const CARRY_FORWARD_FAQS: Faq[] = [
  {
    q: "What are carry-forward concessional contributions?",
    a: `If you contribute less than the concessional cap in a year, the unused part can be carried forward and used in later years to contribute above the general cap, for up to ${CARRY_FORWARD.years} years. It lets you catch up on before-tax super contributions, for example by salary sacrificing or making a personal contribution you claim as a deduction.`,
  },
  {
    q: "Who can use carry-forward contributions?",
    a: `You can use carried-forward amounts if your total super balance was less than ${LIMIT} at 30 June of the previous financial year, and you have unused cap amounts from earlier years. The amounts count from 2018-19 and can include years when you were not a member of a super fund.`,
  },
  {
    q: "What is the concessional contributions cap for 2026-27?",
    a: `${CAP} from 1 July 2026. It was $30,000 for 2024-25 and 2025-26, $27,500 for 2021-22 to 2023-24, and $25,000 from 2017-18 to 2020-21.`,
  },
  {
    q: "How long does an unused cap amount last?",
    a: `Five years, then it expires. The ATO's example: a 2020-21 unused amount not used by the end of 2025-26 expires. So for 2026-27 you can use unused amounts from 2021-22 to 2025-26, and the 2021-22 amount is lost after 30 June 2027.`,
  },
  {
    q: "Which carry-forward amounts are used first?",
    a: "The oldest. The ATO says the oldest available unused cap amounts are carried forward first, so the amount closest to expiring is used before newer ones. This happens automatically once your concessional contributions exceed the general cap for the year.",
  },
  {
    q: "What counts as a concessional contribution?",
    a: "Your employer's super guarantee, salary sacrifice contributions, any other employer contributions (including fees and insurance your employer pays for you) and personal contributions you claim a tax deduction for. Contributions count towards the cap in the year your super fund receives them.",
  },
  {
    q: "How do I find my unused cap amounts?",
    a: "Sign in to ATO online services through myGov and select Super, then Information, then Carry forward concessional contributions. Your concessional contributions and your total super balance are shown in the same area. Check your fund has reported everything before you rely on the figure.",
  },
  {
    q: "How do I claim a tax deduction for a personal contribution?",
    a: "You must give your super fund a notice of intent to claim a deduction, in the approved form, and receive an acknowledgment from the fund. Time limits apply, so do this before you lodge your tax return for the year. Contributions your employer makes by salary sacrifice need no notice.",
  },
  {
    q: "What happens if I go over the cap?",
    a: "Excess concessional contributions are included in your assessable income and taxed at your marginal rate, with a 15% tax offset for the tax your fund already paid. The excess concessional contributions charge no longer applies from 1 July 2021, and you can choose to release up to 85% of the excess from your super.",
  },
];
