import type { AppLocale } from "@/i18n/routing";

export type LandingContent = {
  navigationLinks: Array<{ href: string; label: string }>;
  hero: {
    titleMain: string;
    titleFor: string;
    titleAudienceRotating: string[];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    onlineStatus: string;
    askPlaceholder: string;
    chat: {
      userQuestion1: string;
      assistantConclusionText: string;
      assistantConclusionTitle: string;
      assistantConclusionTags: string[];
      userQuestion2: string;
      assistantDraftTitle: string;
      assistantDraftText: string;
    };
  };
  heroStats: Array<{ value: string; label: string }>;
  problem: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    oldWayBadge: string;
    withLegisBadge: string;
    oldWayItems: string[];
    legisItems: string[];
  };
  features: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    cards: Array<{ number: string; title: string; description: string; items: string[] }>;
  };
  howItWorks: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    steps: Array<{ title: string; description: string }>;
  };
  personas: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    cards: Array<{ tag: string; title: string; description: string; wins: string[] }>;
  };
  pricing: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    mostPopular: string;
    needsMoreTokensTitle: string;
    needsMoreTokensDescription: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      featured: boolean;
      cta: string;
      features: Array<{ text: string; enabled: boolean }>;
    }>;
    topups: Array<{ tokens: string; price: string }>;
  };
  faq: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    descriptionPrefix: string;
    email: string;
    items: Array<{ question: string; answer: string }>;
  };
  earlyAccess: {
    sectionLabel: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    buttonLabel: string;
    submittingButtonLabel: string;
    submittingMessage: string;
    successMessage: string;
    duplicateMessage: string;
    errorMessage: string;
    footnote: string;
  };
  footer: {
    description: string;
    copyright: string;
    columns: Array<{ title: string; links: string[] }>;
  };
};

export const languageOptions: Array<{
  locale: AppLocale;
  code: "EN" | "RU" | "AM";
  label: string;
  flagSrc: string;
}> = [
  { locale: "en", code: "EN", label: "English", flagSrc: "/flags/en.svg" },
  { locale: "ru", code: "RU", label: "Русский", flagSrc: "/flags/ru.svg" },
  { locale: "am", code: "AM", label: "Հայերեն", flagSrc: "/flags/hy.svg" },
];

export const landingImages = {
  hero: {
    src: "/landing/hero-legal.jpg",
    alt: "Legal professional reviewing case files at a desk",
  },
  /** Photo: Supannee U-prapruit — unsplash.com/photos/glasses-and-pen-on-tax-form-and-laptop-hn6k00wZxr8 (Unsplash License) */
  feature: {
    src: "/landing/features-three-tools.jpg",
    alt: "Glasses and pen on tax paperwork beside an open laptop — professional compliance workspace",
  },
  personas: [
    {
      src: "/landing/consultation.jpg",
      alt: "Consultant discussing compliance requirements with a client",
    },
    {
      src: "/landing/persona-law-firm.jpg",
      alt: "Team of legal and accounting professionals in a collaborative meeting",
    },
    /** Photo: Priscilla Du Preez — unsplash.com/photos/two-people-sitting-at-a-table-with-laptops-nNMBa7Y1Ymk (Unsplash License) */
    {
      src: "/landing/persona-sme-founders.jpg",
      alt: "Two colleagues collaborating at a laptop in a bright, modern office",
    },
  ],
};
