/*
  THE ADAPTER: this file is the only place that knows what the backend sends.

  The UI always receives the same clean object, regardless of how
  the Lambda formats its response.
*/

import { toTimestamp } from "../utils/seenTime";

function pick(object, keys, fallback = undefined) {
  if (!object || typeof object !== "object") return fallback;

  for (const key of keys) {
    if (
      object[key] !== undefined &&
      object[key] !== null &&
      object[key] !== ""
    ) {
      return object[key];
    }
  }

  return fallback;
}

function toText(value) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : "";
}

function toStringList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return toText(item);

        if (item && typeof item === "object") {
          return toText(
            pick(item, ["text", "label", "name", "value", "description"])
          );
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|;/)
      .map((item) =>
        item.replace(/^[-\*•\s]+/, "").trim()
      )
      .filter(Boolean);
  }

  return [];
}

/*
  Turns:
  0.93
  93
  "93%"
  into:
  93

  Returns null if unknown.
*/
function toPercent(value) {
  const number =
    typeof value === "string"
      ? parseFloat(value)
      : value;

  if (
    typeof number !== "number" ||
    Number.isNaN(number)
  ) {
    return null;
  }

  const percent = number <= 1
    ? number * 100
    : number;

  return Math.max(
    0,
    Math.min(100, Math.round(percent))
  );
}

/*
  Maps backend verdict to:
  "scam" | "suspicious" | "safe" | "unknown"
*/
function toVerdict(raw) {
  if (typeof raw === "boolean") {
    return raw ? "scam" : "safe";
  }

  if (typeof raw !== "string") {
    return "unknown";
  }

  const text = raw
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (
    /not a scam|not scam|safe|legit|benign|likely safe/.test(text)
  ) {
    return "safe";
  }

  if (
    /suspicious|possible|maybe|caution|unclear/.test(text)
  ) {
    return "suspicious";
  }

  if (
    /scam|fraud|phish|malicious/.test(text)
  ) {
    return "scam";
  }

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
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        const isUrl = /^https?:\/\//i.test(item);

        return {
          title: isUrl ? hostOf(item) : item,
          url: isUrl ? item : "",
          snippet: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const url = toText(
        pick(item, ["url", "link", "href"])
      );

      return {
        title:
          toText(
            pick(item, ["title", "name"])
          ) ||
          (url ? hostOf(url) : "Untitled source"),

        url,

        snippet: toText(
          pick(item, [
            "snippet",
            "content",
            "summary",
            "description",
          ])
        ),
      };
    })
    .filter(Boolean)
    .filter((source) => source.title);
}

function toTriState(value) {
  if (value === true || value === "true" || value === 1) return true;
  if (value === false || value === "false" || value === 0) return false;
  return null;
}

function firstDefined(object, keys) {
  if (!object || typeof object !== "object") return undefined;

  for (const key of keys) {
    if (object[key] !== undefined) return object[key];
  }

  return undefined;
}

function emptyMemory(matched = null) {
  return {
    matched,
    category: "",
    previousScamFamily: "",
    firstSeen: null,
    lastSeen: null,
    reportCount: null,
  };
}

function toReportCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  return null;
}

/*
  Memory is only a confirmed family hit when matched === true.
  That means this scam category was seen before — not the exact message.
  matched === false → new family.
  matched missing → memory unavailable.
  Never infer a match from category, summary, or similarity.
*/
function toMemory(value) {
  if (value === undefined || value === null || typeof value !== "object") {
    return emptyMemory(null);
  }

  const matched = toTriState(
    firstDefined(value, ["matched", "found", "hit"])
  );

  const category = toText(pick(value, ["category"]));
  const previousScamFamily = toText(
    pick(value, ["previousScamFamily", "previous_scam_family"])
  );

  const firstSeen = toTimestamp(
    firstDefined(value, ["firstSeen", "first_seen"])
  );
  const lastSeen = toTimestamp(
    firstDefined(value, ["lastSeen", "last_seen"])
  );

  const reportCount = toReportCount(
    firstDefined(value, ["reportCount", "report_count", "count", "reports"])
  );

  if (matched !== true) {
    return {
      ...emptyMemory(matched),
      category,
    };
  }

  return {
    matched: true,
    category,
    previousScamFamily,
    firstSeen,
    lastSeen,
    reportCount,
  };
}

