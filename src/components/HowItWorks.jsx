import { IconCheck } from "./Icons.jsx";

export default function HowItWorks() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="container">
        <p className="kicker">How it works</p>
        <h2 id="how-title" className="section-heading">
          From a suspicious message to a report in one minute
        </h2>
        <p className="section-lead">
          You don't need to know anything about scams. ScamTrace does the checking and tells you
          what to do next.
        </p>

        <ol className="steps">
          <li className="step-card">
            <span className="step-number">01</span>
            <h3>Paste the message</h3>
            <p>Copy the text, email or chat message and drop it into the box. Nothing else needed.</p>
            <div className="mini mini-message" aria-hidden="true">
              <p>
                Your account will be <mark>blocked</mark> today. Share the <mark>OTP</mark> to
                confirm.
              </p>
            </div>
          </li>

          <li className="step-card">
            <span className="step-number">02</span>
            <h3>We investigate</h3>
            <p>
              It reads the wording, looks up public sources, and compares the message with scams
              it has seen before.
            </p>
            <ul className="mini mini-checks" aria-hidden="true">
              <li>
                <IconCheck size={15} /> Scam patterns
              </li>
              <li>
                <IconCheck size={15} /> Public sources
              </li>
              <li>
                <IconCheck size={15} /> Scam memory
              </li>
            </ul>
          </li>

          <li className="step-card">
            <span className="step-number">03</span>
            <h3>Verdict and reports</h3>
            <p>
              See how the trick works, then copy a ready-made complaint and a warning for your
              family.
            </p>
            <div className="mini mini-report" aria-hidden="true">
              <span className="mini-verdict">Likely a scam</span>
              <span className="mini-btn">Copy complaint</span>
              <span className="mini-btn">Copy warning</span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
