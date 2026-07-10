"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { FormEvent, MouseEvent } from "react";
import { useState } from "react";
import { HeroRotatingAudience } from "./hero-rotating-audience";
import { HeroDoodleCanvas } from "./hero-doodle-canvas";
import { landingImages, type LandingContent } from "./content";
import { MarketingShell } from "./marketing-shell";
import {
  marketingSectionLabel as sectionLabel,
  marketingSectionSub as sectionSub,
  marketingSectionTitle as sectionTitle,
} from "./marketing-constants";

const FIXED_NAV_OFFSET = 104;

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
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const [earlyAccessState, setEarlyAccessState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [earlyAccessFeedback, setEarlyAccessFeedback] = useState("");

  const handleEarlyAccessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = earlyAccessEmail.trim();
    if (!normalizedEmail) return;

    setEarlyAccessState("submitting");
    setEarlyAccessFeedback(content.earlyAccess.submittingMessage);

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json()) as { code?: string };

      if (!response.ok) {
        throw new Error(payload.code || "error");
      }

      setEarlyAccessState("success");
      if (payload.code === "duplicate") {
        setEarlyAccessFeedback(content.earlyAccess.duplicateMessage);
      } else {
        setEarlyAccessFeedback(content.earlyAccess.successMessage);
      }
      setEarlyAccessEmail("");
    } catch {
      setEarlyAccessState("error");
      setEarlyAccessFeedback(content.earlyAccess.errorMessage);
    }
  };

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
      <main className="[font-family:var(--font-outfit)]">
        <section className="landing-hero-dotted overflow-hidden px-5 pb-24 pt-36 md:px-10 md:pt-40">
          <div className="relative z-[1] mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mx-auto mb-6 [font-family:var(--font-playfair)] text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f] sm:text-[52px] md:text-[68px]">
                <span className="block text-[0.68em]">{content.hero.titleMain}</span>
                <span className="mt-[0.2em] block text-[30px] sm:text-[42px] md:text-[58px]">
                  {content.hero.titleFor}{" "}
                  {content.hero.titleAudienceRotating.length > 0 ? (
                    <HeroRotatingAudience items={content.hero.titleAudienceRotating} />
                  ) : null}
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-black/60 md:text-lg md:leading-8">
                {content.hero.description}
              </p>

              <div className="mb-14 flex flex-wrap items-center justify-center gap-3 md:mb-16">
                <a
                  href="#early-access"
                  onClick={handleAnchorClick("#early-access")}
                  className={`rounded-full bg-[#1d1d1f] px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-[#3a3a3c] ${
                    locale === "am" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : ""
                  }`}
                >
                  {content.hero.primaryCta}
                </a>
                <a
                  href="#how"
                  onClick={handleAnchorClick("#how")}
                  className="rounded-full border border-black/20 px-7 py-3.5 text-[15px] transition hover:border-black"
                >
                  {content.hero.secondaryCta}
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-6xl">
              <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white/80 p-3 shadow-[0_36px_100px_rgba(17,17,17,0.15)] backdrop-blur-sm md:rounded-[36px] md:p-4">
                <HeroDoodleCanvas />
              </div>
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
            <div className="mb-6 overflow-hidden rounded-2xl border border-black/10">
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
            <div className="grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 lg:grid-cols-3">
              {content.features.cards.map((feature) => (
                <article className="bg-white p-8" key={feature.number}>
                  <span className="mb-5 block [font-family:var(--font-playfair)] text-sm text-black/35">{feature.number}</span>
                  <h3 className="mb-3 [font-family:var(--font-playfair)] text-[26px] font-semibold leading-tight">{feature.title}</h3>
                  <p className="mb-5 text-sm leading-6 text-black/60">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li className="pl-4 text-sm leading-6 text-black/60 before:relative before:left-[-8px] before:content-['-']" key={item}>
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
                <ComparisonCard badge={content.problem.withLegisBadge} items={content.problem.legisItems} />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-scroll-target bg-[#f5f5f7] px-5 py-24 md:px-10" id="how">
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
                  <div className="mb-5 grid size-[50px] place-items-center rounded-full bg-[#1d1d1f] [font-family:var(--font-playfair)] text-xl font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-2xl font-semibold">{step.title}</h3>
                  <p className="text-sm leading-7 text-black/60">{step.description}</p>
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
                <article className="rounded-2xl border border-black/10 p-7" key={persona.title}>
                  <div className="relative mb-4 h-[200px] overflow-hidden rounded-xl">
                    <Image
                      src={landingImages.personas[index]?.src ?? landingImages.personas[0].src}
                      alt={landingImages.personas[index]?.alt ?? landingImages.personas[0].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <span className="mb-4 inline-block rounded-full bg-[#1d1d1f] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-white">
                    {persona.tag}
                  </span>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-3xl font-semibold">{persona.title}</h3>
                  <p className="mb-5 text-sm leading-7 text-black/60">{persona.description}</p>
                  <ul className="space-y-2">
                    {persona.wins.map((win) => (
                      <li className="flex gap-2 text-sm leading-6 text-black/60" key={win}>
                        <span className="text-black/35">•</span>
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
              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.faq.descriptionPrefix}{" "}
                <a className="border-b border-black/20 text-black" href="mailto:hello@legis.am">
                  {content.faq.email}
                </a>
              </p>
            </div>
            <div>
              {content.faq.items.map((faq) => (
                <article className="border-t border-black/10 py-5" key={faq.question}>
                  <h3 className="mb-2 [font-family:var(--font-playfair)] text-2xl font-semibold">{faq.question}</h3>
                  <p className="text-sm leading-7 text-black/60">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-scroll-target bg-[#1d1d1f] px-5 py-24 text-center text-white md:px-10" id="early-access">
          <span className="mb-4 block text-[11px] uppercase tracking-[0.09em] text-white/40">{content.earlyAccess.sectionLabel}</span>
          <h2 className="mb-4 [font-family:var(--font-playfair)] text-[44px] font-semibold leading-[1.1] tracking-[-0.02em]">
            {content.earlyAccess.titleMain}
            <br />
            <em className="font-normal italic">{content.earlyAccess.titleAccent}</em>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-white/60">{content.earlyAccess.description}</p>
          <form className="mx-auto mb-4 flex max-w-xl flex-col gap-3 md:flex-row md:items-end" onSubmit={handleEarlyAccessSubmit}>
            <div className="w-full text-left">
              <label
                htmlFor="early-access-email"
                className={`mb-2 block text-[12px] uppercase tracking-[0.08em] text-white/55 ${
                  locale === "am" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : "font-medium"
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
                value={earlyAccessEmail}
                onChange={(event) => setEarlyAccessEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-white/55"
                disabled={earlyAccessState === "submitting"}
              />
            </div>
            <button
              type="submit"
              disabled={earlyAccessState === "submitting"}
              className={`h-12 whitespace-nowrap rounded-xl bg-white px-6 text-[15px] text-[#1d1d1f] transition hover:bg-[#f5f5f7] ${
                locale === "am" ? "[font-family:var(--font-noto-sans-armenian)] font-semibold" : "font-medium"
              }`}
            >
              {earlyAccessState === "submitting" ? content.earlyAccess.submittingButtonLabel : content.earlyAccess.buttonLabel}
            </button>
          </form>
          {earlyAccessFeedback ? (
            <p
              className={`mx-auto max-w-xl text-sm ${
                earlyAccessState === "error" ? "text-red-300" : "text-emerald-300"
              }`}
              aria-live="polite"
            >
              {earlyAccessFeedback}
            </p>
          ) : null}
          <p className="mt-5 text-xs text-white/35">{content.earlyAccess.footnote}</p>
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
    <article className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-8">
      <span
        className={`mb-6 inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.08em] ${
          negative ? "bg-red-600 text-white" : "bg-[#1d1d1f] text-white"
        }`}
      >
        {badge}
      </span>
      <ul className="space-y-3">
        {items.map((item) => (
          <li className="flex gap-2.5 text-sm leading-6 text-black/60" key={item}>
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
