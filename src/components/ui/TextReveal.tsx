"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "h2" | "h3" | "p" | "span";
  delay?: number;
};

export function TextReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

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
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
