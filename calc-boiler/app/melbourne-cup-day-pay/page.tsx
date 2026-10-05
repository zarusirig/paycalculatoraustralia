import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("melbourne-cup-day-pay");

function Page() {
  return <SeasonalRoute slug="melbourne-cup-day-pay" />;
}

export default withPageEnd(Page, "/melbourne-cup-day-pay/");
