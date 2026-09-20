import { useEffect, useState } from "react";
import { IconClose, IconMenu, LogoMark } from "./Icons.jsx";

export default function Header({ showLinks, onNewScan }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!showLinks) setMenuOpen(false);
  }, [showLinks]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleBrandClick(event) {
    closeMenu();
    if (!showLinks) {
      event.preventDefault();
      document.getElementById("results-title")?.focus();
      window.scrollTo({ top: 0 });
    }
  }

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="nav-pill">
        <a
          className="brand"
          href={showLinks ? "#home" : "#results-title"}
          aria-label="ScamTrace home"
          onClick={handleBrandClick}
        >
          <LogoMark size={36} />
          <span className="brand-text">
            <span className="brand-name">ScamTrace</span>
            <span className="tagline">Forensic message check</span>
          </span>
        </a>

        {showLinks && (
          <nav className="nav-links" aria-label="Main">
            <a href="#how">How it works</a>
            <a href="#scams">Scam types</a>
            <a href="#faq">FAQ</a>
          </nav>
        )}

        <div className="nav-end">
          <span className="live-pill" aria-hidden="true">
            <span className="live-dot" />
            Live
          </span>

          {showLinks ? (
            <a className="btn btn-primary btn-sm nav-cta" href="#home">
              Analyze
            </a>
          ) : (
            <button type="button" className="btn btn-primary btn-sm" onClick={onNewScan}>
              New scan
            </button>
          )}

          {showLinks && (
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
            </button>
          )}
        </div>
      </div>

      {showLinks && menuOpen && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          <a href="#how" onClick={closeMenu}>
            How it works
          </a>
          <a href="#scams" onClick={closeMenu}>
            Scam types
          </a>
          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>
        </nav>
      )}
    </header>
  );
}
