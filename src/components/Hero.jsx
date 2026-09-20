import { MAX_MESSAGE_LENGTH } from "../config";
import { SAMPLE_MESSAGES } from "../data/sampleData";
import ErrorState from "./ErrorState.jsx";
import { IconSearch } from "./Icons.jsx";

export default function Hero({
  message,
  onMessageChange,
  onAnalyze,
  onUseSample,
  onPreviewSample,
  error,
}) {
  const length = message.length;
  const isEmpty = message.trim().length === 0;
  const isTooLong = length > MAX_MESSAGE_LENGTH;

  function handleSubmit(event) {
    event.preventDefault();
    if (!isEmpty && !isTooLong) onAnalyze();
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") handleSubmit(event);
  }

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="floaters" aria-hidden="true">
          <span className="floater floater-a">urgent</span>
          <span className="floater floater-b">share the OTP</span>
          <span className="floater floater-c">bank-kyc-verify.top</span>
        </div>

        <p className="kicker hero-kicker">Message intelligence</p>
        <h1 id="hero-title" className="hero-title">
          Is that message
          <span className="hero-em"> a scam?</span>
        </h1>
        <p className="hero-copy">
          Paste a text, email or chat you don't trust. ScamTrace traces the trick, marks the
          evidence, and drafts the reports you need — in about a minute.
        </p>

        {error && <ErrorState kind={error.kind} message={error.message} onRetry={onAnalyze} />}

        <form className="composer-wrap" onSubmit={handleSubmit}>
          <div className="composer">
            <div className="terminal-bar">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="terminal-name">case / incoming-message.txt</span>
              <span className="terminal-keys">⌘ / Ctrl + Enter</span>
            </div>

            <label htmlFor="message-input" className="sr-only">
              Suspicious message
            </label>
            <textarea
              id="message-input"
              className="composer-input"
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste the suspicious message here. A blocked-account text, a prize you never entered, a parcel you didn't order…"
              rows={9}
              spellCheck={false}
              aria-describedby="composer-hint"
            />

            <div className="composer-bar">
              <p id="composer-hint" className={isTooLong ? "hint hint-error" : "hint"}>
                {isTooLong
                  ? `Message is too long. Shorten it by ${length - MAX_MESSAGE_LENGTH} characters.`
                  : isEmpty
                    ? "Don't paste passwords or OTPs. Only the message itself."
                    : `${length.toLocaleString()} / ${MAX_MESSAGE_LENGTH.toLocaleString()} characters`}
              </p>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isEmpty || isTooLong}
              >
                <IconSearch size={19} />
                Analyze message
              </button>
            </div>
          </div>
        </form>

        <div className="sample-row">
          <span className="sample-label">Try a known pattern</span>
          {SAMPLE_MESSAGES.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="sample-chip"
              onClick={() => onUseSample(sample.text)}
            >
              {sample.label}
            </button>
          ))}
        </div>

        <p className="preview-line">
          Just exploring?{" "}
          <button type="button" className="link-button" onClick={onPreviewSample}>
            Preview a sample case file
          </button>
        </p>
      </div>
    </section>
  );
}
