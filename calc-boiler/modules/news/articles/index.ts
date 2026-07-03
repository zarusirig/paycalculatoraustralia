import type { ComponentType } from "react";
import MinimumWageIncreaseJuly2026 from "./minimum-wage-increase-july-2026";
import NewMinimumWageTakeHomePay from "./new-minimum-wage-take-home-pay";
import AwardWageIncrease2026Industries from "./award-wage-increase-2026-industries";
import C13ClassificationPhaseOut from "./c13-classification-phase-out";

/** slug → article body component. Every entry in NEWS_ARTICLES must have a component here. */
export const NEWS_COMPONENTS: Record<string, ComponentType> = {
  "minimum-wage-increase-july-2026": MinimumWageIncreaseJuly2026,
  "new-minimum-wage-take-home-pay": NewMinimumWageTakeHomePay,
  "award-wage-increase-2026-industries": AwardWageIncrease2026Industries,
  "c13-classification-phase-out": C13ClassificationPhaseOut,
};
