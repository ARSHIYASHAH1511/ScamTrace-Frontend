import { SAMPLE_MESSAGES } from "../data/sampleData";
import HighlightedMessage from "./HighlightedMessage.jsx";
import {
  IconBriefcase,
  IconGift,
  IconMail,
  IconPackage,
  IconTrend,
  IconWallet,
} from "./Icons.jsx";

// "size" controls how big the cell is in the bento grid (see styles.css).
const SCAM_TYPES = [
  {
    id: "bank",
    size: "feature",
    title: "Bank and KYC phishing",
    icon: IconMail,
    trick: "A fake alert says your account is about to be blocked, then sends you to a lookalike login page and asks for your OTP.",
    flag: "Share the OTP to confirm",
    keywords: ["URGENT", "blocked", "KYC", "OTP", "http://bank-kyc-verify.top/login"],
  },
  {
    id: "parcel",
    size: "small",
    title: "Parcel delivery fee",
    icon: IconPackage,
    trick: "A small fee to redeliver a parcel you never ordered. The payment page steals your card.",
    flag: "Pay a small redelivery fee",
  },
  {
    id: "job",
    size: "small",
    title: "Fake job offers",
    icon: IconBriefcase,
    trick: "Easy money for a few hours a day, after you pay a registration fee.",
    flag: "Earn per day from home",
  },
  {
    id: "prize",
    size: "wide",
    title: "Prize and lottery wins",
    icon: IconGift,
    trick: "You have 'won' something you never entered for. You only need to pay charges to claim it, and the prize never arrives.",
    flag: "Claim within 2 hours",
  },
  {
    id: "payment",
    size: "wide",
    title: "Wrong payment requests",
    icon: IconWallet,
    trick: "Someone says they sent money by mistake and asks you to approve a request. Approving it sends your money to them.",
    flag: "Enter your PIN to get a refund",
  },
  {
    id: "invest",
    size: "wide",
    title: "Investment and crypto",
    icon: IconTrend,
    trick: "Guaranteed returns and pressure to deposit today. The money disappears when you try to withdraw.",
    flag: "Doubling money in 7 days",
  },
];

export default function ScamTypes({ onUseSample }) {
  function useExample(id) {
    const sample = SAMPLE_MESSAGES.find((item) => item.id === id);
    if (sample) onUseSample(sample.text);
  }

  return (
    <section className="section" id="scams" aria-labelledby="scams-title">
      <div className="container">
        <p className="kicker">Threat library</p>
        <h2 id="scams-title" className="section-heading">
          Scams ScamTrace is built to catch
        </h2>
        <p className="section-lead">
          Different stories, same tricks: urgency, fear, or a too-good-to-be-true offer. Pick one
          to test it.
        </p>

        <div className="scam-grid">
          {SCAM_TYPES.map(({ id, size, title, icon: Icon, trick, flag, keywords }) => (
            <article key={id} className={`scam-cell scam-${size}`}>
              <span className="scam-icon">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p className="scam-trick">{trick}</p>

              {keywords && (
                <div className="evidence evidence-compact">
                  <HighlightedMessage
                    text={SAMPLE_MESSAGES.find((item) => item.id === id).text}
                    keywords={keywords}
                  />
                </div>
              )}

              <p className="scam-flag">"{flag}"</p>
              <button type="button" className="btn btn-text btn-inline" onClick={() => useExample(id)}>
                Test this example
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
