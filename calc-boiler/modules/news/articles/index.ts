import type { ComponentType } from "react";
import MinimumWageIncreaseJuly2026 from "./minimum-wage-increase-july-2026";
import NewMinimumWageTakeHomePay from "./new-minimum-wage-take-home-pay";
import AwardWageIncrease2026Industries from "./award-wage-increase-2026-industries";
import C13ClassificationPhaseOut from "./c13-classification-phase-out";
import PaydaySuperStartsJuly2026 from "./payday-super-starts-july-2026";
import PaydaySuperEmployeesPayslip from "./payday-super-employees-payslip";
import Division296SuperTaxStarts from "./division-296-super-tax-starts";
import SuperContributionCaps202627 from "./super-contribution-caps-2026-27";
import TransferBalanceCapIncrease2026 from "./transfer-balance-cap-increase-2026";
import SuperTaxChangesExplained from "./super-tax-changes-explained";
import HecsIndexation2026 from "./hecs-indexation-2026";
import Hecs20PercentCutStatus from "./hecs-20-percent-cut-status";
import HecsRepaymentThreshold202627 from "./hecs-repayment-threshold-2026-27";
import HecsMarginalRepaymentFirstTaxTime from "./hecs-marginal-repayment-first-tax-time";

/** slug → article body component. Every entry in NEWS_ARTICLES must have a component here. */
export const NEWS_COMPONENTS: Record<string, ComponentType> = {
  "minimum-wage-increase-july-2026": MinimumWageIncreaseJuly2026,
  "new-minimum-wage-take-home-pay": NewMinimumWageTakeHomePay,
  "award-wage-increase-2026-industries": AwardWageIncrease2026Industries,
  "c13-classification-phase-out": C13ClassificationPhaseOut,
  "payday-super-starts-july-2026": PaydaySuperStartsJuly2026,
  "payday-super-employees-payslip": PaydaySuperEmployeesPayslip,
  "division-296-super-tax-starts": Division296SuperTaxStarts,
  "super-contribution-caps-2026-27": SuperContributionCaps202627,
  "transfer-balance-cap-increase-2026": TransferBalanceCapIncrease2026,
  "super-tax-changes-explained": SuperTaxChangesExplained,
  "hecs-indexation-2026": HecsIndexation2026,
  "hecs-20-percent-cut-status": Hecs20PercentCutStatus,
  "hecs-repayment-threshold-2026-27": HecsRepaymentThreshold202627,
  "hecs-marginal-repayment-first-tax-time": HecsMarginalRepaymentFirstTaxTime,
};
