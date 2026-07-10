"use client";

import {Link} from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { brandText } from "@/lib/brand-text";
import { useMemo, useState } from "react";

type PlanId = "free" | "basic" | "pro" | "rocket";
type Period = "monthly" | "annual";

interface Plan {
  id: PlanId;
  num: string;
  base: number;
}

interface LocalizedPlan {
  name: string;
  kicker: string;
  desc: string;
  cta: string;
  priceNote: string;
  featured?: boolean;
  features: Array<{ text: string; enabled: boolean }>;
}

const PLANS: Plan[] = [
  {
    id: "free",
    num: "I.",
    base: 0,
  },
  {
    id: "basic",
    num: "II.",
    base: 8000,
  },
  {
    id: "pro",
    num: "III.",
    base: 15000,
  },
  {
    id: "rocket",
    num: "IV.",
    base: 25000,
  },
];

const FEATURED: PlanId = "pro";

export function PlansAndBilling() {
  const [period, setPeriod] = useState<Period>("monthly");
  const tP = useTranslations("landing.pricingParity");
  const tPricing = useTranslations("landing.pricing");
  const localizedPlans = [0, 1, 2, 3].map((i) =>
    tPricing.raw(`plans.${i}`),
  ) as LocalizedPlan[];


  const amounts = useMemo(() => {
    return PLANS.map((p) => {
      if (!p.base) return "0";
      const v =
        period === "annual"
          ? Math.round((p.base * 0.85) / 100) * 100
          : p.base;
      return v.toLocaleString("en-US");
    });
  }, [period]);

  return (
    <>
      <div
        className="billing-switch"
        role="tablist"
        aria-label={tPricing("billingAriaLabel")}
      >
        <button
          type="button"
          className={period === "monthly" ? "on" : ""}
          onClick={() => setPeriod("monthly")}
        >
          {tP("monthly")}
        </button>
        <button
          type="button"
          className={period === "annual" ? "on" : ""}
          onClick={() => setPeriod("annual")}
        >
          {tP("annual")}
        </button>
      </div>
      <span className="billing-note">
        {period === "annual"
          ? tP("annualHintActive")
          : tP("annualHintIdle")}
      </span>

      <div className="plans">
        {PLANS.map((p, i) => {
          const lp = localizedPlans[i];
          const isFeat = lp.featured ?? p.id === FEATURED;
          return (
            <article
              key={p.id}
              className={`plan${isFeat ? " feat" : ""}`}
            >
              {isFeat && <span className="plan-ribbon">{tPricing("mostPopular")}</span>}
              <div className="plan-top">
                <div className="plan-kicker">
                  <span className="num">{p.num}</span>
                  <span>{lp.kicker}</span>
                </div>
                <h3>{lp.name}</h3>
                <p className="desc">{brandText(lp.desc)}</p>
                <div className="price-stack">
                  {p.id === "rocket" ? (
                    <div className="price enterprise">
                      <span className="enterprise-copy">{tPricing("contactSales.planPriceCopy")}</span>
                    </div>
                  ) : (
                    <div className="price">
                      <span className="cur">AMD</span>
                      <span className="amt">{amounts[i]}</span>
                      <span className="unit">
                        {period === "annual" ? tP("billedYearly") : tPricing("monthlyShort")}
                      </span>
                    </div>
                  )}
                  <p className="price-note">{brandText(tPricing("vatNote"))}</p>
                </div>
              </div>
              <Link
                className={`plan-cta${isFeat ? "" : " ghost"}`}
                href={p.id === "rocket" ? "#contact-sales" : "/#waitlist"}
              >
                {lp.cta}
              </Link>
              <hr className="divider" />
              <ul className="feat-list">
                {lp.features.map((f, idx) => (
                  <li key={idx} className={!f.enabled ? "off" : undefined}>
                    <span>{brandText(f.text)}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </>
  );
}
