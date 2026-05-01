import type { Metadata } from "next";
import {useTranslations} from "next-intl";
import { Footer } from "../../_components/Footer";
import { Masthead } from "../../_components/Masthead";
import { brandText } from "@/lib/brand-text";

export const metadata: Metadata = {
  title: "Terms of Service | doLegal",
  description:
    "Read doLegal Terms of Service covering subscriptions, acceptable use, billing, refunds, liability, and legal terms for using the platform.",
};

export default function TermsOfServicePage() {
  const tNav = useTranslations("nav");
  const nav = [
    { href: "/#features", label: tNav("features") },
    { href: "/#how", label: tNav("howItWorks") },
    { href: "/#who", label: tNav("audience") },
    { href: "/pricing", label: tNav("pricing") },
    { href: "/#faq", label: tNav("faq") },
  ];

  return (
    <>
      <Masthead nav={nav} />
      <main className="section policy-legal">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <p className="section-label">Legal</p>
          <h1 className="section-title">
            Terms of <em>Service</em>
          </h1>
          <p className="section-sub" style={{ fontWeight: 700 }}>
            {brandText(
              "Last updated: April 22, 2026. These Terms govern access to and use of doLegal.",
            )}
          </p>

        <section style={{ marginTop: 32 }}>
          <h2>1. Operator and acceptance</h2>
          <p>
            These Terms are between you and <strong>[LEGAL ENTITY NAME]</strong>{" "}
            {brandText(
              "(doLegal, we, us, our), a company registered in the Republic of Armenia with registered address at [REGISTERED ADDRESS]. By accessing or using doLegal, you agree to these Terms. If you use doLegal on behalf of an organization, you confirm you have authority to bind that organization.",
            )}
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>2. Service description</h2>
          <p>
            {brandText(
              "doLegal is a subscription-based software service for Armenian legal and tax research, document drafting, and related productivity workflows. Features may include AI-assisted answers, article-level citations, drafting tools, file upload, and export features.",
            )}
          </p>
          <p>
            {brandText(
              "doLegal is an information and drafting tool, not a law firm and not a substitute for professional legal advice. You remain responsible for reviewing outputs and decisions.",
            )}
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>3. Accounts and eligibility</h2>
          <p>
            You must provide accurate account information and keep credentials secure. You are
            responsible for all activity under your account. You must promptly notify us of
            unauthorized access.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>4. Plans, billing, and taxes</h2>
          <p>
            Paid access is offered on recurring subscription plans and optional one-time top-ups as
            shown on our pricing page. Prices are listed in AMD unless otherwise stated and are
            exclusive of applicable taxes, including VAT, unless expressly stated otherwise.
          </p>
          <p>
            We use Paddle as our merchant of record for payments, billing, and tax handling at
            checkout. By purchasing, you also agree to Paddle&apos;s buyer terms as presented during
            checkout.
          </p>
          <p>
            {brandText(
              "Certain features are metered in tokens. A token is a unit of AI processing — roughly 0.75 words of typical text. Your subscription refreshes a fixed token allowance each billing cycle; optional top-ups increase your balance without changing your plan tier.",
            )}
          </p>
          <p>
            {brandText(
              "Illustrative token ranges for typical doLegal workflows (non-binding estimates; actual usage depends on prompts, attachments, and model behavior):",
            )}
          </p>
          <ul>
            <li>
              Short legal question and concise answer (e.g. when VAT registration is mandatory):
              approximately 500–1,500 tokens.
            </li>
            <li>
              Longer answer with extensive citations (e.g. tax filing calendar, cross-referenced):
              approximately 2,000–4,000 tokens.
            </li>
            <li>
              Contract draft from a prompt (NDA, employment, service agreement): approximately
              6,000–12,000 tokens.
            </li>
            <li>
              Document comparison from two PDF uploads, with redline and article mapping:
              approximately 10,000–20,000 tokens.
            </li>
            <li>
              Full case-style review (uploaded judgment plus a thread of about 5–10 questions):
              approximately 15,000–35,000 tokens.
            </li>
          </ul>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>5. Renewals, changes, and cancellation</h2>
          <p>
            Subscriptions renew automatically at the end of each billing cycle unless canceled
            before renewal. You may upgrade, downgrade, or cancel from your billing settings.
            Unless otherwise stated at checkout, upgrades may apply immediately and downgrades may
            apply from the next billing cycle.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>6. Refunds</h2>
          <p>
            Refund eligibility is governed by our Refund Policy available at
            <strong> /refund-policy</strong>, which forms part of these Terms.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>7. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for unlawful, fraudulent, or abusive purposes.</li>
            <li>Reverse engineer, copy, or resell the service except as expressly permitted.</li>
            <li>Upload content you do not have rights to process.</li>
            <li>Interfere with platform security, stability, or other users.</li>
          </ul>
          <p>
            We may suspend or terminate accounts that violate these Terms, applicable law, or
            payment-provider requirements.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>8. Customer content and AI output</h2>
          <p>
            You retain rights to content you submit. You grant us a limited license to host,
            process, and transmit that content to provide and improve the service.
          </p>
          <p>
            AI outputs may contain errors or omissions. You are responsible for independent
            verification before relying on any output in legal, tax, or business matters.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>9. Intellectual property</h2>
          <p>
            {brandText(
              "doLegal, including software, branding, and platform content (excluding your submitted content and third-party public legal texts), is owned by us or our licensors and protected by applicable intellectual property laws.",
            )}
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>10. Availability and changes</h2>
          <p>
            We may update features, pricing, or service components from time to time. We do not
            guarantee uninterrupted or error-free availability.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>11. Disclaimers</h2>
          <p>
            The service is provided on an as-is and as-available basis, to the fullest extent
            permitted by law. We disclaim implied warranties, including merchantability, fitness
            for a particular purpose, and non-infringement.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>12. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, we are not liable for indirect, incidental,
            special, consequential, or punitive damages, or for loss of profits, revenue, data, or
            goodwill. Our total aggregate liability arising from or related to the service will not
            exceed the amounts paid by you to us for the service in the 12 months before the event
            giving rise to liability.
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>13. Indemnification</h2>
          <p>
            {brandText(
              "You agree to defend, indemnify, and hold harmless doLegal from claims arising out of your use of the service, your content, or your breach of these Terms.",
            )}
          </p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>14. Governing law and disputes</h2>
          <p>
            These Terms are governed by the laws of <strong>Republic of Armenia</strong>,
            excluding conflict-of-laws rules. Courts located in <strong>Republic of Armenia</strong>{" "}
            have exclusive jurisdiction unless mandatory law requires otherwise.
          </p>
        </section>

        <section style={{ marginTop: 24, marginBottom: 24 }}>
          <h2>15. Contact</h2>
          <p>
            For legal notices or Terms-related questions, contact us at{" "}
            <a href="mailto:hello@dolegal.am">hello@dolegal.am</a>.
          </p>
        </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
