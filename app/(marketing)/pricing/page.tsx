import type { Metadata } from "next";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import { brandText } from "@/lib/brand-text";
import { Fragment } from "react";
import { IssueStrip } from "../../_components/IssueStrip";
import { Masthead } from "../../_components/Masthead";
import { Waitlist } from "../../_components/Waitlist";
import { Footer } from "../../_components/Footer";
import { FAQList } from "../_components/FAQList";
import { ContactSalesForm } from "./_components/ContactSalesForm";
import { PlansAndBilling } from "./_components/PlansAndBilling";

export const metadata: Metadata = {
  title: "Pricing | doLegal Armenia",
  description:
    "Explore doLegal pricing plans for Armenian legal research and drafting, including token tiers, top-ups, and team options for law and accounting practices.",
};

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

type CompareMatrixRow = { label: string; cells: [string, string, string, string] };
type CompareMatrixGroup = { head: string; rows: CompareMatrixRow[] };

function cellFromMatrixValue(s: string): Cell {
  const v = s.trim();
  if (v === "Yes" || v === "Այո" || v === "Да") return check;
  if (v === "No" || v === "Ոչ" || v === "Нет") return dash;
  return txt(v);
}

function getCompareGroups(tPricing: ReturnType<typeof useTranslations>): CompareGroup[] {
  const raw = tPricing.raw("compare.matrix") as { groups: CompareMatrixGroup[] };
  return raw.groups.map((g) => ({
    head: g.head,
    rows: g.rows.map((r) => ({
      label: r.label,
      values: r.cells.map(cellFromMatrixValue) as [Cell, Cell, Cell, Cell],
    })),
  }));
}

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
  const compareGroups = getCompareGroups(tPricing);
  const pricingFaq = [0, 1, 2, 3, 4, 5].map((i) => tPricing.raw(`faq.${i}`));
  const topups = [0, 1].map((i) => tPricing.raw(`topupsDetailed.${i}`));
  const planNames = [0, 1, 2, 3].map((i) => tPricing.raw(`plans.${i}.name`)) as string[];
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
            {brandText(tPricing("description"))}
          </p>
          <div className="meta-row">
            <span>
              {tPricing("meta.currencyLabel")} · <b>{tPricing("meta.currencyValue")}</b>
            </span>
            <span>
              {tPricing("meta.billingLabel")} · <b>{tPricing("meta.billingValue")}</b>
            </span>
            <span>
              {tPricing("meta.tokensResetLabel")} · <b>{tPricing("meta.tokensResetValue")}</b>
            </span>
            <span>
              {tPricing("meta.earlyAccessLabel")} · <b>{tPricing("meta.earlyAccessValue")}</b>
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
                {brandText(tPricing("needsMoreTokensDescription"))}
              </p>
            </div>
            <div className="topup-table">
              {topups.map((t: any) => (
                <div className="topup-row" key={t.num}>
                  <span className="num">{t.num}</span>
                  <span className="tok">
                    {t.tokens} <em>{tPricing("tokensUnit")}</em>
                  </span>
                  <span className="eff">{brandText(t.note)}</span>
                  <span className="price">
                    AMD&nbsp;<b>{t.price}</b>
                  </span>
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
                    {planNames[0]}
                    <span className="sub">AMD 0</span>
                    <span className="vat-hint">{tPricing("vatShort")}</span>
                  </th>
                  <th className="plan-head">
                    {planNames[1]}
                    <span className="sub">AMD 8,000</span>
                    <span className="vat-hint">{tPricing("vatShort")}</span>
                  </th>
                  <th className="plan-head feat">
                    {planNames[2]}
                    <span className="sub">AMD 15,000</span>
                    <span className="vat-hint">{tPricing("vatShort")}</span>
                  </th>
                  <th className="plan-head">
                    {planNames[3]}
                    <Link className="sub" href="#contact-sales">
                      {tPricing("contactSales.tableCta")}
                    </Link>
                    <span className="vat-hint">{tPricing("vatShort")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareGroups.map((g) => (
                  <Fragment key={g.head}>
                    <tr>
                      <td colSpan={5} className="group-head">
                        {g.head}
                      </td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={`${g.head}-${r.label}`}>
                        <td className="row-label">{brandText(r.label)}</td>
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

      <section className="contact-sales-section" id="contact-sales">
        <div className="wrap">
          <ContactSalesForm />
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
          <FAQList items={pricingFaq as Array<{ q: string; a: string }>} togglePlusMinus />
        </div>
      </section>

      <Waitlist
        heading={
          <>
            {tPricing("waitlist.headingMain")}
            <br />
            <em>{tPricing("waitlist.headingAccent")}</em>
          </>
        }
        body={<>{brandText(tPricing("waitlist.body"))}</>}
      />
      <Footer />
    </>
  );
}
