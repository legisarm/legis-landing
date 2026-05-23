import type { Metadata } from "next";
import {getTranslations} from "next-intl/server";
import { Footer } from "../../_components/Footer";
import { Masthead } from "../../_components/Masthead";
import { brandText } from "@/lib/brand-text";

type SupportedLocale = "en" | "ru" | "am";

type RefundCopy = {
  title: string;
  legalLabel: string;
  updated: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
  }>;
};

const COPY: Record<SupportedLocale, RefundCopy> = {
  en: {
    title: "Refund Policy",
    legalLabel: "Legal",
    updated: "Last updated: April 22, 2026.",
    sections: [
      {
        heading: "1. Merchant of record",
        paragraphs: [
          "Payments are processed by Paddle, our merchant of record. Paddle may handle payment operations, tax, and chargeback workflows according to its platform rules.",
        ],
      },
      {
        heading: "2. Subscription refunds",
        paragraphs: [
          "You may request a refund for the most recent subscription charge within 14 calendar days of purchase or renewal if usage in that billing cycle is minimal and the request is made in good faith.",
          "Refunds may be denied where there is substantial service consumption, policy abuse, repeated refund requests, fraud indicators, or violation of the Terms of Service.",
        ],
      },
      {
        heading: "3. Top-up purchases",
        paragraphs: [
          "One-time top-up purchases are generally non-refundable once consumed in whole or in part. If purchased by mistake and unused, contact us within 7 calendar days for case-by-case review.",
        ],
      },
      {
        heading: "4. Cancellation",
        paragraphs: [
          "Canceling a subscription stops future renewals. Cancellation does not automatically generate a refund for charges already processed, except where required by law or granted under this policy.",
        ],
      },
      {
        heading: "5. Chargebacks",
        paragraphs: [
          "If you believe a transaction is unauthorized, contact us first so we can investigate and help resolve quickly. Fraudulent or abusive chargebacks may lead to account suspension.",
        ],
      },
      {
        heading: "6. How to request a refund",
        paragraphs: [
          "Email hello@dolegal.am with your account email, Paddle transaction ID or receipt, and reason for request. We typically review requests within 5 business days.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика возврата",
    legalLabel: "Правовая информация",
    updated: "Последнее обновление: 22 апреля 2026 г.",
    sections: [
      {
        heading: "1. Платежный посредник",
        paragraphs: [
          "Платежи обрабатываются через Paddle — нашего платежного посредника. Paddle может администрировать платежные операции, налоги и процедуры оспаривания платежей в соответствии с правилами своей платформы.",
        ],
      },
      {
        heading: "2. Возвраты по подписке",
        paragraphs: [
          "Вы можете запросить возврат последнего платежа по подписке в течение 14 календарных дней с даты покупки или продления, если использование в этом расчетном периоде было минимальным и запрос подан добросовестно.",
          "В возврате может быть отказано при существенном потреблении сервиса, злоупотреблении политикой, повторяющихся запросах на возврат, признаках мошенничества или нарушении Условий использования.",
        ],
      },
      {
        heading: "3. Разовые пополнения",
        paragraphs: [
          "Разовые пополнения, как правило, не подлежат возврату после полного или частичного использования. Если пополнение было сделано по ошибке и осталось неиспользованным, свяжитесь с нами в течение 7 календарных дней — мы рассмотрим запрос индивидуально.",
        ],
      },
      {
        heading: "4. Отмена подписки",
        paragraphs: [
          "Отмена подписки прекращает будущие продления. Отмена не означает автоматический возврат уже списанных сумм, кроме случаев, когда это требуется законом или прямо предусмотрено этой политикой.",
        ],
      },
      {
        heading: "5. Оспаривание платежей",
        paragraphs: [
          "Если вы считаете транзакцию несанкционированной, сначала свяжитесь с нами, чтобы мы могли быстро проверить ситуацию и помочь с решением. Мошеннические или недобросовестные оспаривания платежей могут привести к приостановке аккаунта.",
        ],
      },
      {
        heading: "6. Как запросить возврат",
        paragraphs: [
          "Напишите на hello@dolegal.am, указав email аккаунта, ID транзакции Paddle или чек, а также причину запроса. Обычно мы рассматриваем запросы в течение 5 рабочих дней.",
        ],
      },
    ],
  },
  am: {
    title: "Վերադարձի քաղաքականություն",
    legalLabel: "Իրավական տեղեկատվություն",
    updated: "Վերջին թարմացում՝ 22 ապրիլի, 2026 թ.",
    sections: [
      {
        heading: "1. Վճարումների միջնորդ",
        paragraphs: [
          "Վճարումները մշակվում են Paddle-ի միջոցով՝ որպես մեր վճարումների միջնորդ։ Paddle-ը կարող է իրականացնել վճարային գործառնությունների, հարկերի և վճարումների բողոքարկման ընթացակարգերի կառավարումը՝ իր հարթակի կանոններին համապատասխան։",
        ],
      },
      {
        heading: "2. Բաժանորդագրության վերադարձներ",
        paragraphs: [
          "Դուք կարող եք պահանջել վերջին բաժանորդագրական գանձման վերադարձը գնումից կամ թարմացումից հետո 14 օրացուցային օրվա ընթացքում, եթե այդ հաշվարկային շրջանում օգտագործումը եղել է նվազագույն և դիմումը ներկայացվել է բարեխղճորեն։",
          "Վերադարձը կարող է մերժվել, եթե առկա է ծառայության էական օգտագործում, քաղաքականության չարաշահում, կրկնվող վերադարձի դիմումներ, խարդախության նշաններ կամ Օգտագործման պայմանների խախտում։",
        ],
      },
      {
        heading: "3. Միանվագ լիցքավորումներ",
        paragraphs: [
          "Միանվագ լիցքավորումները սովորաբար չեն վերադարձվում, եթե ամբողջությամբ կամ մասնակի օգտագործվել են։ Եթե լիցքավորումը կատարվել է սխալմամբ և չի օգտագործվել, կապվեք մեզ հետ 7 օրացուցային օրվա ընթացքում, և մենք կքննարկենք դիմումը անհատական կարգով։",
        ],
      },
      {
        heading: "4. Դադարեցում",
        paragraphs: [
          "Բաժանորդագրության դադարեցումը կանգնեցնում է ապագա թարմացումները։ Դադարեցումը ինքնաբերաբար չի առաջացնում արդեն գանձված գումարների վերադարձ, բացառությամբ օրենքով պարտադիր կամ սույն քաղաքականությամբ նախատեսված դեպքերի։",
        ],
      },
      {
        heading: "5. Վճարման բողոքարկում",
        paragraphs: [
          "Եթե կարծում եք, որ գործարքն իրականացվել է առանց թույլտվության, նախ կապվեք մեզ հետ, որպեսզի կարողանանք արագ ուսումնասիրել իրավիճակը և օգնել լուծման հարցում։ Խարդախ կամ չարաշահող վճարման բողոքարկումները կարող են հանգեցնել հաշվի կասեցման։",
        ],
      },
      {
        heading: "6. Ինչպես պահանջել վերադարձ",
        paragraphs: [
          "Գրեք hello@dolegal.am հասցեին՝ նշելով ձեր հաշվեհասցեն, Paddle գործարքի ID-ն կամ կտրոնը, և դիմումի պատճառը։ Սովորաբար դիմումները դիտարկվում են 5 աշխատանքային օրվա ընթացքում։",
        ],
      },
    ],
  },
};

const REFUND_DESCRIPTIONS: Record<SupportedLocale, string> = {
  en: "Learn doLegal refund rules for subscriptions and top-ups, request windows, and the process for submitting refund requests.",
  ru: "Узнайте правила возврата doLegal по подпискам и пополнениям, сроки подачи и порядок оформления запроса на возврат.",
  am: "Ծանոթացեք doLegal-ի վերադարձի կանոններին՝ բաժանորդագրությունների և լիցքավորումների, դիմելու ժամկետների և վերադարձի հարցման ընթացակարգի վերաբերյալ։",
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/refund-policy">): Promise<Metadata> {
  const {locale} = await params;
  const key = (locale as SupportedLocale) || "en";
  const copy = COPY[key] ?? COPY.en;

  return {
    title: `${copy.title} | doLegal`,
    description: REFUND_DESCRIPTIONS[key] ?? REFUND_DESCRIPTIONS.en,
  };
}

export default async function LocalizedRefundPolicyPage({
  params,
}: PageProps<"/[locale]/refund-policy">) {
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
          <p className="section-label">{copy.legalLabel}</p>
          <h1 className="section-title">{copy.title}</h1>
          <p className="section-sub" style={{ fontWeight: 700 }}>{copy.updated}</p>

          {copy.sections.map((section) => (
            <section key={section.heading} style={{ marginTop: 24 }}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{brandText(paragraph)}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
