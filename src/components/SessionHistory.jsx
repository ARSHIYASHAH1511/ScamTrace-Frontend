import { getVerdictLabel } from "../utils/risk";

const SHORT_VERDICT = {
  scam: "Scam",
  suspicious: "Suspicious",
  safe: "Safe",
  unknown: "Unknown",
};

export default function SessionHistory({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="session-history" aria-labelledby="session-history-title">
      <p className="meta-kicker" id="session-history-title">
        Recent analyses this session
      </p>
      <ul className="session-history-list">
        {items.map((item) => {
          const type = item.scamType || "Not provided.";
          const verdict = SHORT_VERDICT[item.verdict] || getVerdictLabel(item.verdict);
          const confidence =
            typeof item.confidence === "number" ? `${item.confidence}%` : "Not provided.";
          const memory =
            item.matched === true
              ? "Previously seen pattern"
              : item.matched === false
                ? "New pattern"
                : "";

          return (
            <li key={item.id} className="session-history-item">
              <p className="session-history-type">{type}</p>
              <p className="session-history-meta">
                {verdict} · {confidence}
                {memory ? ` · ${memory}` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
