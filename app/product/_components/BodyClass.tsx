"use client";

import { useEffect } from "react";

export function BodyClass({ className }: { className: string }) {
  useEffect(() => {
    const classes = className.split(" ").filter(Boolean);
    classes.forEach((c) => document.body.classList.add(c));
    return () => {
      classes.forEach((c) => document.body.classList.remove(c));
    };
  }, [className]);
  return null;
}
