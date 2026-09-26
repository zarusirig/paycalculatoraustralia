"use client";

import { useEffect } from "react";

/**
 * Adsterra Popunder_1 (placement 29439534), with guardrails. Added 26 Sep 2026.
 *
 * Why it exists: the owner's goal is $50/day against a $15.29/day baseline
 * (docs/revenue/README.md). The unit was provisioned but Inactive until
 * 26 Sep 2026, so it had never earned anything.
 *
 * Why the guardrails: a popunder binds to the visitor's next click anywhere on
 * the page and opens an ad window. The guardrails decide WHO gets it and WHEN,
 * so it never costs us the answer or the next page:
 *
 * 1. Desktop only (wide screen + mouse). On phones a "popunder" opens a new
 *    tab IN FRONT of our page, which pulls the visitor away mid-calculation.
 *    Phones keep the Social Bar only.
 * 2. Only after the visitor has had their answer: they scrolled past the
 *    first screen and a half (past the calculator), or stayed 45 seconds.
 *    Their first clicks and typing in the calculator are never hijacked.
 * 3. At most once per 24 hours per browser (our own cap, on top of
 *    Adsterra's), so a returning visitor is not hit on every visit.
 *
 * How it is judged: 7 and 14 days after deploy run, from calc-boiler,
 *   node scripts/adsterra-report.mjs --days 7 --compare
 * Keep it only if it adds at least $2/day AND GA4 pages per session and
 * next_step_click do not fall. Remove it from app/layout.tsx to turn it off.
 *
 * Chrome's Abusive Experience Report is the tail risk for all ad revenue:
 * check it in Search Console monthly.
 */

const SRC = "https://abscloud.org/1/cad98f60a3609ac8506df1819e4aae26";

const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";
const SCROLL_SCREENS = 1.5;
const FALLBACK_MS = 45_000;
const CAP_MS = 24 * 60 * 60 * 1000;
const CAP_KEY = "pca_pu_loaded_at";

function cappedRecently(): boolean {
  try {
    const last = Number(window.localStorage.getItem(CAP_KEY) ?? 0);
    return Number.isFinite(last) && Date.now() - last < CAP_MS;
  } catch {
    // Storage blocked (private mode, strict settings): Adsterra's own
    // frequency cap still applies, so we allow one load per page view.
    return false;
  }
}

function markLoaded() {
  try {
    window.localStorage.setItem(CAP_KEY, String(Date.now()));
  } catch {
    /* see cappedRecently */
  }
}

export default function DeferredPopunder() {
  useEffect(() => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    if (cappedRecently()) return;

    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      teardown();
      markLoaded();

      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      // Cloudflare Rocket Loader rewrites Adsterra tags unless they opt out.
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    };

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * SCROLL_SCREENS) load();
    };

    const timer = window.setTimeout(load, FALLBACK_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    function teardown() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }

    return teardown;
  }, []);

  return null;
}
