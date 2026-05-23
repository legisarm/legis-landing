"use client";

import {Link} from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { brandText } from "@/lib/brand-text";
import {
  Fragment,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

/* ------------ static content ------------ */

const TOOLS = [
  {
    id: "research",
    label: "Legal research",
    icon: (
      <svg className="ico" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="m11 11 3 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "draft",
    label: "Document drafting",
    icon: (
      <svg className="ico" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 2h6l3 3v9H4z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M10 2v3h3M6 8h5M6 10.5h5M6 13h3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "assist",
    label: "Legal assistant",
    icon: (
      <svg className="ico" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2 2 5v4.5C2 12 5 14 8 14s6-2 6-4.5V5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M5 8.5 7 10.5l4-4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "library",
    label: "Corpus library",
    icon: (
      <svg className="ico" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 3v10M6 3v10M9 3v10M13 3.5l-1 9.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

const THREADS = [
  {
    id: "vat",
    title: "When must I register for VAT as an individual entrepreneur in Armenia?",
    meta: "Apr 20 · 3 sources",
  },
  {
    id: "svc",
    title: "Draft a service agreement for my consulting LLC",
    meta: "Apr 19 · drafting · 5 sources",
  },
  {
    id: "emp",
    title: "Deadline to register an employee after starting operations",
    meta: "Apr 18 · 2 sources",
  },
  {
    id: "term",
    title: "Termination notice periods under the Labour Code",
    meta: "Apr 15 · 4 sources",
  },
  {
    id: "div",
    title: "Can an LLC pay dividends before year-end audit?",
    meta: "Apr 12 · 3 sources",
  },
  {
    id: "exc",
    title: "Excise-tax obligations for imported alcohol",
    meta: "Apr 10 · 6 sources",
  },
  { id: "nda", title: "NDA for a pre-seed fundraising process", meta: "Apr 08 · drafting" },
];

const LANGS = ["EN", "RU", "ՀԱ"] as const;

interface Turn {
  id: number;
  user: string;
  state: "loading" | "resolved" | "static";
  attachment?: string;
}

/* ------------ component ------------ */

export function ProductWorkspace() {
  const [activeTool, setActiveTool] = useState<(typeof TOOLS)[number]["id"]>(
    "research",
  );
  const [activeTab, setActiveTab] = useState<"Research" | "Draft" | "Assistant">(
    "Research",
  );
  const [activeThread, setActiveThread] = useState<string>("vat");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

  const [turns, setTurns] = useState<Turn[]>([]);
  const [composeVal, setComposeVal] = useState("");
  const nextIdRef = useRef(1);
  const mainRef = useRef<HTMLDivElement>(null);

  const send = (q?: string) => {
    const v = (q ?? composeVal).trim();
    if (!v) return;
    setComposeVal("");
    const id = nextIdRef.current++;
    setTurns((t) => [...t, { id, user: v, state: "loading" }]);
    setTimeout(() => {
      setTurns((t) =>
        t.map((turn) =>
          turn.id === id ? { ...turn, state: "resolved" as const } : turn,
        ),
      );
    }, 1400);
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [turns]);

  const onComposeKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="app">
      {/* TOPBAR */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link href="/" className="back-link">
            ← Landing
          </Link>
          <Link href="/" className="brand" aria-label="doLegal">
            <img className="brand-logo" src="/doLegal-logo.svg" alt="doLegal" />
          </Link>
        </div>
        <div className="top-center">
          <span className="crumb">
            Workspace / Research / <b>VAT registration threshold</b>
          </span>
        </div>
        <div className="top-right">
          <div className="lang-switch">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={lang === l ? "on" : undefined}
                onClick={() => setLang(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="tokens">
            <span>620k / 1M</span>
            <span className="bar">
              <i />
            </span>
            <b>Rocket</b>
          </div>
          <div className="avatar-u">AM</div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <button className="new-btn" type="button">
          + New research <kbd>⌘K</kbd>
        </button>

        <div className="nav-group-label">Tools</div>
        {TOOLS.map((t) => (
          <div
            key={t.id}
            className={`nav-item${activeTool === t.id ? " on" : ""}`}
            onClick={() => setActiveTool(t.id)}
            role="button"
            tabIndex={0}
          >
            {t.icon}
            <span>{t.label}</span>
          </div>
        ))}

        <div className="nav-group-label">Recent research</div>
        {THREADS.map((th) => (
          <div
            key={th.id}
            className={`thread-item${activeThread === th.id ? " on" : ""}`}
            onClick={() => setActiveThread(th.id)}
            role="button"
            tabIndex={0}
          >
            <div className="thread-t">{th.title}</div>
            <div className="thread-m">{th.meta}</div>
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: "0.1em",
            padding: "14px 8px 0",
            borderTop: "1px solid var(--rule-soft)",
          }}
        >
          CORPUS · last sync 4d ago
          <br />
          100,324 indexed · 17 codes
        </div>
      </aside>

      {/* MAIN */}
      <main className="main" ref={mainRef}>
        <div className="main-inner">
          <header className="research-header">
            <h1>VAT registration threshold</h1>
            <div className="meta-chips">
              <span className="chip live">● Live corpus</span>
              <span className="chip">3 sources</span>
              <span className="chip">{lang}</span>
            </div>
          </header>

          <div className="tool-tabs">
            {(["Research", "Draft", "Assistant"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`tool-tab${activeTab === t ? " on" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Canonical turn */}
          <div className="turn">
            <div className="user-q">
              <div className="av">AM</div>
              <div className="q">
                When must I register for VAT as an individual entrepreneur in
                Armenia?{" "}
                <span className="attachment">▤ invoice_log_2025.pdf</span>
              </div>
            </div>

            <div
              className="product-ai-answer-hdr"
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
            >
              <div className="avatar ai" aria-hidden>DL</div>
              <div className="ans-label" style={{ marginBottom: 0, flex: 1, minWidth: 0 }}>
                {brandText("doLegal · answer")}
              </div>
            </div>

            <div className="product-conclusion">
              <span className="tag">Conclusion</span>VAT registration becomes
              mandatory once turnover crosses the statutory threshold in any
              rolling 12-month period. From that point onward, invoicing and
              filing follow the RA Tax Code and e-invoicing rules.
            </div>

            <div className="reasoning">
              <h4>Reasoning</h4>
              <p>
                Armenia&apos;s Tax Code sets a{" "}
                <mark>turnover-based VAT threshold</mark> measured across any
                twelve consecutive months — not a calendar year
                <sup>[01]</sup>. The test is cumulative and rolling; it can be
                triggered mid-year by a single large invoice that pushes the
                prior 12-month total past the threshold.
              </p>
              <p>
                On crossing it, the taxpayer becomes a VAT payer from the next
                transaction onward and assumes the full package of invoicing,
                reporting, and e-filing duties<sup>[02]</sup>. Invoices issued
                after that moment must carry the VAT attributes specified by
                SRC Ordinance N-148 — including the buyer&apos;s tax ID, the
                20% rate, and an e-invoice reference<sup>[03]</sup>.
              </p>

              <h4>What this means for your situation</h4>
              <p>
                Based on the uploaded <i>invoice_log_2025.pdf</i>, your rolling
                12-month turnover through March 2026 stands at{" "}
                <b style={{ color: "var(--accent)" }}>AMD 112,400,000</b> —
                above the current threshold. You should register with the State
                Revenue Committee before issuing the next invoice, and switch
                your invoicing to e-invoices with the required VAT attributes.
              </p>

              <h4>Caveat</h4>
              <p style={{ color: "var(--ink-3)", fontStyle: "italic" }}>
                This response summarises retrieved legislation and is not legal
                advice. Verify current thresholds with the State Revenue
                Committee before action.
              </p>
            </div>

            <div className="cites">
              <div className="cites-title">
                <span>Legal sources · grounded</span>
                <span style={{ color: "var(--accent)" }}>3 verified ↗</span>
              </div>
              {[
                {
                  n: "[01]",
                  label: "RA TC · Art. 267",
                  body: "VAT registration threshold; rolling 12-month turnover test.",
                },
                {
                  n: "[02]",
                  label: "RA TC · Arts. 268–271",
                  body: "VAT payer obligations, invoicing, and reporting.",
                },
                {
                  n: "[03]",
                  label: "SRC Ord. N-148",
                  body: "E-invoicing attributes, VAT identifier, rate, buyer reference.",
                },
              ].map((c) => (
                <div className="cite-row" key={c.n}>
                  <div className="cite-n">{c.n}</div>
                  <div className="cite-b">
                    <b>{c.label}</b> — {c.body}
                  </div>
                  <div className="cite-link">View ↗</div>
                </div>
              ))}
            </div>

            <div className="ans-actions">
              <button className="act" type="button">↪ Follow-up</button>
              <button className="act" type="button">⎘ Copy</button>
              <button className="act" type="button">↓ Export PDF</button>
              <button className="act" type="button">⚖ Open in drafting</button>
              <button className="act" type="button" style={{ marginLeft: "auto" }}>
                ✎ Feedback
              </button>
            </div>
          </div>

          {/* Dynamic turns */}
          {turns.map((t) => (
            <Fragment key={t.id}>
              <div className="turn">
                <div className="user-q">
                  <div className="av">AM</div>
                  <div className="q">{t.user}</div>
                </div>
                <div
                  className="product-ai-answer-hdr"
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
                >
                  <div className="avatar ai" aria-hidden>DL</div>
                  <div className="ans-label" style={{ marginBottom: 0, flex: 1, minWidth: 0 }}>
                    {brandText("doLegal · answer")}
                    {t.state === "loading" && (
                      <span className="typing">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                  </div>
                </div>
                {t.state === "loading" ? (
                  <div className="product-conclusion">
                    <span className="tag">Retrieving</span>
                    <em>
                      Searching corpus · reranking candidates · grounding
                      response…
                    </em>
                  </div>
                ) : (
                  <>
                    <div className="product-conclusion">
                      <span className="tag">Conclusion</span>This is a simulated
                      response. The real system retrieves articles from the
                      Armenian legal corpus and returns a cited answer within
                      seconds.
                    </div>
                    <div className="cites">
                      <div className="cites-title">
                        <span>Legal sources · grounded</span>
                        <span style={{ color: "var(--accent)" }}>
                          retrieved ↗
                        </span>
                      </div>
                      <div className="cite-row">
                        <div className="cite-n">[01]</div>
                        <div className="cite-b">
                          <b>RA TC · Art. 267</b> — cited in response
                        </div>
                        <div className="cite-link">View ↗</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Composer */}
        <div className="composer-wrap">
          <div className="composer-wrap-inner">
            <div className="suggest">
              {[
                "What penalties apply for late VAT registration?",
                "Does the threshold differ for sole traders vs LLCs?",
                "Draft a VAT registration notice letter",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setComposeVal(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="product-composer">
              <textarea
                value={composeVal}
                onChange={(e) => setComposeVal(e.target.value)}
                onKeyDown={onComposeKey}
                placeholder="Ask a follow-up in Armenian, Russian, or English — or drop a document to ground the answer…"
              />
              <div className="composer-bar">
                <div className="cb-left">
                  <button className="cb-icon" type="button" title="Attach">
                    ▤
                  </button>
                  <button
                    className="cb-icon"
                    type="button"
                    title="Upload photo / OCR"
                  >
                    ☰
                  </button>
                  <button className="cb-icon" type="button" title="Voice">
                    ◉
                  </button>
                </div>
                <div className="cb-right">
                  <span className="cb-lang">{lang} · ~420 tokens</span>
                  <button
                    className="cb-send"
                    type="button"
                    onClick={() => send()}
                  >
                    Ask ↵
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="panel">
        <h3>
          <span>Top source</span>
          <span>Art. 267</span>
        </h3>
        <div className="card">
          <div className="k">RA TAX CODE · ARTICLE 267</div>
          <div className="t">VAT registration threshold</div>
          <div className="body">
            <p>
              <b>1.</b> A taxable person whose aggregate turnover from the
              supply of goods, works, and services exceeds the threshold
              established by this Code in any twelve consecutive calendar
              months is deemed to be a VAT payer…
            </p>
            <p>
              <b>2.</b> The obligation arises from the moment the threshold is
              crossed; the person shall register with the tax authority and
              issue invoices with VAT from the next taxable transaction.
            </p>
            <p>
              <b>3.</b> Turnover calculation shall include all supplies subject
              to VAT regardless of the place of supply…
            </p>
          </div>
          <div className="art-meta">
            <span>
              In force · <b>current</b>
            </span>
            <span>Last amend. 2024-12-18</span>
          </div>
        </div>

        <div className="section-divider">Also referenced</div>

        {[
          { tag: "RA TC · Art. 268", desc: "Registration procedure with SRC", pct: "92%" },
          { tag: "RA TC · Art. 270", desc: "VAT declaration periodicity", pct: "88%" },
          { tag: "SRC Ord. N-148", desc: "E-invoicing attributes", pct: "84%" },
          { tag: "Gov.Dec. 142-N", desc: "Late registration penalties", pct: "71%" },
        ].map((r) => (
          <div className="related" key={r.tag}>
            <span>
              <b>{r.tag}</b>
              <br />
              <span style={{ color: "var(--ink-2)" }}>{r.desc}</span>
            </span>
            <span className="pct">{r.pct}</span>
          </div>
        ))}

        <div className="section-divider">Context attached</div>
        <div className="doc">
          <span className="name">invoice_log_2025.pdf</span>
          <span>18pp · OCR ✓</span>
        </div>

        <div className="section-divider">Trace</div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10.5,
            lineHeight: 1.7,
            color: "var(--ink-3)",
            letterSpacing: "0.02em",
          }}
        >
          retrieval ▸ 12 candidates
          <br />
          rerank ▸ top 3 · score 0.84
          <br />
          grounding ▸ 3 / 3 claims
          <br />
          latency ▸ 3.2s · 420 tok
        </div>
      </aside>
    </div>
  );
}
