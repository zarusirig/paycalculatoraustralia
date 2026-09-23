import type { Metadata } from "next";
import { PublicHolidayHubRoute, publicHolidayHubMetadata } from "@/modules/guide/public-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = publicHolidayHubMetadata();

function Page() {
  return <PublicHolidayHubRoute />;
}

export default withPageEnd(Page, "/public-holiday-pay/");
