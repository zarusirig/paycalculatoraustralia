import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface SidebarLink {
  href: string;
  label: string;
}

interface TaxTablesSidebarProps {
  links: SidebarLink[];
  ctaHref?: string;
  ctaTitle?: string;
  ctaText?: string;
  ctaButton?: string;
}

export default function TaxTablesSidebar({
  links,
  ctaHref = "/take-home-pay-calculator/",
  ctaTitle = "Need an exact figure?",
  ctaText = "Enter your exact salary to see your PAYG withheld right down to the cent.",
  ctaButton = "Go to Calculator",
}: TaxTablesSidebarProps) {
  return (
    <aside className="lg:w-1/3">
      <div className="sticky top-8 space-y-6">
        <Card className="bg-sandstone border-sandstone-dark/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-navy mb-3 block">Related Tax Tables &amp; Calculators</h3>
            <div className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">{ctaTitle}</h3>
            <p className="text-eucalyptus-light text-sm mb-4">{ctaText}</p>
            <Link
              href={ctaHref}
              className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors"
            >
              {ctaButton}
            </Link>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
