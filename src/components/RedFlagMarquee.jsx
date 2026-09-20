const PHRASES = [
  "Your account will be blocked today",
  "Pay a small fee to release your parcel",
  "Share the OTP to confirm",
  "You have won a prize",
  "Earn per day working from home",
  "Click the link to update your KYC",
  "Approve the request to get your money back",
  "Do not tell anyone",
  "Offer expires in 1 hour",
  "Guaranteed returns",
];

export default function RedFlagMarquee() {
  return (
    <section className="marquee" aria-label="Phrases that often appear in scam messages">
      <p className="marquee-label">Phrases that give scams away</p>
      {/* The list is shown twice so the scroll loops without a gap. */}
      <div className="marquee-track" aria-hidden="true">
        {[...PHRASES, ...PHRASES].map((phrase, index) => (
          <span key={index} className="marquee-item">
            {phrase}
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {PHRASES.map((phrase) => (
          <li key={phrase}>{phrase}</li>
        ))}
      </ul>
    </section>
  );
}
