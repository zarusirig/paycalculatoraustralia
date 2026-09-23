import type { ComponentType } from "react";
import Link from "next/link";
import AdsterraBanner from "@/components/common/adsterra-banner";
import { withPageEndUsing } from "@/components/common/page-end";

/**
 * Wraps a route's default export so it renders the 300x250 rectangle and
 * "What to check next" after the page (see ./page-end.tsx):
 *
 *   export default withPageEnd(Page, "/take-home-pay-on/[salary]/");
 *
 * Every page in app/ uses this except the homepage, which calls
 * `withPageEndUsing` with its own client re-exports.
 */
export function withPageEnd<P extends object>(Page: ComponentType<P>, route: string) {
  return withPageEndUsing(Page, route, { Link, Banner: AdsterraBanner });
}
