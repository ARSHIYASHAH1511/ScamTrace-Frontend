const MISSING = "Not provided.";

function orMissing(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length) return value;
  return "";
}

export function extractUrlsFromMessage(message) {
  if (typeof message !== "string" || !message) return [];
  const found = message.match(/https?:\/\/[^\s<>"']+/gi) || [];
  return [...new Set(found)];
}

/**
 * Builds a complaint from known analysis fields and the submitted message.
 * Does not invent dates, senders, banks, phones, URLs, or transaction IDs.
 */
export function buildComplaintDraft({
  message = "",
  scamType = "",
  explanation = "",
  reasons = [],
  verdictLabel = "",
  riskLabel = "",
} = {}) {
  const incidentType = orMissing(scamType) || MISSING;
  const received = orMissing(message) || MISSING;
  const description = orMissing(explanation) || MISSING;
  const indicators = Array.isArray(reasons) && reasons.length
    ? reasons.map((item) => `- ${item}`).join("\n")
    : MISSING;
  const risk = [verdictLabel, riskLabel && `Risk level: ${riskLabel}`]
    .filter(Boolean)
    .join(". ") || MISSING;
  const urls = extractUrlsFromMessage(message);

  return [
    "CYBERCRIME INCIDENT DRAFT",
    "",
    `Incident type: ${incidentType}`,
    `Date received: ${MISSING}`,
    `Sender identity: ${MISSING}`,
    `Phone number: ${MISSING}`,
    `Transaction ID: ${MISSING}`,
    "",
    "Message received:",
    received,
    "",
    "Description:",
    description,
    "",
    "Suspicious indicators:",
    indicators,
    "",
    `Potential risk: ${risk}`,
    "",
    "Evidence:",
    "Original message",
    urls.length ? `Links found in the message:\n${urls.join("\n")}` : `Links: ${MISSING}`,
    "",
    "I have not added any details that were missing from the original message.",
  ].join("\n");
}