/*
  Lambda proxy responses wrap the actual JSON
  inside a "body" string.
*/
function unwrapBody(raw) {
  if (
    raw &&
    typeof raw.body === "string"
  ) {
    try {
      return JSON.parse(raw.body);
    } catch {
      return raw;
    }
  }

  if (
    raw &&
    typeof raw.body === "object" &&
    raw.body !== null
  ) {
    return raw.body;
  }

  return raw;
}

export function normalizeResult(rawResponse) {
  const data = unwrapBody(rawResponse) || {};

  /*
    Your current Lambda returns:

    {
      verdict,
      confidence,
      explanation,
      scamType,
      redFlags,
      investigation: {
        keywords,
        sourcesChecked,
        similarFound,
        previousScamFamily
      },
      mechanism,
      complaintDraft,
      familyWarning,
      memory
    }
  */

  const investigation =
    data.investigation &&
    typeof data.investigation === "object"
      ? data.investigation
      : {};

  const result = {
    // -----------------------------
    // Verdict
    // -----------------------------
    verdict: toVerdict(
      pick(data, [
        "verdict",
        "is_scam",
        "isScam",
        "classification",
        "label",
      ])
    ),

    // -----------------------------
    // Scam type
    // -----------------------------
    scamType: toText(
      pick(data, [
        "scamType",
        "scam_type",
        "type",
        "category",
      ])
    ),

    // -----------------------------
    // Confidence
    // -----------------------------
    confidence: toPercent(
      pick(data, [
        "confidence",
        "confidence_score",
        "score",
      ])
    ),

    // -----------------------------
    // Explanation / red flags
    // -----------------------------
    reasons: toStringList(
      pick(data, [
        "redFlags",
        "red_flags",
        "reasons",
        "why",
      ])
    ),

    explanation: toText(
      pick(data, [
        "explanation",
        "summary",
      ])
    ),

    // -----------------------------
    // Scam mechanism
    // -----------------------------
    mechanism: toText(
      pick(data, [
        "mechanism",
        "scam_mechanism",
        "scamMechanism",
        "how_it_works",
      ])
    ),

    // -----------------------------
    // Keywords
    // -----------------------------
    keywords: toStringList(
      pick(data, [
        "keywords",
        "detected_keywords",
        "flagged_phrases",
      ]) ||
        investigation.keywords
    ),

    // -----------------------------
    // Sources
    // -----------------------------
    sources: toSources(
      pick(data, [
        "sources",
        "investigation_sources",
        "references",
      ])
    ),

    // -----------------------------
    // Investigation
    // -----------------------------
    investigation: {
      keywords: toStringList(
        investigation.keywords
      ),

      sourcesChecked: toStringList(
        investigation.sourcesChecked
      ),

      similarFound: toTriState(investigation.similarFound),

      previousScamFamily: toText(
        investigation.previousScamFamily
      ),
    },

    // -----------------------------
    // Memory
    // -----------------------------
    memory: toMemory(
      pick(data, [
        "memory",
        "similar_scam",
        "similarScam",
        "scam_memory",
      ])
    ),

    // -----------------------------
    // Complaint
    // -----------------------------
    complaintDraft: toText(
      pick(data, [
        "complaintDraft",
        "complaint_draft",
        "complaint",
      ])
    ),

    // -----------------------------
    // Family warning
    // -----------------------------
      familyWarning: toText(
      pick(data, [
        "familyWarning",
        "family_warning",
        "warning_message",
        "warning",
      ])
    ),
  };

  if (result.memory.matched === true) {
    if (!result.memory.previousScamFamily && result.investigation.previousScamFamily) {
      result.memory.previousScamFamily = result.investigation.previousScamFamily;
    }
    if (!result.memory.category) {
      result.memory.category =
        result.memory.previousScamFamily || result.scamType;
    }
  } else if (result.memory.matched === false && !result.memory.category) {
    result.memory.category = result.scamType;
  }

  /*
    The old placeholder Lambda returned:
    "Hello from Lambda!"

    Keep this detection so the UI can still show
    its placeholder message if necessary.
  */
  result.isPlaceholder =
    result.verdict === "unknown" &&
    !result.scamType &&
    !result.mechanism &&
    result.reasons.length === 0 &&
    !result.explanation;

  result.placeholderNote =
    result.isPlaceholder
      ? toText(
          pick(data, ["message"])
        )
      : "";

  return result;
}