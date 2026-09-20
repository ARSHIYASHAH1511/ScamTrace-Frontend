import CopyBox from "./CopyBox.jsx";
import { buildComplaintDraft } from "../utils/complaint";
import { buildFamilyWarning } from "../utils/familyWarning";
import { getSafetyActions } from "../utils/actions";
import { IconFileText, IconUsers } from "./Icons.jsx";

export default function ActionsSection({ message, result }) {
  const scamType = result?.scamType || "";
  const complaint = buildComplaintDraft({
    message,
    scamType,
    explanation: result?.explanation || "",
    reasons: result?.reasons || [],
    verdictLabel: result?.verdictLabel || "",
    riskLabel: result?.risk?.label || "",
  });
  const warning = buildFamilyWarning({
    scamType,
    verdict: result?.verdict || "",
  });
  const actions = getSafetyActions({
    verdict: result?.verdict || "unknown",
    message,
    keywords: result?.keywords || [],
  });

  return (
    <section className="actions" id="action-center" tabIndex={-1} aria-labelledby="actions-title">
      <p className="kicker">Next steps</p>
      <h2 id="actions-title" className="section-heading section-heading-sm">
        What to do now
      </h2>
      <p className="section-lead action-intro">{actions.intro}</p>

      <ul className="action-checklist">
        {actions.items.map((item) => (
          <li key={item.id} className={item.emphasized ? "is-emphasized" : undefined}>
            <span className="action-check" aria-hidden="true">
              ✓
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      <p className="card-sub action-note">
        Use contact details from an official app, card, or website you already trust — not from
        this message.
      </p>

      <div className="actions-grid">
        <CopyBox
          id="complaint"
          title="Cybercrime incident draft"
          icon={IconFileText}
          description="Facts that were missing from the message are marked Not provided. You can edit before copying."
          text={complaint}
          buttonLabel="Copy complaint"
          rows={16}
        />
        <CopyBox
          id="warning"
          title="Family warning"
          icon={IconUsers}
          description="A short alert you can paste into WhatsApp or another chat."
          text={warning}
          buttonLabel="Copy warning"
          rows={14}
        />
      </div>
    </section>
  );
}
