// One cell of the results "bento" grid. `icon` is optional, `className` sets its size.
export default function Card({ title, icon: Icon, children, className = "", id }) {
  return (
    <section className={`bento-cell ${className}`.trim()} id={id} tabIndex={id ? -1 : undefined}>
      <h3 className="cell-title">
        {Icon && (
          <span className="cell-icon">
            <Icon size={17} />
          </span>
        )}
        {title}
      </h3>
      {children}
    </section>
  );
}

// Shown inside a cell when the backend didn't return that piece of information.
export function EmptyNote({ children }) {
  return <p className="empty-note">{children}</p>;
}
