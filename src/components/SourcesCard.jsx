import Card, { EmptyNote } from "./Card.jsx";
import { IconExternal, IconGlobe } from "./Icons.jsx";

const isSafeUrl = (url) => /^https?:\/\//i.test(url);

function similarLabel(similarFound, memoryMatched) {
  if (memoryMatched === true) return "Confirmed in ScamTrace memory.";
  if (similarFound === true) {
    return "Reported by the analysis, but not confirmed in ScamTrace memory.";
  }
  if (similarFound === false) return "No similar pattern confirmed.";
  return "Not provided.";
}

export default function SourcesCard({ sources = [], investigation, memoryMatched }) {
  const sourcesChecked = investigation?.sourcesChecked || [];
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const hasChecked = sourcesChecked.length > 0;
  const hasAnything = hasSources || hasChecked || investigation;

  return (
    <Card title="Investigation" icon={IconGlobe} id="investigation">
      {!hasAnything ? (
        <EmptyNote>Not provided.</EmptyNote>
      ) : (
        <div className="investigation-block">
          <div>
            <p className="meta-kicker">Sources checked</p>
            {hasChecked ? (
              <ul className="source-list">
                {sourcesChecked.map((item) => (
                  <li key={item} className="source">
                    <span className="source-title">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">Not provided.</p>
            )}
          </div>

          <div>
            <p className="meta-kicker">Similar pattern</p>
            <p className="prose">{similarLabel(investigation?.similarFound, memoryMatched)}</p>
          </div>

          {hasSources && (
            <div>
              <p className="meta-kicker">References returned by the analysis</p>
              <ul className="source-list">
                {sources.map((source, index) => (
                  <li key={`${source.title}-${index}`} className="source">
                    {isSafeUrl(source.url) ? (
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                        <IconExternal size={15} />
                      </a>
                    ) : (
                      <span className="source-title">{source.title}</span>
                    )}
                    {source.snippet && <p>{source.snippet}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
