import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("christmas-shutdown-annual-leave");

function Page() {
  return <SeasonalRoute slug="christmas-shutdown-annual-leave" />;
}

export default withPageEnd(Page, "/christmas-shutdown-annual-leave/");
