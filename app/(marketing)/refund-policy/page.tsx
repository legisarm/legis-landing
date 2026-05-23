import type { Metadata } from "next";
import { brandText } from "@/lib/brand-text";

export const metadata: Metadata = {
  title: "Refund Policy | doLegal",
  description:
    "Understand doLegal refund eligibility for subscriptions and top-ups, chargeback handling, and how to submit a refund request.",
};

export default function RefundPolicyPage() {
  return (
    <main className="section policy-legal">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <p className="section-label">Legal</p>
        <h1 className="section-title">
          Refund <em>Policy</em>
        </h1>
        <p className="section-sub" style={{ fontWeight: 700 }}>
          {brandText(
            "Last updated: April 22, 2026. This policy explains when doLegal subscription and top-up payments may be refunded.",
          )}
        </p>

        <section style={{ marginTop: 32 }}>
          <h2>1. Merchant of record</h2>
          <p>
            Payments are processed by Paddle, our merchant of record. Paddle may handle payment
            operations, tax, and chargeback workflows according to its platform rules.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>2. Subscription refunds</h2>
          <p>
            You may request a refund for the most recent subscription charge within 14 calendar days
            of purchase or renewal if usage on that billing cycle is minimal and the request is made
            in good faith.
          </p>
          <p>
            Refunds may be denied where there is substantial service consumption, policy abuse,
            repeated refund requests, fraud indicators, or violation of the Terms of Service.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>3. Top-up purchases</h2>
          <p>
            One-time token top-ups are generally non-refundable once consumed in whole or in part.
            If a top-up was purchased by mistake and remains unused, contact us within 7 calendar
            days and we will review eligibility case by case.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>4. Cancellation</h2>
          <p>
            Canceling a subscription stops future renewals. Cancellation does not automatically
            generate a refund for charges already processed, except where required by law or granted
            under this policy.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>5. Chargebacks</h2>
          <p>
            If you believe a transaction is unauthorized, contact us first so we can investigate and
            help resolve quickly. Fraudulent or abusive chargebacks may lead to account suspension.
          </p>
        </section>

        <section style={{ marginTop: 24, marginBottom: 24 }}>
          <h2>6. How to request a refund</h2>
          <p>
            Email <a href="mailto:hello@dolegal.am">hello@dolegal.am</a> with your account email,
            Paddle transaction ID/receipt, and reason for request. We usually review requests within
            5 business days.
          </p>
        </section>
      </div>
    </main>
  );
}
