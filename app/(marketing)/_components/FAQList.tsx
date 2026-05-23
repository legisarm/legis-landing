"use client";

import { useState } from "react";
import { brandText } from "@/lib/brand-text";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQListProps {
  items: FAQItem[];
  defaultOpen?: number[];
  containerClassName?: string;
  togglePlusMinus?: boolean;
}

export function FAQList({
  items,
  defaultOpen = [0],
  containerClassName = "faq",
  togglePlusMinus = false,
}: FAQListProps) {
  const [open, setOpen] = useState<number[]>(defaultOpen);

  const toggle = (idx: number) => {
    setOpen((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <div className={containerClassName}>
      {items.map((item, idx) => {
        const isOpen = open.includes(idx);
        return (
          <div
            key={item.q}
            className={`q${isOpen ? " open" : ""}`}
            onClick={() => toggle(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(idx);
              }
            }}
          >
            <div className="q-num">{String(idx + 1).padStart(2, "0")}</div>
            <div>
              <p className="q-q">{item.q}</p>
              <p className="q-a">{brandText(item.a)}</p>
            </div>
            <div className="q-toggle">{togglePlusMinus ? "" : "+"}</div>
          </div>
        );
      })}
    </div>
  );
}
