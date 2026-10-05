// Subscribable .ics for /pay-and-tax-changes-calendar/. The folder is literally
// named `pay-and-tax-changes-2026-27.ics`: with `output: "export"` a route
// handler's body is written to out/<route>, so this lands at
// out/pay-and-tax-changes-calendar/pay-and-tax-changes-2026-27.ics (same
// pattern as app/embed/take-home-pay/index.html).
import { icsCalendar } from "@/lib/constants/pay-tax-changes-calendar";

export const dynamic = "force-static";

export function GET() {
  return new Response(icsCalendar(), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
