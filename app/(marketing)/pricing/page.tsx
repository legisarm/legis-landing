import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import { Fragment } from "react";
import { IssueStrip } from "../../_components/IssueStrip";
import { Masthead } from "../../_components/Masthead";
import { Waitlist } from "../../_components/Waitlist";
import { FAQList } from "../_components/FAQList";
import { PlansAndBilling } from "./_components/PlansAndBilling";

const PRICING_FAQ = [
  {
    q: "Can I cancel or change plans anytime?",
    a: "Yes. Upgrades apply immediately with prorated billing, downgrades apply in the next billing cycle, and you can cancel any time. No contracts, no hidden fees.",
  },
  {
    q: "What happens if I run out of tokens?",
    a: "You can add a one-time top-up (10k / 15k / 25k) to your current cycle without changing plans, or upgrade to a higher tier. Unused top-up tokens roll over for 30 days.",
  },
  {
    q: "Do unused tokens roll over?",
    a: "Plan tokens reset each cycle. Top-up tokens roll over for 30 days from purchase, so a bad week doesn't cost you the balance you've already paid for.",
  },
  {
    q: "Is VAT included in the quoted prices?",
    a: "Prices shown are in AMD and exclusive of VAT. For entities registered in Armenia, VAT is added per the RA Tax Code at checkout.",
  },
  {
    q: "How does the Rocket team plan work?",
    a: "Rocket gives a 2–10 person practice a shared 1,000,000 token pool, seat-based admin, and dedicated support. Larger firms should contact us for a custom plan.",
  },
  {
    q: "When is pricing actually available?",
    a: "DoLegal is in early access. Pricing shown is the planned launch pricing. Join the waitlist and we'll invite you in batches as we open access — starting with independent practitioners in Yerevan.",
  },
];

const TOPUPS = [
  {
    num: "1",
    tokens: "10,000",
    note: "≈ 7,500 words of research output",
    price: "4,000",
  },
  {
    num: "2",
    tokens: "15,000",
    note: "≈ 11,000 words · good for one long drafting session",
    price: "6,000",
  },
  {
    num: "3",
    tokens: "25,000",
    note: "≈ 18,500 words · covers a week of heavy use",
    price: "10,000",
  },
];

const TOKEN_EX = [
  {
    n: "1",
    what: "A short legal question with a short answer.",
    note: "“When is VAT registration mandatory?”",
    cost: "≈ 500–1,500",
  },
  {
    n: "2",
    what: "A longer answer with extensive citations.",
    note: "Tax filing calendar, cross-referenced",
    cost: "≈ 2,000–4,000",
  },
  {
    n: "3",
    what: "Contract draft from a prompt.",
    note: "NDA, employment, service agreement",
    cost: "≈ 6,000–12,000",
  },
  {
    n: "4",
    what: "Document comparison (upload two PDFs).",
    note: "Redline with article mapping",
    cost: "≈ 10,000–20,000",
  },
  {
    n: "5",
    what: "Full case review (upload + Q&A thread).",
    note: "Uploaded judgment + 5–10 questions",
    cost: "≈ 15,000–35,000",
  },
];

/* ============ Compare table data ============ */
type Cell =
  | { kind: "text"; value: string; off?: boolean }
  | { kind: "check" }
  | { kind: "dash" };

const check: Cell = { kind: "check" };
const dash: Cell = { kind: "dash" };
const txt = (v: string, off = false): Cell => ({ kind: "text", value: v, off });

interface CompareRow {
  label: string;
  values: [Cell, Cell, Cell, Cell];
}

interface CompareGroup {
  head: string;
  rows: CompareRow[];
}

const COMPARE_GROUPS: CompareGroup[] = [
  {
    head: "§ Usage",
    rows: [
      {
        label: "Monthly tokens",
        values: [txt("1,400"), txt("40,000"), txt("250,000"), txt("1,000,000")],
      },
      { label: "Guest trial queries", values: [txt("8"), dash, dash, dash] },
      {
        label: "File upload size",
        values: [dash, txt("5 MB"), txt("10 MB"), txt("25 MB")],
      },
      {
        label: "Pinned conversations",
        values: [txt("1"), txt("3"), txt("5"), txt("Unlimited")],
      },
      {
        label: "Full chat history",
        values: [dash, dash, check, check],
      },
    ],
  },
  {
    head: "§ Research",
    rows: [
      {
        label: "Retrieval over Armenian legal corpora",
        values: [check, check, check, check],
      },
      { label: "Article-level citations", values: [check, check, check, check] },
      { label: "Weekly corpus refresh", values: [check, check, check, check] },
      { label: "Priority AI response", values: [dash, dash, check, check] },
    ],
  },
  {
    head: "§ Drafting",
    rows: [
      { label: "Document drafting", values: [dash, check, check, check] },
      { label: "DOCX export", values: [dash, check, check, check] },
      { label: "Document comparison", values: [dash, dash, check, check] },
      { label: "OCR of scanned documents", values: [dash, check, check, check] },
    ],
  },
  {
    head: "§ Team & support",
    rows: [
      { label: "Shared token pool", values: [dash, dash, dash, check] },
      { label: "Dedicated support", values: [dash, dash, dash, check] },
      {
        label: "Onboarding session",
        values: [dash, dash, txt("Group"), txt("1-on-1")],
      },
    ],
  },
];

const FEATURED_COL = 2; // Pro

function renderCell(c: Cell, i: number, isFeatCol: boolean) {
  const classes = ["val"];
  if (isFeatCol) classes.push("feat-cell");
  if (c.kind === "text" && c.off) classes.push("off");
  if (c.kind === "dash") classes.push("off");

  const className = classes.join(" ");

  if (c.kind === "check") {
    return (
      <td key={i} className={className}>
        <span className="check">✓</span>
      </td>
    );
  }
  if (c.kind === "dash") {
    return (
      <td key={i} className={className}>
        <span className="dash">—</span>
      </td>
    );
  }
  return (
    <td key={i} className={className}>
      {c.value}
    </td>
  );
}

