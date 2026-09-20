import CopyBox from "./CopyBox.jsx";
import { IconFileText, IconUsers } from "./Icons.jsx";

export default function ActionsSection({ complaintDraft, familyWarning }) {
  return (
    <section className="actions" aria-labelledby="actions-title">
      <p className="kicker">Next steps</p>
      <h2 id="actions-title" className="section-heading section-heading-sm">
        What to do next
      </h2>
      <div className="actions-grid">
        <CopyBox
          id="complaint"
          title="Cybercrime complaint draft"
          icon={IconFileText}
          description="Edit the [brackets], then send it to your cybercrime portal or your bank."
          text={complaintDraft}
          buttonLabel="Copy complaint"
          rows={12}
        />
        <CopyBox
          id="warning"
          title="Family warning message"
          icon={IconUsers}
          description="Send this to relatives and friends so they don't fall for it."
          text={familyWarning}
          buttonLabel="Copy warning"
          rows={8}
        />
      </div>
    </section>
  );
}
