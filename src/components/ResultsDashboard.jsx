import { useEffect, useRef } from "react";
import VerdictCard from "./VerdictCard.jsx";
import KeywordsCard from "./KeywordsCard.jsx";
import ReasonsCard from "./ReasonsCard.jsx";
import MechanismCard from "./MechanismCard.jsx";
import SourcesCard from "./SourcesCard.jsx";
import MemoryCard from "./MemoryCard.jsx";
import ActionsSection from "./ActionsSection.jsx";
import { IconRefresh } from "./Icons.jsx";

function Notice({ title, children }) {
  return (
    <div className="notice" role="note">
      <p className="notice-title">{title}</p>
      <p>{children}</p>
    </div>
  );
}

export default function ResultsDashboard({ result, message, isSample, onReset }) {
  const headingRef = useRef(null);

  // When results appear, move focus to the top so screen readers announce them.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="container">
        <p className="kicker">Case file</p>
        <h1 id="results-title" className="section-heading results-heading" tabIndex={-1} ref={headingRef}>
          Analysis results
        </h1>

        {isSample && (
          <Notice title="This is a sample report">
            It uses made-up example data so you can preview the dashboard. Analyze a real message
            to get a real result.
          </Notice>
        )}

        {result.isPlaceholder && (
          <Notice title="The backend is connected, but the analysis isn't built yet">
            {result.placeholderNote
              ? `The API replied: "${result.placeholderNote}". `
              : "The API replied without any analysis. "}
            Once the Lambda returns the ScamTrace fields (see src/services/normalizeResult.js),
            this dashboard fills in automatically.
          </Notice>
        )}

        <div className="bento">
          <VerdictCard
            verdict={result.verdict}
            scamType={result.scamType}
            confidence={result.confidence}
          />
          <KeywordsCard message={message} keywords={result.keywords} className="span-7" />
          <MechanismCard mechanism={result.mechanism} className="span-5" />
          <ReasonsCard reasons={result.reasons} className="span-6" />
          <div className="bento-stack span-6">
            <SourcesCard sources={result.sources} />
            <MemoryCard memory={result.memory} />
          </div>
        </div>

        <ActionsSection
          complaintDraft={result.complaintDraft}
          familyWarning={result.familyWarning}
        />

        <div className="results-footer">
          <button type="button" className="btn btn-primary" onClick={onReset}>
            <IconRefresh size={18} />
            Analyze another message
          </button>
        </div>
      </div>
    </section>
  );
}
