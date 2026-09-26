"use client";

// NativeBanner, re-exported through a client module of the homepage's own.
// Same reason as ./home-link.tsx and ./home-adsterra-banner.tsx: a client
// component referenced directly by the root page makes other static routes
// resolve its chunk list from the root entry and download the homepage
// calculator chunk. Behaviour is identical: it is the same component.
import NativeBanner from "@/components/common/native-banner";

export default NativeBanner;
