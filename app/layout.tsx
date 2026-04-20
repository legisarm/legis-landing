import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const weblySans = localFont({
  variable: "--font-webly-sans",
  display: "swap",
  src: [
    {
      path: "../public/fonts/webly/weblysleek-light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/webly/weblysleek-light-italic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/webly/weblysleek-semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/webly/weblysleek-semibold-italic.woff",
      weight: "600",
      style: "italic",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoLegal - AI Legal Assistant for Armenia",
  description:
    "AI-powered legal research, drafting, and advisory assistant for Armenian law professionals and founders.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${weblySans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
