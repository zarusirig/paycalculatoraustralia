import { ShieldCheck, Clock, FileCheck, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface TrustBarProps {
  className?: string;
  variant?: "light" | "dark";
}

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
      className={`inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-4 py-2.5 text-sm ${colors} ${className}`}
      role="status"
      aria-label="Trust signals"
    >
      {signals.map((signal, i) => (
        <span key={signal.text} className="flex items-center gap-1.5">
          {i > 0 && <span className={`mr-1 ${dotColor}`} aria-hidden="true">&middot;</span>}
          <signal.icon className={`h-3.5 w-3.5 ${iconColor}`} aria-hidden="true" />
          <span className="font-medium text-[0.8125rem]">{signal.text}</span>
        </span>
      ))}
    </div>
  );
}
