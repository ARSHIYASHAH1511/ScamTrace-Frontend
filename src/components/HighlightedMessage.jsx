// Escapes special characters so keywords like "http://a.b/c?d" work inside a RegExp.
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Shows the original message and marks every detected keyword, like evidence on a case file.
export default function HighlightedMessage({ text, keywords }) {
  const cleaned = keywords.map((word) => word.trim()).filter(Boolean);

  if (cleaned.length === 0) {
    return <p className="evidence-text">{text}</p>;
  }

  // Longest keywords first, so "bank-kyc-verify.top" wins over "bank".
  const pattern = new RegExp(
    `(${cleaned
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|")})`,
    "gi"
  );

  // Because the pattern has one capture group, matches land on the odd positions.
  const parts = text.split(pattern);

  return (
    <p className="evidence-text">
      {parts.map((part, index) =>
        index % 2 === 1 ? <mark key={index}>{part}</mark> : <span key={index}>{part}</span>
      )}
    </p>
  );
}
