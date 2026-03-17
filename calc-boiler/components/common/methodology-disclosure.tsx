interface MethodologyDisclosureProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MethodologyDisclosure({
  title = "How this calculator works",
  children,
  className = "",
}: MethodologyDisclosureProps) {
  return (
    <details
      className={`group rounded-xl border border-sandstone-dark/20 bg-sandstone/30 ${className}`}
    >
      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-navy transition-colors hover:text-eucalyptus-dark [&::-webkit-details-marker]:hidden">
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</span>
        <span className="ml-2 text-warmgray-light transition-transform group-open:rotate-180">
          &#9660;
        </span>
      </summary>
      <div className="border-t border-sandstone-dark/15 px-5 py-4 text-sm leading-relaxed text-warmgray">
        {children}
      </div>
    </details>
  );
}
