"use client";

import { useEffect, useRef, useState } from "react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";

const LANGS = ["en", "ru", "am"] as const;
type Lang = (typeof LANGS)[number];

export function LanguageSwitcher() {
  const locale = useLocale() as Lang;
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`lang${open ? " open" : ""}`}
      role="group"
      aria-label={t("ariaLabel")}
    >
      <button
        type="button"
        className="lang-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {locale.toUpperCase()}
      </button>
      <div className="lang-menu" role="listbox">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            className={locale === l ? "active" : ""}
            onClick={() => {
              setOpen(false);
              document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
              router.replace(pathname, {locale: l});
              router.refresh();
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
