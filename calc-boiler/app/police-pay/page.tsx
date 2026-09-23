import type { Metadata } from "next";
import { ServiceHubRoute, serviceHubMetadata } from "@/modules/guide/service-pay-routes";
import { withPageEnd } from "@/components/common/content-slots";

// F5 (24 Sep 2026): police pay by state hub. Copy, metadata and schema live in
// modules/guide/service-pay-routes.tsx, shared with the other service hubs.
export const metadata: Metadata = serviceHubMetadata("police");

function Page() {
  return <ServiceHubRoute occupation="police" />;
}

export default withPageEnd(Page, "/police-pay/");
