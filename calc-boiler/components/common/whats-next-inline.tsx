import Link from "next/link";
import { WhatsNext } from "@/components/common/page-end";
import NativeBanner from "@/components/common/native-banner";

/**
 * "What to check next", rendered directly under a calculator instead of (or as
 * well as) at the end of the page.
 *
 * Why: GA4 recorded 53 clicks on the page-end block in nine months. On the
 * bonus page it sat 17,061px down a 19,337px page. Under the calculator it is
 * one scroll away from the answer.
 *
 * This is a SERVER component: it reads lib/related-links.ts (a large table)
 * on the server so the table never ships in a client bundle. Calculator
 * modules are "use client", so they cannot import this directly — the route's
 * page.tsx renders it and passes it in as a prop:
 *
 *   // app/foo-calculator/page.tsx (server)
 *   <FooCalculator afterCalculator={<WhatsNextInline route="/foo-calculator/" />}>
 *
 *   // modules/calculator/foo-calculator.tsx (client)
 *   export default function FooCalculator({ children, afterCalculator }) {
 *     ... <section>calculator</section>
 *     {afterCalculator}
 *     {children}
 */
export default function WhatsNextInline({ route }: { route: string }) {
  // Our own next steps first, then the one native ad unit for the page.
  return (
    <>
      <WhatsNext path={route} Link={Link} placement="inline" />
      <NativeBanner className="pb-10" />
    </>
  );
}
