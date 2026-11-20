"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Recalculate every scroll scene once web fonts and images have settled the layout. */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // Anchor links: jump past pinned scenes reliably.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target && id !== "top") return;
      e.preventDefault();
      const st = target ? ScrollTrigger.getAll().find((t) => t.pin === target) : null;
      const y = id === "top" || !target ? 0 : st ? st.start : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
