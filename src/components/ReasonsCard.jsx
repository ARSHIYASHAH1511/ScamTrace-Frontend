import Card, { EmptyNote } from "./Card.jsx";
import { IconEye } from "./Icons.jsx";

export default function ReasonsCard({ reasons = [], evidence, explanation, className }) {
  const whyItems = Array.isArray(evidence)
    ? evidence.filter((item) => item.source === "reason" && item.text)
    : [];

  const fallback = whyItems.length === 0 && Array.isArray(reasons)
    ? reasons.filter(Boolean).map((text) => ({ text, quote: "", tactic: "" }))
    : whyItems;

  const hasWhy = fallback.length > 0;
  const hasExplanation = Boolean(explanation);

  return (
    <Card title="Why this looks suspicious" icon={IconEye} className={className} id="why-suspicious">
      {!hasWhy && !hasExplanation ? (
        <EmptyNote>No evidence was returned for this message.</EmptyNote>
      ) : (
        <>
          {hasExplanation && <p className="prose reason-explanation">{explanation}</p>}
          {hasWhy && (
            <ul className="reason-list">
              {fallback.map((item) => (
                <li key={item.text}>
                  {item.tactic && <p className="reason-tactic">{item.tactic}</p>}
                  {item.quote && <p className="reason-quote">“{item.quote}”</p>}
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