export default function PricingPage() {
  const tNav = useTranslations("nav");
  const tP = useTranslations("landing.pricingParity");
  const tPricing = useTranslations("landing.pricing");
  
  // Dynamic PRICING_FAQ from JSON
  const dynamicFAQ = [0, 1].map(i => ({
    q: tP.raw(`q${i + 1}Title`),
    a: tP.raw(`q${i + 1}Answer`)
  }));
  const NAV = [
    { href: "/#features", label: tNav("features") },
    { href: "/#how", label: tNav("howItWorks") },
    { href: "/#who", label: tNav("audience") },
    { href: "/pricing", label: tNav("pricing"), active: true },
    { href: "/#faq", label: tNav("faq") },
  ];

  return (
    <>
      <Masthead nav={NAV} ctaHref="/#waitlist" />
      <IssueStrip />

      {/* HERO */}
      <section className="price-hero">
        <div className="wrap">
          <p className="eyebrow">{tPricing("sectionLabel")}</p>
          <h1>
            {tPricing("titleMain")}
            <br />
            <em>{tPricing("titleAccent")}</em>
          </h1>
          <p className="lede">
            {tPricing("description")}
          </p>
          <div className="meta-row">
            <span>
              Currency · <b>AMD</b>
            </span>
            <span>
              Billing · <b>Monthly</b>
            </span>
            <span>
              Tokens reset · <b>Every 30 days</b>
            </span>
            <span>
              Early-access · <b>Waitlist only</b>
            </span>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="plans-wrap">
        <div className="wrap">
          <PlansAndBilling />
        </div>
      </section>

      {/* TOPUPS */}
      <section className="topups-section">
        <div className="wrap">
          <div className="topups-grid">
            <div>
              <p className="eyebrow">{tP("oneTimeTopup")}</p>
              <h2>
                {tPricing("needsMoreTokensTitle")}
              </h2>
              <p className="descr">
                {tPricing("needsMoreTokensDescription")}
              </p>
            </div>
            <div className="topup-table">
              {TOPUPS.map((t) => (
                <div className="topup-row" key={t.num}>
                  <span className="num">{t.num}</span>
                  <span className="tok">
                    {t.tokens} <em>tokens</em>
                  </span>
                  <span className="eff">{t.note}</span>
                  <span className="price">
                    AMD&nbsp;<b>{t.price}</b>
                  </span>
                  <Link className="topup-cta" href="/#waitlist">
                    Add top-up →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section className="compare-section">
        <div className="wrap">
          <p className="section-label">{tP("comparisonLabel")}</p>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(36px, 4.8vw, 64px)",
              marginBottom: 40,
            }}
          >
            {tP("comparisonTitleMain")}
            <br />
            <em>{tP("comparisonTitleAccent")}</em>
          </h2>

          <div className="compare-wrap">
            <table className="compare">
              <colgroup>
                <col style={{ width: "36%" }} />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th />
                  <th className="plan-head">
                    Free<span className="sub">AMD 0</span>
                  </th>
                  <th className="plan-head">
                    Basic<span className="sub">AMD 8,000</span>
                  </th>
                  <th className="plan-head feat">
                    Pro<span className="sub">AMD 15,000</span>
                  </th>
                  <th className="plan-head">
                    Rocket<span className="sub">AMD 25,000</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_GROUPS.map((g) => (
                  <Fragment key={g.head}>
                    <tr>
                      <td colSpan={5} className="group-head">
                        {g.head}
                      </td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={`${g.head}-${r.label}`}>
                        <td className="row-label">{r.label}</td>
                        {r.values.map((c, i) =>
                          renderCell(c, i, i === FEATURED_COL),
                        )}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HOW TOKENS WORK */}
      <section className="howtokens">
        <div className="wrap">
          <div className="howtokens-grid">
            <div>
              <p className="eyebrow">Unit economics</p>
              <h2>
                A token, <em>loosely speaking.</em>
              </h2>
              <p className="lead">
                A token is the unit of AI processing — roughly{" "}
                <b>0.75 words</b>. Your plan refreshes a fixed allowance
                monthly; top-ups stack on top. Here is what typical DoLegal work
                costs.
              </p>
            </div>
            <div className="token-examples">
              {TOKEN_EX.map((t, i) => (
                <div
                  className="token-ex"
                  key={t.n}
                  style={
                    i === TOKEN_EX.length - 1 ? { borderBottom: 0 } : undefined
                  }
                >
                  <span className="n">{t.n}</span>
                  <span className="what">
                    {t.what}
                    <em>{t.note}</em>
                  </span>
                  <span className="cost">
                    <b>{t.cost}</b>
                    <em>tokens</em>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING FAQ */}
      <section className="mini-faq">
        <div className="wrap">
          <p className="section-label">{tP("questionsLabel")}</p>
          <h2>
            {tP("questionsTitleMain")}
            <br />
            <em>{tP("questionsTitleAccent")}</em>
          </h2>
          {/* using fallback to static FAQ for missing translations, plus translated ones */}
          <FAQList items={[...dynamicFAQ, ...PRICING_FAQ.slice(2)]} togglePlusMinus />
        </div>
      </section>

      <Waitlist
        heading={
          <>
            Join the waitlist.
            <br />
            <em>Lock in launch pricing.</em>
          </>
        }
        body={
          <>
            DoLegal is not publicly released. Early-access invitees get the
            launch tariff grandfathered for 12 months after general availability.
          </>
        }
      />
    </>
  );
}
