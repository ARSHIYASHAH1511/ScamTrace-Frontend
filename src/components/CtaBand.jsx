import { IconSearch } from "./Icons.jsx";

export default function CtaBand() {
  return (
    <section className="section cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <p className="kicker">Ready when you are</p>
          <h2 id="cta-title">Got a message you don't trust?</h2>
          <p>Paste it in. You'll know in about a minute, and you'll know what to do next.</p>
          <a className="btn btn-primary btn-lg" href="#home">
            <IconSearch size={19} />
            Analyze a message
          </a>
        </div>
      </div>
    </section>
  );
}
