import type { Metadata } from "next";
import MarketingHomePage from "../(marketing)/page";
import { Footer } from "../_components/Footer";

type SupportedLocale = "en" | "ru" | "am";

const HOME_META: Record<SupportedLocale, Metadata> = {
  en: {
    title: "doLegal | Armenian Legal AI Research and Drafting Platform",
    description:
      "doLegal helps lawyers, accountants, and founders in Armenia research laws, draft legal documents, and verify citations across Armenian, Russian, and English.",
  },
  ru: {
    title: "doLegal | AI-платформа для юридических исследований в Армении",
    description:
      "doLegal помогает юристам, бухгалтерам и основателям в Армении исследовать законодательство, готовить документы и проверять ссылки на нормы права.",
  },
  am: {
    title: "doLegal | Իրավական AI հարթակ Հայաստանի համար",
    description:
      "doLegal-ը օգնում է իրավաբաններին, հաշվապահներին և հիմնադիրներին ուսումնասիրել ՀՀ օրենսդրությունը, կազմել փաստաթղթեր և ստուգել իրավական հղումները։",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const {locale} = await params;
  return HOME_META[(locale as SupportedLocale) || "en"] ?? HOME_META.en;
}

export default function LocalizedHomePage() {
  return (
    <>
      <MarketingHomePage />
      <Footer />
    </>
  );
}
