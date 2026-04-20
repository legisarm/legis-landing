"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { HeroRotatingAudience } from "./hero-rotating-audience";
import { DoLegalWordmark } from "./dolegal-wordmark";
import { landingImages, type LandingContent } from "./content";
import { MarketingShell } from "./marketing-shell";
import {
  marketingSectionLabel as sectionLabel,
  marketingSectionSub as sectionSub,
  marketingSectionTitle as sectionTitle,
} from "./marketing-constants";

const FIXED_NAV_OFFSET = 104;

type PreviewCitation = {
  instrument: string;
  locator: string;
  note?: string;
};

type PreviewUseCase = {
  question: string;
  answerTitle: string;
  answerBody: string;
  citations?: PreviewCitation[];
  withAttachment?: boolean;
  withExport?: boolean;
  exportPdfName?: string;
  exportDocxName?: string;
};

type HeroPreviewContent = LandingContent["hero"] & {
  previewBadge: string;
  previewQuestionLabel: string;
  previewAnswerLabel: string;
  previewAttachmentLabel: string;
  previewAnalyzedFile: string;
  previewExportLabel: string;
  previewExportPdfName: string;
  previewUseCases?: PreviewUseCase[];
  previewSourcesLabel?: string;
};

function animateScrollTo(targetY: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(1200, Math.max(520, Math.abs(distance) * 0.7));
  const startTime = performance.now();

  const easeInOutCubic = (time: number) =>
    time < 0.5 ? 4 * time * time * time : 1 - (-2 * time + 2) ** 3 / 2;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * easedProgress);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

