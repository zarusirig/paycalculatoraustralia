import type { Metadata } from "next";
import { ServiceHubRoute, serviceHubMetadata } from "@/modules/guide/service-pay-routes";
import { withPageEnd } from "@/components/common/content-slots";

// F5 (24 Sep 2026): firefighter pay by state hub. Copy, metadata and schema live in
// modules/guide/service-pay-routes.tsx, shared with the other service hubs.
export const metadata: Metadata = serviceHubMetadata("firefighter");

function Page() {
  return <ServiceHubRoute occupation="firefighter" />;
}

export default withPageEnd(Page, "/firefighter-pay/");
