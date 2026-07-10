"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Fraunces, JetBrains_Mono, Manrope, Noto_Sans_Armenian } from "next/font/google";
import { BrandLogo } from "@/app/_components/BrandLogo";
import { DocxFileIcon, PdfFileIcon } from "./hero-document-icons";

/**
 * Assistant “responding” stream uses {@link ANSWER_TYPE_MS} only.
 * Everything else is scaled by REST_PACE so the preview feels slower outside the reply typing.
 */
const REST_PACE = 1.5;

const TYPE_MS = 32 * REST_PACE;
const ANSWER_TYPE_MS = 3;
const GAP_BETWEEN_TURNS_MS = 1_500 * REST_PACE;
const DROP_TO_FILE_MS = 1_400 * REST_PACE;
const DROP_TO_ANALYZING_MS = 3_300 * REST_PACE;
const BEFORE_ANSWER_STREAM_MS = 500 * REST_PACE;

/** Distinct from marketing shell (Outfit / Playfair) — reads as an embedded product preview */
const previewUi = Manrope({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-hero-preview-ui",
  weight: ["400", "500", "600", "700"],
});

const previewBrand = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hero-preview-brand",
  weight: ["500", "600", "700"],
});

const previewMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-hero-preview-mono",
  weight: ["400", "500"],
});

const previewHy = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-hero-preview-hy",
  weight: ["400", "500", "600"],
});

type DropPhase = "idle" | "dropped" | "analyzing";

type PreviewCitation = {
  instrument: string;
  locator: string;
  note?: string;
};

type PreviewUseCase = {
  question: string;
  answerTitle: string;
  answerBody: string;
  citations?: PreviewCitation[];
  tags?: string[];
  withAttachment?: boolean;
  withExport?: boolean;
  exportPdfName?: string;
  exportDocxName?: string;
};

type ThreadAssistant = {
  kind: "assistant";
  title: string;
  body: string;
  citations?: PreviewCitation[];
  tags?: string[];
  showExport?: boolean;
  exportPdfName?: string;
  exportDocxName?: string;
};

type ThreadUser = { kind: "user"; text: string };
type ThreadItem = ThreadUser | ThreadAssistant;

type ChatPhase = "compose" | "answer" | "pause";

