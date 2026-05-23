import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { brandText } from "@/lib/brand-text";

export function Footer() {
  const t = useTranslations("landing.footer");
  const cols = [0, 1].map((i) => t.raw(`columns.${i}`));

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <img className="brand-logo" src="/doLegal-logo.svg" alt="doLegal" />
            </div>
            <p className="foot-tag">{brandText(t("description"))}</p>
          </div>
          <div className="foot-col">
            <h5>{cols[0].title}</h5>
            <Link href="/#features">{cols[0].links[0]}</Link>
            <Link href="/pricing">{cols[0].links[1]}</Link>
            <Link href="/#how">{cols[0].links[2]}</Link>
          </div>
          <div className="foot-col">
            <h5>{cols[1].title}</h5>
            <Link href="/terms">{cols[1].links[0]}</Link>
            <Link href="/privacy">{cols[1].links[1]}</Link>
            <Link href="/refund-policy">{cols[1].links[2]}</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{brandText(t("copyright"))}</span>
        </div>
      </div>
    </footer>
  );
}
