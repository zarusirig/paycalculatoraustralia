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
import FederalBudget202627YourPay from "./federal-budget-2026-27-your-pay";
import MedicareLevyThresholds2026 from "./medicare-levy-thresholds-2026";
import TaxCutJuly2026 from "./tax-cut-july-2026";
import ThousandDollarInstantTaxDeduction from "./1000-dollar-instant-tax-deduction";
import TaxTime2026WhatsNew from "./tax-time-2026-whats-new";
import July12026MoneyChanges from "./july-1-2026-money-changes";
import CentrelinkPaymentIncreaseJanuary2026 from "./centrelink-payment-increase-january-2026";
import AgePensionIncreaseMarch2026 from "./age-pension-increase-march-2026";
import DeemingRatesChange2026 from "./deeming-rates-change-2026";
import CentrelinkChangesJuly2026 from "./centrelink-changes-july-2026";
// W5: Victorian teachers pay rise (23 Sep 2026)
import VictorianTeachersPayRise2026 from "./victorian-teachers-pay-rise-2026";
// --- G6: news articles, 24 Sep 2026 ---
import AgePensionIncreaseSeptember2026 from "./age-pension-increase-september-2026";
import SchadsHomeCareDisabilityPayRiseDecember2026 from "./schads-home-care-disability-pay-rise-december-2026";
import HealthProfessionalsAwardChangesOctober2026 from "./health-professionals-award-changes-october-2026";
import JuniorPayRatesDecember2026 from "./junior-pay-rates-december-2026";
import QueenslandStateWageCase2026 from "./queensland-state-wage-case-2026";
import TaxReturnDeadlineOctober2026 from "./tax-return-deadline-october-2026";
// --- end G6 ---

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
  "federal-budget-2026-27-your-pay": FederalBudget202627YourPay,
  "medicare-levy-thresholds-2026": MedicareLevyThresholds2026,
  "tax-cut-july-2026": TaxCutJuly2026,
  "1000-dollar-instant-tax-deduction": ThousandDollarInstantTaxDeduction,
  "tax-time-2026-whats-new": TaxTime2026WhatsNew,
  "july-1-2026-money-changes": July12026MoneyChanges,
  "centrelink-payment-increase-january-2026": CentrelinkPaymentIncreaseJanuary2026,
  "age-pension-increase-march-2026": AgePensionIncreaseMarch2026,
  "deeming-rates-change-2026": DeemingRatesChange2026,
  "centrelink-changes-july-2026": CentrelinkChangesJuly2026,
  // W5: Victorian teachers pay rise (23 Sep 2026)
  "victorian-teachers-pay-rise-2026": VictorianTeachersPayRise2026,
  // --- G6: news articles, 24 Sep 2026 ---
  "age-pension-increase-september-2026": AgePensionIncreaseSeptember2026,
  "schads-home-care-disability-pay-rise-december-2026": SchadsHomeCareDisabilityPayRiseDecember2026,
  "health-professionals-award-changes-october-2026": HealthProfessionalsAwardChangesOctober2026,
  "junior-pay-rates-december-2026": JuniorPayRatesDecember2026,
  "queensland-state-wage-case-2026": QueenslandStateWageCase2026,
  "tax-return-deadline-october-2026": TaxReturnDeadlineOctober2026,
  // --- end G6 ---
};