export function HeroDoodleCanvas() {
  const locale = useLocale();
  const t = useTranslations("landing");
  const useCases = useMemo(
    () => t.raw("hero.previewUseCases") as PreviewUseCase[],
    [t]
  );
  const slideCount = useCases.length;

  const [turnIndex, setTurnIndex] = useState(0);
  const [items, setItems] = useState<ThreadItem[]>([]);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("compose");

  const [reducedMotion, setReducedMotion] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [displayAnswerBody, setDisplayAnswerBody] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [dropPhase, setDropPhase] = useState<DropPhase>("idle");

  const timerRef = useRef<number | null>(null);
  const sendTimerRef = useRef<number | null>(null);
  const answerTimerRef = useRef<number | null>(null);
  const gapTimerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const s = useCases[turnIndex % slideCount] ?? useCases[0];
  const needsAttachment = Boolean(s.withAttachment);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReducedMotion(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (!needsAttachment) return;

    if (reducedMotion) {
      const raf = requestAnimationFrame(() => setDropPhase("analyzing"));
      return () => cancelAnimationFrame(raf);
    }

    const kick = window.setTimeout(() => {
      setDropPhase("idle");
    }, 0);
    const t1 = window.setTimeout(() => setDropPhase("dropped"), DROP_TO_FILE_MS);
    const t2 = window.setTimeout(() => setDropPhase("analyzing"), DROP_TO_ANALYZING_MS);
    return () => {
      clearTimeout(kick);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [turnIndex, reducedMotion, needsAttachment]);

  const contextReady = !needsAttachment || reducedMotion || dropPhase === "analyzing";

  const submitQuestion = useCallback((question: string) => {
    const value = question.trim();
    if (!value) return;
    setItems((prev) => [...prev, { kind: "user", text: value }]);
    setComposerText("");
    setQuestionSent(true);
    setChatPhase("answer");
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [items, displayAnswerBody, chatPhase, reducedMotion]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }

    if (chatPhase !== "compose") {
      return;
    }

    if (!contextReady) {
      if (!reducedMotion) {
        const clear = window.setTimeout(() => {
          setComposerText("");
          setQuestionSent(false);
          setTypingDone(false);
        }, 0);
        return () => clearTimeout(clear);
      }
      return;
    }

    if (reducedMotion) {
      const raf = requestAnimationFrame(() => {
        setComposerText(s.question);
        submitQuestion(s.question);
      });
      return () => cancelAnimationFrame(raf);
    }

    const full = s.question;
    let idx = 0;

    const step = () => {
      idx += 1;
      setComposerText(full.slice(0, idx));
      if (idx >= full.length) {
        sendTimerRef.current = window.setTimeout(() => submitQuestion(full), TYPE_MS * 10);
        return;
      }
      const ch = full[idx - 1];
      const delay = ch === " " || ch === "\n" ? TYPE_MS * 0.45 : TYPE_MS;
      timerRef.current = window.setTimeout(step, delay);
    };

    const kickoff = window.setTimeout(() => {
      setComposerText("");
      setQuestionSent(false);
      setTypingDone(false);
      timerRef.current = window.setTimeout(step, TYPE_MS * 1.1);
    }, 0);

    return () => {
      clearTimeout(kickoff);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
    };
  }, [turnIndex, s.question, reducedMotion, contextReady, chatPhase, submitQuestion]);

  useEffect(() => {
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }

    if (chatPhase !== "answer" || !questionSent) {
      if (chatPhase !== "answer") {
        setDisplayAnswerBody("");
        setTypingDone(false);
      }
      return;
    }

    if (reducedMotion) {
      const raf = requestAnimationFrame(() => {
        setDisplayAnswerBody(s.answerBody);
        setTypingDone(true);
        setItems((prev) => [
          ...prev,
          {
            kind: "assistant",
            title: s.answerTitle,
            body: s.answerBody,
            citations: s.citations,
            tags: s.tags,
            showExport: s.withExport,
            exportPdfName: s.exportPdfName,
            exportDocxName: s.exportDocxName,
          },
        ]);
        setQuestionSent(false);
        setDisplayAnswerBody("");
        setTypingDone(false);
        gapTimerRef.current = window.setTimeout(() => {
          setTurnIndex((i) => (i + 1) % slideCount);
          setChatPhase("compose");
        }, GAP_BETWEEN_TURNS_MS);
      });
      return () => cancelAnimationFrame(raf);
    }

    setDisplayAnswerBody("");
    setTypingDone(false);
    let idx = 0;
    const full = s.answerBody;

    const typeAnswer = () => {
      idx += 1;
      setDisplayAnswerBody(full.slice(0, idx));
      if (idx >= full.length) {
        setTypingDone(true);
        setItems((prev) => [
          ...prev,
          {
            kind: "assistant",
            title: s.answerTitle,
            body: s.answerBody,
            citations: s.citations,
            tags: s.tags,
            showExport: s.withExport,
            exportPdfName: s.exportPdfName,
            exportDocxName: s.exportDocxName,
          },
        ]);
        setQuestionSent(false);
        setDisplayAnswerBody("");
        setTypingDone(false);
        setChatPhase("pause");
        gapTimerRef.current = window.setTimeout(() => {
          setTurnIndex((i) => (i + 1) % slideCount);
          setChatPhase("compose");
        }, GAP_BETWEEN_TURNS_MS);
        return;
      }
      const ch = full[idx - 1];
      const delay = ch === " " || ch === "\n" ? ANSWER_TYPE_MS * 0.55 : ANSWER_TYPE_MS;
      answerTimerRef.current = window.setTimeout(typeAnswer, delay);
    };

    const startDelay = window.setTimeout(() => {
      setTypingDone(true);
      answerTimerRef.current = window.setTimeout(typeAnswer, ANSWER_TYPE_MS);
    }, BEFORE_ANSWER_STREAM_MS);

    return () => {
      clearTimeout(startDelay);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, [chatPhase, questionSent, s, reducedMotion, slideCount]);

  useEffect(() => {
    return () => {
      if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    };
  }, []);

  const showComposerCaret =
    contextReady &&
    !reducedMotion &&
    chatPhase === "compose" &&
    !questionSent &&
    composerText.length < s.question.length;

  const renderAssistantCard = (
    uc: PreviewUseCase,
    bodyText: string,
    opts: { streaming: boolean }
  ) => {
    const tags = uc.tags && uc.tags.length > 0 ? uc.tags : null;
    const cite = uc.citations && uc.citations.length > 0 ? uc.citations : null;
    const pdf = uc.exportPdfName ?? t("hero.previewExportPdfName");
    const docx = uc.exportDocxName ?? t("hero.previewExportDocxName");
    return (
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm shadow-slate-900/[0.04]">
        <div className="px-4 py-4 md:px-5 md:py-5">
          <p
            className={`hero-ans-1 text-[13px] font-semibold text-slate-900 md:text-sm ${
              locale === "am" ? "[font-family:var(--font-hero-preview-hy)]" : ""
            }`}
          >
            {uc.answerTitle}
          </p>
          <p className="hero-ans-2 mt-2 line-clamp-4 text-[14px] leading-relaxed text-slate-600 md:line-clamp-none md:text-[15px]">
            {bodyText}
          </p>
          {!opts.streaming && tags ? (
            <p className="hero-ans-3 mt-3 text-[11px] leading-relaxed text-slate-400">
              {tags.join(" · ")}
            </p>
          ) : null}
        </div>
        {!opts.streaming && cite ? (
          <div className="hero-ans-cite border-t border-slate-200/35 bg-slate-50/55 px-4 py-2.5 md:px-5 md:py-3">
            <p className="mb-1.5 text-[9px] font-normal uppercase tracking-[0.16em] text-slate-400/90">
              {t("hero.previewSourcesLabel")}
            </p>
            <ul className="space-y-1.5">
              {cite.map((c, i) => (
                <li key={`${c.instrument}-${i}`} className="text-[10px] font-normal leading-snug text-slate-500/95">
                  <span className="text-slate-400/95">{c.instrument}</span>
                  <span className="text-slate-300/90"> · </span>
                  <span className="text-slate-500/90">{c.locator}</span>
                  {c.note ? (
                    <span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-slate-400/85">
                      {c.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {!opts.streaming && uc.withExport ? (
          <div className="hero-ans-export border-t border-slate-200/50 bg-white px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-5">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
              {t("hero.previewExportLabel")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/90 px-3 py-2.5">
                <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                  <PdfFileIcon />
                </span>
                <span className="truncate text-[12px] font-medium text-slate-700 [font-family:var(--font-hero-preview-mono)]">
                  {pdf}
                </span>
              </div>
              <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/90 px-3 py-2.5">
                <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                  <DocxFileIcon />
                </span>
                <span className="truncate text-[12px] font-medium text-slate-700 [font-family:var(--font-hero-preview-mono)]">
                  {docx}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const assistantFromThread = (item: ThreadAssistant): PreviewUseCase => ({
    question: "",
    answerTitle: item.title,
    answerBody: item.body,
    citations: item.citations,
    tags: item.tags,
    withExport: item.showExport,
    exportPdfName: item.exportPdfName,
    exportDocxName: item.exportDocxName,
  });

  const cardFontClass =
    locale === "am" ? "[font-family:var(--font-hero-preview-hy)]" : "[font-family:var(--font-hero-preview-ui)]";

  return (
    <div
      className={`${previewUi.variable} ${previewBrand.variable} ${previewMono.variable} ${previewHy.variable} relative mx-auto w-full`}
    >
      <div
        className={`hero-preview-card-idle flex h-[555px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 p-6 shadow-[0_1px_0_rgba(15,23,42,0.06),0_22px_60px_rgba(15,23,42,0.11)] ring-1 ring-white/75 md:p-8 ${cardFontClass}`}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
          <BrandLogo className="brand-logo !h-7 w-auto md:!h-8" />
          <span className="shrink-0 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 text-[11px] font-medium tracking-wide text-slate-500">
            {t("hero.previewBadge")}
          </span>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
          {items.map((item, i) =>
            item.kind === "user" ? (
              <section key={`u-${i}`}>
                <p
                  className={`mb-3 text-[11px] uppercase tracking-[0.14em] text-slate-500 ${
                    locale === "am" ? "font-semibold" : "font-medium"
                  }`}
                >
                  {t("hero.previewQuestionLabel")}
                </p>
                <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] shadow-sm shadow-slate-900/5">
                  <div className="bg-slate-100/80 px-4 py-4 text-[15px] leading-[1.55] text-slate-800 md:px-5 md:text-[16px]">
                    <span className="inline-block whitespace-pre-wrap">{item.text}</span>
                  </div>
                </div>
              </section>
            ) : (
              <section key={`a-${i}`}>
                <p
                  className={`hero-ans-label mb-3 text-[11px] uppercase tracking-[0.14em] text-slate-500 ${
                    locale === "am" ? "font-semibold" : "font-medium"
                  }`}
                >
                  {t("hero.previewAnswerLabel")}
                </p>
                {renderAssistantCard(assistantFromThread(item), item.body, { streaming: false })}
              </section>
            )
          )}

          {chatPhase === "answer" && questionSent ? (
            <section key="streaming-answer">
              <p
                className={`hero-ans-label mb-3 text-[11px] uppercase tracking-[0.14em] text-slate-500 ${
                  locale === "am" ? "font-semibold" : "font-medium"
                }`}
              >
                {t("hero.previewAnswerLabel")}
              </p>
              {renderAssistantCard(s, displayAnswerBody, { streaming: true })}
            </section>
          ) : null}
        </div>

        {needsAttachment && chatPhase === "compose" ? (
          <div className="mt-4 shrink-0 overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] shadow-sm shadow-slate-900/5">
            <div className="border-b border-slate-200/60 bg-gradient-to-b from-slate-100/95 to-slate-50/50 px-4 py-3.5 md:px-5">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                {t("hero.previewAttachmentLabel")}
              </p>
              <div
                key={dropPhase}
                className="hero-context-strip min-h-[3.25rem] motion-safe:transition-opacity motion-safe:duration-300"
              >
                {dropPhase === "idle" ? (
                  <div className="flex gap-3">
                    <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-black/8 bg-white shadow-sm">
                      <PdfFileIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-slate-600 md:text-[14px]">
                        {t("hero.previewAttachmentIdle")}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">{t("hero.previewDropzoneFormats")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 sm:items-center">
                    <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                      <PdfFileIcon />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-slate-800 [font-family:var(--font-hero-preview-mono)] md:text-[13px]">
                        {t("hero.previewAnalyzedFile")}
                      </p>
                      {dropPhase === "dropped" ? (
                        <p className="mt-1 text-[12px] text-slate-500">{t("hero.previewAnalyzing")}</p>
                      ) : (
                        <>
                          <p className="mt-1 text-[12px] font-medium text-slate-600">{t("hero.previewAnalyzing")}</p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">
                            {t("hero.previewAnalyzeDetail")}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-auto shrink-0 pt-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 p-2.5 shadow-sm shadow-slate-900/5">
            <div className="flex min-h-[42px] flex-1 items-center rounded-lg border border-slate-200/70 bg-slate-50/90 px-3 text-[13px] text-slate-700">
              <span className="line-clamp-1 whitespace-pre-wrap">{composerText}</span>
              {showComposerCaret ? (
                <span
                  className="ml-1 inline-block min-h-[1em] w-[2px] animate-pulse bg-slate-600/50 motion-reduce:animate-none"
                  aria-hidden
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => submitQuestion(composerText || s.question)}
              disabled={!contextReady || chatPhase !== "compose" || questionSent}
              className="min-h-[42px] shrink-0 rounded-full bg-[var(--brand-blue)] px-6 text-[12px] font-medium tracking-wide text-white transition hover:bg-[var(--accent-2)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--brand-blue)]"
            >
              {t("hero.previewSend")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
