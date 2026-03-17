import { useState } from "react";
import { ScoreCard } from "./ScoreCard";
import { IssueList } from "./IssueList";
import { analyzeCode, type AnalysisResult } from "./analyzeCode";
import "./CodeAnalyzer.css";

const CodeAnalyzer = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(analyzeCode(code));
      setIsAnalyzing(false);
    }, 1200);
  };

  const overallScore = result
    ? Math.round(
        (result.readability + result.maintainability + result.complexity + result.bestPractices) / 4
      )
    : null;

  return (
    <div className="analyzer-root">
      <header className="analyzer-header">
        <h1 className="ods-typography-title-l analyzer-title">
          VibeCheck
        </h1>
        <p className="ods-typography-body-m-regular analyzer-subtitle">
          Paste your vibe-coded code. Get instant quality insights.
        </p>
      </header>

      <div className="analyzer-input-section">
        <div className="textarea-wrapper">
          <label className="textarea-label" htmlFor="code-input">Paste your code</label>
          <textarea
            id="code-input"
            className="analyzer-textarea"
            placeholder={"function doStuff(x) {\n  var y = x + 1;\n  console.log(y);\n  return y;\n}"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button
          className="analyzer-button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {result && (
        <div className="analyzer-results">
          <div className="analyzer-overall">
            <div
              className={`analyzer-score-ring ${
                overallScore! >= 80 ? "score-good" : overallScore! >= 50 ? "score-ok" : "score-bad"
              }`}
            >
              <span className="ods-typography-display analyzer-score-number">
                {overallScore}
              </span>
              <span className="ods-typography-microcopy-bold">/ 100</span>
            </div>
            <p className="ods-typography-subtitle" style={{ color: "var(--colours-basic-text)" }}>
              {overallScore! >= 80
                ? "Looking clean! 🎉"
                : overallScore! >= 50
                ? "Needs some work 🔧"
                : "Time to refactor 🚨"}
            </p>
          </div>

          <div className="analyzer-scores-grid">
            <ScoreCard label="Readability" score={result.readability} />
            <ScoreCard label="Maintainability" score={result.maintainability} />
            <ScoreCard label="Complexity" score={result.complexity} />
            <ScoreCard label="Best Practices" score={result.bestPractices} />
          </div>

          <IssueList issues={result.issues} />
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;
