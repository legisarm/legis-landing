import type { Metadata } from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {themeAttrsFromPathname} from "@/lib/theme-from-path";

export const metadata: Metadata = {
  title: "Legis — Legal AI-assistant for Armenia",
  description:
    "AI-powered legal research and drafting for Armenia. Grounded, cited, multilingual — built on official government legislation sources.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const pathname = (await headers()).get("x-pathname") ?? "";
  const themeAttrs = themeAttrsFromPathname(pathname);

  return (
    <html
      lang={locale}
      data-theme={themeAttrs.theme}
      data-display={themeAttrs.display}
      data-accent={themeAttrs.accent}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
