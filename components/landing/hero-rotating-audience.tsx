"use client";

import { useEffect, useState } from "react";

const ROTATE_MS = 2800;

export function HeroRotatingAudience({ items }: { items: string[] }) {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion || items.length < 2) return;
    const intervalId = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => window.clearInterval(intervalId);
  }, [mounted, reduceMotion, items.length]);

  if (!mounted || reduceMotion) {
    const text = reduceMotion ? items.join(", ") : items[0] ?? "";
    return (
      <span className="font-semibold not-italic text-purple-900 [font-family:inherit] [font-size:inherit] [line-height:inherit]">
        {text}
      </span>
    );
  }

  return (
    <span className="font-semibold not-italic [font-family:inherit] [font-size:inherit] [line-height:inherit]">
      <span
        key={index}
        aria-live="polite"
        aria-atomic="true"
        className="hero-audience-slide-up inline-block align-baseline text-purple-900"
      >
        {items[index]}
      </span>
    </span>
  );
}
