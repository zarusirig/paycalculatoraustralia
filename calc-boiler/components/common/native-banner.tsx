"use client";

import { useEffect, useRef } from "react";

/**
 * Adsterra NativeBanner_1 (placement 29439535). Added 26 Sep 2026.
 *
 * A row of ad cards that look like content recommendations. It is the least
 * intrusive unit we have: no pop-ups, no overlay, and it sits in the page
 * flow. Placement rule: AFTER our own "What to check next" links, never above
 * the calculator answer, so our internal links always get the first look.
 *
 * ONE PER PAGE. Adsterra mounts the widget into the element with this exact
 * id, and the script is the same for every page, so rendering this twice on
 * one page would create a duplicate id and only one would fill.
 *
 * Widget settings live in the Adsterra dashboard (26 Sep 2026: layout 4:1,
 * font size and colour inherit). Change them there, not here.
 */

const KEY = "47058907200cd6e5d6ce74dff6f50408";
const SRC = `https://dischargeconceiteffort.com/${KEY}/invoke.js`;
const CONTAINER_ID = `container-${KEY}`;

export default function NativeBanner({ className = "" }: { className?: string }) {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;

    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    // Cloudflare Rocket Loader rewrites Adsterra tags unless they opt out.
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, []);

  return (
    <aside aria-label="Advertisement" className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <p className="mb-1 text-center text-[0.625rem] uppercase tracking-[0.08em] text-[#94a3b8]">Advertisement</p>
      <div id={CONTAINER_ID} />
    </aside>
  );
}
