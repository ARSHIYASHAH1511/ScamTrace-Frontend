import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "../utils/clipboard";
import { IconCheck, IconCopy } from "./Icons.jsx";

// An editable draft with a copy button. Users can fill in [placeholders] before copying.
export default function CopyBox({ id, title, icon: Icon, description, text, buttonLabel, rows = 10 }) {
  const [draft, setDraft] = useState(text);
  const [status, setStatus] = useState("idle"); // "idle" | "copied" | "failed"
  const timerRef = useRef(null);

  // If a new result arrives, replace the draft.
  useEffect(() => {
    setDraft(text);
  }, [text]);

  // Clear the timer if the component disappears.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function handleCopy() {
    const ok = await copyToClipboard(draft);
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 2200);
  }

  const hasText = Boolean(text);

  return (
    <div className="bento-cell action-cell">
      <h3 className="cell-title" id={`${id}-title`}>
        {Icon && (
          <span className="cell-icon">
            <Icon size={17} />
          </span>
        )}
        {title}
      </h3>
      <p className="card-sub">{description}</p>

      {hasText ? (
        <textarea
          className="copybox-text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={rows}
          aria-labelledby={`${id}-title`}
        />
      ) : (
        <p className="empty-note">Not provided.</p>
      )}

      <div className="copybox-footer">
        <button
          type="button"
          className={status === "copied" ? "btn btn-primary is-copied" : "btn btn-primary"}
          onClick={handleCopy}
          disabled={!hasText || !draft.trim()}
        >
          {status === "copied" ? <IconCheck size={18} /> : <IconCopy size={18} />}
          {status === "copied" ? "Copied" : buttonLabel}
        </button>
        <span className="copy-status" role="status">
          {status === "copied" && "Copied to your clipboard."}
          {status === "failed" && "Couldn't copy. Select the text and copy it manually."}
        </span>
      </div>
    </div>
  );
}
