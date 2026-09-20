import { IconAlert, IconQuestion, IconShieldCheck } from "./Icons.jsx";

const VERDICTS = {
  scam: {
    label: "Likely a scam",
    advice: "Don't reply, click any link, or share any code.",
    Icon: IconAlert,
  },
  suspicious: {
    label: "Suspicious",
    advice: "Don't act on it yet. Check with the company using a number or site you already trust.",
    Icon: IconAlert,
  },
  safe: {
    label: "No clear scam signs",
    advice: "Nothing strong stood out, but stay careful with any unexpected request.",
    Icon: IconShieldCheck,
  },
  unknown: {
    label: "No verdict yet",
    advice: "The backend didn't return a verdict for this message.",
    Icon: IconQuestion,
  },
};

// A circular gauge. The colored arc grows from 0 to the confidence value.
function ConfidenceRing({ value }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = value === null ? circumference : circumference * (1 - value / 100);

  return (
    <div
      className="ring"
      role="meter"
      aria-label="Confidence"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value === null ? undefined : value}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-track" cx="60" cy="60" r={radius} />
        <circle
          className="ring-fill"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ "--ring-full": circumference }}
        />
      </svg>
      <p className="ring-value">
        {value === null ? "-" : value}
        {value !== null && <span>%</span>}
      </p>
    </div>
  );
}

// Returns two cells for the bento grid: the verdict, and the confidence gauge.
export default function VerdictCard({ verdict, scamType, confidence }) {
  const { label, advice, Icon } = VERDICTS[verdict] || VERDICTS.unknown;

  return (
    <>
      <div className="bento-cell verdict span-8" data-verdict={verdict}>
        <span className="verdict-icon">
          <Icon size={28} />
        </span>
        <p className="verdict-label">{label}</p>
        <p className="verdict-type">
          {scamType ? `Scam type: ${scamType}` : "Scam type: not identified"}
        </p>
        <p className="verdict-advice">{advice}</p>
      </div>

      <div className="bento-cell confidence span-4" data-verdict={verdict}>
        <ConfidenceRing value={confidence} />
        <p className="confidence-caption">
          {confidence === null ? "Confidence not provided" : "confidence in this verdict"}
        </p>
      </div>
    </>
  );
}
