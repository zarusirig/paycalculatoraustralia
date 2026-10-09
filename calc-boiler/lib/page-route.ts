import { cache } from "react";

/**
 * Per-render state for the page being rendered, for server components deep
 * in the tree that need it without a prop chain (FeaturedImage, JsonLd).
 *
 * `route` is the page's path, e.g. "/job-pay-rates/nurse/". withPageEnd
 * (components/common/page-end.tsx) wraps every page and already resolves the
 * real path, dynamic segments included; it records it here before its page
 * renders. React's `cache` scopes the store to one server render, so
 * concurrent prerenders cannot see each other's state.
 *
 * Server components only: in a client component the store is always empty.
 */
const store = cache((): { route: string | null; jsonLdImageApplied: boolean } => ({
  route: null,
  jsonLdImageApplied: false,
}));

export function setPageRoute(route: string): void {
  store().route = route;
}

export function getPageRoute(): string | null {
  return store().route;
}

/** True once a <JsonLd> on this page has carried the featured image. */
export function jsonLdImageApplied(): boolean {
  return store().jsonLdImageApplied;
}

export function markJsonLdImageApplied(): void {
  store().jsonLdImageApplied = true;
}
