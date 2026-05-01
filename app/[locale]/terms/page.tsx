import type { Metadata } from "next";
import {getTranslations} from "next-intl/server";
import { Footer } from "../../_components/Footer";
import { Masthead } from "../../_components/Masthead";
import { brandText } from "@/lib/brand-text";

type SupportedLocale = "en" | "ru" | "am";

type TermsCopy = {
  title: string;
  updated: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

const COPY: Record<SupportedLocale, TermsCopy> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: April 22, 2026.",
    sections: [
      {
        heading: "1. Operator and acceptance",
        paragraphs: [
          "These Terms are between you and [LEGAL ENTITY NAME] (doLegal, we, us, our), a company registered in the Republic of Armenia, with registered address at [REGISTERED ADDRESS].",
          "By accessing or using doLegal, you agree to these Terms. If you use doLegal on behalf of an organization, you confirm you have authority to bind that organization.",
        ],
      },
      {
        heading: "2. Service description",
        paragraphs: [
          "doLegal is a subscription-based software service for Armenian legal and tax research, document drafting, and related productivity workflows.",
          "doLegal is an information and drafting tool, not a law firm and not a substitute for professional legal advice.",
        ],
      },
      {
        heading: "3. Accounts and eligibility",
        paragraphs: [
          "You must provide accurate account information and keep credentials secure. You are responsible for activity under your account.",
        ],
      },
      {
        heading: "4. Plans, billing, and taxes",
        paragraphs: [
          "Paid access is offered on recurring subscription plans and optional top-ups as shown on the pricing page.",
          "We use Paddle as merchant of record for checkout, payment processing, tax handling, and invoicing.",
          "Certain features are metered in tokens. A token is a unit of AI processing — roughly 0.75 words of typical text. Your subscription refreshes a fixed token allowance each billing cycle; optional top-ups increase your balance without changing your plan tier.",
          "Illustrative token ranges for typical doLegal workflows (non-binding estimates; actual usage depends on prompts, attachments, and model behavior):",
        ],
        bullets: [
          "Short legal question and concise answer (e.g. when VAT registration is mandatory): approximately 500–1,500 tokens.",
          "Longer answer with extensive citations (e.g. tax filing calendar, cross-referenced): approximately 2,000–4,000 tokens.",
          "Contract draft from a prompt (NDA, employment, service agreement): approximately 6,000–12,000 tokens.",
          "Document comparison from two PDF uploads, with redline and article mapping: approximately 10,000–20,000 tokens.",
          "Full case-style review (uploaded judgment plus a thread of about 5–10 questions): approximately 15,000–35,000 tokens.",
        ],
      },
      {
        heading: "5. Renewals, changes, and cancellation",
        paragraphs: [
          "Subscriptions renew automatically unless canceled before renewal. Upgrades and downgrades are applied as described at checkout.",
        ],
      },
      {
        heading: "6. Refunds",
        paragraphs: [
          "Refund eligibility is governed by our Refund Policy at /refund-policy, which forms part of these Terms.",
        ],
      },
      {
        heading: "7. Acceptable use",
        bullets: [
          "Do not use the service for unlawful, fraudulent, or abusive purposes.",
          "Do not reverse engineer, copy, or resell the service except as permitted.",
          "Do not upload content you do not have rights to process.",
          "Do not interfere with platform security, availability, or other users.",
        ],
      },
      {
        heading: "8. Customer content and AI output",
        paragraphs: [
          "You retain rights to content you submit and grant us a limited license to process that content to provide the service.",
          "AI outputs may contain errors. You are responsible for verification before relying on outputs.",
        ],
      },
      {
        heading: "9. Intellectual property",
        paragraphs: [
          "doLegal software, branding, and platform content (excluding your submitted content and public legal texts) are owned by us or our licensors.",
        ],
      },
      {
        heading: "10. Availability and changes",
        paragraphs: [
          "We may update features, pricing, or service components. We do not guarantee uninterrupted or error-free availability.",
        ],
      },
      {
        heading: "11. Disclaimers",
        paragraphs: [
          "The service is provided on an as-is and as-available basis to the fullest extent permitted by law.",
        ],
      },
      {
        heading: "12. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, we are not liable for indirect or consequential damages. Our aggregate liability is limited to amounts paid by you in the 12 months before the claim.",
        ],
      },
      {
        heading: "13. Indemnification",
        paragraphs: [
          "You agree to indemnify and hold harmless doLegal from claims arising out of your use of the service, your content, or your breach of these Terms.",
        ],
      },
      {
        heading: "14. Governing law and disputes",
        paragraphs: [
          "These Terms are governed by the laws of the Republic of Armenia. Courts located in the Republic of Armenia have exclusive jurisdiction unless mandatory law requires otherwise.",
        ],
      },
      {
        heading: "15. Contact",
        paragraphs: [
          "For legal notices or Terms-related questions, contact hello@dolegal.am.",
        ],
      },
    ],
  },
  ru: {
    title: "Условия использования",
    updated: "Последнее обновление: 22 апреля 2026 г.",
    sections: [
      {
        heading: "1. Оператор и принятие условий",
        paragraphs: [
          "Настоящие Условия заключаются между вами и [LEGAL ENTITY NAME] (doLegal, мы, нас, наш), компанией, зарегистрированной в Республике Армения, по адресу [REGISTERED ADDRESS].",
          "Используя doLegal, вы соглашаетесь с этими Условиями. Если вы используете сервис от имени организации, вы подтверждаете полномочия связывать эту организацию данными Условиями.",
        ],
      },
      {
        heading: "2. Описание сервиса",
        paragraphs: [
          "doLegal — это подписочный программный сервис для юридических и налоговых исследований по Армении, подготовки документов и связанных рабочих процессов.",
          "doLegal — информационный и драфтинг-инструмент, не юридическая фирма и не замена профессиональной юридической консультации.",
        ],
      },
      {
        heading: "3. Аккаунты и право использования",
        paragraphs: [
          "Вы обязаны предоставлять точные данные аккаунта и хранить учетные данные в безопасности. Вы несете ответственность за действия в вашем аккаунте.",
        ],
      },
      {
        heading: "4. Тарифы, оплата и налоги",
        paragraphs: [
          "Платный доступ предоставляется по подписке и через дополнительные топ-апы, указанные на странице тарифов.",
          "Мы используем Paddle как merchant of record для checkout, обработки платежей, налогов и выставления счетов.",
          "Учёт использования части функций ведётся в токенах. Токен — единица AI-обработки, примерно 0,75 слова типичного текста. Подписка обновляет фиксированный пакет токенов каждый расчётный период; дополнительные топ-апы увеличивают баланс без смены уровня тарифа.",
          "Ориентировочные диапазоны для типовых сценариев doLegal (примерные значения; фактическое потребление зависит от запросов, вложений и поведения модели):",
        ],
        bullets: [
          "Короткий юридический вопрос и краткий ответ (например, когда обязательна регистрация НДС): примерно 500–1 500 токенов.",
          "Развёрнутый ответ с обширными ссылками (например, налоговый календарь с перекрёстными ссылками): примерно 2 000–4 000 токенов.",
          "Черновик договора по промпту (NDA, трудовой, сервисный): примерно 6 000–12 000 токенов.",
          "Сравнение документов по двум PDF с редлайном и привязкой к статьям: примерно 10 000–20 000 токенов.",
          "Полный разбор кейса (загруженный судебный акт и тред из примерно 5–10 вопросов): примерно 15 000–35 000 токенов.",
        ],
      },
      {
        heading: "5. Продление, изменения и отмена",
        paragraphs: [
          "Подписка продлевается автоматически, если не отменена до даты продления. Применение апгрейдов и даунгрейдов определяется условиями checkout.",
        ],
      },
      {
        heading: "6. Возвраты",
        paragraphs: [
          "Условия возврата регулируются нашей Политикой возврата по адресу /refund-policy, которая является частью этих Условий.",
        ],
      },
      {
        heading: "7. Допустимое использование",
        bullets: [
          "Запрещено использовать сервис в незаконных, мошеннических или злоупотребляющих целях.",
          "Запрещено реверс-инжинирить, копировать или перепродавать сервис, кроме прямо разрешенных случаев.",
          "Запрещено загружать контент, на обработку которого у вас нет прав.",
          "Запрещено нарушать безопасность, доступность платформы или работу других пользователей.",
        ],
      },
      {
        heading: "8. Контент пользователя и результаты ИИ",
        paragraphs: [
          "Вы сохраняете права на загружаемый контент и предоставляете нам ограниченную лицензию на его обработку для оказания сервиса.",
          "Результаты ИИ могут содержать ошибки. Вы обязаны проверять результаты до их использования.",
        ],
      },
      {
        heading: "9. Интеллектуальная собственность",
        paragraphs: [
          "Программное обеспечение doLegal, бренд и контент платформы (кроме вашего контента и публичных юридических текстов) принадлежат нам или нашим лицензиарам.",
        ],
      },
      {
        heading: "10. Доступность и изменения",
        paragraphs: [
          "Мы можем изменять функции, цены и компоненты сервиса. Мы не гарантируем непрерывную и безошибочную работу.",
        ],
      },
      {
        heading: "11. Отказ от гарантий",
        paragraphs: [
          "Сервис предоставляется по принципу «как есть» и «по мере доступности» в максимально допустимой законом степени.",
        ],
      },
      {
        heading: "12. Ограничение ответственности",
        paragraphs: [
          "В максимально допустимой законом степени мы не несем ответственности за косвенные и последующие убытки. Наша совокупная ответственность ограничена суммой, уплаченной вами за 12 месяцев до предъявления требования.",
        ],
      },
      {
        heading: "13. Возмещение убытков",
        paragraphs: [
          "Вы соглашаетесь возместить убытки и освободить doLegal от претензий, возникших из-за вашего использования сервиса, вашего контента или нарушения этих Условий.",
        ],
      },
      {
        heading: "14. Применимое право и споры",
        paragraphs: [
          "Настоящие Условия регулируются законодательством Республики Армения. Исключительная подсудность принадлежит судам Республики Армения, если иное не требуется императивным правом.",
        ],
      },
      {
        heading: "15. Контакты",
        paragraphs: [
          "По юридическим вопросам и вопросам по Условиям: hello@dolegal.am.",
        ],
      },
    ],
  },
  am: {
    title: "Օգտագործման պայմաններ",
    updated: "Վերջին թարմացում՝ 22 ապրիլի, 2026 թ.",
    sections: [
      {
        heading: "1. Օպերատոր և պայմանների ընդունում",
        paragraphs: [
          "Սույն պայմանները կնքվում են ձեր և [LEGAL ENTITY NAME]-ի (doLegal, մենք, մեզ, մեր) միջև, որը գրանցված է Հայաստանի Հանրապետությունում՝ [REGISTERED ADDRESS] հասցեում։",
          "doLegal-ից օգտվելով՝ դուք համաձայնում եք սույն պայմաններին։ Եթե ծառայությունից օգտվում եք կազմակերպության անունից, հաստատում եք, որ լիազորված եք պարտավորեցնել այդ կազմակերպությանը։",
        ],
      },
      {
        heading: "2. Ծառայության նկարագրություն",
        paragraphs: [
          "doLegal-ը բաժանորդագրության հիմքով ծրագրային ծառայություն է՝ ՀՀ իրավական և հարկային հետազոտության, փաստաթղթերի նախագծման և հարակից աշխատանքային հոսքերի համար։",
          "doLegal-ը տեղեկատվական և նախագծման գործիք է, ոչ իրավաբանական ընկերություն, և չի փոխարինում մասնագիտական իրավաբանական խորհրդատվությանը։",
        ],
      },
      {
        heading: "3. Հաշիվներ և իրավասություն",
        paragraphs: [
          "Դուք պարտավոր եք տրամադրել ճշգրիտ տվյալներ և պահպանել մուտքանուն/գաղտնաբառի անվտանգությունը։ Ձեր հաշվով կատարվող գործողությունների համար պատասխանատու եք դուք։",
        ],
      },
      {
        heading: "4. Սակագներ, վճարումներ և հարկեր",
        paragraphs: [
          "Վճարովի մուտքը տրամադրվում է պարբերական բաժանորդագրությամբ և լրացուցիչ top-up-երով՝ ըստ գնացուցակի էջի։",
          "Մենք օգտագործում ենք Paddle-ը որպես merchant of record checkout-ի, վճարումների, հարկերի և հաշիվների մշակման համար։",
          "Որոշ գործառույթների օգտագործումը հաշվարկվում է թոքեններով։ Թոքենը AI մշակման միավոր է՝ մոտավորապես 0.75 բառ տիպիկ տեքստում։ Բաժանորդագրությունը յուրաքանչյուր վճարման ցիկլում թարմացնում է թոքենների սահմանաչափը, իսկ լրացուցիչ լիցքավորումները մեծացնում են մնացորդը՝ առանց փաթեթի մակարդակը փոխելու։",
          "doLegal-ում տիպիկ աշխատանքների թոքենների կողմնորոշչական միջակայքեր (չեն կարող համարվել պարտավորեցնող, փաստացի սպառումը կախված է հարցումներից, կցված ֆայլերից և մոդելի վարքից)՝",
        ],
        bullets: [
          "Կարճ իրավական հարց և կարճ պատասխան (օր. երբ ԱԱՀ գրանցումը պարտադիր է)՝ մոտավորապես 500–1,500 թոքեն։",
          "Ավելի երկար պատասխան՝ լայն հղումներով (օր. հարկային օրացույց՝ խաչաձև հղումներ)՝ մոտավորապես 2,000–4,000 թոքեն։",
          "Պայմանագրի սևագիր prompt-ով (NDA, աշխատանքային, ծառայությունների)՝ մոտավորապես 6,000–12,000 թոքեն։",
          "Փաստաթղթերի համեմատում՝ երկու PDF, redline և հոդվածների համապատասխանեցում՝ մոտավորապես 10,000–20,000 թոքեն։",
          "Գործի ամբողջական վերանայում (վճիռ + մոտ 5–10 հարցի թրեդ)՝ մոտավորապես 15,000–35,000 թոքեն։",
        ],
      },
      {
        heading: "5. Թարմացումներ, փոփոխություններ և դադարեցում",
        paragraphs: [
          "Բաժանորդագրությունները ավտոմատ թարմացվում են, եթե մինչև թարմացման օրը չեք դադարեցրել։ Թարմացման և իջեցման կարգը սահմանվում է checkout-ում։",
        ],
      },
      {
        heading: "6. Վերադարձներ",
        paragraphs: [
          "Վերադարձների իրավասությունը կարգավորվում է մեր Վերադարձի քաղաքականությամբ՝ /refund-policy հասցեում, որը սույն պայմանների անբաժանելի մասն է։",
        ],
      },
      {
        heading: "7. Թույլատրելի օգտագործում",
        bullets: [
          "Արգելվում է ծառայության օգտագործումը ապօրինի, խարդախ կամ չարաշահող նպատակներով։",
          "Արգելվում է reverse engineer անել, պատճենել կամ վերավաճառել ծառայությունը՝ բացի թույլատրված դեպքերից։",
          "Արգելվում է վերբեռնել բովանդակություն, որի մշակման իրավունքը չունեք։",
          "Արգելվում է խաթարել հարթակի անվտանգությունը, հասանելիությունը կամ այլ օգտատերերի աշխատանքը։",
        ],
      },
      {
        heading: "8. Օգտատիրոջ բովանդակություն և AI արդյունքներ",
        paragraphs: [
          "Դուք պահպանում եք ձեր ներկայացրած բովանդակության իրավունքները և մեզ տրամադրում եք սահմանափակ լիցենզիա՝ ծառայությունը մատուցելու նպատակով մշակման համար։",
          "AI արդյունքները կարող են սխալներ պարունակել։ Արդյունքներին հենվելուց առաջ պարտավոր եք դրանք ստուգել։",
        ],
      },
      {
        heading: "9. Մտավոր սեփականություն",
        paragraphs: [
          "doLegal ծրագրային ապահովումը, բրենդը և հարթակի բովանդակությունը (բացառությամբ ձեր բովանդակության և հանրային իրավական տեքստերի) պատկանում են մեզ կամ մեր լիցենզավորողներին։",
        ],
      },
      {
        heading: "10. Հասանելիություն և փոփոխություններ",
        paragraphs: [
          "Մենք կարող ենք փոխել ֆունկցիաները, գները կամ ծառայության բաղադրիչները։ Մենք չենք երաշխավորում անխափան կամ անսխալ հասանելիություն։",
        ],
      },
      {
        heading: "11. Պատասխանատվության սահմանափակման դրույթներ",
        paragraphs: [
          "Ծառայությունը տրամադրվում է «ինչպես կա» և «ըստ հասանելիության» սկզբունքով՝ օրենքով թույլատրելի առավելագույն չափով։",
        ],
      },
      {
        heading: "12. Պատասխանատվության սահմանափակում",
        paragraphs: [
          "Օրենքով թույլատրելի առավելագույն չափով մենք պատասխանատվություն չենք կրում անուղղակի կամ հետևանքային վնասների համար։ Մեր ընդհանուր պատասխանատվությունը սահմանափակվում է պահանջից առաջ 12 ամսվա ընթացքում ձեր կողմից վճարված գումարով։",
        ],
      },
      {
        heading: "13. Փոխհատուցում",
        paragraphs: [
          "Դուք համաձայնում եք պաշտպանել և փոխհատուցել doLegal-ին՝ ձեր օգտագործման, ձեր բովանդակության կամ սույն պայմանների խախտման արդյունքում առաջացած պահանջների դեպքում։",
        ],
      },
      {
        heading: "14. Կիրառելի իրավունք և վեճեր",
        paragraphs: [
          "Սույն պայմանները կարգավորվում են Հայաստանի Հանրապետության օրենքներով։ Վեճերի բացառիկ իրավասությունը պատկանում է Հայաստանի Հանրապետության դատարաններին, եթե պարտադիր իրավունքը այլ բան չի պահանջում։",
        ],
      },
      {
        heading: "15. Կապ",
        paragraphs: [
          "Իրավական ծանուցումների և պայմանների վերաբերյալ հարցերի համար՝ hello@dolegal.am։",
        ],
      },
    ],
  },
};

const TERMS_DESCRIPTIONS: Record<SupportedLocale, string> = {
  en: "Read the doLegal Terms of Service, including billing, acceptable use, refunds, and legal conditions for using the platform.",
  ru: "Ознакомьтесь с Условиями использования doLegal: оплата, допустимое использование, возвраты и правовые условия работы с платформой.",
  am: "Կարդացեք doLegal-ի Օգտագործման պայմանները՝ վճարումներ, թույլատրելի օգտագործում, վերադարձներ և հարթակի իրավական պայմաններ։",
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const {locale} = await params;
  const key = (locale as SupportedLocale) || "en";
  const copy = COPY[key] ?? COPY.en;

  return {
    title: `${copy.title} | doLegal`,
    description: TERMS_DESCRIPTIONS[key] ?? TERMS_DESCRIPTIONS.en,
  };
}

export default async function LocalizedTermsPage({
  params,
}: PageProps<"/[locale]/terms">) {
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
