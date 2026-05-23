"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { brandText } from "@/lib/brand-text";

type DemoKey = "vat" | "draft" | "deadline";

interface DemoBody {
  h: string;
  p: React.ReactNode;
}

interface DemoCite {
  tag: string;
  label: string;
  quote: string;
}

interface Demo {
  q: string;
  queryLabel: string;
  conclusion: string;
  body: DemoBody[];
  cites: DemoCite[];
}

function useLiveDemos(t: ReturnType<typeof useTranslations>) {
  return useMemo((): Record<DemoKey, Demo> => {
    const codeStyle = {
      fontFamily: "var(--mono)",
      fontSize: 13,
      color: "var(--accent)",
      border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
      borderRadius: 6,
      padding: "2px 6px",
    } as const;
    const suffixStyle = { color: "var(--ink-3)", fontSize: 12.6 } as const;

    return {
      vat: {
        q: t("demoQuestion"),
        queryLabel: t("demoQueryLabel"),
        conclusion: t("demoAnswer"),
        body: [
          { h: t("demoVatBody1H"), p: t("demoVatBody1P") },
          { h: t("demoVatBody2H"), p: t("demoVatBody2P") },
        ],
        cites: [
          {
            tag: t("demoVatCite1Tag"),
            label: t("demoVatCite1Label"),
            quote: t("demoVatCite1Quote"),
          },
          {
            tag: t("demoVatCite2Tag"),
            label: t("demoVatCite2Label"),
            quote: t("demoVatCite2Quote"),
          },
          {
            tag: t("demoVatCite3Tag"),
            label: t("demoVatCite3Label"),
            quote: t("demoVatCite3Quote"),
          },
        ],
      },
      draft: {
        q: t("demoDraftQuestion"),
        queryLabel: t("demoDraftQueryLabel"),
        conclusion: t("demoDraftAnswer"),
        body: [
          { h: t("demoDraftBody1H"), p: t("demoDraftBody1P") },
          {
            h: t("demoDraftBody2H"),
            p: (
              <>
                <code style={codeStyle}>⬇ service_agreement.docx</code>
                &nbsp;
                <span style={suffixStyle}>{t("demoDraftDownloadSuffix")}</span>
              </>
            ),
          },
        ],
        cites: [
          {
            tag: t("demoDraftCite1Tag"),
            label: t("demoDraftCite1Label"),
            quote: t("demoDraftCite1Quote"),
          },
          {
            tag: t("demoDraftCite2Tag"),
            label: t("demoDraftCite2Label"),
            quote: t("demoDraftCite2Quote"),
          },
          {
            tag: t("demoDraftCite3Tag"),
            label: t("demoDraftCite3Label"),
            quote: t("demoDraftCite3Quote"),
          },
        ],
      },
      deadline: {
        q: t("demoDeadlineQuestion"),
        queryLabel: t("demoDeadlineQueryLabel"),
        conclusion: t("demoDeadlineAnswer"),
        body: [{ h: t("demoDeadlineBody1H"), p: t("demoDeadlineBody1P") }],
        cites: [
          {
            tag: t("demoDeadlineCite1Tag"),
            label: t("demoDeadlineCite1Label"),
            quote: t("demoDeadlineCite1Quote"),
          },
          {
            tag: t("demoDeadlineCite2Tag"),
            label: t("demoDeadlineCite2Label"),
            quote: t("demoDeadlineCite2Quote"),
          },
        ],
      },
    };
  }, [t]);
}

