import type { ReactNode } from "react";

/** Matches product name plus optional hyphenated affixes (e.g. Armenian doLegal-ը). */
const BRAND_RE = /doLegal(?:[-‑][A-Za-z\u0400-\u04FF\u0561-\u0587]+)?/gi;

/**
 * Wraps occurrences of "doLegal" (and common hyphenated forms) in <strong>.
 * Use for body copy only — not headings, nav, or chrome labels.
 */
export function brandText(text: string): ReactNode {
  const matches = [...text.matchAll(new RegExp(BRAND_RE.source, "gi"))];
  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  for (const m of matches) {
    const idx = m.index ?? 0;
    const slice = m[0];
    if (idx > last) nodes.push(text.slice(last, idx));
    nodes.push(
      <strong key={`${idx}-${slice}`} className="font-bold">
        {slice}
      </strong>,
    );
    last = idx + slice.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
