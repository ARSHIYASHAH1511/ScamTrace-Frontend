import { toMechanismSteps } from "../utils/mechanism";
import Card, { EmptyNote } from "./Card.jsx";
import { IconRoute } from "./Icons.jsx";

export default function MechanismCard({ mechanism, className }) {
  const steps = toMechanismSteps(mechanism);

  return (
    <Card title="How the scam works" icon={IconRoute} className={className} id="mechanism">
      {steps.length === 0 ? (
        <EmptyNote>Not provided.</EmptyNote>
      ) : (
        <ol className="mechanism-steps">
          {steps.map((step, index) => (
            <li key={`${index}-${step.slice(0, 24)}`}>
              <span className="mechanism-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
