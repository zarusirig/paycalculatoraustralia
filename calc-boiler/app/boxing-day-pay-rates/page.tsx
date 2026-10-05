import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("boxing-day-pay-rates");

function Page() {
  return <SeasonalRoute slug="boxing-day-pay-rates" />;
}

export default withPageEnd(Page, "/boxing-day-pay-rates/");
