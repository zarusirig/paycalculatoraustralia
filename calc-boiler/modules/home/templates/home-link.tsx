"use client";

// next/link, re-exported through a client module of the homepage's own.
//
// Why: when a server component renders next/link directly, the Link module
// becomes a client-reference entry of that route. Next's static export then
// resolved Link's chunk list for ~50 other static routes (calculators, 404)
// from the root page entry, so every one of them downloaded the homepage
// calculator chunk (~35 KB). Rendering Link through this wrapper keeps the root
// page's reference on a module no other route uses, and those routes go back
// to taking Link from the layout. Behaviour is identical: it is the same Link.
import Link from "next/link";

export default Link;