export function LiveDemo() {
  const t = useTranslations("landing.parity");
  const demos = useLiveDemos(t);
  const sourcesVerifiedLabel = t("demoSourcesVerified");
  const sourcesVerifiedText = sourcesVerifiedLabel.replace(/\s*✓\s*$/, "").trim();
  const uploadCodeStyle = {
    fontFamily: "var(--mono)",
    fontSize: 13,
    color: "var(--accent)",
    border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
    borderRadius: 6,
    padding: "2px 6px",
  } as const;

  const [active, setActive] = useState<DemoKey>("vat");
  const [expandedCite, setExpandedCite] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const demo = demos[active];
  const isDraftFlow = active === "draft";

  useEffect(() => {
    setExpandedCite(null);
    setTyped("");
    setIsTyping(true);

    let i = 0;
    const step = () => {
      i++;
      setTyped(demo.conclusion.slice(0, i));
      if (i < demo.conclusion.length) {
        timerRef.current = setTimeout(step, 14);
      } else {
        setIsTyping(false);
      }
    };
    timerRef.current = setTimeout(step, 14);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, demo]);

  return (
    <div>
      <div className="demo-frame" id="demo">
        <div className="demo-chrome">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>
          <div>{t("demoChromeMiddle")}</div>
          <div>⌘K</div>
        </div>
        <div className="demo-body">
          <div className="demo-tabs">
            <button
              type="button"
              className={`demo-tab${active === "vat" ? " active" : ""}`}
              onClick={() => setActive("vat")}
            >
              {t("demoTab1")}
            </button>
            <button
              type="button"
              className={`demo-tab${active === "draft" ? " active" : ""}`}
              onClick={() => setActive("draft")}
            >
              {t("demoTab2")}
            </button>
            <button
              type="button"
              className={`demo-tab${active === "deadline" ? " active" : ""}`}
              onClick={() => setActive("deadline")}
            >
              {t("demoTab3")}
            </button>
          </div>

          <div style={{ paddingBottom: 72 }} key={active}>
            <div className="msg-user fade-in">
              <div className="avatar">{t("demoUserShort")}</div>
              <div className="msg-content">
                <div className="msg-label">{demo.queryLabel}</div>
                <div
                  className="msg-text"
                  style={{ fontStyle: "italic", color: "var(--ink)" }}
                >
                  {brandText(demo.q)}
                </div>
              </div>
            </div>

            {isDraftFlow ? (
              <>
                <div className="msg-user msg-ai fade-in">
                  <div className="avatar ai">DL</div>
                  <div className="msg-content">
                    <div className="msg-label">{t("demoAssistantLabel")}</div>
                    <div className="msg-text">
                      <div className="conclusion">
                        {brandText(t("demoDraftClarifyPrompt"))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="msg-user fade-in">
                  <div className="avatar">{t("demoUserShort")}</div>
                  <div className="msg-content">
                    <div className="msg-label">{t("demoDraftClarifyReplyLabel")}</div>
                    <div className="msg-text" style={{ color: "var(--ink)" }}>
                      <p style={{ fontStyle: "italic" }}>{brandText(t("demoDraftClarifyReply"))}</p>
                      <p style={{ marginTop: 14 }}>
                        <code style={uploadCodeStyle}>⬆ {t("demoDraftUploadedDocName")}</code>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="msg-user msg-ai fade-in">
              <div className="avatar ai">DL</div>
              <div className="msg-content">
                <div className="msg-label">{t("demoAssistantLabel")}</div>
                <div className="msg-text">
                  <div className={`conclusion${isTyping ? " caret" : ""}`}>
                    {brandText(typed)}
                  </div>

                  {!isTyping && (
                    <>
                      {demo.body.map((b, idx) => (
                        <div key={b.h}>
                          <h4>{b.h}</h4>
                          <p style={isDraftFlow && idx === 1 ? { marginTop: 12 } : undefined}>
                            {typeof b.p === "string" ? brandText(b.p) : b.p}
                          </p>
                        </div>
                      ))}

                      <div className="citations">
                        <div className="citations-title">
                          <span style={{ color: "var(--accent)" }}>
                            {t("demoCitationsTitle")}
                          </span>
                          <span>
                            <span style={{ color: "var(--ink-3)" }}>{sourcesVerifiedText}</span>{" "}
                            <span style={{ color: "var(--accent)" }}>✓</span>
                          </span>
                        </div>
                        {demo.cites.map((c, i) => {
                          const citeId = `${active}-${c.tag}`;
                          const isExpanded = expandedCite === citeId;

                          return (
                          <div className={`cite${isExpanded ? " expanded" : ""}`} key={c.tag}>
                            <div className="cite-main">
                              <div className="cite-num">
                                [{String(i + 1).padStart(2, "0")}]
                              </div>
                              <div className="cite-body">
                                <b>{c.tag}</b> — {brandText(c.label)}
                              </div>
                              <button
                                className="cite-link"
                                type="button"
                                aria-expanded={isExpanded}
                                onClick={() => setExpandedCite(isExpanded ? null : citeId)}
                              >
                                <svg
                                  className="cite-expand-icon"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M3 4.5 6 7.5 9 4.5"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                            {isExpanded ? (
                              <div className="cite-detail">
                                <span className="cite-detail-label">Quote from legislation</span>
                                <p>{brandText(c.quote)}</p>
                              </div>
                            ) : null}
                          </div>
                        )})}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="composer">
            <span className="lang-tag">{t("demoComposerLang")}</span>
            <input
              placeholder={t("demoInputPlaceholder")}
              readOnly
            />
            <button className="send" aria-label="Send" type="button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7h9m-3-3 3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p className="demo-note">{brandText(t("demoNote"))}</p>
    </div>
  );
}
