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
    </Card>
  );
}
