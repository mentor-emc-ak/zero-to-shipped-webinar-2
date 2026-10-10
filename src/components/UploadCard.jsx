import { useRef, useState } from "react";
import { extractPdfText, computeResult, validateFile } from "../lib/parser.js";

const STEPS = [
  "Reading PDF…",
  "Extracting skills…",
  "Scoring against a target role…",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UploadCard({ onResult }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  // 0 = idle, 1..3 = step i is active, 4 = all steps done
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);

    for (let i = 1; i <= STEPS.length; i++) {
      setStep(i);
      await sleep(700);
    }
    setStep(STEPS.length + 1);

    const buffer = await file.arrayBuffer();
    const text = extractPdfText(buffer);
    onResult(computeResult(file.name, text));
  }

  function stepClass(index) {
    if (index < step - 1) return "step done";
    if (index === step - 1) return "step active";
    return "step";
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
          PDF only · max ~5 MB · nothing is uploaded, it all runs in your
          browser
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

      {error && <p className="error">{error}</p>}

      {step > 0 && (
        <div className="steps">
          {STEPS.map((label, index) => (
            <p key={label} className={stepClass(index)}>
              {label}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
