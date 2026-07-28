"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GA4 engagement instrumentation.
 *
 * The site previously sent `page_view` and nothing else. GA4 counts a session
 * as engaged if it lasts over 10 seconds, converts, or reaches 2+ pageviews —
 * so a visitor who landed, calculated their take-home pay in eight seconds, got
 * the answer they came for and left was recorded as a bounce.
 *
 * That means part of the reported bounce rate is successful task completion
 * that was never measured. These events separate the two, so the ad and layout
 * work can be judged against real numbers rather than a proxy that punishes the
 * site for answering quickly.
 */

type GtagArgs = [string, string, Record<string, unknown>?];

function track(event: string, params: Record<string, unknown> = {}) {
  const gtag = (window as unknown as { gtag?: (...args: GtagArgs) => void }).gtag;
  gtag?.("event", event, params);
}

export default function EngagementTracking() {
  const pathname = usePathname();

  useEffect(() => {
    let calculatorUsed = false;
    const depthsSeen = new Set<number>();

    // --- Calculator interaction: the core "got value" signal ---
    const onInput = (event: Event) => {
      if (calculatorUsed) return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest("input, select, textarea")) return;

      calculatorUsed = true;
      track("calculator_used", { page_path: pathname });
    };

    // --- Next-step clicks: what actually drives pages per session ---
    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLElement>('[data-engagement="next-step"]');
      if (!link) return;

      track("next_step_click", {
        page_path: pathname,
        destination: link.dataset.nextStepHref ?? "",
      });
    };

    // --- Scroll depth: distinguishes a skim from a read ---
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const milestone of [25, 50, 75, 90]) {
        if (percent >= milestone && !depthsSeen.has(milestone)) {
          depthsSeen.add(milestone);
          track("scroll_depth", { page_path: pathname, percent: milestone });
        }
      }
    };

    // --- Engaged time: 30s on page, independent of scrolling ---
    const engagedTimer = window.setTimeout(() => {
      track("engaged_session", { page_path: pathname });
    }, 30_000);

    document.addEventListener("input", onInput, { passive: true });
    document.addEventListener("change", onInput, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(engagedTimer);
      document.removeEventListener("input", onInput);
      document.removeEventListener("change", onInput);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
