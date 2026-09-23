import type { Metadata } from "next";
import { AviationRoute, aviationMetadata } from "@/modules/guide/aviation-pay-route";
import { withPageEnd } from "@/components/common/content-slots";

// F5 (24 Sep 2026): Air Pilots Award 2020 [MA000046] minimum pay.
export const metadata: Metadata = aviationMetadata("pilot");

function Page() {
  return <AviationRoute slug="pilot" />;
}

export default withPageEnd(Page, "/pilot-salary/");
