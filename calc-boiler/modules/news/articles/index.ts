import type { ComponentType } from "react";
import MinimumWageIncreaseJuly2026 from "./minimum-wage-increase-july-2026";

/** slug → article body component. Every entry in NEWS_ARTICLES must have a component here. */
export const NEWS_COMPONENTS: Record<string, ComponentType> = {
  "minimum-wage-increase-july-2026": MinimumWageIncreaseJuly2026,
};
