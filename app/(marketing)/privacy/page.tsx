import type { Metadata } from "next";
import {useTranslations} from "next-intl";
import { Footer } from "../../_components/Footer";
import { Masthead } from "../../_components/Masthead";
import { brandText } from "@/lib/brand-text";

export const metadata: Metadata = {
  title: "Privacy Policy | doLegal",
  description:
    "Review how doLegal collects, uses, and protects personal data, including waitlist, technical, and billing-related information.",
};

export default function PrivacyPolicyPage() {
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
            Privacy <em>Policy</em>
          </h1>
          <p className="section-sub" style={{ fontWeight: 700 }}>
            {brandText(
              "Last updated: April 22, 2026. This Privacy Policy explains what personal data doLegal processes and how we use it.",
            )}
          </p>

          <section style={{ marginTop: 32 }}>
            <h2>1. Controller</h2>
            <p>
              {brandText("doLegal is operated by ")}
              <strong>[LEGAL ENTITY NAME]</strong>
              {brandText(", registered in the Republic of Armenia, with registered address at ")}
              <strong>[REGISTERED ADDRESS]</strong>
              {brandText(". Contact: ")}{" "}
              <a href="mailto:hello@dolegal.am">hello@dolegal.am</a>.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>2. Data we collect</h2>
            <ul>
              <li>
                Waitlist data: email address submitted through the early-access form.
              </li>
              <li>
                Essential technical data: basic request metadata and server logs required for
                security, troubleshooting, and abuse prevention.
              </li>
              <li>
                Language preference cookie: a locale cookie used to remember selected site language.
              </li>
              <li>
                Payment and billing data (when paid plans launch): processed by Paddle as merchant
                of record.
              </li>
            </ul>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>3. How we use data</h2>
            <ul>
              <li>Manage early-access waitlist entries and invitation communications.</li>
              <li>Operate, secure, and improve the website and related services.</li>
              <li>Comply with legal obligations and resolve fraud, abuse, or disputes.</li>
              <li>Process payments, subscriptions, taxes, and refunds through Paddle.</li>
            </ul>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>4. Legal bases</h2>
            <p>
              Depending on applicable law, we rely on consent (for waitlist sign-up), contract
              performance (for paid services), legitimate interests (service security and abuse
              prevention), and legal obligations (tax, accounting, and compliance duties).
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>5. Processors and disclosures</h2>
            <p>
              We use third-party processors to operate the service, including:
            </p>
            <ul>
              <li>
                <strong>Resend</strong> for waitlist contact storage and related communications.
              </li>
              <li>
                <strong>Paddle</strong> for checkout, payment processing, tax handling, invoicing,
                and certain fraud checks.
              </li>
            </ul>
            <p>
              We may also disclose data when required by law or to establish, exercise, or defend
              legal claims.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>6. International transfers</h2>
            <p>
              Some processors may handle data outside Armenia. Where required, we implement
              appropriate transfer safeguards.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>7. Retention</h2>
            <p>
              We retain personal data only for as long as necessary for the purposes in this Policy,
              including legal, tax, accounting, and dispute-resolution obligations.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>8. Security</h2>
            <p>
              We apply reasonable technical and organizational security measures. No system can
              guarantee absolute security.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>9. Your rights</h2>
            <p>
              Subject to applicable law, you may request access, correction, deletion, restriction,
              objection, or data portability. To make a request, email{" "}
              <a href="mailto:hello@dolegal.am">hello@dolegal.am</a>.
            </p>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2>10. Children</h2>
            <p>
              {brandText(
                "doLegal is not intended for children. We do not knowingly collect personal data from children where prohibited by law.",
              )}
            </p>
          </section>

          <section style={{ marginTop: 24, marginBottom: 24 }}>
            <h2>11. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be posted
              on this page with an updated date.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
