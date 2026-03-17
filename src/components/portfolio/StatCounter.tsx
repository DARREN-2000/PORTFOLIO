import { useInView, useCounter } from "../../hooks/useAnimations";
import { ODSText } from "@telekom-ods/react-ui-kit";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatCounter = ({ value, label, suffix = "+" }: StatCounterProps) => {
  const { ref, isInView } = useInView();
  const count = useCounter(value, 2000, 0, isInView);

  return (
    <div ref={ref} className="stat-counter">
      <ODSText as="span" className="stat-number">
        {count}{suffix}
      </ODSText>
      <ODSText as="span" className="stat-label">
        {label}
      </ODSText>
    </div>
  );
};

export default StatCounter;
