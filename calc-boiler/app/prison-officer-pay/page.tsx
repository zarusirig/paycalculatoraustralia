import type { Metadata } from "next";
import { ServiceHubRoute, serviceHubMetadata } from "@/modules/guide/service-pay-routes";
import { withPageEnd } from "@/components/common/content-slots";

// J8 (9 Oct 2026): prison officer pay by state hub. Copy, metadata and schema live in
// modules/guide/service-pay-routes.tsx, shared with the other service hubs.
export const metadata: Metadata = serviceHubMetadata("prison-officer");

function Page() {
  return <ServiceHubRoute occupation="prison-officer" />;
}

export default withPageEnd(Page, "/prison-officer-pay/");
