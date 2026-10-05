import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("easter-public-holiday-pay");

function Page() {
  return <SeasonalRoute slug="easter-public-holiday-pay" />;
}

export default withPageEnd(Page, "/easter-public-holiday-pay/");
