import Card, { EmptyNote } from "./Card.jsx";
import { IconRoute } from "./Icons.jsx";

export default function MechanismCard({ mechanism, className }) {
  return (
    <Card title="How the scam works" icon={IconRoute} className={className}>
      {mechanism ? (
        <p className="prose">{mechanism}</p>
      ) : (
        <EmptyNote>No explanation was returned for this message.</EmptyNote>
      )}
    </Card>
  );
}
