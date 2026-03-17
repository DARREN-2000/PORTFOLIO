import "./ScoreCard.css";

interface ScoreCardProps {
  label: string;
  score: number;
}

export const ScoreCard = ({ label, score }: ScoreCardProps) => {
  const level = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";

  return (
    <div className={`score-card score-card--${level}`}>
      <div className="score-card-header">
        <span className="ods-typography-body-m-bold">{label}</span>
      </div>
      <span className={`ods-typography-title-m score-card-value score-card-value--${level}`}>
        {score}
      </span>
      <div className="progress-bar-wrapper" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-bar-fill progress-bar-fill--${level === "bad" ? "error" : "success"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
