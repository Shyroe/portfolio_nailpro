"use client";

import type { ReactNode } from "react";
import { createElement, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealTag = "article" | "div" | "h1" | "li" | "ul";
type RevealAnimation = "bounceIn" | "fadeIn" | "zoomIn";

type ScrollRevealProps = {
  animation: RevealAnimation;
  as?: RevealTag;
  children: ReactNode;
  className?: string;
};

const animationClasses: Record<RevealAnimation, string> = {
  bounceIn: "animate-[bounceIn_1.25s]",
  fadeIn: "animate-[fadeIn_1.25s_both]",
  zoomIn: "animate-[zoomIn_1s]",
};

export function ScrollReveal({
  animation,
  as = "div",
  children,
  className,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let fallbackTimer: number | undefined;
    const revealIfInViewport = () => {
      const { bottom, top } = element.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) {
        setIsVisible(true);
        return true;
      }
      return false;
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
        if (fallbackTimer !== undefined) {
          window.clearTimeout(fallbackTimer);
        }
      }
    });

    observer.observe(element);
    fallbackTimer = window.setTimeout(() => {
      if (revealIfInViewport()) {
        observer.disconnect();
      }
    }, 100);

    return () => {
      observer.disconnect();
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, []);

  return createElement(
    as,
    {
      className: cn(
        // The reference hides pre-reveal content with `visibility: hidden`
        // (Elementor's `.elementor-invisible`), which also drops every
        // wrapped heading out of the accessibility tree until JavaScript
        // reveals it. `opacity: 0` renders identically, keeps the semantic
        // outline readable, and is what the accessibility audit expects.
        !isVisible && "pointer-events-none opacity-0",
        isVisible && animationClasses[animation],
        "motion-reduce:animate-none",
        className,
      ),
      ref: elementRef,
    },
    children,
  );
}
