// Embeddable "current figure" badges (national minimum wage, super guarantee
// rate, tax-free threshold, HELP threshold). Same pattern as
// app/embed/take-home-pay/index.html: a route handler, so the document escapes
// the root layout (nav, ads, popunder, analytics) and is safe in third-party
// iframes. Framing and noindex headers for /embed/badge/ are in firebase.json.
import { badgeHtml } from "@/lib/embed/figure-badges";

export const dynamic = "force-static";

export function GET() {
  return new Response(badgeHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
