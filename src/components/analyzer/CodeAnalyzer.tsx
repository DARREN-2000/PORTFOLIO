import { useState } from "react";
import { ODSBox, ODSText, ODSButton, ODSTextArea } from "@telekom-ods/react-ui-kit";
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
    <ODSBox as="div" className="analyzer-root">
      <ODSBox as="header" className="analyzer-header">
        <ODSText as="h1" className="ods-typography-title-l analyzer-title">
          VibeCheck
        </ODSText>
        <ODSText as="p" className="ods-typography-body-m-regular analyzer-subtitle">
          Paste your vibe-coded code. Get instant quality insights.
        </ODSText>
      </ODSBox>

      <ODSBox as="div" className="analyzer-input-section">
        <ODSTextArea
          labelText="Paste your code"
          placeholder={"function doStuff(x) {\n  var y = x + 1;\n  console.log(y);\n  return y;\n}"}
          value={code}
          onChange={(e: any) => setCode(e.target.value)}
        />
        <ODSButton
          label={isAnalyzing ? "Analyzing..." : "Analyze Code"}
          variant="primary"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
        />
      </ODSBox>

      {result && (
        <ODSBox as="div" className="analyzer-results">
          <ODSBox as="div" className="analyzer-overall">
            <ODSBox
              as="div"
              className={`analyzer-score-ring ${
                overallScore! >= 80 ? "score-good" : overallScore! >= 50 ? "score-ok" : "score-bad"
              }`}
            >
              <ODSText as="span" className="ods-typography-display analyzer-score-number">
                {overallScore}
              </ODSText>
              <ODSText as="span" className="ods-typography-microcopy-bold">/ 100</ODSText>
            </ODSBox>
            <ODSText as="p" className="ods-typography-subtitle" style={{ color: "var(--colours-basic-text)" }}>
              {overallScore! >= 80
                ? "Looking clean! 🎉"
                : overallScore! >= 50
                ? "Needs some work 🔧"
                : "Time to refactor 🚨"}
            </ODSText>
          </ODSBox>

          <ODSBox as="div" className="analyzer-scores-grid">
            <ScoreCard label="Readability" score={result.readability} icon="information-type-standard" />
            <ScoreCard label="Maintainability" score={result.maintainability} icon="settings-type-standard" />
            <ScoreCard label="Complexity" score={result.complexity} icon="warning-type-standard" />
            <ScoreCard label="Best Practices" score={result.bestPractices} icon="checkmark-type-standard" />
          </ODSBox>

          <IssueList issues={result.issues} />
        </ODSBox>
      )}
    </ODSBox>
  );
};

export default CodeAnalyzer;
