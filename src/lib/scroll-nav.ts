import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export const SECTION_PROGRESS: Record<string, number> = {
  "#hero": 0,
  "#stack": 0.25,
  "#experience": 0.56,
  "#contact": 1,
};

/** Below this progress only the hero should be visible. */
export const HERO_PANEL_CUTOFF = 0.115;

/** Depth state after hero exit — lock during section-to-section nav. */
const SECTION_DEPTH_PROGRESS = 0.12;

type PanelKey = "stack" | "cases" | "contact";
type NavTarget = PanelKey | "hero";

type DepthRefs = {
  visual: HTMLElement | null;
  figure: HTMLElement | null;
  foreground: HTMLElement | null;
};

type DepthTuning = {
  maxBlur: number;
  textBlur: number;
  endScale: number;
};

type ScrollExperience = {
  scrollTrigger: ScrollTrigger;
  timeline: gsap.core.Timeline;
  panels: Record<PanelKey, HTMLElement | null>;
  depth: DepthRefs;
  depthTuning: DepthTuning;
};

const HREF_TO_TARGET: Record<string, NavTarget> = {
  "#hero": "hero",
  "#stack": "stack",
  "#experience": "cases",
  "#contact": "contact",
};

const NAV_DURATION = 1.1;
const NAV_DURATION_HERO = 0.72;
const NAV_DURATION_SECTION = 0.55;

let experience: ScrollExperience | null = null;
let navTween: gsap.core.Timeline | null = null;
let activeNavTarget: NavTarget | null = null;
let heroEntranceLock = false;

export function setHeroEntranceLock(locked: boolean) {
  heroEntranceLock = locked;

  if (!experience) return;

  if (locked) {
    experience.scrollTrigger.disable();
    return;
  }

  experience.scrollTrigger.enable();
  syncScrollExperienceDepth();
  ScrollTrigger.update();
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * clamp01(t);
}

export function hidePanel(panel: HTMLElement | null) {
  if (!panel) return;
  // Called on every scroll frame in the hero zone — skip if already hidden.
  if (panel.style.visibility === "hidden" && panel.style.opacity === "0") return;
  gsap.set(panel, {
    autoAlpha: 0,
    y: 80,
    scale: 0.96,
    zIndex: 1,
    visibility: "hidden",
    pointerEvents: "none",
  });
}

export function hideAllPanels(panels: Record<PanelKey, HTMLElement | null>) {
  (Object.keys(panels) as PanelKey[]).forEach((key) => hidePanel(panels[key]));
}

function suppressNonTargetPanels(
  panels: Record<PanelKey, HTMLElement | null>,
  target: NavTarget,
) {
  (Object.keys(panels) as PanelKey[]).forEach((key) => {
    if (target !== "hero" && key === target) return;
    hidePanel(panels[key]);
  });
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Last-applied depth values per element. Past the hero exit (p >= 0.12) the
 * computed values are constant, yet this runs on every scroll frame — the
 * cache turns those frames into no-ops. Safe because the scrub timeline
 * mirrors the exact same keyframes, so a skipped write never leaves a
 * diverging style behind.
 */
const depthWriteCache = new WeakMap<HTMLElement, string>();

function setDepth(
  el: HTMLElement | null,
  key: string,
  vars: gsap.TweenVars,
) {
  if (!el) return;
  if (depthWriteCache.get(el) === key) return;
  depthWriteCache.set(el, key);
  gsap.set(el, vars);
}

/** Mirror scroll-timeline depth keyframes for reliable nav scrub. */
export function applyDepthAtProgress(
  progress: number,
  depth: DepthRefs,
  tuning: DepthTuning,
) {
  if (heroEntranceLock && progress < HERO_PANEL_CUTOFF) return;

  const p = Math.max(0, progress);
  const { maxBlur, endScale } = tuning;

  const enter = clamp01(p / 0.12);

  let fgOpacity = 1;
  let fgY = 0;
  if (p > 0.06) {
    const fadeT = clamp01((p - 0.06) / 0.1);
    fgOpacity = 1 - fadeT;
    fgY = -48 * fadeT;
  }

  const scale = round(lerp(1, endScale, enter), 4);
  const visualOpacity = round(lerp(1, 0.65, enter), 3);
  // Integer blur → far fewer distinct filter strings → fewer GPU re-rasters.
  const blur = Math.round(lerp(0, maxBlur, enter));

  const visualFilter = blur > 0 ? `blur(${blur}px)` : "none";
  setDepth(depth.visual, `${scale}|${visualOpacity}|${blur}`, {
    scale,
    opacity: visualOpacity,
    filter: visualFilter,
  });

  setDepth(depth.figure, `${scale}|${blur}`, {
    scale,
    filter: visualFilter,
  });

  if (depth.foreground) {
    // Must match the scrub keyframes (opacity/y fade 0.06→0.16). No live text
    // blur — it was expensive and redundant with the fade.
    const settled = p >= 0.16;
    setDepth(
      depth.foreground,
      settled
        ? "fg|done"
        : `fg|${round(fgOpacity, 3)}|${round(fgY, 1)}`,
      {
        autoAlpha: settled ? 0 : round(fgOpacity, 3),
        y: settled ? -48 : round(fgY, 1),
      },
    );
  }
}

function getScrollYForProgress(st: ScrollTrigger, progress: number) {
  return st.start + progress * (st.end - st.start);
}

function isSectionToSectionNav(fromProgress: number, target: NavTarget, toProgress: number) {
  return fromProgress >= SECTION_DEPTH_PROGRESS && target !== "hero" && toProgress >= SECTION_DEPTH_PROGRESS;
}

/** Includes transition gaps so same-section clicks don't re-animate. */
export function isAlreadyAtSection(target: NavTarget, progress: number) {
  if (target === "hero") return progress < 0.12;
  if (target === "stack") return progress >= 0.115 && progress < 0.38;
  if (target === "cases") return progress >= 0.36 && progress < 0.76;
  if (target === "contact") return progress >= 0.74;
  return false;
}

function releaseNavScrollTrigger() {
  if (!experience) return;
  experience.scrollTrigger.enable();
  ScrollTrigger.update();
}

function stopNavTween(releaseScrollTrigger = true) {
  if (!navTween) return;
  navTween.kill();
  navTween = null;
  activeNavTarget = null;
  if (releaseScrollTrigger) releaseNavScrollTrigger();
}

function finishNav(
  href: string,
  target: NavTarget,
  targetProgress: number,
  lenis: Lenis | null | undefined,
) {
  if (!experience) return;

  const { scrollTrigger: st, timeline, panels, depth, depthTuning } = experience;
  const y = getScrollYForProgress(st, targetProgress);

  timeline.progress(targetProgress);
  applyDepthAtProgress(targetProgress, depth, depthTuning);

  if (target === "hero" || targetProgress < HERO_PANEL_CUTOFF) {
    hideAllPanels(panels);
  }

  lenis?.scrollTo(y, { immediate: true, force: true });
  st.enable();
  ScrollTrigger.update();

  window.history.replaceState(null, "", href);
  navTween = null;
  activeNavTarget = null;
}

export function isNavigating() {
  return navTween !== null;
}

export function isScrollExperienceRegistered() {
  return experience !== null;
}

export function getSectionHashOnLoad(): string | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash;
  if (!hash || hash === "#hero") return null;

  return hash in SECTION_PROGRESS ? hash : null;
}

