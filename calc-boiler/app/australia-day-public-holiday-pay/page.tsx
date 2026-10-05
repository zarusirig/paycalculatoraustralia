import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("australia-day-public-holiday-pay");

function Page() {
  return <SeasonalRoute slug="australia-day-public-holiday-pay" />;
}

export default withPageEnd(Page, "/australia-day-public-holiday-pay/");
