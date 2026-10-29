import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/portfolio/Layout";
import { portfolioData } from "../data/portfolioData";
import { projectCategory, projectSlug } from "../data/projectUtils";
import "./Index.css";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(() => (
    (localStorage.getItem("portfolio-theme") as "light" | "dark") || "light"
  ));
  const project = useMemo(
    () => portfolioData.projects.find((item) => projectSlug(item.title) === slug),
    [slug],
  );
  const hasRepository = Boolean(project?.github);
  const hasDemo = Boolean(project && "demo" in project && project.demo);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — Project Record | Morris Darren Babu`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", `${project.title}: ${project.desc}`);
  }, [project]);

  if (!project) {
    return (
      <Layout theme={theme} setTheme={setTheme}>
        <section className="section project-detail-page">
          <div className="section-container archive-empty">
            <h1>Project not found</h1>
            <p>This project is not part of the current verified portfolio archive.</p>
            <button className="btn btn--outline" onClick={() => navigate("/projects")}>Browse projects</button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <article className="section project-detail-page">
        <div className="section-container">
          <Link className="archive-back-link" to="/projects">← Back to archive</Link>
          <header className="project-detail-header">
            <span className="section-eyebrow">Project record</span>
            <p className="project-subtitle">{project.subtitle}</p>
            <h1 className="section-title">{project.title}</h1>
            <p className="project-detail-lede">{project.desc}</p>
            <div className="project-detail-meta">
              <span>{projectCategory(project)}</span>
              <span>{hasRepository ? "Repository-backed record" : "Portfolio project record"}</span>
            </div>
            <div className="project-detail-actions">
              {project.github && <a className="btn btn--primary" href={project.github} target="_blank" rel="noopener noreferrer">Inspect repository ↗</a>}
              {hasDemo && "demo" in project && project.demo && <a className="btn btn--outline" href={project.demo} target="_blank" rel="noopener noreferrer">Open live demo ↗</a>}
              <Link className="btn btn--outline" to="/commands">Developer commands</Link>
            </div>
          </header>
          <div className="project-detail-grid">
            <section className="project-detail-panel">
              <span className="section-eyebrow">Outcome</span>
              <h2>What this project demonstrates</h2>
              <p>{project.impact}</p>
              <p className="project-detail-note">The repository is the source of truth for implementation details, setup instructions, and current results. Claims on this page stay intentionally limited to the verified project record.</p>
            </section>
            <section className="project-detail-panel">
              <span className="section-eyebrow">Technology</span>
              <h2>Tools and methods</h2>
              <div className="project-tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            </section>
            <section className="project-detail-panel">
              <span className="section-eyebrow">Evidence</span>
              <h2>How to verify it</h2>
              <p>
                {hasRepository
                  ? "Inspect the linked repository for implementation details, setup instructions, and the latest source."
                  : hasDemo
                    ? "Use the linked live demo to explore the published experience. A public repository is not currently attached to this record."
                    : "This record is based on the current portfolio catalogue. A public repository or live demo is not currently attached."}
              </p>
            </section>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ProjectDetail;
