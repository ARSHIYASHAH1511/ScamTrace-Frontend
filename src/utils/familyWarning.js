/**
 * Short WhatsApp-friendly warning. Uses scam type from the analysis
 * when present. Does not invent a bank, sender, or URL.
 */
export function buildFamilyWarning({ scamType = "", verdict = "" } = {}) {
  if (verdict === "safe") {
    return [
      "SAFETY NOTE",
      "",
      "This message did not show clear scam signs, but unexpected requests can still be risky.",
      "",
      "Do NOT:",
      "• share OTPs, PINs, or passwords",
      "• send money because a message asked you to",
      "",
      "If you need to check, use the organisation's official app or website — not contacts from the message.",
    ].join("\n");
  }

  const typeLine = scamType.trim()
    ? `This message appears to be a ${scamType.trim()} attempt.`
    : "This message appears to be a scam or phishing attempt.";

  return [
    "⚠️ SCAM ALERT",
    "",
    typeLine,
    "",
    "Do NOT:",
    "• click links",
    "• share OTPs",
    "• share passwords",
    "• provide banking information",
    "• call numbers from the message",
    "",
    "Verify through the organisation's official app or website, not through this message.",
  ].join("\n");
}
