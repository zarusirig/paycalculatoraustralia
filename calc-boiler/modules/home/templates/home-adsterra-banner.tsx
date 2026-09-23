"use client";

// AdsterraBanner, re-exported through a client module of the homepage's own,
// for the rectangle the homepage renders after its content
// (components/common/page-end.tsx). Same reason as ./home-link.tsx: if the root
// page referenced AdsterraBanner directly, the 404 page would resolve the
// banner's chunk list from the root page entry and download the homepage
// calculator chunk. Behaviour is identical: it is the same component.
import AdsterraBanner from "@/components/common/adsterra-banner";

export default AdsterraBanner;