export function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const content = t.raw("landing") as LandingContent;
  const heroPreview = content.hero as HeroPreviewContent;
  const previewCases = (heroPreview.previewUseCases ?? []) as PreviewUseCase[];
  const cardCases = [
    previewCases[1] ?? previewCases[0],
    previewCases[2] ?? previewCases[1] ?? previewCases[0],
    previewCases[0] ?? previewCases[2] ?? previewCases[1],
  ].filter(Boolean) as PreviewUseCase[];
  const cardLabelFontClass = locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : "";
  const handleAnchorClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - FIXED_NAV_OFFSET;
    animateScrollTo(Math.max(0, targetY));
    window.history.replaceState(null, "", href);
  };

  return (
    <MarketingShell>
      <main
        className={`${locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : "[font-family:var(--font-outfit)]"} bg-white text-slate-900`}
      >
        <section className="landing-hero-dotted overflow-hidden px-5 pb-20 pt-36 text-slate-100 md:px-10">
          <div className="relative z-[1] mx-auto w-full max-w-7xl">
            <div className="max-w-3xl text-left">
              <h1 className="mb-12 text-[44.8px] font-semibold leading-[1.03] tracking-[-0.03em] text-slate-50">
                <span className="block text-[31.36px]">{content.hero.titleMain}</span>
                <span className="mt-[0.5625rem] flex flex-wrap items-baseline gap-x-[0.35em]">
                  <span className="text-[57.34px]">{content.hero.titleFor}</span>
                  {content.hero.titleAudienceRotating.length > 0 ? (
                    <HeroRotatingAudience items={content.hero.titleAudienceRotating} />
                  ) : null}
                </span>
              </h1>
              <p className="mb-14 w-[132.5%] max-w-none text-[1.575rem] leading-[2.45rem] text-slate-300">{content.hero.description}</p>
              <div className="mt-20 mb-9 flex flex-wrap items-center gap-3">
                <a
                  href="#early-access"
                  onClick={handleAnchorClick("#early-access")}
                  className={`inline-flex items-center rounded-lg border border-white bg-white px-5 py-2.5 text-[15px] font-medium text-slate-950 transition hover:bg-slate-200 ${
                    locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : ""
                  }`}
                >
                  {content.hero.primaryCta}
                </a>
                <a
                  href="#how"
                  onClick={handleAnchorClick("#how")}
                  className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-900 px-5 py-2.5 text-[15px] text-slate-100 transition hover:border-slate-400 hover:text-white"
                >
                  {content.hero.secondaryCta}
                </a>
              </div>

              <div className="inline-flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 md:flex-row">
                {content.heroStats.map((stat) => (
                  <div className="border-slate-700 px-8 py-4 md:border-r last:md:border-r-0" key={stat.label}>
                    <div className="[font-family:var(--font-webly-sans)] text-[1.35rem] font-semibold tracking-tight text-slate-100">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cardCases.map((item, idx) => (
                <article
                  key={`${item.question}-${idx}`}
                  className="flex h-[390px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05),0_14px_28px_rgba(2,6,23,0.45)]"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <DoLegalWordmark className="[font-family:var(--font-playfair)] text-[22px] font-semibold tracking-tight text-slate-50" />
                    <span
                      className={`rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] tracking-wide text-slate-200 ${cardLabelFontClass} ${
                        locale === "hy" ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {heroPreview.previewBadge}
                    </span>
                  </div>

                  <section>
                    <p
                      className={`mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400 ${cardLabelFontClass} ${
                        locale === "hy" ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {heroPreview.previewQuestionLabel}
                    </p>
                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm shadow-black/30">
                      <div className="bg-slate-800 px-4 py-4 text-[15px] leading-[1.5] text-slate-100">
                        {item.question}
                      </div>
                    </div>
                  </section>

                  {item.withAttachment ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/70">
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <span
                          className={`text-[10px] uppercase tracking-[0.12em] text-slate-400 ${cardLabelFontClass} ${
                            locale === "hy" ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {heroPreview.previewAttachmentLabel}
                        </span>
                        <span className="text-[11px] text-slate-200">{heroPreview.previewAnalyzedFile}</span>
                      </div>
                    </div>
                  ) : null}

                  <section className="mt-5">
                    <p
                      className={`mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400 ${cardLabelFontClass} ${
                        locale === "hy" ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {heroPreview.previewAnswerLabel}
                    </p>
                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm shadow-black/30">
                      <div className="px-4 py-4">
                        <p className="text-[13px] font-semibold text-slate-100">{item.answerTitle}</p>
                        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-300">{item.answerBody}</p>
                      </div>

                      {item.citations && item.citations.length > 0 ? (
                        <div className="border-t border-slate-700 bg-slate-800 px-4 py-3">
                          <p className="mb-1.5 text-[9px] uppercase tracking-[0.16em] text-slate-400">
                            {heroPreview.previewSourcesLabel ?? "Sources"}
                          </p>
                          <ul className="space-y-1.5">
                            {item.citations.slice(0, 2).map((citation, citeIndex) => (
                              <li key={`${citation.instrument}-${citeIndex}`} className="text-[10px] leading-snug text-slate-300">
                                <span className="text-slate-300">{citation.instrument}</span>
                                <span className="text-slate-500"> · </span>
                                <span className="text-slate-200">{citation.locator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {item.withExport ? (
                        <div className="border-t border-slate-700 bg-slate-900 px-4 py-3">
                          <p className="text-[11px] text-slate-300">{heroPreview.previewExportLabel}</p>
                          <p className="mt-1 truncate text-[11px] text-slate-200">
                            {item.exportPdfName ?? heroPreview.previewExportPdfName}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </section>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-scroll-target px-5 py-24 md:px-10" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end">
              <div>
                <span className={sectionLabel}>{content.features.sectionLabel}</span>
                <h2 className={sectionTitle}>
                  {content.features.titleMain}
                  <br />
                  <em className="font-normal italic">{content.features.titleAccent}</em>
                </h2>
              </div>
              <p className={sectionSub}>{content.features.description}</p>
            </div>
            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
              <div className="relative h-56 md:h-72">
                <Image
                  src={landingImages.feature.src}
                  alt={landingImages.feature.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-3">
              {content.features.cards.map((feature) => (
                <article className="bg-white p-8" key={feature.number}>
                  <span className="mb-5 block [font-family:var(--font-playfair)] text-sm text-slate-500">{feature.number}</span>
                  <h3 className="mb-3 [font-family:var(--font-playfair)] text-[26px] font-semibold leading-tight text-slate-900">{feature.title}</h3>
                  <p className="mb-5 text-sm leading-6 text-slate-600">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li className="pl-4 text-sm leading-6 text-slate-600 before:relative before:left-[-8px] before:content-['-']" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-16 md:mt-20">
              <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
                <ComparisonCard badge={content.problem.oldWayBadge} negative items={content.problem.oldWayItems} />
                <ComparisonCard badge={content.problem.withDoLegalBadge} items={content.problem.doLegalItems} />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-scroll-target bg-[#f8fafc] px-5 py-24 md:px-10" id="how">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className={sectionLabel}>{content.howItWorks.sectionLabel}</span>
              <h2 className={sectionTitle}>
                {content.howItWorks.titleMain}
                <br />
                <em className="font-normal italic">{content.howItWorks.titleAccent}</em>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {content.howItWorks.steps.map((step, index) => (
                <article key={step.title}>
                  <div className="mb-5 grid size-[50px] place-items-center rounded-full border border-slate-300 bg-white [font-family:var(--font-playfair)] text-xl font-semibold text-slate-900">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-2xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <span className={sectionLabel}>{content.personas.sectionLabel}</span>
              <h2 className={sectionTitle}>
                {content.personas.titleMain}
                <br />
                <em className="font-normal italic">{content.personas.titleAccent}</em>
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {content.personas.cards.map((persona, index) => (
                <article className="rounded-2xl border border-slate-200 bg-white p-7" key={persona.title}>
                  <div className="relative mb-4 h-[200px] overflow-hidden rounded-xl">
                    <Image
                      src={landingImages.personas[index]?.src ?? landingImages.personas[0].src}
                      alt={landingImages.personas[index]?.alt ?? landingImages.personas[0].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <span className="mb-4 inline-block rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-slate-700">
                    {persona.tag}
                  </span>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-3xl font-semibold text-slate-900">{persona.title}</h3>
                  <p className="mb-5 text-sm leading-7 text-slate-600">{persona.description}</p>
                  <ul className="space-y-2">
                    {persona.wins.map((win) => (
                      <li className="flex gap-2 text-sm leading-6 text-slate-600" key={win}>
                        <span className="text-slate-500">•</span>
                        {win}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-scroll-target px-5 py-24 md:px-10" id="faq">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <span className={sectionLabel}>{content.faq.sectionLabel}</span>
              <h2 className={sectionTitle}>
                {content.faq.titleMain}
                <br />
                <em className="font-normal italic">{content.faq.titleAccent}</em>
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {content.faq.descriptionPrefix}{" "}
                <a className="border-b border-slate-300 text-slate-900 transition hover:border-slate-900" href="mailto:hello@dolegal.am">
                  {content.faq.email}
                </a>
              </p>
            </div>
            <div>
              {content.faq.items.map((faq) => (
                <article className="border-t border-slate-200 py-5" key={faq.question}>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-2xl font-semibold text-slate-900">{faq.question}</h3>
                  <p className="text-sm leading-7 text-slate-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-scroll-target border-y border-slate-200 bg-[#f8fafc] px-5 py-24 text-center text-slate-900 md:px-10" id="early-access">
          <span className="mb-4 block text-[11px] uppercase tracking-[0.09em] text-slate-500">{content.earlyAccess.sectionLabel}</span>
          <h2 className="mb-4 [font-family:var(--font-playfair)] text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-slate-900 md:text-6xl">
            {content.earlyAccess.titleMain}
            <br />
            <em className="font-normal italic">{content.earlyAccess.titleAccent}</em>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-slate-600">{content.earlyAccess.description}</p>
          <form className="mx-auto mb-4 flex max-w-xl flex-col gap-3 md:flex-row md:items-end">
            <div className="w-full text-left">
              <label
                htmlFor="early-access-email"
                className={`mb-2 block text-[12px] uppercase tracking-[0.08em] text-slate-500 ${
                  locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : "font-medium"
                }`}
              >
                {content.earlyAccess.emailLabel}
              </label>
              <input
                id="early-access-email"
                name="email"
                type="email"
                required
                placeholder={content.earlyAccess.emailPlaceholder}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
              />
            </div>
            <button
              type="submit"
              className={`h-12 whitespace-nowrap rounded-xl bg-slate-900 px-6 text-[15px] text-white transition hover:bg-slate-700 ${
                locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : "font-medium"
              }`}
            >
              {content.earlyAccess.buttonLabel}
            </button>
          </form>
          <p className="mt-5 text-xs text-slate-500">{content.earlyAccess.footnote}</p>
        </section>
      </main>
    </MarketingShell>
  );
}

function ComparisonCard({
  badge,
  items,
  negative = false,
}: {
  badge: string;
  items: string[];
  negative?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-8">
      <span
        className={`mb-6 inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.08em] ${
          negative ? "border border-red-200 bg-red-50 text-red-700" : "border border-slate-300 bg-slate-50 text-slate-900"
        }`}
      >
        {badge}
      </span>
      <ul className="space-y-3">
        {items.map((item) => (
          <li className="flex gap-2.5 text-sm leading-6 text-slate-600" key={item}>
            <span className="mt-1 shrink-0">
              <Image
                src={negative ? "/landing/close.svg" : "/landing/tick.svg"}
                alt={negative ? "Negative point" : "Positive point"}
                width={20}
                height={20}
              />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
