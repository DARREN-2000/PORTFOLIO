import { useInView } from "../../hooks/useAnimations";

interface SkillCategoryProps {
  title: string;
  icon: string;
  skills: string[];
  index: number;
}

const SkillCategory = ({ title, icon, skills, index }: SkillCategoryProps) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`skill-category ${isInView ? "skill-category--visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="skill-category-header">
        <span className="skill-icon">{icon}</span>
        <h3 className="skill-title">{title}</h3>
      </div>
      <div className="skill-chips">
        {skills.map((s) => (
          <span key={s} className="skill-chip">{s}</span>
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;
