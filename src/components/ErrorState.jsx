import { IconAlert } from "./Icons.jsx";

// Each kind of failure gets a plain-language title and a way to fix it.
const ERROR_COPY = {
  network: {
    title: "Couldn't reach ScamTrace",
    hint: "Check your internet connection and try again. If you are the developer, make sure CORS is enabled on the API for this address.",
  },
  timeout: {
    title: "The analysis is taking too long",
    hint: "The server didn't answer in time. Try again, or try a shorter message.",
  },
  server: {
    title: "ScamTrace hit a problem",
    hint: "The backend returned an error. Try again in a moment.",
  },
  parse: {
    title: "The reply couldn't be read",
    hint: "The backend answered in a format the app doesn't understand. Check the response shape in normalizeResult.js.",
  },
  unknown: {
    title: "Something went wrong",
    hint: "Try again. Your message is still in the box.",
  },
};

export default function ErrorState({ kind = "unknown", message, onRetry }) {
  const copy = ERROR_COPY[kind] || ERROR_COPY.unknown;

  return (
    <div className="error-state" role="alert">
      <IconAlert className="error-icon" size={22} />
      <div className="error-body">
        <h2 className="error-title">{copy.title}</h2>
        {message && <p>{message}</p>}
        <p className="muted">{copy.hint}</p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
