"use client";

import { useEffect, useState } from "react";

/**
 * A slim bar pinned under the fixed header that shows the calculator's headline
 * answer while the visitor reads the guide text below the calculator.
 *
 * Why: the answer card scrolls away after ~1 screen and pages are 10–20
 * screens long. Keeping the number on screen is what keeps people reading
 * instead of leaving with the figure. `.sticky-results` in globals.css was
 * written for this and never used.
 *
 * Usage: give the result card `id="calc-result"` (any id) and render
 *   <StickyResult targetId="calc-result" label="Take-home bonus" value={formatAUD(net)} />
 * anywhere in the same client component. The bar appears once the target has
 * scrolled ABOVE the viewport and hides again when the target is back in view
 * or when the page end is reached (so it never covers the footer links).
 */
export default function StickyResult({
  targetId,
  label,
  value,
  hint,
}: {
  targetId: string;
  label: string;
  value: string;
  /** Optional small text after the value, e.g. "per fortnight". */
  hint?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === "undefined") return;

    let above = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Visible → hide. Not visible and its bottom is above the viewport → show.
        above = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setShow(above);
      },
      { threshold: 0 },
    );
    io.observe(target);

    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
      setShow(above && !nearEnd);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [targetId]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!show}
      className={`sticky-results fixed inset-x-0 z-40 transition-[opacity,transform] duration-200 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
      style={{ top: 64 }}
    >
      <div className="mx-auto flex max-w-7xl items-baseline justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <span className="truncate text-xs font-semibold uppercase tracking-wider text-warmgray">{label}</span>
        <span className="shrink-0 text-base font-extrabold text-navy sm:text-lg">
          {value}
          {hint ? <span className="ml-1 text-xs font-medium text-warmgray">{hint}</span> : null}
        </span>
        <button
          type="button"
          onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="sn-ring shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-eucalyptus-dark hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
