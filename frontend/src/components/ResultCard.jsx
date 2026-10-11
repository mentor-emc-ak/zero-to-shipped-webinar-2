export default function ResultCard({ result, onReset }) {
  const { fileName, score, present, missing, verdict } = result;

  return (
    <section className="card">
      <div className="result-head">
        <div className="score-ring" style={{ "--p": String(score) }}>
          <div className="score-num">
            <span>{score}</span>
            <span className="score-max">/100</span>
          </div>
        </div>
        <div className="result-meta">
          <p className="verdict">{verdict}</p>
          <p className="file-name">{fileName}</p>
        </div>
      </div>

      <div className="skills-grid">
        <div className="skill-col">
          <h2>
            <span className="dot dot-good"></span> Skills present
          </h2>
          <ul className="chips">
            {present.length === 0 ? (
              <li className="empty">No target skills found</li>
            ) : (
              present.map((skill) => <li key={skill}>{skill}</li>)
            )}
          </ul>
        </div>
        <div className="skill-col">
          <h2>
            <span className="dot dot-miss"></span> Skills missing
          </h2>
          <ul className="chips chips-miss">
            {missing.length === 0 ? (
              <li className="empty">All target skills present 🎉</li>
            ) : (
              missing.map((skill) => <li key={skill}>{skill}</li>)
            )}
          </ul>
        </div>
      </div>

      <button className="btn btn-ghost" type="button" onClick={onReset}>
        Try another resume
      </button>
    </section>
  );
}
