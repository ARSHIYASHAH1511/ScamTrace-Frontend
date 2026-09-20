import Card, { EmptyNote } from "./Card.jsx";
import { IconDatabase } from "./Icons.jsx";

function Detail({ label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function MemoryCard({ memory }) {
  const matched = memory?.matched;

  if (matched !== true && matched !== false) {
    return (
      <Card title="Similar scam memory" icon={IconDatabase}>
        <p className="memory-status memory-none">Unavailable</p>
        <EmptyNote>Scam memory is currently unavailable.</EmptyNote>
      </Card>
    );
  }

  if (matched === false) {
    return (
      <Card title="Similar scam memory" icon={IconDatabase}>
        <p className="memory-status memory-none">No match</p>
        <p className="prose">No similar scam found in ScamTrace memory.</p>
      </Card>
    );
  }

  return (
    <Card title="Similar scam memory" icon={IconDatabase}>
      <p className="memory-status memory-hit">Match found</p>
      {memory.summary && <p className="prose">{memory.summary}</p>}
      <dl className="memory-meta">
        <Detail label="Category" value={memory.category || "Not provided."} />
        <Detail
          label="Previous scam family"
          value={memory.previousScamFamily || "Not provided."}
        />
        {memory.similarity !== null && (
          <Detail label="Similarity" value={`${memory.similarity}%`} />
        )}
        <Detail label="First seen" value={memory.firstSeen} />
        {memory.count !== null && <Detail label="Similar reports" value={memory.count} />}
      </dl>
    </Card>
  );
}
