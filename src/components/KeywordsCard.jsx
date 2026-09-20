import Card, { EmptyNote } from "./Card.jsx";
import HighlightedMessage from "./HighlightedMessage.jsx";
import { IconTag } from "./Icons.jsx";

export default function KeywordsCard({
  message,
  keywords = [],
  highlightPhrases,
  highlightLegend,
  className,
}) {
  const phrases = Array.isArray(highlightPhrases) ? highlightPhrases : keywords;

  return (
    <Card title="Original message" icon={IconTag} className={className}>
      <p className="card-sub">
        The submitted text. Highlighted phrases appear in this message and in the analysis.
      </p>
      {message ? (
        <div className="evidence">
          <HighlightedMessage
            text={message}
            phrases={phrases}
            legend={highlightLegend}
            showLegend
          />
        </div>
      ) : (
        <EmptyNote>Not provided.</EmptyNote>
      )}
      {Array.isArray(keywords) && keywords.length > 0 && (
        <>
          <p className="meta-kicker keyword-kicker">Keywords</p>
          <ul className="chips">
            {[...new Set(keywords.filter(Boolean))].map((word) => (
              <li key={word} className="chip">
                {word}
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
