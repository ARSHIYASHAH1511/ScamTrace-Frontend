import { escapeRegExp, getHighlightPhrases, buildHighlightLegend } from "../utils/evidence";

// Shows the original message and marks phrases that actually appear in it.
export default function HighlightedMessage({
  text,
  keywords = [],
  phrases,
  legend,
  showLegend = false,
}) {
  const message = typeof text === "string" ? text : "";
  const highlight = Array.isArray(phrases)
    ? phrases.filter(Boolean)
    : getHighlightPhrases(message, keywords);

  const legendItems = showLegend
    ? Array.isArray(legend) && legend.length
      ? legend.filter((item) => item?.phrase)
      : buildHighlightLegend(message, highlight)
    : [];

  if (!message) {
    return <p className="empty-note">Not provided.</p>;
  }

  if (highlight.length === 0) {
    return (
      <>
        <p className="evidence-text">{message}</p>
        {showLegend && (
          <p className="legend-empty">No phrases from the analysis were found in this message.</p>
        )}
      </>
    );
  }

  const pattern = new RegExp(
    `(${highlight
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|")})`,
    "gi"
  );

  const parts = message.split(pattern);

  return (
    <>
      <p className="evidence-text">
        {parts.map((part, index) =>
          index % 2 === 1 ? <mark key={index}>{part}</mark> : <span key={index}>{part}</span>
        )}
      </p>
      {showLegend && legendItems.length > 0 && (
        <ul className="highlight-legend">
          {legendItems.map((item) => (
            <li key={item.phrase}>
              <mark>{item.phrase}</mark>
              {item.tactic ? (
                <>
                  <span aria-hidden="true"> → </span>
                  <span>{item.tactic}</span>
                </>
              ) : (
                <span className="legend-note"> — found in the message</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
