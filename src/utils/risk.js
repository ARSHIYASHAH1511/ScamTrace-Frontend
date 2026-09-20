/*
  Maps a normalized verdict + confidence into a risk level.
  Does not invent a verdict: unknown stays unknown.
*/

const RISK = {
  high: { id: "high", label: "High" },
  medium: { id: "medium", label: "Medium" },
  low: { id: "low", label: "Low" },
  unknown: { id: "unknown", label: "Unknown" },
};

const VERDICT_LABELS = {
  scam: "Likely a scam",
  suspicious: "Suspicious",
  safe: "No clear scam signs",
  unknown: "No verdict yet",
};

export function getVerdictLabel(verdict) {
  return VERDICT_LABELS[verdict] || VERDICT_LABELS.unknown;
}

/**
 * @param {"scam"|"suspicious"|"safe"|"unknown"} verdict
 * @param {number|null|undefined} confidence 0–100, or null if not provided
 */
export function getRiskLevel(verdict, confidence) {
  const score =
    typeof confidence === "number" && !Number.isNaN(confidence)
      ? Math.max(0, Math.min(100, confidence))
      : null;

  if (verdict === "scam") {
    if (score === null) return RISK.high;
    if (score >= 70) return RISK.high;
    return RISK.medium;
  }

  if (verdict === "suspicious") {
    if (score !== null && score >= 80) return RISK.high;
    if (score !== null && score < 40) return RISK.low;
    return RISK.medium;
  }

  if (verdict === "safe") {
    return RISK.low;
  }

  return RISK.unknown;
}

export function getRiskPresentation(verdict, confidence) {
  return {
    verdict: verdict || "unknown",
    verdictLabel: getVerdictLabel(verdict),
    risk: getRiskLevel(verdict, confidence),
    confidence: typeof confidence === "number" ? confidence : null,
  };
}
