import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/portfolio/Layout";
import { portfolioData } from "../data/portfolioData";
import { projectSlug } from "../data/projectUtils";
import "./Index.css";

const SYSTEMS = [
  {
    title: "LLM platforms",
    eyebrow: "Routing · evaluation · serving",
    description: "Model routing, semantic caching, evaluation loops, and observability for systems that need more than a single API call.",
    projects: ["Inference Control Plane", "LLM Fuzzing Monitor Dashboard"],
  },
  {
    title: "Agent safety",
    eyebrow: "Policy · provenance · durable workflows",
    description: "Turning natural-language intent into actions with explicit boundaries, evidence, approvals, and recoverable execution.",
    projects: ["governOS", "IntentGraph", "MCP Provenance Capsules", "AgentBox"],
  },
  {
    title: "AI infrastructure",
    eyebrow: "Isolation · orchestration · runtimes",
    description: "Infrastructure experiments around GPU-aware workloads, controlled execution, and the operational layer around AI products.",
    projects: ["AI Hypervisor Platform", "TelosVM"],
  },
  {
    title: "Applied data and ML",
    eyebrow: "Retrieval · vision · research",
    description: "Practical ML systems that connect data preparation, model behavior, evaluation, and a usable interface.",
    projects: ["GNN Material Wear Prediction", "Multilingual OCR System", "Hybrid Movie Recommendation"],
  },
];

const Systems = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => (
    (localStorage.getItem("portfolio-theme") as "light" | "dark") || "light"
  ));
  const projects = new Map(portfolioData.projects.map((project) => [project.title, project]));

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section systems-page">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Systems map</span>
            <h1 className="section-title">How I think<br /><span className="accent-text">about systems</span></h1>
            <p className="section-sub">A map of the engineering problems behind the projects: reliable inference, governed automation, infrastructure, and applied ML.</p>
          </div>
          <div className="systems-grid">
            {SYSTEMS.map((system) => (
              <article className="system-card" key={system.title}>
                <span className="section-eyebrow">{system.eyebrow}</span>
                <h2>{system.title}</h2>
                <p>{system.description}</p>
                <div className="system-projects">
                  {system.projects.map((title) => {
                    const project = projects.get(title);
                    return project ? <Link key={title} to={`/projects/${projectSlug(project.title)}`}>{project.title} <span>→</span></Link> : null;
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Systems;
