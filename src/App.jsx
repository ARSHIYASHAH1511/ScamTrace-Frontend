import { useRef, useState } from "react";
import Atmosphere from "./components/Atmosphere.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import TrustBar from "./components/TrustBar.jsx";
import RedFlagMarquee from "./components/RedFlagMarquee.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import ScamTypes from "./components/ScamTypes.jsx";
import Faq from "./components/Faq.jsx";
import CtaBand from "./components/CtaBand.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ResultsDashboard from "./components/ResultsDashboard.jsx";
import Footer from "./components/Footer.jsx";
import { analyzeMessage } from "./services/api";
import { normalizeResult } from "./services/normalizeResult";
import { SAMPLE_MESSAGE, SAMPLE_NEW_MESSAGE, SAMPLE_NEW_RAW_RESULT, SAMPLE_RAW_RESULT } from "./data/sampleData";
import { enrichResult } from "./utils/enrichResult";
import { getVerdictLabel } from "./utils/risk";

export default function App() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSample, setIsSample] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const requestRef = useRef(null);

  async function handleAnalyze() {
    const text = message.trim();
    if (!text) return;

    const controller = new AbortController();
    requestRef.current = controller;

    setStatus("loading");
    setError(null);
    setIsSample(false);

    try {
      const data = await analyzeMessage(text, { signal: controller.signal });
      if (requestRef.current !== controller) return;
      const enriched = enrichResult(data, text);
      setResult(enriched);
      setSessionHistory((previous) =>
        [
          {
            id: `${Date.now()}-${previous.length}`,
            scamType: enriched.scamType || "Not provided.",
            verdict: enriched.verdict,
            verdictLabel: enriched.verdictLabel || getVerdictLabel(enriched.verdict),
            confidence: enriched.confidence,
            matched: enriched.memory?.matched,
          },
          ...previous,
        ].slice(0, 8)
      );
      setStatus("success");
    } catch (err) {
      if (requestRef.current !== controller) return;
      if (err.kind === "cancelled") {
        setStatus("idle");
        return;
      }
      setError({ kind: err.kind || "unknown", message: err.message });
      setStatus("error");
    }
  }

  function handleCancel() {
    requestRef.current?.abort();
  }

  function handleUseSample(text) {
    setMessage(text);
    setError(null);
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("message-input")?.focus({ preventScroll: true });
    }, 450);
  }

  function handlePreviewSample() {
    setMessage(SAMPLE_MESSAGE);
    setResult(enrichResult(normalizeResult(SAMPLE_RAW_RESULT), SAMPLE_MESSAGE));
    setIsSample(true);
    setStatus("success");
  }

  function handlePreviewNewSample() {
    setMessage(SAMPLE_NEW_MESSAGE);
    setResult(enrichResult(normalizeResult(SAMPLE_NEW_RAW_RESULT), SAMPLE_NEW_MESSAGE));
    setIsSample(true);
    setStatus("success");
  }

  function handleReset() {
    setStatus("idle");
    setMessage("");
    setResult(null);
    setError(null);
    setIsSample(false);
    window.scrollTo({ top: 0 });
  }

  const showHome = status === "idle" || status === "error";

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Atmosphere />
      <Header showLinks={showHome} onNewScan={handleReset} />
      <main id="main-content">
        {showHome && (
          <>
            <Hero
              message={message}
              onMessageChange={setMessage}
              onAnalyze={handleAnalyze}
              onUseSample={handleUseSample}
              onPreviewSample={handlePreviewSample}
              onPreviewNewSample={handlePreviewNewSample}
              error={error}
            />
            <TrustBar />
            <RedFlagMarquee />
            <HowItWorks />
            <ScamTypes onUseSample={handleUseSample} />
            <Faq />
            <CtaBand />
          </>
        )}

        {status === "loading" && <LoadingState message={message} onCancel={handleCancel} />}

        {status === "success" && result && (
          <ResultsDashboard
            result={result}
            message={message}
            isSample={isSample}
            sessionHistory={sessionHistory}
            onReset={handleReset}
          />
        )}
      </main>
      <Footer showLinks={showHome} />
    </div>
  );
}
