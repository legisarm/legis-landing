import type { Metadata } from "next";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import { brandText } from "@/lib/brand-text";
import { IssueStrip } from "../_components/IssueStrip";
import { Masthead } from "../_components/Masthead";
import { Waitlist } from "../_components/Waitlist";
import { FAQList } from "./_components/FAQList";
import { LiveDemo } from "./_components/LiveDemo";

export const metadata: Metadata = {
  title: "doLegal | Armenian Legal AI Research and Drafting Platform",
  description:
    "doLegal helps lawyers, accountants, and founders in Armenia research laws, draft legal documents, and verify citations across Armenian, Russian, and English.",
};

export default function LandingPage() {
  const tNav = useTranslations("nav");
  const tParity = useTranslations("landing.parity");
  const tStats = useTranslations("landing.heroStats");
  const tProblem = useTranslations("landing.problem");
  const tFeatures = useTranslations("landing.features");
  const tHow = useTranslations("landing.howItWorks");
  const tPersonas = useTranslations("landing.personas");
  const tFaq = useTranslations("landing.faq");

  const NAV = [
    { href: "/#features", label: tNav("features") },
    { href: "/#how", label: tNav("howItWorks") },
    { href: "/#who", label: tNav("audience") },
    { href: "/pricing", label: tNav("pricing") },
    { href: "/#faq", label: tNav("faq") },
  ];

  // We map over keys since next-intl arrays are accessed differently,
  // or we can use useMessages / raw() for array data.
  // Actually, next-intl supports .raw() on arrays.
  
  const stats = [0, 1, 2].map((i) => tStats.raw(`${i}`));
  const oldWayItems = tProblem.raw("oldWayItems");
  const doLegalItems = tProblem.raw("doLegalItems");
  const featureCards = [0, 1, 2].map((i) => tFeatures.raw(`cards.${i}`));
  const howSteps = [0, 1, 2].map((i) => tHow.raw(`steps.${i}`));
  const howLawSources = tHow.raw("illustrations.lawSources") as string[];
  const howAnswerLabel = tHow("illustrations.answerLabel");
  const howCitations = tHow.raw("illustrations.citations") as {
    sources: string;
    verified: string;
    tagline: string;
    items: string[];
  };
  const personaCards = [0, 1, 2].map((i) => tPersonas.raw(`cards.${i}`));
  const faqs = tFaq.raw("items") as { question: string; answer: string }[];

  return (
    <>
      <Masthead nav={NAV} />
      <IssueStrip />

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">{tParity("heroEyebrow")}</p>
              <h1 className="h-display">
                {tParity("heroLine1")}<br />
                {tParity("heroLine2Prefix")} <em>{tParity("heroLine2Emphasis")}</em><br />
                <span className="amp" style={{ color: "#fff" }}>{tParity("heroLine3Prefix")}</span> {tParity("heroLine3Rest")}
                <span className="small">{tParity("heroLine4")}</span>
              </h1>
              <p className="lede">
                {brandText(tParity("heroDescriptionExact"))}
              </p>
              <div className="cta-row">
                <Link className="btn-primary" href="#waitlist">
                  {tParity("heroPrimaryCtaExact")}
                </Link>
                <Link className="btn-ghost" href="/#how">
                  {tParity("heroSecondaryCtaExact")}
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-num">
                    100,000<span style={{ color: "var(--ink)" }}>+</span>
                  </div>
                  <div className="stat-label">{stats[0].label}</div>
                </div>
                <div className="stat">
                  <div className="stat-num">
                    {tParity("heroStat2Value")}<span style={{ color: "var(--ink-3)" }}>{tParity("heroStat2Suffix")}</span>
                  </div>
                  <div className="stat-label">{tParity("heroStat2Label")}</div>
                </div>
                <div className="stat">
                  <div className="stat-num">{tParity("heroStat3Value")}</div>
                  <div className="stat-label">{tParity("heroStat3Label")}</div>
                </div>
              </div>
            </div>

            <LiveDemo />
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section" id="features">
        <div className="wrap">
          <p className="section-label">{tParity("featuresSectionLabelExact")}</p>
          <h2 className="section-title">
            {tParity("featuresTitleMainExact")}<br />
            <em>{tParity("featuresTitleAccentExact")}</em>
          </h2>
          <p className="section-sub">
            {brandText(tFeatures("description"))}
          </p>

          <div className="cap-grid">
            {featureCards.map((cap: any, i: number) => (
              <div className="cap" key={cap.title}>
                <div className="cap-num">{i + 1}</div>
                <h3>{cap.title}</h3>
                <p className="cap-desc">{brandText(cap.description)}</p>
                <ul className="cap-list">
                  {cap.items.map((item: string) => (
                    <li key={item}>{brandText(item)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <p className="section-label">{tProblem("sectionLabel")}</p>
          <h2 className="section-title">
            {tProblem("titleMain")}<br />
            <em>{tProblem("titleAccent")}</em>
          </h2>
        </div>

        <div className="wrap" style={{ padding: 0 }}>
          <div className="compare-grid">
            <div className="col-old">
              <div className="col-head">
                {tProblem("oldWayBadge")}
              </div>
              {oldWayItems.map((t: string) => (
                <div className="compare-item" key={t}>
                  <span className="mark">—</span>
                  <span>{brandText(t)}</span>
                </div>
              ))}
            </div>
            <div className="col-new">
              <div className="col-head">
                {tProblem("withDoLegalBadge")}
              </div>
              {doLegalItems.map((t: string) => (
                <div className="compare-item" key={t}>
                  <span className="mark">✦</span>
                  <span>{brandText(t)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="wrap">
          <p className="section-label">{tParity("howSectionLabelExact")}</p>
          <h2 className="section-title">
            {tParity("howTitleMainExact")}<br />
            <em>{tParity("howTitleAccentExact")}</em>
          </h2>
          <p className="section-sub">
            {brandText(tParity("heroDescriptionExact"))} {/* Using hero description as fallback or what was here? */}
          </p>

          <div className="steps">
            {howSteps.map((step: any, i: number) => (
              <div className="step" key={step.title}>
                <span className="step-num">
                  <span className="step-num-label">STEP</span>{" "}
                  <span className="step-num-index">0{i + 1}</span>
                </span>
                <h3>{step.title}</h3>
                <p>{brandText(step.description)}</p>
                {/* keeping original SVGs inside would require custom mapping,
                    let's re-use the hardcoded SVGs by passing index */}
                {i === 0 && (
                  <div className="step-illus">
                    <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
                      <defs>
                        <pattern id="p1" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                        </pattern>
                      </defs>
                      <rect width="240" height="180" fill="url(#p1)" style={{ color: "var(--ink)" }} />
                      <g transform="translate(24, 20)" fontFamily="var(--mono)" fontSize="7" fill="var(--ink-2)">
                        <rect x="0" y="0" width="192" height="42" fill="var(--paper)" stroke="var(--rule)" />
                        <text x="10" y="13">
                          <tspan x="10" dy="0">Ե՞րբ է ԱԱՀ գրանցումը</tspan>
                          <tspan x="10" dy="9">պարտադիր ԱՁ-ի համար</tspan>
                        </text>
                        <rect x="0" y="50" width="192" height="42" fill="var(--paper)" stroke="var(--rule)" />
                        <text x="10" y="61" fill="var(--ink-3)">
                          <tspan x="10" dy="0">When does VAT registration</tspan>
                          <tspan x="10" dy="9">become mandatory for a sole</tspan>
                          <tspan x="10" dy="9">proprietor?</tspan>
                        </text>
                        <rect x="0" y="100" width="192" height="42" fill="var(--paper)" stroke="var(--rule)" />
                        <text x="10" y="113" fill="var(--ink-3)">
                          <tspan x="10" dy="0">Когда регистрация по НДС</tspan>
                          <tspan x="10" dy="9">становится обязательной</tspan>
                          <tspan x="10" dy="9">для ИП?</tspan>
                        </text>
                      </g>
                    </svg>
                  </div>
                )}
                {i === 1 && (
                  <div className="step-illus">
                    <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
                      <g transform="translate(20, 20)" fontFamily="var(--mono)" fontSize="9">
                        <g fontSize="8" fill="var(--ink-3)">
                          <text x="0" y="0">{howLawSources[0]}</text>
                          <line x1="40" y1="-3" x2="200" y2="-3" stroke="var(--rule)" />
                          <text x="0" y="18">{howLawSources[1]}</text>
                          <line x1="40" y1="15" x2="200" y2="15" stroke="var(--rule)" />
                          <text x="0" y="36">{howLawSources[2]}</text>
                          <line x1="40" y1="33" x2="200" y2="33" stroke="var(--rule)" />
                          <text x="0" y="54">{howLawSources[3]}</text>
                          <line x1="55" y1="51" x2="200" y2="51" stroke="var(--rule)" />
                          <text x="0" y="72">{howLawSources[4]}</text>
                          <line x1="55" y1="69" x2="200" y2="69" stroke="var(--rule)" />
                          <text x="0" y="90">{howLawSources[5]}</text>
                          <line x1="55" y1="87" x2="200" y2="87" stroke="var(--rule)" />
                        </g>
                        <circle cx="90" cy="15" r="3" fill="var(--accent)" />
                        <circle cx="160" cy="33" r="3" fill="var(--accent)" />
                        <circle cx="120" cy="-3" r="3" fill="var(--accent)" opacity="0.5" />
                        <circle cx="70" cy="51" r="3" fill="var(--accent)" opacity="0.7" />
                        <path d="M90 15 Q 120 60 140 120 L 170 120" stroke="var(--accent)" fill="none" strokeWidth="0.8" strokeDasharray="2 2" />
                        <path d="M160 33 Q 150 70 170 120" stroke="var(--accent)" fill="none" strokeWidth="0.8" strokeDasharray="2 2" />
                        <rect x="155" y="115" width="60" height="22" fill="var(--paper)" stroke="var(--accent)" />
                        <text x="185" y="129" textAnchor="middle" fill="var(--accent)" fontSize="8">{howAnswerLabel}</text>
                      </g>
                    </svg>
                  </div>
                )}
                {i === 2 && (
                  <div className="step-illus">
                    <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
                      <g transform="translate(20, 20)" fontFamily="var(--mono)" fontSize="9" fill="var(--ink-2)">
                        <line x1="0" y1="10" x2="200" y2="10" stroke="var(--rule)" />
                        <text x="0" y="7" fontSize="7" fill="var(--accent)">{howCitations.sources}</text>
                        <g fontFamily="var(--mono)">
                          <text x="0" y="28">[01]</text><text x="22" y="28">{howCitations.items[0]}</text><text x="165" y="28" fill="var(--accent)">✓</text><line x1="0" y1="34" x2="200" y2="34" stroke="var(--rule-soft)" />
                          <text x="0" y="52">[02]</text><text x="22" y="52">{howCitations.items[1]}</text><text x="165" y="52" fill="var(--accent)">✓</text><line x1="0" y1="58" x2="200" y2="58" stroke="var(--rule-soft)" />
                          <text x="0" y="76">[03]</text><text x="22" y="76">{howCitations.items[2]}</text><text x="165" y="76" fill="var(--accent)">✓</text><line x1="0" y1="82" x2="200" y2="82" stroke="var(--rule-soft)" />
                          <text x="0" y="100">[04]</text><text x="22" y="100">{howCitations.items[3]}</text><text x="165" y="100" fill="var(--accent)">✓</text><line x1="0" y1="106" x2="200" y2="106" stroke="var(--rule-soft)" />
                        </g>
                        <text x="0" y="130" fontFamily="var(--serif)" fontStyle="italic" fill="var(--ink-3)" fontSize="8">{howCitations.tagline}</text>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="section" id="who">
        <div className="wrap">
          <p className="section-label">{tParity("whoSectionLabelExact")}</p>
          <h2 className="section-title">
            {tParity("whoTitleMainExact")}<br />
            <em>{tParity("whoTitleAccentExact")}</em>
          </h2>
          <p className="section-sub">
            {/* The actual hardcoded text was "And ambitious founders..." let's see where that was */}
          </p>

          <div className="aud-grid">
            {personaCards.map((aud: any) => (
              <div className="aud" key={aud.tag}>
                <div className="aud-kicker step-num">{aud.tag}</div>
                <h4>{aud.title}</h4>
                <p>{brandText(aud.description)}</p>
                <ul>
                  {aud.wins.map((w: string) => (
                    <li key={w}>{brandText(w)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <p className="section-label">{tParity("faqSectionLabelExact")}</p>
          <h2 className="section-title">
            {tParity("faqTitleMainExact")} <em>{tParity("faqTitleAccentExact")}</em>
          </h2>
          <p className="section-sub">
            {brandText(tFaq("descriptionPrefix"))}{" "}
            <a href={`mailto:${tFaq("email")}`} style={{ color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>{tFaq("email")}</a>.
          </p>

          <FAQList items={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} />
        </div>
      </section>

      <Waitlist />
    </>
  );
}
