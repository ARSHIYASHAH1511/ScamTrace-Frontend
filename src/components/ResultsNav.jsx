const LINKS = [
  { href: "#verdict", label: "Verdict" },
  { href: "#why-suspicious", label: "Why suspicious" },
  { href: "#investigation", label: "Investigation" },
  { href: "#memory", label: "Memory" },
  { href: "#mechanism", label: "Mechanism" },
  { href: "#action-center", label: "Action center" },
];

export default function ResultsNav() {
  return (
    <nav className="results-nav" aria-label="Analysis sections">
      {LINKS.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
