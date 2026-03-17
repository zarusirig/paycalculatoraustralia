"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  navigationItems,
  navigationLogo,
  GUIDE_CATEGORIES,
  STATE_CATEGORIES,
  TAX_ON_SALARY_CATEGORIES,
} from "@/lib/navigation";

type CategoryItem = { label: string; href: string; description?: string };
type Category = { title: string; items: CategoryItem[] };

const MEGA_MENU_MAP: Record<string, { categories: Category[]; gridCols?: string }> = {
  "Tax on Salary": {
    categories: TAX_ON_SALARY_CATEGORIES.map((c) => ({
      title: c.title,
      items: [...c.salaries] as CategoryItem[],
    })),
  },
  Guides: {
    categories: GUIDE_CATEGORIES.map((c) => ({
      title: c.title,
      items: [...c.guides] as CategoryItem[],
    })),
  },
  "By State": {
    categories: STATE_CATEGORIES.map((c) => ({
      title: c.title,
      items: [...c.states] as CategoryItem[],
    })),
  },
};

export default function Navbar() {
  const pathname = usePathname() || "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileActiveMenu(null);
  }, []);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : href !== "#" && pathname.startsWith(href);

  const renderDesktopLink = (href: string, label: string, hasMegaMenu?: boolean) => {
    const isActive = isLinkActive(href);

    if (!hasMegaMenu) {
      return (
        <Link
          key={href + label}
          href={href}
          className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-eucalyptus-dark" : "text-navy/70 hover:text-navy"
          }`}
        >
          {label}
          <span
            className={`absolute left-1 right-1 -bottom-0.5 h-[2px] rounded-full bg-eucalyptus transition-all duration-300 ${
              isActive ? "w-[calc(100%-8px)] opacity-100" : "w-0 opacity-0"
            }`}
          />
        </Link>
      );
    }

    const isOpen = activeMenu === label;
    const megaData = MEGA_MENU_MAP[label];

    return (
      <div
        key={label}
        className="relative"
        onMouseEnter={() => setActiveMenu(label)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setActiveMenu(isOpen ? null : label);
            }
            if (e.key === "Escape") setActiveMenu(null);
          }}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`flex items-center space-x-0 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-eucalyptus-dark" : "text-navy/70 hover:text-navy"
          }`}
        >
          <span>{label}</span>
          <ChevronDown
            className={`ml-1 h-3.5 w-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && megaData && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 z-50 mt-0 w-screen max-w-5xl -translate-x-1/2"
            >
              <div className="rounded-xl border border-sandstone-dark/40 bg-white/95 shadow-xl backdrop-blur-sm ring-1 ring-black/5">
                <div className="p-8">
                  <div className="flex flex-wrap justify-normal gap-8">
                    {megaData.categories.map((category) => (
                      <div key={category.title} className="space-y-2">
                        <h4 className="border-b border-eucalyptus/20 pb-2 text-xs font-semibold uppercase tracking-widest text-eucalyptus-dark">
                          {category.title}
                        </h4>
                        <ul className={megaData.gridCols ?? "space-y-1"}>
                          {category.items.map((item, index) => (
                            <li key={index}>
                              <Link
                                href={item.href}
                                className="group block py-1.5 text-sm text-warmgray transition-all duration-200 hover:translate-x-1 hover:text-navy"
                                onClick={closeAll}
                              >
                                <div>
                                  <div className="font-medium group-hover:text-eucalyptus-dark">{item.label}</div>
                                  {item.description && (
                                    <div className="mt-0.5 text-xs text-warmgray-light">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-sandstone-dark/30 bg-white/90 shadow-md backdrop-blur-lg"
          : "border-b border-transparent bg-white/70 backdrop-blur-sm"
      }`}
      ref={dropdownRef}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={navigationLogo.href} className="group flex items-center gap-2.5">
            <Image
              src="/images/logo.svg"
              alt="Pay Calculator Australia"
              width={36}
              height={36}
              className="rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span
                className="text-base font-bold tracking-tight text-navy transition-colors group-hover:text-eucalyptus-dark"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {navigationLogo.label}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center space-x-0.5 lg:flex" aria-label="Main navigation">
            {navigationItems.map(({ href, label, hasMegaMenu }) =>
              renderDesktopLink(href, label, hasMegaMenu)
            )}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-navy transition-colors hover:bg-sandstone lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-sandstone-dark/30 bg-white lg:hidden"
          >
            <div className="max-h-[80vh] space-y-4 overflow-y-auto px-4 py-6">
              {navigationItems.map(({ href, label, hasMegaMenu }, index) => {
                const isActive = isLinkActive(href);

                if (!hasMegaMenu) {
                  return (
                    <motion.div
                      key={href + label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={href}
                        className={`block py-2 font-medium transition-colors ${
                          isActive ? "text-eucalyptus-dark" : "text-navy hover:text-eucalyptus-dark"
                        }`}
                        onClick={closeAll}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                }

                const megaData = MEGA_MENU_MAP[label];
                if (!megaData) return null;

                const isOpen = mobileActiveMenu === label;
                const totalItems = megaData.categories.reduce(
                  (acc, cat) => acc + cat.items.length,
                  0
                );

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={`flex-1 text-lg font-semibold ${
                          isActive ? "text-eucalyptus-dark" : "text-navy"
                        }`}
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {label}
                        <span className="ml-2 rounded-full bg-sandstone px-2 py-0.5 text-sm text-warmgray">
                          {totalItems}
                        </span>
                      </h3>
                      <button
                        onClick={() =>
                          setMobileActiveMenu(isOpen ? null : label)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setMobileActiveMenu(isOpen ? null : label);
                          }
                        }}
                        className="p-1"
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
                      >
                        <ChevronDown
                          className={`h-4 w-4 text-warmgray transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 pl-2"
                        >
                          {megaData.categories.map((category) => (
                            <div key={category.title} className="space-y-2">
                              <h4 className="text-xs font-semibold uppercase tracking-widest text-eucalyptus-dark">
                                {category.title}
                              </h4>
                              <ul className="space-y-1 pl-3">
                                {category.items.map((item, idx) => (
                                  <li key={idx}>
                                    <Link
                                      href={item.href}
                                      className="block py-1 text-sm text-warmgray transition-colors hover:text-eucalyptus-dark"
                                      onClick={closeAll}
                                    >
                                      <div>
                                        <div>{item.label}</div>
                                        {item.description && (
                                          <div className="mt-0.5 text-xs text-warmgray-light">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
