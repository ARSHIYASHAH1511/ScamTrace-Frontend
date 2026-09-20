export default function Footer({ showLinks }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-blurb">
            ScamTrace reads suspicious messages so you don't have to guess.
          </p>
          <p className="footer-disclaimer">
            ScamTrace is an AI assistant and can get things wrong. If you already lost money or
            shared a password or OTP, call your bank right away.
          </p>
        </div>

        {showLinks && (
          <nav aria-label="Footer">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-links">
              <li>
                <a href="#how">How it works</a>
              </li>
              <li>
                <a href="#scams">Scam types</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </nav>
        )}

        <div>
          <h2 className="footer-heading">If you've been scammed</h2>
          <ul className="footer-links">
            <li>Call your bank and block the card</li>
            <li>Change your passwords</li>
            <li>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
                Report at cybercrime.gov.in
              </a>
            </li>
            <li>India: call 1930 for financial fraud</li>
          </ul>
        </div>
      </div>

      <p className="footer-wordmark" aria-hidden="true">
        ScamTrace
      </p>
    </footer>
  );
}
