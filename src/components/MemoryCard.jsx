import Card, { EmptyNote } from "./Card.jsx";
import { IconDatabase } from "./Icons.jsx";

export default function MemoryCard({ memory }) {
  if (!memory) {
    return (
      <Card title="Similar scam memory" icon={IconDatabase}>
        <EmptyNote>The memory check didn't return a result for this message.</EmptyNote>
      </Card>
    );
  }

  if (!memory.found) {
    return (
      <Card title="Similar scam memory" icon={IconDatabase}>
        <p className="memory-status memory-none">No close match</p>
        <p className="prose">ScamTrace hasn't seen a message like this before.</p>
      </Card>
    );
  }

  return (
    <Card title="Similar scam memory" icon={IconDatabase}>
      <p className="memory-status memory-hit">
        Match found{memory.similarity !== null ? `: ${memory.similarity}% similar` : ""}
      </p>
      {memory.summary && <p className="prose">{memory.summary}</p>}
      {(memory.firstSeen || memory.count !== null) && (
        <dl className="memory-meta">
          {memory.firstSeen && (
            <div>
              <dt>First seen</dt>
              <dd>{memory.firstSeen}</dd>
            </div>
          )}
          {memory.count !== null && (
            <div>
              <dt>Similar reports</dt>
              <dd>{memory.count}</dd>
            </div>
          )}
        </dl>
      )}
    </Card>
  );
}
