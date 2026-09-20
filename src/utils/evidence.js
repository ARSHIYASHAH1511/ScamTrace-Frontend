/*
  Evidence helpers.

  Every phrase we later highlight or quote must already exist in the user's
  submitted message. These functions never invent URLs, senders, banks,
  dates, phone numbers, or tactic quotes.
*/

export function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toTrimmed(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Returns the exact slice of `message` that matches `phrase` (preserving
 * the message's original casing), or "" if the phrase is not present.
 */
export function findExactInMessage(message, phrase) {
  const haystack = typeof message === "string" ? message : "";
  const needle = toTrimmed(phrase);

  if (!haystack || !needle) return "";

  const index = haystack.toLowerCase().indexOf(needle.toLowerCase());
  if (index === -1) return "";

  return haystack.slice(index, index + needle.length);
}

export function phraseExistsInMessage(message, phrase) {
  return Boolean(findExactInMessage(message, phrase));
}

/**
 * Keeps only phrases that actually appear in the message.
 * Deduplicates by lowercase, prefers the longest original phrase,
 * and returns slices taken from the message itself.
 */
export function filterPhrasesInMessage(message, phrases) {
  if (!Array.isArray(phrases) || !message) return [];

  const seen = new Set();
  const found = [];

  for (const phrase of phrases) {
    const match = findExactInMessage(message, phrase);
    if (!match) continue;

    const key = match.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    found.push(match);
  }

  return found.sort((a, b) => b.length - a.length);
}

function extractQuotedFragments(text) {
  if (typeof text !== "string") return [];

  const fragments = [];
  const pattern = /"([^"]+)"|'([^']+)'/g;
  let match;

  while ((match = pattern.exec(text))) {
    fragments.push((match[1] || match[2] || "").trim());
  }

  return fragments.filter(Boolean);
}

/**
 * Conservative tactic labels. A label is returned only when the phrase
 * itself supports it. Unknown phrases get no label (never fabricated).
 */
export function tacticLabelForPhrase(phrase) {
  const text = toTrimmed(phrase).toLowerCase();
  if (!text) return "";

  if (
    /\b(otp|one[-\s]?time password|pin|password|cvv|kyc|aadhaar|aadhar|pan(?:\s+card)?|account number|debit card|credit card)\b/.test(
      text
    ) ||
    /\bverif(?:y|ication)\b/.test(text)
  ) {
    return "Sensitive information request";
  }

  if (
    /\b(urgent|immediately|right now|asap|today|within \d+\s*(?:hour|hr|minute|min|day)s?|do not ignore|don't ignore|act now|last chance|limited time)\b/.test(
      text
    )
  ) {
    return "Urgency";
  }

  if (
    /\b(blocked|suspend|suspension|legal action|arrest|police|fine|penalty|account will be)\b/.test(
      text
    )
  ) {
    return "Threat";
  }

  if (
    /\bhttps?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:top|xyz|click|link|site|online|club)\b/i.test(
      text
    )
  ) {
    return "Suspicious link";
  }

  if (
    /\b(click here|tap (?:the )?link|open the link|call this number|whatsapp)\b/.test(
      text
    )
  ) {
    return "Pressure to act immediately";
  }

  if (/\b(prize|winner|lottery|congratulations|guaranteed|work from home)\b/.test(text)) {
    return "Too-good-to-be-true offer";
  }

  return "";
}

/**
 * Keywords that are safe to highlight: present in the submitted message.
 */
export function getHighlightPhrases(message, keywords) {
  return filterPhrasesInMessage(message, keywords);
}

/**
 * Builds Why/evidence rows from backend reasons + keywords.
 * Quotes and highlight phrases are taken only from the user message.
 * Reasons with no in-message quote are still returned (as backend text)
 * without a fabricated excerpt.
 */
export function buildEvidenceItems({ message = "", reasons = [], keywords = [] } = {}) {
  const items = [];
  const usedQuotes = new Set();

  for (const reason of Array.isArray(reasons) ? reasons : []) {
    const text = toTrimmed(reason);
    if (!text) continue;

    const quoted = extractQuotedFragments(text)
      .map((fragment) => findExactInMessage(message, fragment))
      .find(Boolean);

    const quote = quoted || "";
    if (quote) usedQuotes.add(quote.toLowerCase());

    items.push({
      source: "reason",
      text,
      quote,
      tactic: quote ? tacticLabelForPhrase(quote) || tacticLabelForPhrase(text) : tacticLabelForPhrase(text),
    });
  }

  for (const phrase of getHighlightPhrases(message, keywords)) {
    if (usedQuotes.has(phrase.toLowerCase())) continue;

    items.push({
      source: "keyword",
      text: "",
      quote: phrase,
      tactic: tacticLabelForPhrase(phrase),
    });
  }

  return items;
}

/**
 * Legend under a highlighted message: phrase → tactic,
 * only for phrases that appear in the message.
 */
export function buildHighlightLegend(message, keywords) {
  return getHighlightPhrases(message, keywords).map((phrase) => ({
    phrase,
    tactic: tacticLabelForPhrase(phrase),
  }));
}
