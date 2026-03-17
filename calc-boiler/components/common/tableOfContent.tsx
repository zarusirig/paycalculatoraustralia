"use client";

import { useState, useEffect } from "react";
import { ChevronDown, List } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    headings.forEach((heading) => {
      if (heading) observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        if (heading) observer.unobserve(heading);
      });
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = window.innerWidth < 1024 ? 150 : 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 250);
  };

  const tocContent = (
    <nav aria-label="Table of contents">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                flex items-center gap-2 group
                ${activeId === item.id
                  ? "bg-eucalyptus-light/30 text-eucalyptus-dark font-medium"
                  : "text-warmgray hover:bg-sandstone/50 hover:text-navy"
                }
              `}
            >
              <List
                className={`w-4 h-4 flex-shrink-0 ${activeId === item.id ? "text-eucalyptus" : "text-warmgray-light"}`}
              />
              <span className="line-clamp-2">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Version - Sticky Collapsible */}
      <div className="lg:hidden sticky top-20 z-40 ">
        <Card className="rounded-t-none rounded-b-xl shadow-md py-0 gap-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-sandstone/50 transition-colors"
            aria-expanded={isOpen}
          >
            <h2 className="text-base font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>In this article</h2>
            <ChevronDown
              className={`w-5 h-5 text-warmgray-light transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`transition-all duration-200 ease-in-out ${isOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
              } overflow-auto`}
          >
            <div className="px-4 pb-4 border-t border-sandstone-dark/10">
              {tocContent}
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop Version - Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>In this article</h2>
          {tocContent}
        </Card>
      </div>
    </>
  );
}
