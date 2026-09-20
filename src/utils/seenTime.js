/*
  Formats optional firstSeen / lastSeen values from the API.
  Accepts Unix seconds, Unix milliseconds, or a non-empty string.
  Returns "" when the value is missing or invalid — never invents a date.
*/

export function formatSeenTime(value) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "number" && Number.isFinite(value)) {
    return formatEpoch(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return formatEpoch(Number(trimmed));
    }
    return trimmed;
  }

  return "";
}

function formatEpoch(value) {
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";

  const diff = Date.now() - date.getTime();
  if (diff >= 0 && diff < 5 * 60 * 1000) return "Just now";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (trimmed) return trimmed;
  }
  return null;
}
