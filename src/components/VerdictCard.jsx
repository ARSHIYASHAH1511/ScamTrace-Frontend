import { getRiskLevel, getVerdictLabel } from "../utils/risk";
import { IconAlert, IconQuestion, IconShieldCheck } from "./Icons.jsx";

const VERDICTS = {
  scam: {
    advice: "Don't reply, click any link, or share any code.",
    Icon: IconAlert,
  },
  suspicious: {
    advice: "Don't act on it yet. Check with the organisation using a number or site you already trust.",
    Icon: IconAlert,
  },
  safe: {
    advice: "Nothing strong stood out, but stay careful with any unexpected request.",
    Icon: IconShieldCheck,
  },
  unknown: {
    advice: "The analysis did not return a verdict for this message.",
    Icon: IconQuestion,
  },
};

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

export default function VerdictCard({ verdict, scamType, confidence, risk, verdictLabel }) {
  const key = VERDICTS[verdict] ? verdict : "unknown";
  const { advice, Icon } = VERDICTS[key];
  const label = verdictLabel || getVerdictLabel(key);
  const riskLevel = risk?.id ? risk : getRiskLevel(key, confidence);

  return (
    <>
      <div className="bento-cell verdict span-8" id="verdict" tabIndex={-1} data-verdict={key} data-risk={riskLevel.id}>
        <span className="verdict-icon">
          <Icon size={28} />
        </span>
        <div className="verdict-meta">
          <div>
            <p className="meta-kicker">Verdict</p>
            <p className="verdict-label">{label}</p>
          </div>
          <div>
            <p className="meta-kicker">Risk level</p>
            <p className="risk-label">{riskLevel.label}</p>
          </div>
        </div>
        <p className="verdict-type">
          {scamType ? `Scam type: ${scamType}` : "Scam type: Not provided."}
        </p>
        <p className="verdict-advice">{advice}</p>
      </div>

      <div className="bento-cell confidence span-4" data-verdict={key}>
        <ConfidenceRing value={confidence ?? null} />
        <p className="confidence-caption">
          {confidence === null || confidence === undefined
            ? "Confidence: Not provided."
            : "Confidence in this verdict"}
        </p>
      </div>
    </>
  );
}
