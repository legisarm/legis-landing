"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Noto_Sans_Armenian } from "next/font/google";
import { DoLegalWordmark } from "./dolegal-wordmark";
import { DocxFileIcon, PdfFileIcon } from "./hero-document-icons";

/** ~17s per slide for a calmer preview pace */
const ROTATE_MS = 17_000;
const TYPE_MS = 32;
const ANSWER_TYPE_MS = 3;
const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-sans-armenian",
  weight: ["600"],
});

type DropPhase = "idle" | "dropped" | "analyzing";

type PreviewUseCase = {
  question: string;
  answerTitle: string;
  answerBody: string;
  tags?: string[];
  withAttachment?: boolean;
  withExport?: boolean;
  exportPdfName?: string;
  exportDocxName?: string;
};

export function HeroDoodleCanvas() {
  const locale = useLocale();
  const t = useTranslations("landing");
  const useCases = useMemo(
    () => t.raw("hero.previewUseCases") as PreviewUseCase[],
    [t]
  );
  const slideCount = useCases.length;

  const [slide, setSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [displayQuestion, setDisplayQuestion] = useState("");
  const [composerText, setComposerText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [requestSliding, setRequestSliding] = useState(false);
  const [displayAnswerBody, setDisplayAnswerBody] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [dropPhase, setDropPhase] = useState<DropPhase>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const s = useCases[slide % slideCount] ?? useCases[0];
  const needsAttachment = Boolean(s.withAttachment);
  const showExport = Boolean(s.withExport);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReducedMotion(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setSlide((x) => (x + 1) % slideCount), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, slideCount]);

  useEffect(() => {
    if (!needsAttachment) return;

    if (reducedMotion) {
      const raf = requestAnimationFrame(() => setDropPhase("analyzing"));
      return () => cancelAnimationFrame(raf);
    }

    const kick = window.setTimeout(() => {
      setDropPhase("idle");
    }, 0);
    const t1 = window.setTimeout(() => setDropPhase("dropped"), 1_400);
    const t2 = window.setTimeout(() => setDropPhase("analyzing"), 3_300);
    return () => {
      clearTimeout(kick);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [slide, reducedMotion, needsAttachment]);

  const contextReady = !needsAttachment || reducedMotion || dropPhase === "analyzing";

  const submitQuestion = (question: string) => {
    const value = question.trim();
    if (!value) return;
    setDisplayQuestion(value);
    setComposerText("");
    setQuestionSent(true);
    setRequestSliding(true);
    window.requestAnimationFrame(() => setRequestSliding(false));
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (sendTimerRef.current) {
      clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }

    if (!contextReady) {
      if (!reducedMotion) {
        const clear = window.setTimeout(() => {
          setComposerText("");
          setDisplayQuestion("");
          setDisplayAnswerBody("");
          setQuestionSent(false);
          setRequestSliding(false);
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
      timerRef.current = setTimeout(step, delay);
    };

    const kickoff = window.setTimeout(() => {
      setComposerText("");
      setDisplayQuestion("");
      setDisplayAnswerBody("");
      setQuestionSent(false);
      setRequestSliding(false);
      setTypingDone(false);
      timerRef.current = setTimeout(step, TYPE_MS * 1.1);
    }, 0);

    return () => {
      clearTimeout(kickoff);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, [slide, s.question, reducedMotion, contextReady]);

  useEffect(() => {
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }

    if (!questionSent) {
      setDisplayAnswerBody("");
      setTypingDone(false);
      return;
    }

    if (reducedMotion) {
      const raf = requestAnimationFrame(() => {
        setDisplayAnswerBody(s.answerBody);
        setTypingDone(true);
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
        return;
      }
      const ch = full[idx - 1];
      const delay = ch === " " || ch === "\n" ? ANSWER_TYPE_MS * 0.55 : ANSWER_TYPE_MS;
      answerTimerRef.current = setTimeout(typeAnswer, delay);
    };

    const startDelay = window.setTimeout(() => {
      setTypingDone(true);
      answerTimerRef.current = setTimeout(typeAnswer, ANSWER_TYPE_MS);
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, [questionSent, s.answerBody, reducedMotion]);

  const showComposerCaret =
    contextReady && !reducedMotion && !questionSent && composerText.length < s.question.length;

  const exportPdf = s.exportPdfName ?? t("hero.previewExportPdfName");
  const exportDocx = s.exportDocxName ?? t("hero.previewExportDocxName");
  const tags = s.tags && s.tags.length > 0 ? s.tags : null;

  const questionBody = (
    <div
      className={`min-h-[4.5rem] px-4 py-4 text-[15px] leading-[1.55] text-black/[0.82] md:min-h-[5rem] md:px-5 md:text-[16px] ${
        needsAttachment ? "bg-white" : "bg-neutral-50/90"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      {!contextReady && needsAttachment ? (
        <span className="text-black/28">{t("hero.previewWaitingQuestion")}</span>
      ) : !questionSent ? (
        <span className="text-black/28">{t("hero.previewWaitingQuestion")}</span>
      ) : (
        <>
          <span
            className={`inline-block whitespace-pre-wrap transition-all duration-300 ease-out ${
              requestSliding ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {displayQuestion}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className={`relative mx-auto w-full max-w-3xl ${notoSansArmenian.variable}`}>
      <div className="hero-preview-card-idle flex h-[555px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_48px_rgba(0,0,0,0.07)] md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <DoLegalWordmark className="[font-family:var(--font-playfair)] text-xl font-semibold tracking-tight text-[#1d1d1f] md:text-2xl" />
          <span className="shrink-0 rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-[11px] font-medium tracking-wide text-black/50">
            {t("hero.previewBadge")}
          </span>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <section>
            <p
              className={`mb-3 text-[11px] uppercase tracking-[0.14em] text-black/40 ${
                locale === "hy" ? "font-semibold [font-family:var(--font-noto-sans-armenian)]" : "font-medium"
              }`}
            >
              {t("hero.previewQuestionLabel")}
            </p>

            {needsAttachment ? (
              <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="border-b border-black/[0.06] bg-gradient-to-b from-neutral-50/95 to-neutral-50/40 px-4 py-3.5 md:px-5">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-black/38">
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
                          <p className="text-[13px] leading-snug text-black/70 md:text-[14px]">
                            {t("hero.previewAttachmentIdle")}
                          </p>
                          <p className="mt-1 text-[11px] text-black/38">{t("hero.previewDropzoneFormats")}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 sm:items-center">
                        <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                          <PdfFileIcon />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-[12px] font-semibold text-[#1d1d1f] md:text-[13px]">
                            {t("hero.previewAnalyzedFile")}
                          </p>
                          {dropPhase === "dropped" ? (
                            <p className="mt-1 text-[12px] text-black/45">{t("hero.previewAnalyzing")}</p>
                          ) : (
                            <>
                              <p className="mt-1 text-[12px] font-medium text-black/65">{t("hero.previewAnalyzing")}</p>
                              <p className="mt-0.5 text-[12px] leading-relaxed text-black/42">
                                {t("hero.previewAnalyzeDetail")}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {questionBody}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                {questionBody}
              </div>
            )}
          </section>

          {questionSent ? (
            <section key={slide} className="mt-8 space-y-8">
              <div>
                <p
                  className={`hero-ans-label mb-3 text-[11px] uppercase tracking-[0.14em] text-black/40 ${
                    locale === "hy" ? "font-semibold [font-family:var(--font-noto-sans-armenian)]" : "font-medium"
                  }`}
                >
                  {t("hero.previewAnswerLabel")}
                </p>
                <div className="rounded-xl border border-black/[0.06] bg-white px-4 py-4 md:px-5 md:py-5">
                  <p
                    className={`hero-ans-1 text-[13px] font-semibold text-[#1d1d1f] md:text-sm ${
                      locale === "hy" ? "[font-family:var(--font-noto-sans-armenian)]" : ""
                    }`}
                  >
                    {s.answerTitle}
                  </p>
                  <p className="hero-ans-2 mt-2 line-clamp-4 text-[14px] leading-relaxed text-black/65 md:line-clamp-none md:text-[15px]">
                    {displayAnswerBody}
                  </p>
                  {typingDone && tags ? (
                    <p className="hero-ans-3 mt-4 border-t border-black/[0.06] pt-4 text-[12px] leading-relaxed text-black/45">
                      {tags.join(" · ")}
                    </p>
                  ) : null}

                  {typingDone && showExport ? (
                    <div className="hero-ans-export mt-5 border-t border-black/[0.06] pt-5">
                      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-black/40">
                        {t("hero.previewExportLabel")}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-lg border border-black/[0.07] bg-neutral-50/90 px-3 py-2.5">
                          <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                            <PdfFileIcon />
                          </span>
                          <span className="truncate font-mono text-[12px] font-medium text-black/75">{exportPdf}</span>
                        </div>
                        <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-lg border border-black/[0.07] bg-neutral-50/90 px-3 py-2.5">
                          <span className="inline-flex h-10 w-8 shrink-0 items-center justify-center">
                            <DocxFileIcon />
                          </span>
                          <span className="truncate font-mono text-[12px] font-medium text-black/75">{exportDocx}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5">
              <div className="flex min-h-[42px] flex-1 items-center rounded-lg border border-black/[0.08] bg-neutral-50/80 px-3 text-[13px] text-black/70">
                <span className="line-clamp-1 whitespace-pre-wrap">{composerText}</span>
                {showComposerCaret ? (
                  <span
                    className="ml-1 inline-block min-h-[1em] w-[2px] animate-pulse bg-[#1d1d1f]/45 motion-reduce:animate-none"
                    aria-hidden
                  />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => submitQuestion(composerText || s.question)}
                disabled={!contextReady || questionSent}
                className="min-h-[42px] rounded-lg bg-[#1d1d1f] px-4 text-[12px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t("hero.previewSend")}
              </button>
            </div>
          </div>
        </div>

        {!reducedMotion ? (
          <div className="mt-8 h-[3px] overflow-hidden rounded-full bg-black/[0.06]" aria-hidden>
            <div
              key={slide}
              className="hero-preview-progress h-full origin-left rounded-full bg-black/25"
              style={{ animationDuration: `${ROTATE_MS}ms` }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
