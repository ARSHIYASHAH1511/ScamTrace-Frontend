import Card from "./Card.jsx";
import { IconExternal, IconGlobe } from "./Icons.jsx";

const isSafeUrl = (url) => /^https?:\/\//i.test(url);

function memoryLabel(memoryMatched, similarFound) {
  if (memoryMatched === true) return "Previously seen";
  if (memoryMatched === false) return "New pattern";
  if (similarFound === true) return "Reported by the analysis, not confirmed in memory.";
  if (similarFound === false) return "Not confirmed.";
  return "Unavailable";
}

export default function SourcesCard({
  sources = [],
  investigation,
  memoryMatched,
  scamType = "",
}) {
  const sourcesChecked = Array.isArray(investigation?.sourcesChecked)
    ? investigation.sourcesChecked
    : [];
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const family = investigation?.previousScamFamily || scamType || "";

  return (
    <Card title="Investigation" icon={IconGlobe} id="investigation">
      <div className="investigation-block">
        <div>
          <p className="meta-kicker">Memory</p>
          <p className="prose">{memoryLabel(memoryMatched, investigation?.similarFound)}</p>
        </div>

        <div>
          <p className="meta-kicker">Scam family</p>
          <p className="prose">{family || "Not provided."}</p>
        </div>

        <div>
          <p className="meta-kicker">Sources checked</p>
          {sourcesChecked.length > 0 ? (
            <ul className="source-list">
              {sourcesChecked.map((item) => (
                <li key={item} className="source">
                  <span className="source-title">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No external sources checked</p>
          )}
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
    </Card>
  );
}
