import type { LandingContent } from "./content";
import { marketingSectionSub, marketingSectionTitle } from "./marketing-constants";

export function PricingSection({ pricing }: { pricing: LandingContent["pricing"] }) {
  return (
    <section className="landing-scroll-target bg-[#f5f5f7] px-5 py-24 md:px-10" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className={marketingSectionTitle}>
            {pricing.titleMain}
            <br />
            <em className="font-normal italic">{pricing.titleAccent}</em>
          </h1>
          <p className={`${marketingSectionSub} mx-auto mt-4 max-w-2xl`}>{pricing.description}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {pricing.plans.map((plan) => (
            <article
              className={`relative rounded-2xl border p-6 ${
                plan.featured ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-black/10 bg-white"
              }`}
              key={plan.name}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.06em] text-[#1d1d1f]">
                  {pricing.mostPopular}
                </span>
              ) : null}
              <div
                className={`mb-3 text-xs uppercase tracking-[0.08em] ${plan.featured ? "text-white/50" : "text-black/40"}`}
              >
                {plan.name}
              </div>
              <div className="mb-1 [font-family:var(--font-playfair)] text-5xl font-semibold tracking-tight">
                <span className="align-top text-xl font-normal opacity-70">AMD </span>
                {plan.price}
              </div>
              <div className={`mb-5 text-xs ${plan.featured ? "text-white/40" : "text-black/40"}`}>{plan.period}</div>
              <ul className={`mb-5 space-y-2 border-t pt-4 ${plan.featured ? "border-white/15" : "border-black/10"}`}>
                {plan.features.map((feature) => (
                  <li className={`flex gap-2 text-sm ${plan.featured ? "text-white/80" : "text-black/60"}`} key={feature.text}>
                    <span className={feature.enabled ? "" : "opacity-40"}>{feature.enabled ? "✓" : "-"}</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  plan.featured ? "bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]" : "border border-black/20 hover:border-black"
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-7 py-5">
          <p className="text-sm text-black/60">
            <strong className="mb-1 block text-black">{pricing.needsMoreTokensTitle}</strong>
            {pricing.needsMoreTokensDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            {pricing.topups.map((topup) => (
              <div className="rounded-full border border-black/10 bg-[#f5f5f7] px-4 py-2 text-center" key={topup.tokens}>
                <div className="text-xs font-medium text-black">{topup.tokens}</div>
                <div className="[font-family:var(--font-playfair)] text-sm text-black/65">{topup.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
