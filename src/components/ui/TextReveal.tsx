"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion-preferences";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** Skip scroll-trigger animation (e.g. overlay panels driven by the main timeline). */
  disabled?: boolean;
};

export function TextReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  disabled = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || disabled || prefersReducedMotion()) return;

      gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            // once — reverse on every pass was re-triggering work for the
            // whole session while the sticky overlay stayed in view.
            once: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [disabled, delay] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
