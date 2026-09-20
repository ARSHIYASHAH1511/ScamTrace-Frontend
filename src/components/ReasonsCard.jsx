import Card, { EmptyNote } from "./Card.jsx";
import { IconEye } from "./Icons.jsx";

export default function ReasonsCard({ reasons, className }) {
  return (
    <Card title="Why it looks suspicious" icon={IconEye} className={className}>
      {reasons.length === 0 ? (
        <EmptyNote>No reasons were returned for this message.</EmptyNote>
      ) : (
        <ul className="reason-list">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
