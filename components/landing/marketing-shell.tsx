"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Noto_Sans_Armenian, Noto_Serif_Armenian, Outfit, Playfair_Display } from "next/font/google";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { languageOptions, type LandingContent } from "./content";
import { DoLegalWordmark } from "./dolegal-wordmark";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-serif-armenian",
});
const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-sans-armenian",
  weight: ["600"],
});

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

const navLinkClass =
  "text-[14px] font-medium uppercase tracking-[0.06em] text-black/60 transition hover:text-black";

export function MarketingShell({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const content = t.raw("landing") as LandingContent;
  const currentLanguage = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0];
  const isHome = pathname === "/";
  const playfairOverrideStyle =
    locale === "hy" ? ({ "--font-playfair": "var(--font-noto-serif-armenian)" } as CSSProperties) : undefined;
  const armenianSansClass = locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : "";

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
    <div
      className={`${outfit.variable} ${playfair.variable} ${notoSerifArmenian.variable} ${notoSansArmenian.variable} bg-white text-[#1d1d1f]`}
      style={playfairOverrideStyle}
    >
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/90 px-6 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between">
          <Link className="[font-family:var(--font-playfair)] text-[32px] font-semibold" href="/">
            <DoLegalWordmark />
          </Link>
          <ul className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex ${armenianSansClass}`}>
            {content.navigationLinks.map((link) => {
              const { href, label } = link;
              if (href.startsWith("#")) {
                if (isHome) {
                  return (
                    <li key={href}>
                      <a className={`${navLinkClass} ${armenianSansClass}`} href={href} onClick={handleAnchorClick(href)}>
                        {label}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={href}>
                    <Link className={`${navLinkClass} ${armenianSansClass}`} href={`/#${href.slice(1)}`}>
                      {label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={href}>
                  <Link className={`${navLinkClass} ${armenianSansClass}`} href={href}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2">
            <details className="group relative">
              <summary className="flex h-12 cursor-pointer list-none items-center gap-2 rounded-xl bg-transparent px-3 text-[14px] font-medium text-black/75">
                <Image
                  src={currentLanguage.flagSrc}
                  alt={`${currentLanguage.label} flag`}
                  width={24}
                  height={24}
                  sizes="24px"
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span>{currentLanguage.code}</span>
                <svg
                  className="size-4 text-black/45 transition group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[88px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    aria-label={option.label}
                    onClick={() => router.replace(pathname, { locale: option.locale })}
                    className={`flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm transition ${
                      option.locale === locale ? "bg-black/5 font-medium text-black" : "text-black/70 hover:bg-black/5"
                    }`}
                  >
                    <Image
                      src={option.flagSrc}
                      alt=""
                      width={24}
                      height={24}
                      sizes="24px"
                      className="h-6 w-6 rounded-full object-cover"
                      aria-hidden={true}
                    />
                    <span className="font-medium tabular-nums">{option.code}</span>
                  </button>
                ))}
              </div>
            </details>
            {isHome ? (
              <a
                href="#early-access"
                onClick={handleAnchorClick("#early-access")}
                className={`flex h-12 items-center rounded-xl bg-[#1d1d1f] px-5 text-[15px] text-white transition hover:bg-[#3a3a3c] ${
                  locale === "hy" ? `${armenianSansClass} font-semibold` : "font-medium"
                }`}
              >
                {content.hero.primaryCta}
              </a>
            ) : (
              <Link
                className={`flex h-12 items-center rounded-xl bg-[#1d1d1f] px-5 text-[15px] text-white transition hover:bg-[#3a3a3c] ${
                  locale === "hy" ? `${armenianSansClass} font-semibold` : "font-medium"
                }`}
                href="/#early-access"
              >
                {content.hero.primaryCta}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {children}

      <footer className="border-t border-white/15 bg-[#1d1d1f] px-5 pt-14 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 [font-family:var(--font-playfair)] text-2xl font-semibold">
              <DoLegalWordmark variant="dark" />
            </div>
            <p className="max-w-xs text-sm leading-7 text-white/65">{content.footer.description}</p>
          </div>
          {content.footer.columns.map((column) => (
            <FooterColumn key={column.title} title={column.title} links={column.links} />
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/15 py-4 text-xs text-white/45">
          <span>{content.footer.copyright}</span>
        </div>

        <div className="pb-8" />
      </footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] uppercase tracking-[0.1em] text-white/45">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-white/70 transition hover:text-white" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
