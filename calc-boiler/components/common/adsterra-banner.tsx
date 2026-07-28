"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adsterra banner ad unit.
 *
 * Each Adsterra banner relies on a GLOBAL `atOptions` variable that its
 * `invoke.js` reads synchronously at load time. Rendering more than one unit on
 * a page therefore requires isolating each one in its own document scope —
 * otherwise the units clobber each other's `atOptions`. We do that by rendering
 * every banner inside a sandboxed iframe via `srcDoc`.
 *
 * Two rules this component enforces:
 *
 * 1. ONE KEY PER PAGE. Adsterra serves a single placement per key per pageview.
 *    Rendering the same key twice means the duplicate no-fills or collapses in
 *    reporting, so every position on a page must use a distinct key.
 *
 * 2. NO INVISIBLE REQUESTS. A `hidden`/`block` Tailwind pair still mounts BOTH
 *    branches — the CSS-hidden iframe loads and fires a real ad request that no
 *    human can ever see. Those unviewable impressions are what invalid-traffic
 *    review looks for. We keep the CSS wrappers (they reserve layout space and
 *    so avoid CLS) but only inject `srcDoc` into the branch that actually
 *    rendered, measured at mount.
 */

type AdsterraSize = {
  key: string;
  width: number;
  height: number;
};

// Provisioned ad units, keyed by a friendly slot name.
export const ADSTERRA_BANNERS = {
  // 300x250 medium rectangle
  rectangle: { key: "584e01bc77cf4247805a893681c51494", width: 300, height: 250 },
  // 468x60 banner
  banner: { key: "3b8513e72e09c5bf3657de628894a5ca", width: 468, height: 60 },
  // 160x300 vertical — INFERRED, verify in the dashboard before trusting it.
  //
  // The account has one 160x300_1 (id 29439540) and one 160x600_1 (id 29439541)
  // placement, but this file previously declared BOTH vertical keys as 160x600,
  // so one of them was wrong. The evidence points at this one:
  //   - `sidebar` was the only rail key ever rendered (it was used twice), and
  //     160x600_1 DOES appear in stats — requested, 0 fill.
  //   - `skyscraper` was never rendered, and 160x300_1 does not appear in stats
  //     at all, i.e. nothing ever requested it.
  // Requesting a 160x300 unit at height 600 guarantees a no-fill, so if this is
  // still at zero impressions after a fortnight, the rails are dead weight and
  // should be deleted outright rather than resized again.
  skyscraper: { key: "f64f3ae47c2d39e35a680024ba01e11b", width: 160, height: 300 },
  // 160x600 vertical sidebar (sticky). Zero fill across 90 days despite running
  // on every >=1280px pageview — the size has little demand for AU traffic.
  sidebar: { key: "9bb1158f01cfa66d4c444734a7ce0f13", width: 160, height: 600 },
  // 728x90 leaderboard
  leaderboard: { key: "96593e6130e3235baa70eb08ddca5c1e", width: 728, height: 90 },
  // 320x50 mobile banner
  mobile: { key: "e4972d6b96c85f80e3174f01af37db0e", width: 320, height: 50 },
} satisfies Record<string, AdsterraSize>;

export type AdsterraSlot = keyof typeof ADSTERRA_BANNERS;

/**
 * Adsterra's creatives currently need same-origin to fill reliably. A `srcDoc`
 * iframe inherits the PARENT's origin, so `allow-same-origin` + `allow-scripts`
 * lets the ad script reach this document, its cookies and its localStorage.
 *
 * That is a real trade and it is deliberate: dropping the flag may drop fill to
 * zero, which is a revenue outage. Flip this to `false` and watch fill rate in
 * the Adsterra dashboard for 24h before committing to it.
 */
const ALLOW_SAME_ORIGIN = true;

/**
 * How long to wait for a fill before collapsing the empty box. Generous on
 * purpose — a slow fill that gets collapsed is lost revenue.
 */
const NO_FILL_TIMEOUT_MS = 8000;

type AdsterraBannerProps = {
  slot: AdsterraSlot;
  className?: string;
  /** Optional label shown above the ad for ad-disclosure compliance. */
  label?: string;
  /**
   * Tighter vertical spacing. Used above the fold on mobile, where the default
   * 1.5rem margins cost more screen than the unit itself is tall.
   */
  compact?: boolean;
};

