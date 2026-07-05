"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/app/providers/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";

// Sanity Studio (mounted at /studio) needs plain, native browser scrolling
// and a normal cursor — its own scrollable panels, drag handles, and
// inputs all assume that. Wrapping it in Lenis's transform-driven scroll
// loop and the custom cursor/hidden-scrollbar treatment (both meant for
// the public portfolio) is what broke scrolling inside Studio. This checks
// the route and skips all three under /studio; the public site keeps the
// exact same experience as before.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
    console.log("AppShell pathname:", pathname); // temporary debug
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <SmoothScroll>
        <Preloader />
        <Cursor />
        {children}
      </SmoothScroll>
    </div>
  );
}