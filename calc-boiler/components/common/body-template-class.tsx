"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PAGE_TEMPLATES, templateFor } from "@/lib/page-template";

/**
 * Keeps the Mediavine template class on <body> correct across client-side
 * navigations. The first page load is handled by the inline script in
 * app/layout.tsx (see lib/page-template.ts); after that the root layout's
 * <body> persists while the page below it changes, so the class is swapped
 * here on every pathname change. Idempotent on the first run.
 */
export default function BodyTemplateClass() {
  const pathname = usePathname();

  useEffect(() => {
    const classes = document.body.classList;
    classes.remove(...PAGE_TEMPLATES);
    classes.add(templateFor(pathname ?? "/"));
  }, [pathname]);

  return null;
}
