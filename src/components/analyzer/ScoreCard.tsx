import { ODSBox, ODSText, ODSProgressBar } from "@telekom-ods/react-ui-kit";
import "./ScoreCard.css";

interface ScoreCardProps {
  label: string;
  score: number;
  icon: string;
}

export const ScoreCard = ({ label, score, icon }: ScoreCardProps) => {
  const level = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";

  return (
    <ODSBox as="div" className={`score-card score-card--${level}`}>
      <ODSBox as="div" className="score-card-header">
        <ODSText as="span" className="ods-typography-body-m-bold">{label}</ODSText>
      </ODSBox>
      <ODSText as="span" className={`ods-typography-title-m score-card-value score-card-value--${level}`}>
        {score}
      </ODSText>
      <ODSProgressBar progress={score} labelText="" size="small" mode={level === "bad" ? "error" : "success"} />
    </ODSBox>
  );
};
