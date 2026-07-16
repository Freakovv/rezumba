"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import type { CaseMeta } from "@/lib/cases";
import { Hero } from "@/components/sections/Hero";
import { Stack } from "@/components/sections/Stack";
import { Cases } from "@/components/sections/Cases";
import { Contact } from "@/components/sections/Contact";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  applyDepthAtProgress,
  enforcePanelsForProgress,
  hidePanel,
  isNavigating,
  getSectionHashOnLoad,
  registerScrollExperience,
  restoreSectionFromHash,
  syncScrollExperienceDepth,
} from "@/lib/scroll-nav";

gsap.registerPlugin(ScrollTrigger);

type HomeScrollExperienceProps = {
  casesByLocale: {
    en: CaseMeta[];
    ru: CaseMeta[];
  };
};

export function HomeScrollExperience({ casesByLocale }: HomeScrollExperienceProps) {
  const { locale } = useLocale();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const cases = casesByLocale[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const casesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useGSAP(
    () => {
      const panels = [stackRef.current, casesRef.current, contactRef.current].filter(
        Boolean,
      ) as HTMLElement[];

      panels.forEach(hidePanel);
      gsap.set(overlayRef.current, { autoAlpha: 1, pointerEvents: "none" });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 639px)",
          isDesktop: "(min-width: 640px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean;
            reduceMotion: boolean;
          };
          // Live CSS filter:blur on full-viewport images is the main GPU cost.
          // Keep it mild; grain no longer sits inside the filtered layer.
          const maxBlur = reduceMotion ? 0 : isMobile ? 4 : 6;
          const textBlur = 0;
          const endScale = isMobile ? 0.82 : 0.78;

          const depthRefs = {
            visual: visualRef.current,
            figure: figureRef.current,
            foreground: foregroundRef.current,
          };
          const panelRefs = {
            stack: stackRef.current,
            cases: casesRef.current,
            contact: contactRef.current,
          };

          // Depth (scale / opacity / blur) is driven only from onUpdate via
          // applyDepthAtProgress — animating the same filters on the timeline
          // as well doubled GPU work every scroll frame.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (isNavigating()) return;
                applyDepthAtProgress(self.progress, depthRefs, {
                  maxBlur,
                  textBlur,
                  endScale,
                });
                enforcePanelsForProgress(self.progress, panelRefs);
              },
              onRefresh: (self) => {
                if (isNavigating()) return;
                applyDepthAtProgress(self.progress, depthRefs, {
                  maxBlur,
                  textBlur,
                  endScale,
                });
                enforcePanelsForProgress(self.progress, panelRefs);
              },
            },
          });

          applyDepthAtProgress(0, depthRefs, { maxBlur, textBlur, endScale });

          tl.set(
            [stackRef.current, casesRef.current, contactRef.current].filter(Boolean),
            {
              autoAlpha: 0,
              y: 80,
              scale: 0.96,
              zIndex: 1,
              visibility: "hidden",
              pointerEvents: "none",
            },
            0,
          )
            // Spacer so panel cues keep the same progress positions while
            // depth is handled outside the timeline.
            .to({}, { duration: 0.12 }, 0)
            .set(
              stackRef.current,
              { visibility: "visible", zIndex: 3, pointerEvents: "auto" },
              0.12,
            )
            .to(
              stackRef.current,
              { y: 0, autoAlpha: 1, scale: 1, ease: "none", duration: 0.06 },
              0.12,
            )
            .to(
              stackRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.12 },
              0.18,
            )
            .to(
              stackRef.current,
              { y: -36, autoAlpha: 0, scale: 0.98, ease: "none", duration: 0.06 },
              0.32,
            )
            .set(
              stackRef.current,
              {
                visibility: "hidden",
                zIndex: 1,
                pointerEvents: "none",
                y: 80,
                scale: 0.96,
              },
              0.36,
            )
            .set(
              casesRef.current,
              { visibility: "visible", zIndex: 3, pointerEvents: "auto" },
              0.38,
            )
            .to(
              casesRef.current,
              { y: 0, autoAlpha: 1, scale: 1, ease: "none", duration: 0.06 },
              0.38,
            )
            .to(
              casesRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.2 },
              0.44,
            )
            .to(
              casesRef.current,
              { y: -36, autoAlpha: 0, scale: 0.98, ease: "none", duration: 0.06 },
              0.68,
            )
            .set(
              casesRef.current,
              {
                visibility: "hidden",
                zIndex: 1,
                pointerEvents: "none",
                y: 80,
                scale: 0.96,
              },
              0.74,
            )
            .set(
              contactRef.current,
              { visibility: "visible", zIndex: 3, pointerEvents: "auto" },
              0.76,
            )
            .to(
              contactRef.current,
              { y: 0, autoAlpha: 1, scale: 1, ease: "none", duration: 0.06 },
              0.76,
            )
            .to(
              contactRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.06 },
              0.82,
            );

          return registerScrollExperience({
            scrollTrigger: tl.scrollTrigger!,
            timeline: tl,
            depth: depthRefs,
            depthTuning: { maxBlur, textBlur, endScale },
            panels: panelRefs,
          });
        },
      );

      let lastWidth = window.innerWidth;
      let resizeTimer: ReturnType<typeof setTimeout> | undefined;

      const refresh = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const width = window.innerWidth;
          if (width !== lastWidth) {
            lastWidth = width;
            ScrollTrigger.refresh();
            return;
          }
          ScrollTrigger.update();
        }, 180);
      };

      window.addEventListener("resize", refresh);
      window.visualViewport?.addEventListener("resize", refresh);

      const applyHashOrSync = (attempts = 0) => {
        ScrollTrigger.refresh();
        const hash = getSectionHashOnLoad();
        if (!hash) {
          syncScrollExperienceDepth();
          return;
        }

        // Lenis mounts in a sibling effect — wait a few frames if needed.
        if (!lenisRef.current && attempts < 12) {
          requestAnimationFrame(() => applyHashOrSync(attempts + 1));
          return;
        }

        restoreSectionFromHash(hash, lenisRef.current);
      };

      requestAnimationFrame(() => applyHashOrSync());

      return () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("resize", refresh);
        window.visualViewport?.removeEventListener("resize", refresh);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [] },
  );

  const contentOverlay = (
    <div
      ref={overlayRef}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 pt-16 pb-14 sm:px-6 sm:pt-0 sm:pb-0"
    >
      <div className="relative h-full w-full min-h-0 max-w-xl">
        <Stack
          ref={stackRef}
          overlay
          className="content-panel-layer absolute inset-0"
        />
        <Cases
          ref={casesRef}
          cases={cases}
          overlay
          className="content-panel-layer absolute inset-0 flex flex-col justify-center py-8"
        />
        <Contact
          ref={contactRef}
          overlay
          className="content-panel-layer absolute inset-0 flex flex-col justify-center py-8"
        />
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={stageRef}
        data-scroll-stage
        className="relative h-[320svh] sm:h-[395dvh]"
      >
        <div data-scroll-progress="0.25" className="pointer-events-none absolute left-0 h-px w-px" aria-hidden />
        <div data-scroll-progress="0.56" className="pointer-events-none absolute left-0 h-px w-px" aria-hidden />
        <div data-scroll-progress="1" className="pointer-events-none absolute left-0 h-px w-px" aria-hidden />

        <Hero
          sectionRef={heroRef}
          visualRef={visualRef}
          figureRef={figureRef}
          foregroundRef={foregroundRef}
          chromeRef={chromeRef}
          contentOverlay={contentOverlay}
          className="sticky top-0"
        />
      </div>
    </div>
  );
}
