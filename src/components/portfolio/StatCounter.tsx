import { useInView, useCounter } from "../../hooks/useAnimations";

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
      <span className="stat-number">
        {count}{suffix}
      </span>
      <span className="stat-label">
        {label}
      </span>
    </div>
  );
};

export default StatCounter;
