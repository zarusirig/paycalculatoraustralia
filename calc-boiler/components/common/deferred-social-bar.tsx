"use client";

import { useEffect } from "react";

/**
 * Adsterra social bar / popunder, loaded on a delay instead of immediately.
 *
 * Previously this shipped as `<Script strategy="afterInteractive">`, which
 * fires an unprompted window at almost every visitor — including the ones who
 * landed, saw a headline partly covered by a sidebar ad, and were already
 * leaving. Those sessions produced a bounce AND a poor experience for an
 * impression that was never going to lead anywhere.
 *
 * Loading it after the visitor has either stayed DELAY_MS or actually used a
 * calculator keeps the impressions that come from engaged sessions and drops
 * the ones from sessions that were bouncing regardless.
 *
 * READ THIS BEFORE CHANGING DELAY_MS.
 *
 * Measured from the Adsterra API, 30 days to 2026-07-28 for this domain:
 *
 *   SocialBar (this unit)  12,412 impressions   $20.18 CPM   $250.44
 *   320x50 mobile          13,588 impressions   $0.33 CPM      $4.46
 *   300x250                 6,846 impressions   $0.54 CPM      $3.67
 *   728x90 leaderboard      6,901 impressions   $0.46 CPM      $3.17
 *   468x60 banner                0 impressions                 $0.00
 *   160x600 rail                 0 impressions                 $0.00
 *
 * This single unit is 94% of site revenue. Every display banner combined earns
 * $11.29/month. It also fires on roughly 90% of pageviews, so any delay long
 * enough to help bounce rate cuts directly into the only meaningful income the
 * site has.
 *
 * DELAY_MS was 0 from the refactor until 26 Sep 2026 — byte-identical
 * behaviour to before. The component exists so the trade is a one-line change
 * made deliberately, not an accident:
 *
 *   - DELAY_MS = 0       → fires immediately, full revenue
 *   - DELAY_MS = 10_000  → spares instant-bouncers, modest revenue cost
 *   - DELAY_MS = 45_000  → large bounce-rate win, expect a large revenue cut
 *   - remove from layout.tsx → no popunder, lose ~94% of revenue
 *
 * CHANGED 26 Sep 2026: DELAY_MS 0 → 10_000, as a measured test.
 *
 * Why: the Social Bar (89.3% of revenue in the 28 days to 25 Sep 2026, see
 * docs/revenue/2026-09-26-adsterra-28d.md) rewrites the tab title to
 * "(1) New Message!" and draws a fake notification over the page the moment
 * it loads, so every visitor's first impression of the site is a fake
 * message. GA4 shows 65% of sessions end within 10 seconds anyway, so those
 * sessions were never going to click it; a 10s delay only removes the unit
 * from visitors who were already leaving. The calculator-input trigger below
 * is unchanged, so an engaged visitor still gets it before the 10s mark.
 *
 * How it is judged: one week after deploy, run from calc-boiler
 *
 *   node scripts/adsterra-report.mjs --days 7 --compare
 *
 * and compare Social Bar revenue per 1k pageviews against the baseline.
 * REVERT to 0 if Social Bar revenue drops more than 15% while sessions are
 * flat. If sessions also fell, the drop is traffic, not the delay — look at
 * the per-1k-pageview figure, not the dollar total.
 *
 * Whichever you pick, note that Chrome's Abusive Experience Report lists
 * popunders explicitly, and a flagged domain has ALL ads blocked in Chrome —
 * Adsterra's included. That is a tail risk to 100% of revenue, not just this
 * unit's share.
 */

const SRC = "https://pl29540036.effectivecpmnetwork.com/d6/b7/79/d6b779f19c693c0f80a1c6a82ba34550.js";

const DELAY_MS = 10_000;

export default function DeferredSocialBar() {
  useEffect(() => {
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      teardown();

      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      // Cloudflare Rocket Loader rewrites Adsterra tags unless they opt out (Adsterra doc, 28 Jan 2026).
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    };

    // Any interaction with a calculator input means the visitor got value from
    // the page, so treat it as the engagement signal.
    const onInteract = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, select, textarea")) load();
    };

    const timer = window.setTimeout(load, DELAY_MS);
    document.addEventListener("change", onInteract, { passive: true });
    document.addEventListener("input", onInteract, { passive: true });

    function teardown() {
      window.clearTimeout(timer);
      document.removeEventListener("change", onInteract);
      document.removeEventListener("input", onInteract);
    }

    return teardown;
  }, []);

  return null;
}
