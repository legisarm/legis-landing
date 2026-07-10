import type { ReactNode } from "react";

/** Word chars in Latin, Cyrillic, and Armenian scripts. */
const WORD_CHAR = "A-Za-z\\u0400-\\u04FF\\u0561-\\u0587";

/** Standalone brand name plus optional hyphenated affixes (e.g. Armenian Legis-ը). */
const BRAND_RE = new RegExp(
  `(?<![${WORD_CHAR}])Legis(?:[-‑][${WORD_CHAR}]+)?(?![${WORD_CHAR}])`,
  "gi",
);

/**
 * Wraps occurrences of "Legis" (and common hyphenated forms) in <strong>.
 * Use for body copy only — not headings, nav, or chrome labels.
 */
export function brandText(text: string): ReactNode {
  const matches = [...text.matchAll(BRAND_RE)];
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
