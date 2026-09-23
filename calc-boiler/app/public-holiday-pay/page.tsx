import type { Metadata } from "next";
import { PublicHolidayHubRoute, publicHolidayHubMetadata } from "@/modules/guide/public-holiday-routes";

export const metadata: Metadata = publicHolidayHubMetadata();

export default function Page() {
  return <PublicHolidayHubRoute />;
}