function buildSrcDoc({ key, width, height }: AdsterraSize): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key' : '${key}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body>
</html>`;
}

/**
 * `display:none` elements report zero client rects. This is more reliable than
 * `offsetParent`, which is also null for `position:fixed` elements — and the
 * sidebar rails live inside a fixed ancestor.
 */
function isRendered(el: HTMLElement | null): boolean {
  return !!el && el.getClientRects().length > 0;
}

/**
 * Has this unit actually filled? `true` yes, `false` no, `null` can't tell yet.
 *
 * Adsterra's `invoke.js` builds its own `<iframe src="about:blank">` inside our
 * frame and then writes the creative into it. Both the filled and the unfilled
 * state leave the OUTER body with the same four children (two inline scripts,
 * the inner frame, and the invoke.js tag), so counting children there tells you
 * nothing — the only real signal is whether the INNER frame has content.
 *
 * Anything ambiguous returns `null`, and callers must not collapse on `null`.
 * Hiding a unit that would have filled is lost revenue, which is worse than
 * briefly showing an empty box.
 */
function inspectFill(outer: HTMLIFrameElement): boolean | null {
  let doc: Document | null;
  try {
    doc = outer.contentDocument;
  } catch {
    // Outer frame went opaque — a creative navigated it. That is a fill.
    return true;
  }

  if (!doc?.body) return null; // Not loaded yet.

  const inner = doc.body.querySelector("iframe");
  if (!inner) return null; // invoke.js hasn't built its frame yet.

  try {
    const innerDoc = inner.contentDocument;
    if (!innerDoc) return true; // Cross-origin creative.
    return innerDoc.body ? innerDoc.body.childElementCount > 0 : null;
  } catch {
    return true; // Cross-origin creative.
  }
}

export default function AdsterraBanner({
  slot,
  className,
  label = "Advertisement",
  compact = false,
}: AdsterraBannerProps) {
  const size = ADSTERRA_BANNERS[slot];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // `pending` until we know whether this branch rendered; drives the no-fill collapse.
  const [state, setState] = useState<"pending" | "loading" | "skipped" | "empty">("pending");

  useEffect(() => {
    // Only the visible branch of a responsive pair may request an ad.
    if (!isRendered(wrapperRef.current)) {
      setState("skipped");
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.srcdoc = buildSrcDoc(size);
    setState("loading");

    /**
     * Adsterra exposes no fill callback, so poll until we get a definite answer
     * or the timeout expires. Collapsing only happens on a CONFIRMED empty
     * reading — never on an ambiguous one.
     */
    let elapsed = 0;
    let confirmedEmpty = false;
    const STEP_MS = 1000;

    const poll = window.setInterval(() => {
      elapsed += STEP_MS;

      const filled = inspectFill(iframe);

      if (filled === true) {
        window.clearInterval(poll);
        return;
      }

      // `null` means "can't tell yet" — the frame or invoke.js hasn't finished.
      // Keep polling rather than giving up or collapsing blind.
      confirmedEmpty = filled === false;

      if (elapsed >= NO_FILL_TIMEOUT_MS) {
        window.clearInterval(poll);
        if (confirmedEmpty) setState("empty");
      }
    }, STEP_MS);

    return () => window.clearInterval(poll);
  }, [size]);

  const collapsed = state === "skipped" || state === "empty";

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: collapsed ? 0 : compact ? "0.5rem auto" : "1.5rem auto",
      }}
    >
      <span
        style={{
          fontSize: "0.625rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#94a3b8",
          marginBottom: "0.25rem",
          // Don't label a box that has nothing in it.
          display: collapsed ? "none" : "block",
        }}
      >
        {label}
      </span>
      <iframe
        ref={iframeRef}
        title="advertisement"
        width={size.width}
        height={size.height}
        scrolling="no"
        // Rails are aria-hidden; without this, keyboard users can still tab
        // into content that has been hidden from assistive tech.
        tabIndex={-1}
        style={{
          width: size.width,
          height: collapsed ? 0 : size.height,
          maxWidth: "100%",
          border: "none",
          overflow: "hidden",
          display: collapsed ? "none" : "block",
        }}
        sandbox={
          ALLOW_SAME_ORIGIN
            ? "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            : "allow-scripts allow-popups allow-popups-to-escape-sandbox"
        }
      />
    </div>
  );
}
