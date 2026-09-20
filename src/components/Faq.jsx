import { IconChevron } from "./Icons.jsx";

const QUESTIONS = [
  {
    q: "How does ScamTrace decide if a message is a scam?",
    a: "It looks at the wording and tricks used in the message and returns a structured explanation. Treat the result as guidance, not proof.",
  },
  {
    q: "Can ScamTrace be wrong?",
    a: "Yes. It is an AI assistant, so treat the result as strong advice, not proof. When in doubt, contact the company using a phone number or website you already trust, never the one in the message.",
  },
  {
    q: "Is it safe to paste my message here?",
    a: "Your message is sent to the ScamTrace backend for analysis. Paste only the message itself and leave out passwords, OTPs and card numbers.",
  },
  {
    q: "I already clicked the link or sent money. What now?",
    a: "Call your bank straight away and ask them to block the transaction or card. Change the passwords for any account you entered on the site, and report it to your local cybercrime authority. The faster you act, the better the chance of recovering money.",
  },
  {
    q: "Where do I report a scam?",
    a: "Use your country's official cybercrime portal. In India that is cybercrime.gov.in, or call 1930 for financial fraud. ScamTrace writes a complaint draft you can paste into the form.",
  },
];

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div>
          <p className="kicker">FAQ</p>
          <h2 id="faq-title" className="section-heading">
            Questions people ask
          </h2>
          <p className="section-lead">Short answers, in plain language.</p>
        </div>

        <div className="faq-list">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>
                <span>{item.q}</span>
                <IconChevron size={20} className="faq-chevron" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
