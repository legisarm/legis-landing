import type { Metadata } from "next";
import {hasLocale} from "next-intl";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages, setRequestLocale} from "next-intl/server";
import {cookies} from "next/headers";
import {routing} from "@/i18n/routing";
import "./globals.css";

export const metadata: Metadata = {
  title: "doLegal — Legal AI-assistant for Armenia",
  description:
    "AI-powered legal research and drafting for Armenia. Grounded, cited, multilingual — built on official government legislation sources.",
};

// Inline script runs before hydration. Applies default theme data-attrs per route,
// so SSR is pixel-perfect from first paint (no FOUC).
const themeInitScript = `
(function () {
  try {
    var p = window.location.pathname || "/";
    var theme = "dark", display = "sans", accent = "cobalt";
    if (p.indexOf("/product") === 0) { theme = "light"; accent = "oxblood"; display = "sans"; }
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.display = display;
    root.dataset.accent = accent;
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const requestLocale = hasLocale(routing.locales, cookieLocale)
    ? cookieLocale
    : routing.defaultLocale;
  setRequestLocale(requestLocale);

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme="dark"
      data-display="sans"
      data-accent="cobalt"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
