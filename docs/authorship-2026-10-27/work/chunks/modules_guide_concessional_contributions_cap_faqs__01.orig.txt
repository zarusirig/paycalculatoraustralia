import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import {
  CARRY_FORWARD,
  CONCESSIONAL_CAP_BY_YEAR,
  CONTRIBUTIONS_TAX_RATE,
  DIVISION_293,
  ECC_MAX_RELEASE,
  annualSuperGuarantee,
  carryForwardWindow,
} from "@/lib/constants/super-contributions";

// Shared by the page body and the FAQPage JSON-LD. Sources are cited in
// lib/constants/super-contributions.ts.

const FY = SITE_CONFIG.financialYear;
const CAP = formatAUD(SUPER_GUARANTEE.concessionalCap);
const PREV = formatAUD(CONCESSIONAL_CAP_BY_YEAR[SITE_CONFIG.previousFinancialYear]);
const W = carryForwardWindow();
const SG_100K = annualSuperGuarantee(100_000);

export const CONCESSIONAL_CAP_FAQS: readonly { q: string; a: string }[] = [
  {
    q: `What is the concessional contributions cap for ${FY}?`,
    a: `${CAP}, up from ${PREV} in ${SITE_CONFIG.previousFinancialYear}. It rose on 1 July 2026 through indexation to average weekly ordinary time earnings, which moves the cap in $2,500 steps. It covers all before-tax contributions to all your funds combined: employer super guarantee, salary sacrifice and personal contributions you claim a deduction for.`,
  },
  {
    q: "Does employer super count towards the concessional cap?",
    a: `Yes. The ${formatPercent(SUPER_GUARANTEE.rate, 0)} super guarantee counts first, so it decides how much room is left. On a ${formatAUD(100_000)} salary your employer pays ${formatAUD(SG_100K)}, leaving ${formatAUD(SUPER_GUARANTEE.concessionalCap - SG_100K)} for salary sacrifice and deductible personal contributions.`,
  },
  {
    q: "How much can I salary sacrifice into super?",
    a: `The ATO sets no limit on the sacrifice itself unless your employment terms do, but anything that takes your total concessional contributions over the cap is excess and taxed at your marginal rate. Subtract your employer's super guarantee and any other concessional contributions from ${CAP} (plus any carry-forward you're eligible for) to find your room.`,
  },
  {
    q: "How does the carry-forward of unused concessional cap work?",
    a: `If your total super balance was under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} at 30 June of the previous year, you can use unused cap amounts from up to ${CARRY_FORWARD.years} previous years. For ${FY} that is ${W[0].year} to ${W[W.length - 1].year}. The oldest amounts are used first, and each expires after five years. You don't apply for it: the ATO uses it automatically once you go over the general cap.`,
  },
  {
    q: "How much tax is paid on concessional super contributions?",
    a: `${formatPercent(CONTRIBUTIONS_TAX_RATE, 0)}, paid by your super fund. If your income plus concessional contributions is over ${formatAUD(DIVISION_293.threshold)}, Division 293 adds another ${formatPercent(DIVISION_293.rate, 0)} on the lesser of the contributions and the amount over ${formatAUD(DIVISION_293.threshold)}.`,
  },
  {
    q: "What happens if I go over the concessional cap?",
    a: `The excess is added to your assessable income and taxed at your marginal rate, less a 15% tax offset for the contributions tax the fund already paid. The old excess concessional contributions charge no longer applies from 1 July 2021. You can ask to release up to ${formatPercent(ECC_MAX_RELEASE, 0)} of the excess from your fund to pay the tax; any excess you don't release counts towards your non-concessional cap.`,
  },
  {
    q: "What is the non-concessional contributions cap?",
    a: `${formatAUD(SUPER_GUARANTEE.nonConcessionalCap)} for ${FY}. That cap is for after-tax contributions you don't claim a deduction for, and it's separate from the ${CAP} concessional cap.`,
  },
];
