import { useEffect, useState } from "react";

const STEPS = [
  "Reading the message",
  "Looking for scam patterns",
  "Searching public sources",
  "Checking scam memory",
  "Writing your report",
];

export default function LoadingState({ message, onCancel }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="loading" aria-labelledby="loading-title">
      <div className="container loading-inner">
        <div className="loading-copy">
          <p className="kicker">Investigation in progress</p>
          <h1 id="loading-title" className="loading-title">
            Tracing the message
          </h1>
          <p className="muted" role="status">
            {STEPS[activeStep]}…
          </p>

          <ol className="step-list" aria-hidden="true">
            {STEPS.map((step, index) => {
              const state = index < activeStep ? "done" : index === activeStep ? "active" : "todo";
              return (
                <li key={step} className={`step step-${state}`}>
                  <span className="step-dot" />
                  {step}
                </li>
              );
            })}
          </ol>

          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel scan
          </button>
        </div>

        <div className="composer-wrap loading-scan" aria-hidden="true">
          <div className="composer">
            <div className="terminal-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="terminal-name">scanning incoming-message.txt</span>
            </div>
            <div className="scan-box">
              <p className="scan-text">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
