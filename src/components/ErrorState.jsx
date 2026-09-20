import { IconAlert } from "./Icons.jsx";

// User-facing copy only. Never show raw AWS, HTTP, or stack details.
const ERROR_HINTS = {
  network: "Check your connection and try again.",
  timeout: "The analysis took too long. Try again, or use a shorter message.",
  server: "Please try again in a moment.",
  parse: "Please try again in a moment.",
  unknown: "Please try again. Your message is still in the box.",
};

export default function ErrorState({ kind = "unknown", onRetry }) {
  const hint = ERROR_HINTS[kind] || ERROR_HINTS.unknown;

  return (
    <div className="error-state" role="alert">
      <IconAlert className="error-icon" size={22} />
      <div className="error-body">
        <h2 className="error-title">Unable to analyze this message.</h2>
        <p className="muted">{hint}</p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
