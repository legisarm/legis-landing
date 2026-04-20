"use client";

import Image from "next/image";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
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
  "text-[14px] font-medium uppercase tracking-[0.12em] text-slate-300 transition-colors hover:text-white";

export function MarketingShell({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const content = t.raw("landing") as LandingContent;
  const currentLanguage = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0];
  const isHome = pathname === "/";
  const languageDropdownRef = useRef<HTMLDetailsElement | null>(null);
  const playfairOverrideStyle =
    locale === "hy" ? ({ "--font-playfair": "var(--font-noto-serif-armenian)" } as CSSProperties) : undefined;
  const armenianSansClass = locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : "";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | globalThis.MouseEvent) => {
      const dropdown = languageDropdownRef.current;
      if (!dropdown || !dropdown.open) return;
      const target = event.target as Node | null;
      if (target && !dropdown.contains(target)) {
        dropdown.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handlePointerDown as EventListener);
    document.addEventListener("touchstart", handlePointerDown as EventListener);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown as EventListener);
      document.removeEventListener("touchstart", handlePointerDown as EventListener);
    };
  }, []);

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
      className={`${outfit.variable} ${playfair.variable} ${notoSerifArmenian.variable} ${notoSansArmenian.variable} bg-white text-slate-900 ${
        locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : ""
      }`}
      style={playfairOverrideStyle}
    >
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/80 bg-slate-950/90 px-6 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between">
          <Link className="[font-family:var(--font-playfair)] text-[32px] font-semibold text-white" href="/">
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
            <details className="group relative" ref={languageDropdownRef}>
              <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-transparent bg-transparent px-3 text-[14px] font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900">
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
                  className="size-4 text-slate-400 transition group-open:rotate-180"
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
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[88px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-[0_12px_24px_rgba(2,6,23,0.45)]">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    aria-label={option.label}
                    onClick={() => router.replace(pathname, { locale: option.locale })}
                    className={`flex w-full items-center justify-center gap-2 px-3 py-2.5 text-sm transition ${
                      option.locale === locale ? "bg-slate-800 font-medium text-white" : "text-slate-200 hover:bg-slate-800"
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
                className={`inline-flex h-10 items-center rounded-lg border border-white bg-white px-4 text-[14px] text-slate-950 transition hover:bg-slate-200 ${
                  locale === "hy" ? `${armenianSansClass} font-semibold` : "font-medium"
                }`}
              >
                {content.hero.primaryCta}
              </a>
            ) : (
              <Link
                className={`inline-flex h-10 items-center rounded-lg border border-white bg-white px-4 text-[14px] text-slate-950 transition hover:bg-slate-200 ${
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

      <footer className="border-t border-slate-200 bg-[#f8fafc] px-5 pt-14 text-slate-900 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 [font-family:var(--font-playfair)] text-2xl font-semibold">
              <DoLegalWordmark variant="dark" />
            </div>
            <p className="max-w-xs text-sm leading-7 text-slate-600">{content.footer.description}</p>
          </div>
          {content.footer.columns.map((column) => (
            <FooterColumn key={column.title} title={column.title} links={column.links} />
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-4 text-xs text-slate-500">
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
      <h3 className="mb-4 text-[11px] uppercase tracking-[0.1em] text-slate-500">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-slate-700 transition hover:text-slate-900" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
