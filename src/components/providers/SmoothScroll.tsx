"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION_PROGRESS, syncScrollExperienceDepth } from "@/lib/scroll-nav";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTrigger() {
  const lenis = useLenis();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const hash = window.location.hash;
    const sectionHash =
      hash && hash !== "#hero" && hash in SECTION_PROGRESS ? hash : null;

    if (!sectionHash) {
      const cleanUrl = window.location.pathname + window.location.search;
      if (hash) {
        window.history.replaceState(null, "", cleanUrl);
      }
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        syncScrollExperienceDepth();
      });
    }

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Default lerp; reduced-motion users get instant follow after mount.
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
      }}
    >
      <LenisScrollTrigger />
      {children}
    </ReactLenis>
  );
}
