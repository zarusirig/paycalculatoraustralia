import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("christmas-day-pay-rates");

function Page() {
  return <SeasonalRoute slug="christmas-day-pay-rates" />;
}

export default withPageEnd(Page, "/christmas-day-pay-rates/");
