import {useTranslations} from "next-intl";

export function IssueStrip() {
  const t = useTranslations("landing.parity");

  return (
    <div className="issue-strip">
      <div className="wrap">
        <span className="pulse">
          <span className="pulse-dot" />
          {t("issueLastSynced")}
        </span>
        <span>{t("issueStats")}</span>
      </div>
    </div>
  );
}
