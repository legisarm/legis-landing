import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "hy"],
  defaultLocale: "hy",
});

export type AppLocale = (typeof routing.locales)[number];
