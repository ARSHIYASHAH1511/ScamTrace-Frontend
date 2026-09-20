import Card, { EmptyNote } from "./Card.jsx";
import { formatSeenTime } from "../utils/seenTime";
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

function reportCountLabel(count) {
  if (typeof count !== "number") return "";
  return count === 1 ? "Seen 1 time" : `Seen ${count} times`;
}

export default function MemoryCard({ memory, scamType = "" }) {
  const matched = memory?.matched;
  const family =
    memory?.category ||
    memory?.previousScamFamily ||
    scamType ||
    "";

  if (matched !== true && matched !== false) {
    return (
      <Card title="Scam memory" icon={IconDatabase} id="memory">
        <p className="memory-status memory-none">Unavailable</p>
        <EmptyNote>Scam memory is currently unavailable.</EmptyNote>
      </Card>
    );
  }

  if (matched === false) {
    return (
      <Card title="Scam memory" icon={IconDatabase} id="memory">
        <p className="memory-status memory-new">New pattern</p>
        {family && <p className="memory-family">{family}</p>}
        <p className="prose">This scam family has not been seen before in ScamTrace.</p>
      </Card>
    );
  }

  const firstSeen = formatSeenTime(memory.firstSeen);
  const lastSeen = formatSeenTime(memory.lastSeen);
  const seenLabel = reportCountLabel(memory.reportCount);

  return (
    <Card title="Scam memory" icon={IconDatabase} id="memory">
      <p className="memory-status memory-hit">Previously seen pattern</p>
      {family && <p className="memory-family">{family}</p>}
      <p className="prose">
        {family
          ? `Similar ${family} scam patterns have been analyzed before.`
          : "Similar scam patterns have been analyzed before by ScamTrace."}
      </p>
      {seenLabel && <p className="memory-count">{seenLabel}</p>}
      {(firstSeen || lastSeen) && (
        <dl className="memory-meta">
          <Detail label="First seen" value={firstSeen} />
          <Detail label="Last seen" value={lastSeen} />
        </dl>
      )}
    </Card>
  );
}
