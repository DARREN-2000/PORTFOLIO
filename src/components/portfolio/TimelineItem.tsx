import { useInView } from "../../hooks/useAnimations";

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
            <span className="timeline-period">{period}</span>
            <span className="timeline-location">{location}</span>
          </div>
          <h3 className="timeline-role">{role}</h3>
          <span className="timeline-company">{company}</span>
          <span className="timeline-desc">{description}</span>
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
              <span className="timeline-bullet-text">{b}</span>
            </li>
          ))}
        </ul>

        <div className="timeline-tech">
          {tech.map((t) => (
            <span key={t} className="tag tag--subtle">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
