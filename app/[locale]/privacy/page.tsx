import type { Metadata } from "next";
import {getTranslations} from "next-intl/server";
import { Footer } from "../../_components/Footer";
import { Masthead } from "../../_components/Masthead";
import { brandText } from "@/lib/brand-text";

type SupportedLocale = "en" | "ru" | "am";

type PrivacyCopy = {
  title: string;
  updated: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

const COPY: Record<SupportedLocale, PrivacyCopy> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 22, 2026.",
    sections: [
      {
        heading: "1. Controller",
        paragraphs: [
          "doLegal is operated by [LEGAL ENTITY NAME], registered in the Republic of Armenia, with registered address at [REGISTERED ADDRESS]. Contact: hello@dolegal.am.",
        ],
      },
      {
        heading: "2. Data we collect",
        bullets: [
          "Waitlist data: email address submitted via the early-access form.",
          "Essential technical data: request metadata and server logs for security and abuse prevention.",
          "Language preference data: locale cookie used to remember selected language.",
          "Payment data (when paid plans launch): processed by Paddle as merchant of record.",
        ],
      },
      {
        heading: "3. How we use data",
        bullets: [
          "Manage early-access signups and invitation communications.",
          "Operate, secure, and improve the website and service.",
          "Comply with legal obligations and resolve abuse, fraud, or disputes.",
          "Process payments, subscriptions, taxes, and refunds through Paddle.",
        ],
      },
      {
        heading: "4. Legal bases",
        paragraphs: [
          "Depending on applicable law, legal bases include consent, contract performance, legitimate interests, and legal obligations.",
        ],
      },
      {
        heading: "5. Processors and disclosures",
        paragraphs: [
          "We use trusted processors including Resend (waitlist contact storage/communication) and Paddle (checkout, billing, tax, invoicing, and related fraud checks).",
          "We may disclose data where required by law or to protect legal rights.",
        ],
      },
      {
        heading: "6. International transfers",
        paragraphs: [
          "Some processors may process data outside Armenia. Where required, we apply appropriate transfer safeguards.",
        ],
      },
      {
        heading: "7. Retention",
        paragraphs: [
          "We retain personal data only as long as needed for the purposes in this Policy, including legal, tax, accounting, and dispute-resolution requirements.",
        ],
      },
      {
        heading: "8. Security",
        paragraphs: [
          "We apply reasonable technical and organizational security measures. No system can guarantee absolute security.",
        ],
      },
      {
        heading: "9. Your rights",
        paragraphs: [
          "Subject to applicable law, you may request access, correction, deletion, restriction, objection, or data portability by contacting hello@dolegal.am.",
        ],
      },
      {
        heading: "10. Children",
        paragraphs: [
          "doLegal is not intended for children, and we do not knowingly collect personal data from children where prohibited by law.",
        ],
      },
      {
        heading: "11. Changes to this Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated date.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: 22 апреля 2026 г.",
    sections: [
      {
        heading: "1. Оператор персональных данных",
        paragraphs: [
          "doLegal управляется [LEGAL ENTITY NAME], зарегистрированной в Республике Армения по адресу [REGISTERED ADDRESS]. Контакт: hello@dolegal.am.",
        ],
      },
      {
        heading: "2. Какие данные мы собираем",
        bullets: [
          "Данные листа ожидания: email, отправленный через форму раннего доступа.",
          "Обязательные технические данные: метаданные запросов и серверные логи для безопасности и предотвращения злоупотреблений.",
          "Данные языковых предпочтений: cookie локали для запоминания выбранного языка.",
          "Платежные данные (после запуска платных тарифов): обрабатываются Paddle как merchant of record.",
        ],
      },
      {
        heading: "3. Как мы используем данные",
        bullets: [
          "Управление заявками на ранний доступ и приглашениями.",
          "Работа, защита и улучшение сайта и сервиса.",
          "Выполнение юридических обязанностей и разрешение злоупотреблений, мошенничества и споров.",
          "Обработка платежей, подписок, налогов и возвратов через Paddle.",
        ],
      },
      {
        heading: "4. Правовые основания",
        paragraphs: [
          "В зависимости от применимого права основаниями могут быть согласие, исполнение договора, законные интересы и юридические обязанности.",
        ],
      },
      {
        heading: "5. Обработчики и раскрытие данных",
        paragraphs: [
          "Мы используем доверенных обработчиков, включая Resend (хранение/коммуникация листа ожидания) и Paddle (checkout, биллинг, налоги, инвойсы и связанные проверки мошенничества).",
          "Мы можем раскрывать данные, если это требуется законом или для защиты наших законных прав.",
        ],
      },
      {
        heading: "6. Трансграничная передача",
        paragraphs: [
          "Некоторые обработчики могут обрабатывать данные за пределами Армении. При необходимости применяются соответствующие гарантии передачи.",
        ],
      },
      {
        heading: "7. Срок хранения",
        paragraphs: [
          "Мы храним персональные данные только столько, сколько необходимо для целей этой Политики, включая требования законодательства, налогового и бухгалтерского учета, а также разрешения споров.",
        ],
      },
      {
        heading: "8. Безопасность",
        paragraphs: [
          "Мы применяем разумные технические и организационные меры безопасности. Ни одна система не гарантирует абсолютную защиту.",
        ],
      },
      {
        heading: "9. Ваши права",
        paragraphs: [
          "С учетом применимого права вы можете запросить доступ, исправление, удаление, ограничение, возражение или переносимость данных по адресу hello@dolegal.am.",
        ],
      },
      {
        heading: "10. Дети",
        paragraphs: [
          "doLegal не предназначен для детей, и мы не собираем сознательно персональные данные детей там, где это запрещено законом.",
        ],
      },
      {
        heading: "11. Изменения Политики",
        paragraphs: [
          "Мы можем периодически обновлять эту Политику конфиденциальности. Существенные изменения публикуются на этой странице с новой датой обновления.",
        ],
      },
    ],
  },
  am: {
    title: "Գաղտնիության քաղաքականություն",
    updated: "Վերջին թարմացում՝ 22 ապրիլի, 2026 թ.",
    sections: [
      {
        heading: "1. Տվյալների վերահսկող",
        paragraphs: [
          "doLegal-ը կառավարվում է [LEGAL ENTITY NAME]-ի կողմից, որը գրանցված է Հայաստանի Հանրապետությունում՝ [REGISTERED ADDRESS] հասցեում։ Կապ՝ hello@dolegal.am։",
        ],
      },
      {
        heading: "2. Ինչ տվյալներ ենք հավաքում",
        bullets: [
          "Սպասման ցուցակի տվյալներ՝ վաղ հասանելիության ձևով ուղարկված էլ. հասցե։",
          "Անհրաժեշտ տեխնիկական տվյալներ՝ հարցումների մետատվյալներ և սերվերի լոգեր՝ անվտանգության և չարաշահման կանխման նպատակով։",
          "Լեզվական նախընտրության տվյալներ՝ locale cookie՝ ընտրված լեզուն հիշելու համար։",
          "Վճարումների տվյալներ (վճարովի փաթեթների մեկնարկից հետո)՝ մշակվում են Paddle-ի կողմից որպես merchant of record։",
        ],
      },
      {
        heading: "3. Ինչպես ենք օգտագործում տվյալները",
        bullets: [
          "Կառավարել վաղ հասանելիության հայտերը և հրավիրատոմսերը։",
          "Ապահովել, պաշտպանել և բարելավել կայքն ու ծառայությունը։",
          "Կատարել իրավական պարտավորությունները և լուծել չարաշահումները, խարդախությունները ու վեճերը։",
          "Մշակել վճարումները, բաժանորդագրությունները, հարկերը և վերադարձները Paddle-ի միջոցով։",
        ],
      },
      {
        heading: "4. Իրավական հիմքեր",
        paragraphs: [
          "Կիրառելի իրավունքի հիման վրա մշակման իրավական հիմքերը կարող են ներառել համաձայնություն, պայմանագրի կատարում, օրինական շահ և իրավական պարտավորություն։",
        ],
      },
      {
        heading: "5. Մշակողներ և բացահայտումներ",
        paragraphs: [
          "Մենք օգտագործում ենք վստահելի մշակողներ, ներառյալ Resend-ը (սպասման ցուցակի պահպանում/հաղորդակցություն) և Paddle-ը (checkout, բիլինգ, հարկեր, հաշիվներ և հարակից հակախարդախ ստուգումներ)։",
          "Մենք կարող ենք բացահայտել տվյալներ, եթե դա պահանջվում է օրենքով կամ անհրաժեշտ է մեր իրավական իրավունքների պաշտպանության համար։",
        ],
      },
      {
        heading: "6. Միջազգային փոխանցումներ",
        paragraphs: [
          "Որոշ մշակողներ կարող են տվյալները մշակել Հայաստանից դուրս։ Անհրաժեշտության դեպքում կիրառվում են համապատասխան փոխանցման երաշխիքներ։",
        ],
      },
      {
        heading: "7. Պահպանման ժամկետ",
        paragraphs: [
          "Մենք անձնական տվյալները պահպանում ենք միայն այնքան, որքան անհրաժեշտ է այս քաղաքականության նպատակների համար՝ ներառյալ իրավական, հարկային, հաշվապահական և վեճերի լուծման պահանջները։",
        ],
      },
      {
        heading: "8. Անվտանգություն",
        paragraphs: [
          "Մենք կիրառում ենք ողջամիտ տեխնիկական և կազմակերպական անվտանգության միջոցներ։ Ոչ մի համակարգ չի կարող երաշխավորել բացարձակ անվտանգություն։",
        ],
      },
      {
        heading: "9. Ձեր իրավունքները",
        paragraphs: [
          "Կիրառելի օրենքով նախատեսված դեպքերում դուք կարող եք պահանջել հասանելիություն, ուղղում, ջնջում, սահմանափակում, առարկություն կամ տվյալների տեղափոխելիություն՝ hello@dolegal.am հասցեով։",
        ],
      },
      {
        heading: "10. Երեխաներ",
        paragraphs: [
          "doLegal-ը նախատեսված չէ երեխաների համար, և մենք գիտակցաբար չենք հավաքում երեխաների անձնական տվյալներ, եթե դա արգելված է օրենքով։",
        ],
      },
      {
        heading: "11. Քաղաքականության փոփոխություններ",
        paragraphs: [
          "Մենք կարող ենք ժամանակ առ ժամանակ թարմացնել այս Գաղտնիության քաղաքականությունը։ Էական փոփոխությունները կհրապարակվեն այս էջում՝ թարմացված ամսաթվով։",
        ],
      },
    ],
  },
};

const PRIVACY_DESCRIPTIONS: Record<SupportedLocale, string> = {
  en: "Review how doLegal collects, uses, stores, and protects personal data for waitlist, product usage, and billing operations.",
  ru: "Узнайте, как doLegal собирает, использует, хранит и защищает персональные данные для листа ожидания, работы продукта и оплаты.",
  am: "Ծանոթացեք, թե ինչպես է doLegal-ը հավաքում, օգտագործում, պահպանում և պաշտպանում անձնական տվյալները՝ սպասման ցուցակի, ծառայության և վճարումների համար։",
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const {locale} = await params;
  const key = (locale as SupportedLocale) || "en";
  const copy = COPY[key] ?? COPY.en;

  return {
    title: `${copy.title} | doLegal`,
    description: PRIVACY_DESCRIPTIONS[key] ?? PRIVACY_DESCRIPTIONS.en,
  };
}

export default async function LocalizedPrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const tNav = await getTranslations("nav");
  const nav = [
    { href: "/#features", label: tNav("features") },
    { href: "/#how", label: tNav("howItWorks") },
    { href: "/#who", label: tNav("audience") },
    { href: "/pricing", label: tNav("pricing") },
    { href: "/#faq", label: tNav("faq") },
  ];

  const {locale} = await params;
  const copy = COPY[(locale as SupportedLocale) || "en"] ?? COPY.en;

  return (
    <>
      <Masthead nav={nav} />
      <main className="section policy-legal">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p className="section-label">Legal</p>
          <h1 className="section-title">{copy.title}</h1>
          <p className="section-sub" style={{ fontWeight: 700 }}>{copy.updated}</p>

          {copy.sections.map((section) => (
            <section key={section.heading} style={{ marginTop: 24 }}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{brandText(paragraph)}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{brandText(bullet)}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
