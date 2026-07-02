"use client";

import { useRef } from "react";
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
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };
          const maxBlur = isMobile ? 8 : 14;
          const textBlur = isMobile ? 14 : 24;
          const endScale = isMobile ? 0.82 : 0.78;

          if (foregroundRef.current) {
            gsap.set(foregroundRef.current, { blur: 0 });
          }

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

          tl.set(
            visualRef.current,
            { scale: 1, opacity: 1, filter: "blur(0px)" },
            0,
          )
            .set(
              figureRef.current,
              { scale: 1, filter: "blur(0px)" },
              0,
            )
            .set(
              foregroundRef.current,
              { opacity: 1, y: 0, blur: 0 },
              0,
            )
            .set(
            [stackRef.current, casesRef.current, contactRef.current].filter(Boolean),
            {
              autoAlpha: 0,
              y: 80,
              zIndex: 1,
              visibility: "hidden",
              pointerEvents: "none",
            },
            0,
          );
          tl.to(
            visualRef.current,
            {
              scale: endScale,
              opacity: 0.65,
              filter: `blur(${maxBlur}px)`,
              ease: "none",
              duration: 0.12,
            },
            0,
          )
            .to(
              figureRef.current,
              {
                scale: endScale,
                filter: `blur(${maxBlur}px)`,
                ease: "none",
                duration: 0.12,
              },
              0,
            )
            .to(
              foregroundRef.current,
              {
                blur: textBlur,
                ease: "none",
                duration: 0.14,
              },
              0,
            )
            .to(
              foregroundRef.current,
              {
                opacity: 0,
                y: -48,
                ease: "none",
                duration: 0.1,
              },
              0.06,
            )
            .set(
              stackRef.current,
              { visibility: "visible", zIndex: 3, pointerEvents: "auto" },
              0.12,
            )
            .to(
              stackRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.06 },
              0.12,
            )
            .to(
              stackRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.12 },
              0.18,
            )
            .to(
              stackRef.current,
              { y: -36, autoAlpha: 0, ease: "none", duration: 0.06 },
              0.32,
            )
            .set(
              stackRef.current,
              {
                visibility: "hidden",
                zIndex: 1,
                pointerEvents: "none",
                y: 80,
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
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.06 },
              0.38,
            )
            .to(
              casesRef.current,
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.2 },
              0.44,
            )
            .to(
              casesRef.current,
              { y: -36, autoAlpha: 0, ease: "none", duration: 0.06 },
              0.68,
            )
            .set(
              casesRef.current,
              {
                visibility: "hidden",
                zIndex: 1,
                pointerEvents: "none",
                y: 80,
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
              { y: 0, autoAlpha: 1, ease: "none", duration: 0.06 },
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
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const hash = getSectionHashOnLoad();
        if (hash) {
          const y = restoreSectionFromHash(hash);
          if (y !== null) {
            lenis?.scrollTo(y, { immediate: true, force: true });
          }
          syncScrollExperienceDepth();
        } else {
          syncScrollExperienceDepth();
        }
      });

      return () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("resize", refresh);
        window.visualViewport?.removeEventListener("resize", refresh);
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
