import { ShieldCheck, Clock, FileCheck, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface TrustBarProps {
  className?: string;
  variant?: "light" | "dark";
}

/**
 * On phones the four signals used to wrap onto four lines (~130px of the first
 * screen on every calculator page, measured 26 Sep 2026). They now sit on one
 * horizontally scrollable line under `sm`, and wrap as before from `sm` up.
 */
export default function TrustBar({ className = "", variant = "light" }: TrustBarProps) {
  const signals = [
    { icon: ShieldCheck, text: "Official ATO rates" },
    { icon: Clock, text: `Updated FY${SITE_CONFIG.financialYear}` },
    { icon: Sparkles, text: "Free forever" },
    { icon: FileCheck, text: "No signup required" },
  ];

  const colors = variant === "dark"
    ? "bg-white/8 text-white/90 border border-white/10"
    : "bg-sandstone border border-sandstone-dark/30 text-navy";

  const iconColor = variant === "dark" ? "text-eucalyptus" : "text-eucalyptus-dark";
  const dotColor = variant === "dark" ? "text-white/25" : "text-sandstone-dark/40";

  return (
    <div
      className={`flex max-w-full items-center gap-x-3 gap-y-2 overflow-x-auto whitespace-nowrap rounded-xl px-4 py-2 text-sm [scrollbar-width:none] sm:inline-flex sm:flex-wrap sm:whitespace-normal sm:py-2.5 [&::-webkit-scrollbar]:hidden ${colors} ${className}`}
      role="status"
      aria-label="Trust signals"
    >
      {signals.map((signal, i) => (
        <span key={signal.text} className="flex shrink-0 items-center gap-1.5">
          {i > 0 && <span className={`mr-1 ${dotColor}`} aria-hidden="true">&middot;</span>}
          <signal.icon className={`h-3.5 w-3.5 ${iconColor}`} aria-hidden="true" />
          <span className="font-medium text-[0.8125rem]">{signal.text}</span>
        </span>
      ))}
    </div>
  );
}
