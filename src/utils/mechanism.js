/*
  Turns backend mechanism text into steps.
  Does not invent attack stages. Only splits text the analysis already returned.
*/

function toTrimmed(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStep(text) {
  return toTrimmed(text)
    .replace(/^[-*•]+\s*/, "")
    .replace(/^\d+[\).:\-]\s*/, "")
    .trim();
}

export function toMechanismSteps(mechanism) {
  const text = toTrimmed(mechanism);
  if (!text) return [];

  const lineParts = text
    .split(/\n+/)
    .map(cleanStep)
    .filter(Boolean);

  if (lineParts.length > 1) return lineParts;

  const numbered = text
    .split(/(?:^|\s)\d+[\).:\-]\s+/)
    .map(cleanStep)
    .filter(Boolean);

  if (numbered.length > 1) return numbered;

  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map(cleanStep)
    .filter(Boolean);

  if (sentences.length > 1) return sentences;

  return [text];
}
