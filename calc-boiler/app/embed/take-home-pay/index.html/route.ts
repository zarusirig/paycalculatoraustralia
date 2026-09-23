// F8 (Lever D): the embeddable take-home pay widget.
//
// A route handler, not a page, so the document escapes the root layout (nav,
// ads, popunder, analytics) and is safe to run inside third-party iframes.
// The folder is literally named `index.html`: with `output: "export"` a route
// handler's body is written to out/<route>, so this lands at
// out/embed/take-home-pay/index.html and Firebase (cleanUrls + trailingSlash)
// serves it at /embed/take-home-pay/. Framing and noindex headers for this
// path are in firebase.json (block labelled F8).
import { takeHomeWidgetHtml } from "@/lib/embed/take-home-widget-html";

export const dynamic = "force-static";

export function GET() {
  return new Response(takeHomeWidgetHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
