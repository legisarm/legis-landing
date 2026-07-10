"use client";

import {useEffect, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandLogo } from "./BrandLogo";

type NavItem = { href: string; label: string; active?: boolean };

interface MastheadProps {
  nav: NavItem[];
  ctaHref?: string;
}

export function Masthead({ nav, ctaHref = "/#waitlist" }: MastheadProps) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const sectionIds = useMemo(
    () =>
      nav
        .map((item) => item.href.split("#")[1] ?? null)
        .filter((id): id is string => Boolean(id)),
    [nav],
  );

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-120px 0px -45% 0px",
        threshold: [0.2, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  const smoothScrollTo = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + startY - 90;
    const distance = targetY - startY;
    const duration = 700;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    setActiveSectionId(targetId);
  };

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || !rawHref.includes("#")) return;

      const url = new URL(rawHref, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const targetId = url.hash.replace("#", "");
      if (!targetId) return;

      event.preventDefault();
      smoothScrollTo(targetId);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
          <Link href="/" className="brand" aria-label="Legis">
            <BrandLogo />
          </Link>
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="site-nav" className={`topnav ${menuOpen ? "open" : ""}`}>
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active || item.href.split("#")[1] === activeSectionId ? "active" : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link className="btn-primary" href={ctaHref} onClick={() => setMenuOpen(false)}>
            {t("earlyAccess")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
