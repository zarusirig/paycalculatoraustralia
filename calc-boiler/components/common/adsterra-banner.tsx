"use client";

import { useEffect, useRef } from "react";

/**
 * Adsterra banner ad unit.
 *
 * Each Adsterra banner relies on a GLOBAL `atOptions` variable that its
 * `invoke.js` reads synchronously at load time. Rendering more than one unit on
 * a page therefore requires isolating each one in its own document scope —
 * otherwise the units clobber each other's `atOptions`. We do that by rendering
 * every banner inside a sandboxed iframe via `srcDoc`.
 *
 * Sizes/keys map to the units provisioned in the Adsterra dashboard.
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
  // 160x600 wide skyscraper
  skyscraper: { key: "f64f3ae47c2d39e35a680024ba01e11b", width: 160, height: 600 },
  // 160x600 vertical sidebar (sticky)
  sidebar: { key: "9bb1158f01cfa66d4c444734a7ce0f13", width: 160, height: 600 },
  // 728x90 leaderboard
  leaderboard: { key: "96593e6130e3235baa70eb08ddca5c1e", width: 728, height: 90 },
  // 320x50 mobile banner
  mobile: { key: "e4972d6b96c85f80e3174f01af37db0e", width: 320, height: 50 },
} satisfies Record<string, AdsterraSize>;

export type AdsterraSlot = keyof typeof ADSTERRA_BANNERS;

type AdsterraBannerProps = {
  slot: AdsterraSlot;
  className?: string;
  /** Optional label shown above the ad for ad-disclosure compliance. */
  label?: string;
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

export default function AdsterraBanner({ slot, className, label = "Advertisement" }: AdsterraBannerProps) {
  const size = ADSTERRA_BANNERS[slot];
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Write the document after mount so SSR markup stays clean and the ad
    // script only runs in the browser.
    if (iframeRef.current) {
      iframeRef.current.srcdoc = buildSrcDoc(size);
    }
  }, [size]);

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1.5rem auto" }}
    >
      <span
        style={{
          fontSize: "0.625rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#94a3b8",
          marginBottom: "0.25rem",
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
        style={{
          width: size.width,
          height: size.height,
          maxWidth: "100%",
          border: "none",
          overflow: "hidden",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
