import { useState } from "react";
import { useInView } from "../../hooks/useAnimations";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  impact: string;
  index: number;
}

const ProjectCard = ({ title, subtitle, desc, tags, impact, index }: ProjectCardProps) => {
  const { ref, isInView } = useInView();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`project-card ${isInView ? "project-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-card-inner">
        <div className="project-number">{String(index + 1).padStart(2, "0")}</div>
        <h3 className="project-title">{title}</h3>
        <span className="project-subtitle">{subtitle}</span>
        <p className="project-desc">{desc}</p>
        <div className="project-impact">
          <span className="impact-indicator" />
          <span className="impact-text">{impact}</span>
        </div>
        <div className="project-tags">
          {tags.map((t) => (
            <span key={t} className="tag tag--subtle">{t}</span>
          ))}
        </div>
      </div>
      <div className={`project-glow ${isHovered ? "project-glow--active" : ""}`} />
    </div>
  );
};

export default ProjectCard;
