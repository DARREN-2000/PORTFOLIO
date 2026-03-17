import { useInView } from "../../hooks/useAnimations";
import { ODSText, ODSTagStatic } from "@telekom-ods/react-ui-kit";

interface TimelineItemProps {
  period: string;
  role: string;
  company: string;
  location: string;
  icon: string;
  description: string;
  bullets: string[];
  tech: string[];
  metrics?: string[];
  index: number;
}

const TimelineItem = ({ period, role, company, location, icon, description, bullets, tech, metrics, index }: TimelineItemProps) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`timeline-item ${isInView ? "timeline-item--visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="timeline-dot">
        <span className="timeline-icon">{icon}</span>
      </div>
      <div className="timeline-card">
        <div className="timeline-header">
          <div className="timeline-meta">
            <ODSText as="span" className="timeline-period">{period}</ODSText>
            <ODSText as="span" className="timeline-location">{location}</ODSText>
          </div>
          <ODSText as="h3" className="timeline-role">{role}</ODSText>
          <ODSText as="span" className="timeline-company">{company}</ODSText>
          <ODSText as="span" className="timeline-desc">{description}</ODSText>
        </div>

        {metrics && metrics.length > 0 && (
          <div className="timeline-metrics">
            {metrics.map((m, i) => (
              <div key={i} className="metric-chip">{m}</div>
            ))}
          </div>
        )}

        <ul className="timeline-bullets">
          {bullets.map((b, i) => (
            <li key={i}>
              <ODSText as="span" className="ods-typography-body-s-regular">{b}</ODSText>
            </li>
          ))}
        </ul>

        <div className="timeline-tech">
          {tech.map((t) => (
            <ODSTagStatic key={t} label={t} type="subtle" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
