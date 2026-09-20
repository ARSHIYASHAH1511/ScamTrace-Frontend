/*
  THE ADAPTER: this file is the only place that knows what the backend sends.

  The UI always receives the same clean object, no matter how the Lambda
  formats its response. When your real backend is ready, change the key names
  in the `pick(...)` calls below (or add new ones). The components stay untouched.

  Expected backend response (all fields optional):
  {
    "verdict": "scam" | "suspicious" | "safe",
    "scam_type": "Bank KYC phishing",
    "confidence": 94,                    // 0-100, or 0-1
    "reasons": ["Creates false urgency", "..."],
    "mechanism": "How the scam works, in plain language",
    "keywords": ["urgent", "blocked"],
    "sources": [{ "title": "...", "url": "https://...", "snippet": "..." }],
    "memory": { "found": true, "similarity": 88, "summary": "...", "first_seen": "...", "report_count": 12 },
    "complaint_draft": "Text of the cybercrime complaint",
    "family_warning": "Text of the warning message"
  }
*/

// Returns the first value that exists under any of the given key names.
function pick(object, keys, fallback = undefined) {
  if (!object || typeof object !== "object") return fallback;
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
      return object[key];
    }
  }
  return fallback;
}

function toText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function toStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;/)
      .map((item) => item.replace(/^[-*•\s]+/, "").trim())
      .filter(Boolean);
  }
  return [];
}

// Turns 0.93, 93 or "93%" into the whole number 93. Returns null if unknown.
function toPercent(value) {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (typeof number !== "number" || Number.isNaN(number)) return null;
  const percent = number <= 1 ? number * 100 : number;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

// Maps whatever the backend says onto: "scam" | "suspicious" | "safe" | "unknown"
function toVerdict(raw) {
  if (typeof raw === "boolean") return raw ? "scam" : "safe";
  if (typeof raw !== "string") return "unknown";
  const text = raw.toLowerCase().replace(/[_-]/g, " ");
  if (/not a scam|not scam|safe|legit|benign/.test(text)) return "safe";
  if (/suspicious|possible|maybe|caution|unclear/.test(text)) return "suspicious";
  if (/scam|fraud|phish|malicious/.test(text)) return "scam";
  return "unknown";
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function toSources(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") {
        const isUrl = /^https?:\/\//i.test(item);
        return { title: isUrl ? hostOf(item) : item, url: isUrl ? item : "", snippet: "" };
      }
      const url = toText(pick(item, ["url", "link", "href"]));
      return {
        title: toText(pick(item, ["title", "name"])) || (url ? hostOf(url) : "Untitled source"),
        url,
        snippet: toText(pick(item, ["snippet", "content", "summary", "description"])),
      };
    })
    .filter((source) => source.title);
}

function toMemory(value) {
  if (typeof value === "string" && value.trim()) {
    return { found: true, similarity: null, summary: value.trim(), firstSeen: "", count: null };
  }
  if (!value || typeof value !== "object") return null;

  const summary = toText(pick(value, ["summary", "description", "match", "note"]));
  const similarity = toPercent(pick(value, ["similarity", "score", "match_score"]));
  const found = pick(value, ["found", "matched", "hit"], Boolean(summary || similarity));
  const count = pick(value, ["report_count", "reportCount", "count", "reports"]);

  return {
    found: Boolean(found),
    similarity,
    summary,
    firstSeen: toText(pick(value, ["first_seen", "firstSeen"])),
    count: typeof count === "number" ? count : null,
  };
}

// Lambda proxy responses sometimes wrap the real data in a "body" string.
function unwrapBody(raw) {
  if (raw && typeof raw.body === "string") {
    try {
      return JSON.parse(raw.body);
    } catch {
      return raw;
    }
  }
  if (raw && typeof raw.body === "object" && raw.body !== null) return raw.body;
  return raw;
}

export function normalizeResult(rawResponse) {
  const data = unwrapBody(rawResponse) || {};

  const result = {
    verdict: toVerdict(pick(data, ["verdict", "is_scam", "isScam", "classification", "label"])),
    scamType: toText(pick(data, ["scam_type", "scamType", "type", "category"])),
    confidence: toPercent(pick(data, ["confidence", "confidence_score", "score"])),
    reasons: toStringList(pick(data, ["reasons", "why", "red_flags", "redFlags", "explanation"])),
    mechanism: toText(pick(data, ["mechanism", "scam_mechanism", "scamMechanism", "how_it_works"])),
    keywords: toStringList(pick(data, ["keywords", "detected_keywords", "flagged_phrases"])),
    sources: toSources(pick(data, ["sources", "investigation_sources", "investigation", "references"])),
    memory: toMemory(pick(data, ["memory", "similar_scam", "similarScam", "scam_memory"])),
    complaintDraft: toText(pick(data, ["complaint_draft", "complaintDraft", "complaint"])),
    familyWarning: toText(pick(data, ["family_warning", "familyWarning", "warning_message", "warning"])),
  };

  // The placeholder Lambda only says "Hello from Lambda!", so there is nothing to analyze yet.
  result.isPlaceholder =
    result.verdict === "unknown" &&
    !result.scamType &&
    !result.mechanism &&
    result.reasons.length === 0;
  result.placeholderNote = result.isPlaceholder ? toText(pick(data, ["message"])) : "";

  return result;
}
