"use client";

// F8 (Lever D): a labelled, read-only snippet with a copy button. Used by the
// pay report's "cite this page" box and the /embed/ instructions page. The
// text is server-rendered in a <pre>, so it is readable and selectable
// without JavaScript; the button only adds one-click copy.

import { useState } from "react";

export default function CopySnippet({ label, text, id }: { label: string; text: string; id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions, insecure context): the text stays selectable.
      setCopied(false);
    }
  }

  return (
    <div className="not-prose my-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span id={`${id}-label`} className="text-sm font-semibold text-navy">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-eucalyptus/40 bg-white px-3 py-1 text-xs font-semibold text-eucalyptus-dark transition-colors hover:bg-eucalyptus-light"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        id={id}
        tabIndex={0}
        aria-labelledby={`${id}-label`}
        className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-3 font-mono text-xs leading-relaxed text-navy"
      >
        {text}
      </pre>
    </div>
  );
}
