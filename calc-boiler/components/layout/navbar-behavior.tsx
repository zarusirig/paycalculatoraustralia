"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Behaviour for the server-rendered header in navbar.tsx. Renders nothing; it
 * wires listeners onto the existing markup so the links never depend on
 * JavaScript to exist. Without JS the menus stay closed but every link is
 * still in the HTML (and /site-directory/ is one click from the footer).
 *
 * Disclosure pattern (not ARIA `menu`): buttons carry aria-expanded and
 * aria-controls, panels are toggled with the `hidden` attribute.
 * Keyboard: Enter/Space toggle; ArrowDown on a trigger opens and focuses the
 * first link; ArrowUp/ArrowDown/Home/End move within an open panel;
 * ArrowLeft/ArrowRight move between top-level triggers on desktop; Escape
 * closes and returns focus to the trigger; tabbing out closes on desktop.
 */

const DESKTOP = "(min-width: 1024px)";
const HOVER = "(hover: hover) and (pointer: fine)";

function visibleLinks(panel: Element): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>("a[href], button"),
  ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
}

export default function NavbarBehavior() {
  const raw = usePathname() || "/";
  // Menu hrefs all end in "/" (trailingSlash export); usePathname may not.
  const pathname = raw.endsWith("/") ? raw : `${raw}/`;

  // Wire listeners once.
  useEffect(() => {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    if (!header || !toggle) return;

    // One controller removes every listener below (StrictMode runs effects twice in dev).
    const controller = new AbortController();
    const { signal } = controller;
    const isDesktop = () => window.matchMedia(DESKTOP).matches;
    const items = Array.from(
      header.querySelectorAll<HTMLLIElement>("[data-menu-item]"),
    );
    const buttonOf = (li: Element) =>
      li.querySelector<HTMLButtonElement>("[data-menu-button]")!;
    const panelOf = (li: Element) =>
      li.querySelector<HTMLElement>("[data-menu-panel]")!;

    const setOpen = (li: Element, open: boolean) => {
      buttonOf(li).setAttribute("aria-expanded", String(open));
      panelOf(li).hidden = !open;
    };
    const closeAll = (except?: Element) =>
      items.forEach((li) => li !== except && setOpen(li, false));
    const isOpen = (li: Element) =>
      buttonOf(li).getAttribute("aria-expanded") === "true";

    const setMobile = (open: boolean) => {
      header.dataset.mobileOpen = String(open);
      toggle.setAttribute("aria-expanded", String(open));
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (!open) closeAll();
    };

    const onScroll = () => {
      header.dataset.scrolled = String(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, signal });

    toggle.addEventListener(
      "click",
      () => setMobile(header.dataset.mobileOpen !== "true"),
      { signal },
    );

    const timers = new WeakMap<Element, number>();
    const hoverOpenedAt = new WeakMap<Element, number>();
    const cleanups: (() => void)[] = [];

    items.forEach((li, index) => {
      const btn = buttonOf(li);
      const panel = panelOf(li);

      btn.addEventListener(
        "click",
        () => {
          // A click that lands just after hover opened the panel should not
          // immediately close it again.
          if (Date.now() - (hoverOpenedAt.get(li) ?? 0) < 500) return;
          const next = !isOpen(li);
          closeAll(li);
          setOpen(li, next);
        },
        { signal },
      );

      btn.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            closeAll(li);
            setOpen(li, true);
            visibleLinks(panel)[0]?.focus();
          } else if (
            isDesktop() &&
            (e.key === "ArrowRight" || e.key === "ArrowLeft")
          ) {
            e.preventDefault();
            const next =
              items[
                (index + (e.key === "ArrowRight" ? 1 : items.length - 1)) %
                  items.length
              ];
            const wasOpen = isOpen(li);
            closeAll();
            if (wasOpen) setOpen(next, true);
            buttonOf(next).focus();
          }
        },
        { signal },
      );

      panel.addEventListener(
        "keydown",
        (e) => {
          const links = visibleLinks(panel);
          const at = links.indexOf(document.activeElement as HTMLElement);
          let target: HTMLElement | undefined;
          if (e.key === "ArrowDown")
            target = links[Math.min(at + 1, links.length - 1)];
          else if (e.key === "ArrowUp") target = at <= 0 ? btn : links[at - 1];
          else if (e.key === "Home") target = links[0];
          else if (e.key === "End") target = links[links.length - 1];
          if (target) {
            e.preventDefault();
            target.focus();
          }
        },
        { signal },
      );

      // Desktop: close when focus leaves the item entirely.
      li.addEventListener(
        "focusout",
        (e) => {
          if (!isDesktop()) return;
          const to = e.relatedTarget as Node | null;
          if (to && !li.contains(to)) setOpen(li, false);
        },
        { signal },
      );

      // Desktop hover with a short intent delay, fine pointers only.
      const enter = () => {
        if (!isDesktop() || !window.matchMedia(HOVER).matches) return;
        window.clearTimeout(timers.get(li));
        timers.set(
          li,
          window.setTimeout(() => {
            if (!isOpen(li)) hoverOpenedAt.set(li, Date.now());
            closeAll(li);
            setOpen(li, true);
          }, 90),
        );
      };
      const leave = () => {
        if (!isDesktop() || !window.matchMedia(HOVER).matches) return;
        window.clearTimeout(timers.get(li));
        timers.set(
          li,
          window.setTimeout(() => setOpen(li, false), 180),
        );
      };
      li.addEventListener("mouseenter", enter, { signal });
      li.addEventListener("mouseleave", leave, { signal });
      cleanups.push(() => window.clearTimeout(timers.get(li)));
    });

    // Mobile nested group accordions.
    header
      .querySelectorAll<HTMLButtonElement>("[data-group-button]")
      .forEach((b) => {
        b.addEventListener(
          "click",
          () => {
            const list = document.getElementById(
              b.getAttribute("aria-controls") || "",
            );
            const open = b.getAttribute("aria-expanded") !== "true";
            b.setAttribute("aria-expanded", String(open));
            if (list) list.dataset.open = String(open);
          },
          { signal },
        );
      });

    const onDocClick = (e: MouseEvent) => {
      if (!header.contains(e.target as Node)) closeAll();
      else if ((e.target as Element).closest("a[href]")) setMobile(false);
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const openItem = items.find(isOpen);
      if (openItem) {
        setOpen(openItem, false);
        buttonOf(openItem).focus();
      } else if (header.dataset.mobileOpen === "true") {
        setMobile(false);
        toggle.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP);
    const onBreakpoint = () => setMobile(false);

    document.addEventListener("click", onDocClick, { signal });
    document.addEventListener("keydown", onDocKey, { signal });
    mq.addEventListener("change", onBreakpoint, { signal });

    return () => {
      controller.abort();
      cleanups.forEach((c) => c());
    };
  }, []);

  // On every route change: close everything and mark the current page.
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    header.dataset.mobileOpen = "false";
    document
      .getElementById("nav-toggle")
      ?.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    header.querySelectorAll("[data-menu-item]").forEach((li) => {
      li.querySelector("[data-menu-button]")?.setAttribute(
        "aria-expanded",
        "false",
      );
      const panel = li.querySelector<HTMLElement>("[data-menu-panel]");
      if (panel) panel.hidden = true;
      const hit = Array.from(li.querySelectorAll("a[href]")).some(
        (a) => a.getAttribute("href") === pathname,
      );
      (li as HTMLElement).dataset.active = String(hit && pathname !== "/");
    });
    header.querySelectorAll("a[data-nav-link]").forEach((a) => {
      if (a.getAttribute("href") === pathname)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }, [pathname]);

  return null;
}
