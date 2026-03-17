import { useState } from "react";
import { useInView } from "../../hooks/useAnimations";
import { ODSText, ODSTagStatic } from "@telekom-ods/react-ui-kit";

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
        <ODSText as="h3" className="project-title">{title}</ODSText>
        <ODSText as="span" className="project-subtitle">{subtitle}</ODSText>
        <ODSText as="p" className="project-desc">{desc}</ODSText>
        <div className="project-impact">
          <span className="impact-indicator" />
          <ODSText as="span" className="impact-text">{impact}</ODSText>
        </div>
        <div className="project-tags">
          {tags.map((t) => (
            <ODSTagStatic key={t} label={t} type="subtle" />
          ))}
        </div>
      </div>
      <div className={`project-glow ${isHovered ? "project-glow--active" : ""}`} />
    </div>
  );
};

export default ProjectCard;
