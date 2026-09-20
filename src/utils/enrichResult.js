import { buildEvidenceItems, buildHighlightLegend, filterPhrasesInMessage, getHighlightPhrases } from "./evidence";
import { getRiskPresentation } from "./risk";

/**
 * Adds derived, non-invented fields for later UI groups.
 * Does not change the API contract or overwrite backend values.
 */
export function enrichResult(result, message) {
  if (!result) return result;

  const text = typeof message === "string" ? message : "";
  const presentation = getRiskPresentation(result.verdict, result.confidence);
  const keywords = Array.isArray(result.keywords) ? result.keywords : [];
  const reasons = Array.isArray(result.reasons) ? result.reasons : [];
  const evidence = buildEvidenceItems({
    message: text,
    reasons,
    keywords,
  });
  const quotes = evidence.map((item) => item.quote).filter(Boolean);
  const highlightPhrases = filterPhrasesInMessage(text, [
    ...getHighlightPhrases(text, keywords),
    ...quotes,
  ]);

  return {
    ...result,
    verdictLabel: presentation.verdictLabel,
    risk: presentation.risk,
    highlightPhrases,
    highlightLegend: buildHighlightLegend(text, highlightPhrases),
    evidence,
  };
}

