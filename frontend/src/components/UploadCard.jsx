import { useRef, useState } from "react";
import { validateFile } from "../lib/parser.js";
import { scoreResume } from "../lib/api.js";

export default function UploadCard({ onResult }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  // step 0 = idle, 1 = request in flight
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [jd, setJd] = useState("");

  async function handleFile(file) {
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);

    setStep(1);
    try {
      onResult(await scoreResume(file, jd));
    } catch (err) {
      setError(err.message);
      setStep(0);
    }
  }

  return (
    <section className="card">
      <div
        className={`dropzone${dragging ? " dragover" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload a resume PDF"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="drop-icon">📄</div>
        <p className="drop-title">Drop your resume here</p>
        <p className="drop-hint">
          PDF only · max ~5 MB · your resume is scored by the local backend
        </p>
        <button className="btn" type="button">
          Choose a PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <label className="jd-label" htmlFor="jd">
        Job description (optional)
      </label>
      <textarea
        id="jd"
        className="jd-input"
        rows={5}
        placeholder="Paste the job description to score against it…"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {step === 1 && <p className="scoring">Scoring your resume…</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
