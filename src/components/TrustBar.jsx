const STATS = [
  { value: "60s", label: "Typical time to a verdict" },
  { value: "3", label: "Checks: wording, sources, memory" },
  { value: "2", label: "Ready-to-send reports in every result" },
];

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="What you get">
      <div className="container trust-grid">
        {STATS.map((stat) => (
          <article key={stat.label} className="trust-item">
            <p className="trust-value">{stat.value}</p>
            <p className="trust-label">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