/** Force-hide overlay panels in the hero scroll zone. */
export function enforcePanelsForProgress(
  progress: number,
  panels: Record<PanelKey, HTMLElement | null>,
) {
  if (progress >= HERO_PANEL_CUTOFF) return;
  hideAllPanels(panels);
}

/** Keep hero depth/blur aligned with the scroll timeline (e.g. after reload). */
export function syncScrollExperienceDepth() {
  if (!experience || isNavigating()) return;

  const progress = experience.scrollTrigger.progress;
  experience.timeline.progress(progress);
  applyDepthAtProgress(progress, experience.depth, experience.depthTuning);
  enforcePanelsForProgress(progress, experience.panels);
}

export function restoreSectionFromHash(
  href: string,
  lenis?: Lenis | null,
): number | null {
  if (!experience) return null;

  const progress = SECTION_PROGRESS[href];
  if (progress === undefined) return null;

  const { scrollTrigger: st, timeline, depth, depthTuning } = experience;
  const y = getScrollYForProgress(st, progress);

  // Lenis owns the scroll position — native st.scroll alone gets overwritten
  // on the next ticker frame. Always drive Lenis when available.
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    st.scroll(y);
  }

  timeline.progress(progress);
  applyDepthAtProgress(progress, depth, depthTuning);
  ScrollTrigger.update();

  return y;
}

export function registerScrollExperience(exp: ScrollExperience) {
  experience = exp;

  if (!getSectionHashOnLoad()) {
    heroEntranceLock = true;
    exp.scrollTrigger.disable();
  }
  // Hash restore is applied later once Lenis + ScrollTrigger.refresh settle —
  // syncing here would read progress 0 and undo the upcoming jump.

  return () => {
    stopNavTween();
    heroEntranceLock = false;
    if (experience === exp) experience = null;
  };
}

export function scrollToSection(href: string, lenis: Lenis | null | undefined) {
  const targetProgress = SECTION_PROGRESS[href];
  const target = HREF_TO_TARGET[href];

  if (targetProgress === undefined || !target || !experience) return;

  if (activeNavTarget === target && navTween) return;

  const { scrollTrigger: st, timeline, panels, depth, depthTuning } = experience;

  stopNavTween(false);

  const currentProgress = timeline.progress();

  if (isAlreadyAtSection(target, currentProgress)) {
    if (target === "hero") {
      timeline.progress(0);
      applyDepthAtProgress(0, depth, depthTuning);
      hideAllPanels(panels);
      lenis?.scrollTo(0, { immediate: true, force: true });
      ScrollTrigger.update();
    }
    window.history.replaceState(null, "", href);
    return;
  }

  window.history.replaceState(null, "", href);

  const fromProgress = currentProgress;
  const navDriver = { progress: fromProgress };
  const lockSectionDepth = isSectionToSectionNav(fromProgress, target, targetProgress);

  if (lockSectionDepth) {
    applyDepthAtProgress(SECTION_DEPTH_PROGRESS, depth, depthTuning);
  }

  activeNavTarget = target;
  st.disable();
  hideAllPanels(panels);

  navTween = gsap.timeline({
    defaults: { ease: "power3.inOut", overwrite: "auto" },
    onComplete: () => finishNav(href, target, targetProgress, lenis),
    onInterrupt: () => {
      navTween = null;
      activeNavTarget = null;
    },
  });

  let duration = NAV_DURATION;
  if (target === "hero") duration = NAV_DURATION_HERO;
  else if (lockSectionDepth) duration = NAV_DURATION_SECTION;

  navTween.to(
    navDriver,
    {
      progress: targetProgress,
      duration,
      onUpdate: () => {
        timeline.progress(navDriver.progress);
        if (lockSectionDepth) {
          applyDepthAtProgress(SECTION_DEPTH_PROGRESS, depth, depthTuning);
        } else {
          applyDepthAtProgress(navDriver.progress, depth, depthTuning);
        }
        suppressNonTargetPanels(panels, target);
        if (navDriver.progress < HERO_PANEL_CUTOFF) {
          hideAllPanels(panels);
        }
      },
    },
    0,
  );
}
