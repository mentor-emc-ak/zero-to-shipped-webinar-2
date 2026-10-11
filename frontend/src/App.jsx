import { useState } from "react";
import UploadCard from "./components/UploadCard.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  // Single source of truth: null = show upload, object = show results
  const [result, setResult] = useState(null);

  return (
    <>
      <header className="nav">
        <div className="logo">
          0<span className="logo-arrow">→</span>shipped
        </div>
        <span className="nav-tag">resume parser</span>
      </header>

      <main>
        <section className="hero">
          <h1>
            Know where your resume stands,
            <br />
            before anyone else reads it.
          </h1>
          <p className="sub">
            Drop in a PDF and get an instant score, the skills it found, and
            the ones a recruiter will notice are missing.
          </p>
        </section>

        {result ? (
          <ResultCard result={result} onReset={() => setResult(null)} />
        ) : (
          <UploadCard onResult={setResult} />
        )}
      </main>

      <footer>
        <p>
          0→shipped · mock demo — scores are generated in the browser, no data
          leaves your machine.
        </p>
      </footer>
    </>
  );
}
