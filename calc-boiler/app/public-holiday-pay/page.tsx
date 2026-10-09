import type { Metadata } from "next";
import { PublicHolidayHubRoute, publicHolidayHubMetadata } from "@/modules/guide/public-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(publicHolidayHubMetadata());

function Page() {
  return <PublicHolidayHubRoute />;
}

export default withPageEnd(Page, "/public-holiday-pay/");
