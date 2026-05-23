"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { brandText } from "@/lib/brand-text";

interface ContactFormState {
  fullName: string;
  email: string;
  companyName: string;
  companySize: string;
  message: string;
}

const INITIAL_STATE: ContactFormState = {
  fullName: "",
  email: "",
  companyName: "",
  companySize: "",
  message: "",
};

export function ContactSalesForm() {
  const tPricing = useTranslations("landing.pricing");
  const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const sizeOptions = tPricing.raw("contactSales.sizeOptions") as string[];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType(null);

    fetch("/api/contact-sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(errorPayload?.error || tPricing("contactSales.error"));
        }

        setForm(INITIAL_STATE);
        setStatusMessage(tPricing("contactSales.success"));
        setStatusType("success");
      })
      .catch((error: unknown) => {
        setStatusMessage(
          error instanceof Error ? error.message : tPricing("contactSales.error"),
        );
        setStatusType("error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-sales-shell">
      <div className="contact-sales-copy">
        <p className="section-label">{tPricing("contactSales.sectionLabel")}</p>
        <h2>
          {tPricing("contactSales.titleMain")}
          <br />
          <em>{tPricing("contactSales.titleAccent")}</em>
        </h2>
        <p>{brandText(tPricing("contactSales.description"))}</p>
      </div>

      <form className="contact-sales-form" onSubmit={onSubmit}>
        <div className="contact-sales-grid">
          <label>
            <span>{tPricing("contactSales.fields.fullName")}</span>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            />
          </label>

          <label>
            <span>{tPricing("contactSales.fields.email")}</span>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <label>
            <span>{tPricing("contactSales.fields.companyName")}</span>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={form.companyName}
              onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
            />
          </label>

          <label>
            <span>{tPricing("contactSales.fields.companySize")}</span>
            <select
              required
              disabled={isSubmitting}
              value={form.companySize}
              onChange={(event) => setForm((prev) => ({ ...prev, companySize: event.target.value }))}
            >
              <option value="" disabled>
                {tPricing("contactSales.fields.companySize")}
              </option>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="contact-sales-message">
          <span>{tPricing("contactSales.fields.message")}</span>
          <textarea
            required
            rows={5}
            disabled={isSubmitting}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? tPricing("contactSales.submittingCta") : tPricing("contactSales.submitCta")}
        </button>
        {statusMessage ? (
          <p className={`contact-sales-status ${statusType === "error" ? "error" : "success"}`}>
            {statusMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
