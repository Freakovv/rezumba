"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject, type ReactNode, type MouseEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { profile } from "@/lib/profile";
import { scrollToSection, getSectionHashOnLoad, isScrollExperienceRegistered, restoreSectionFromHash, setHeroEntranceLock } from "@/lib/scroll-nav";
import { prefersReducedMotion } from "@/lib/motion-preferences";
import { useTranslations } from "@/components/providers/LocaleProvider";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const GITHUB_URL = "https://github.com/Freakovv";

const linkClassName =
  "inline-block transition duration-300 hover:scale-105 hover:text-white active:scale-105";

const externalLinkClassName = `${linkClassName} inline-flex items-center gap-1.5 sm:gap-2`;

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-6Z" />
      <path d="M12 3v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function AnchorLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;

    event.preventDefault();
    event.stopPropagation();
    scrollToSection(href, lenis);
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

type HeroProps = {
  sectionRef?: RefObject<HTMLElement | null>;
  visualRef?: RefObject<HTMLDivElement | null>;
  figureRef?: RefObject<HTMLDivElement | null>;
  foregroundRef?: RefObject<HTMLDivElement | null>;
  chromeRef?: RefObject<HTMLDivElement | null>;
  contentOverlay?: ReactNode;
  className?: string;
};

function assignRef<T>(ref: RefObject<T | null> | undefined, node: T | null) {
  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

export function Hero({
  sectionRef,
  visualRef,
  figureRef,
  foregroundRef,
  chromeRef,
  contentOverlay,
  className,
}: HeroProps = {}) {
  const t = useTranslations();
  const navLinks = [
    { label: t.nav.about, href: "#hero" },
    { label: t.nav.stack, href: "#stack" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const containerRef = useRef<HTMLElement>(null);
  const internalVisualRef = useRef<HTMLDivElement>(null);
  const internalFigureRef = useRef<HTMLDivElement>(null);
  const internalForegroundRef = useRef<HTMLDivElement>(null);
  const internalChromeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = containerRef.current;
      if (!section) return;

      const sectionHash = getSectionHashOnLoad();

      if (sectionHash) {
        gsap.set(internalForegroundRef.current, { autoAlpha: 0 });

        const applyRestoredState = (attempts = 0) => {
          if (!isScrollExperienceRegistered()) {
            requestAnimationFrame(() => applyRestoredState(attempts));
            return;
          }

          // Wait for Lenis so the scroll jump sticks (otherwise Lenis raf
          // overwrites native scroll back to 0).
          if (!lenisRef.current && attempts < 12) {
            requestAnimationFrame(() => applyRestoredState(attempts + 1));
            return;
          }

          restoreSectionFromHash(sectionHash, lenisRef.current);
          gsap.set(internalForegroundRef.current, { autoAlpha: 0 });
          gsap.set(internalFigureRef.current, { autoAlpha: 1 });
          gsap.set(internalChromeRef.current, { opacity: 1, y: 0 });
          gsap.set(".hero-scroll-hint", { opacity: 1, y: 0 });
          document.documentElement.removeAttribute("data-section-restore");
          section.classList.remove("hero-pending");
        };

        requestAnimationFrame(() => applyRestoredState());
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set(internalVisualRef.current, { scale: 1 });
        gsap.set(internalFigureRef.current, { autoAlpha: 1, yPercent: 0 });
        gsap.set(internalForegroundRef.current, { autoAlpha: 1, y: 0, blur: 0 });
        gsap.set(".hero-line", { autoAlpha: 1, y: 0 });
        gsap.set(internalChromeRef.current, { opacity: 1, y: 0 });
        gsap.set(".hero-scroll-hint", { opacity: 1, y: 0 });
        section.classList.remove("hero-pending");

        // The scroll experience registers after this effect and re-enables
        // the entrance lock — wait for it before releasing.
        const releaseLock = () => {
          if (!isScrollExperienceRegistered()) {
            requestAnimationFrame(releaseLock);
            return;
          }
          setHeroEntranceLock(false);
        };
        requestAnimationFrame(releaseLock);
        return;
      }

      gsap.fromTo(
        internalVisualRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: "power2.out", immediateRender: true },
      );

      gsap.fromTo(
        internalFigureRef.current,
        { autoAlpha: 0, yPercent: 6 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.6,
          ease: "power2.out",
          delay: 0.2,
          immediateRender: true,
        },
      );

      gsap.set(internalForegroundRef.current, { autoAlpha: 1, y: 0, blur: 0 });
      gsap.fromTo(
        ".hero-line",
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.35,
          stagger: 0.11,
          immediateRender: true,
        },
      );

      gsap.fromTo(
        internalChromeRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.1,
          immediateRender: true,
        },
      );

      gsap.fromTo(
        ".hero-scroll-hint",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.2,
          ease: "power2.out",
          immediateRender: true,
          onComplete: () => setHeroEntranceLock(false),
        },
      );

      section.classList.remove("hero-pending");
    },
    { scope: containerRef },
  );

  return (
    <section
      id="hero"
      ref={(node) => {
        containerRef.current = node;
        assignRef(sectionRef, node);
      }}
      className={`hero-pending relative h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#050508]${className ? ` ${className}` : ""}`}
    >
      {/* Background layer — scale + opacity on scroll (blur driven in JS) */}
      <div
        ref={(node) => {
          internalVisualRef.current = node;
          assignRef(visualRef, node);
        }}
        className="hero-visual-layer absolute inset-0 z-0 origin-center will-change-transform"
      >
        <div className="absolute inset-0 scale-[1.04]">
          <div className="relative size-full">
            <Image
              src="/hero-bg.avif"
              alt=""
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/80 via-[#050508]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/80 via-transparent to-[#050508]/25" />
        </div>
        <div className="light-leak" />
      </div>

      {/* Grain sits outside the blurred/scaled layer so scroll doesn't re-rasterize turbulence every frame */}
      <div className="film-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="noise-overlay pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      {/* Name typography — behind figure */}
      <div
        ref={(node) => {
          internalForegroundRef.current = node;
          assignRef(foregroundRef, node);
        }}
        className="hero-foreground section-padding pointer-events-none absolute inset-x-0 bottom-[28%] z-10 max-w-full will-change-[transform,opacity] sm:bottom-[34%] lg:bottom-[32%]"
      >
        <h1 className="max-w-full font-serif uppercase">
          <span className="hero-line block text-[clamp(2.35rem,9.2vw,3.65rem)] font-light leading-[0.88] tracking-[0.015em] text-white sm:text-[clamp(4.5rem,12.5vw,9.5rem)] sm:leading-[0.87] sm:tracking-[0.035em]">
            {t.profile.firstName}
          </span>
          <span className="hero-line block text-[clamp(2.35rem,9.2vw,3.65rem)] font-light leading-[0.88] tracking-[0.015em] text-white sm:text-[clamp(4.5rem,12.5vw,9.5rem)] sm:leading-[0.87] sm:tracking-[0.035em]">
            {t.profile.lastName}
          </span>
        </h1>

        <span className="hero-line mt-4 inline-block h-px w-16 bg-white/45 sm:mt-5 sm:w-20" />
        <p className="hero-line mt-2 text-[10px] uppercase tracking-[0.32em] text-zinc-300 sm:mt-3 sm:text-xs sm:tracking-[0.42em]">
          {t.profile.title}
        </p>
      </div>

      {/* Figure — in front of text */}
      <div
        ref={(node) => {
          internalFigureRef.current = node;
          assignRef(figureRef, node);
        }}
        className="hero-figure pointer-events-none absolute bottom-0 left-1/2 z-20 h-[72dvh] w-[105vw] max-w-[820px] -translate-x-[54%] origin-bottom will-change-transform sm:h-screen sm:w-[80vw] sm:-translate-x-[61%]"
      >
        <div className="relative size-full">
          <Image
            src="/hero-figure-cutout.avif"
            alt={`${t.profile.firstName} ${t.profile.lastName}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 640px) 105vw, 80vw"
            className="origin-bottom scale-[1.18] object-contain object-bottom sm:scale-[1.24]"
          />
        </div>
      </div>

      {/* Scroll-driven content panels */}
      {contentOverlay}

      {/* Nav + footer chrome */}
      <div
        ref={(node) => {
          internalChromeRef.current = node;
          assignRef(chromeRef, node);
        }}
        className="hero-chrome-root pointer-events-none absolute inset-0 z-40"
      >
        <nav className="section-padding pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-between gap-3 !py-5 sm:items-center sm:!py-8">
          <LanguageToggle />
          <ul className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[9px] uppercase tracking-[0.16em] text-zinc-300 sm:gap-9 sm:text-[13px] sm:tracking-[0.26em]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <AnchorLink href={link.href} className={linkClassName}>
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="section-padding pointer-events-auto absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 !pb-5 !pt-0 sm:items-center sm:!pb-8">
          <div className="hero-scroll-hint flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-zinc-300 sm:gap-3 sm:text-[11px] sm:tracking-[0.22em]">
            <span className="flex h-6 w-3.5 items-start justify-center rounded-full border border-white/40 p-0.5 sm:h-7 sm:w-4 sm:p-1">
              <span className="h-1.5 w-px animate-bounce rounded-full bg-white/80" />
            </span>
            <span className="hidden min-[380px]:inline">{t.hero.scrollHint}</span>
          </div>

          <ul className="flex shrink-0 items-center gap-4 text-[9px] uppercase tracking-[0.16em] text-zinc-300 sm:gap-9 sm:text-[13px] sm:tracking-[0.26em]">
            <li>
              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClassName}
                aria-label={t.hero.resumeAria}
              >
                <PdfIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>PDF</span>
              </a>
            </li>
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClassName}
                aria-label={t.hero.githubAria}
              >
                <GithubIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Github</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
