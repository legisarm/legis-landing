"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { brandText } from "@/lib/brand-text";

interface WaitlistProps {
  heading?: React.ReactNode;
  body?: React.ReactNode;
}

export function Waitlist({ heading, body }: WaitlistProps) {
  const t = useTranslations("landing.earlyAccess");
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const defaultHeading = (
    <>
      {t("titleMain")}
      <br />
      <em>{t("titleAccent")}</em>
    </>
  );

  const defaultBody = <>{brandText(t("description"))}</>;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting || done) return;

    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(errorPayload?.error || "Unable to join waitlist right now.");
      }

      setDone(true);
      setEmail("");
      setStatusMessage("Thanks! You are on the early-access list.");
      setStatusType("success");
      setTimeout(() => {
        setStatusMessage("");
        setStatusType(null);
      }, 5000);
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="waitlist" id="waitlist">
      <div className="wrap">
        <p className="section-label">{t("sectionLabel")}</p>
        <div className="waitlist-grid">
          <div>
            <h2>{heading || defaultHeading}</h2>
            <p>{body || defaultBody}</p>
          </div>
          <div>
            <form className="waitlist-form" onSubmit={onSubmit}>
              <input
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                disabled={done || isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" disabled={done || isSubmitting}>
                {isSubmitting ? "Submitting..." : t("buttonLabel")}
              </button>
            </form>
            {statusMessage ? (
              <p
                className={`waitlist-status ${statusType === "error" ? "error" : "success"}`}
                role="status"
                aria-live="polite"
              >
                {statusMessage}
              </p>
            ) : null}
            <p className="waitlist-foot">{brandText(t("footnote"))}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
