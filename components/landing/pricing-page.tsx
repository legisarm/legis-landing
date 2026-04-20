"use client";

import { useLocale, useTranslations } from "next-intl";
import type { LandingContent } from "./content";
import { MarketingShell } from "./marketing-shell";
import { PricingSection } from "./pricing-section";

export function PricingPage() {
  const locale = useLocale();
  const t = useTranslations();
  const content = t.raw("landing") as LandingContent;

  return (
    <MarketingShell>
      <main
        className={`${locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : "[font-family:var(--font-outfit)]"} pt-[104px]`}
      >
        <PricingSection pricing={content.pricing} />
      </main>
    </MarketingShell>
  );
}
