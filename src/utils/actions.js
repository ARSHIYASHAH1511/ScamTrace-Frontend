const CORE_ACTIONS = [
  {
    id: "links",
    text: "Do not click suspicious links",
    test: (ctx) => ctx.hasLink,
  },
  {
    id: "secrets",
    text: "Do not share OTP, PIN, or password",
    test: (ctx) => ctx.hasSecret,
  },
  {
    id: "phone",
    text: "Do not call numbers provided by the message",
    test: (ctx) => ctx.hasPhone,
  },
  {
    id: "verify",
    text: "Verify through the organisation's official app or website",
    test: () => false,
  },
  {
    id: "report",
    text: "Report the message when appropriate",
    test: (ctx) => ctx.verdict === "scam" || ctx.verdict === "suspicious",
  },
];

function hasLink(message) {
  return /https?:\/\/|www\.|\.[a-z]{2,}\//i.test(message || "");
}

function hasSecret(message, keywords) {
  const blob = `${message || ""} ${(keywords || []).join(" ")}`;
  return /\b(otp|one[-\s]?time|pin|password|cvv|kyc|passcode)\b/i.test(blob);
}

function hasPhone(message) {
  return /\+\d[\d\s()-]{7,}\d/.test(message || "");
}

export function getSafetyActions({ verdict = "unknown", message = "", keywords = [] } = {}) {
  const ctx = {
    verdict,
    hasLink: hasLink(message),
    hasSecret: hasSecret(message, keywords),
    hasPhone: hasPhone(message),
  };

  const intro =
    verdict === "safe"
      ? "This analysis did not find clear scam signs. Stay careful with unexpected requests."
      : verdict === "suspicious"
        ? "Treat this as unsafe until you verify it through an official channel you already trust."
        : verdict === "scam"
          ? "Treat this message as unsafe. Do not follow its instructions."
          : "Use these steps until you can verify the message through an official channel.";

  return {
    intro,
    items: CORE_ACTIONS.map((item) => ({
      id: item.id,
      text: item.text,
      emphasized: item.test(ctx),
    })),
  };
}
