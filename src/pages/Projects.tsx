import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { portfolioData } from "../data/portfolioData";
import { selectedProjectTitles, projectCategory, projectSlug } from "../data/projectUtils";
import Layout from "../components/portfolio/Layout";
import "./Index.css";

const Projects = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => (
    (localStorage.getItem("portfolio-theme") as "light" | "dark") || "light"
  ));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = searchParams.get("scope") === "selected" ? "selected" : "all";
  const categories = ["All", "AI Systems", "Developer Tools", "Research", "Data & ML"];
  const selectedCount = portfolioData.projects.filter((project) => selectedProjectTitles.has(project.title)).length;
  const projects = useMemo(() => portfolioData.projects.filter((project) => {
    const matchesScope = scope === "all" || selectedProjectTitles.has(project.title);
    const haystack = `${project.title} ${project.subtitle} ${project.desc} ${project.tags.join(" ")}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase().trim());
    const matchesCategory = category === "All" || projectCategory(project) === category;
    return matchesScope && matchesQuery && matchesCategory;
  }), [category, query, scope]);

  const setScope = (nextScope: "selected" | "all") => {
    setSearchParams(nextScope === "selected" ? { scope: nextScope } : {});
    setCategory("All");
    setQuery("");
  };

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section projects-archive">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">{scope === "selected" ? "Selected Work" : "All Work"}</span>
            <h1 className="section-title">{scope === "selected" ? <>Selected<br /><span className="accent-text">Projects</span></> : <>Engineering<br /><span className="accent-text">Archive</span></>}</h1>
            <p className="section-sub">
              {scope === "selected"
                ? "A focused collection of nine projects chosen for technical depth, evidence, and the clearest engineering story."
                : "Explore the complete catalogue across AI, infrastructure, data, developer tooling, research, and product engineering."}
            </p>
          </div>
          <div className="archive-folders" aria-label="Project collections" role="group">
            <button type="button" className={`archive-folder ${scope === "selected" ? "archive-folder--active" : ""}`} onClick={() => setScope("selected")} aria-pressed={scope === "selected"}>
              <span className="archive-folder-icon">◆</span>
              <span><strong>Selected</strong><small>{selectedCount} project records</small></span>
            </button>
            <button type="button" className={`archive-folder ${scope === "all" ? "archive-folder--active" : ""}`} onClick={() => setScope("all")} aria-pressed={scope === "all"}>
              <span className="archive-folder-icon">▦</span>
              <span><strong>Complete archive</strong><small>{portfolioData.projects.length} project records</small></span>
            </button>
          </div>
          <div className="archive-controls">
            <label className="archive-search">
              <span>Search projects</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try RAG, Python, OCR..." aria-label="Search project archive" />
            </label>
            <div className="archive-filters" aria-label="Filter projects">
              {categories.map((item) => (
                <button type="button" key={item} className={`filter-chip ${category === item ? "filter-chip--active" : ""}`} onClick={() => setCategory(item)} aria-pressed={category === item}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="archive-count" aria-live="polite">{projects.length} project{projects.length === 1 ? "" : "s"} found</p>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article key={project.title} className="project-card archive-project-card">
                <span className="project-num">{String(index + 1).padStart(2, "0")}</span>
                <div className="archive-card-meta">
                  <span className="project-subtitle">{project.subtitle}</span>
                  <span className="archive-category">{projectCategory(project)}</span>
                </div>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-desc">{project.desc}</p>
                <div className="project-impact-row"><span className="impact-dot" /><span className="impact-text">{project.impact}</span></div>
                <div className="project-tags">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <span className="archive-evidence">{selectedProjectTitles.has(project.title) ? "Selected record" : "Archive record"}</span>
                <div className="archive-card-links">
                  <button type="button" className="project-link" onClick={() => navigate(`/projects/${projectSlug(project.title)}`)}>Read project record <span>→</span></button>
                  {"demo" in project && project.demo && <a className="project-link project-link--demo" href={project.demo} target="_blank" rel="noopener noreferrer">Live demo <span>↗</span></a>}
                  {project.github && <a className="project-link" href={project.github} target="_blank" rel="noopener noreferrer">Inspect repository <span>↗</span></a>}
                </div>
              </article>
            ))}
          </div>
          {projects.length === 0 && (
            <div className="archive-empty" role="status">
              <h2>No matching project records</h2>
              <p>Try a broader search or remove the active category filter.</p>
              <button type="button" className="btn btn--outline" onClick={() => { setQuery(""); setCategory("All"); }}>
                Clear filters
              </button>
            </div>
          )}
          <button className="btn btn--outline archive-back" onClick={() => navigate("/")}>← Back to home</button>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
