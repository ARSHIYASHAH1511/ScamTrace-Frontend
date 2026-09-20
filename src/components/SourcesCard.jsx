import Card, { EmptyNote } from "./Card.jsx";
import { IconExternal, IconGlobe } from "./Icons.jsx";

// Only allow normal web links, so a bad response can never inject a "javascript:" link.
const isSafeUrl = (url) => /^https?:\/\//i.test(url);

export default function SourcesCard({ sources }) {
  return (
    <Card title="Investigation sources" icon={IconGlobe}>
      {sources.length === 0 ? (
        <EmptyNote>No sources were found for this message.</EmptyNote>
      ) : (
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
      )}
    </Card>
  );
}
