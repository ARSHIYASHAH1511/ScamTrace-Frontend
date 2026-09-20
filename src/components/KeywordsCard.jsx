import Card, { EmptyNote } from "./Card.jsx";
import HighlightedMessage from "./HighlightedMessage.jsx";
import { IconTag } from "./Icons.jsx";

export default function KeywordsCard({ message, keywords, className }) {
  return (
    <Card title="Keywords detected" icon={IconTag} className={className}>
      {keywords.length === 0 ? (
        <EmptyNote>No keywords were flagged in this message.</EmptyNote>
      ) : (
        <>
          <p className="card-sub">Your message, with the flagged words marked.</p>
          <div className="evidence">
            <HighlightedMessage text={message} keywords={keywords} />
          </div>
          <ul className="chips">
            {keywords.map((word) => (
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
