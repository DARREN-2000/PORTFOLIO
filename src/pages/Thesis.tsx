import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/portfolio/Layout";
import { thesisData } from "../data/thesisData";
import { useInView } from "../hooks/useAnimations";
import "./Index.css";

const ThesisPhaseCard = ({ phase, index }: { phase: typeof thesisData.phases[number]; index: number }) => {
  const { ref, isInView } = useInView();
  return (
    <article ref={ref} className={`thesis-phase ${isInView ? "thesis-phase--visible" : ""}`} style={{ transitionDelay: `${index * 110}ms` }}>
      <div className="thesis-phase-number">{phase.number}</div>
      <span className="section-eyebrow">{phase.label}</span>
      <h2>{phase.title}</h2>
      <p>{phase.body}</p>
      <div className="thesis-output-list">{phase.outputs.map((output) => <span key={output}>{output}</span>)}</div>
    </article>
  );
};

const Thesis = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => (
    (localStorage.getItem("portfolio-theme") as "light" | "dark") || "light"
  ));
  const { ref: questionsRef, isInView: questionsVisible } = useInView();

  useEffect(() => {
    document.title = `${thesisData.shortTitle} — Thesis | Morris Darren Babu`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", thesisData.summary);
  }, []);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <div className="thesis-page">
        <section className="section thesis-hero">
          <div className="section-container">
            <Link className="archive-back-link" to="/about">← Back to profile</Link>
            <div className="thesis-hero-grid">
              <div>
                <span className="section-eyebrow">Research record / 2025</span>
                <h1 className="section-title">{thesisData.title}</h1>
                <p className="thesis-context">{thesisData.context}</p>
                <p className="project-detail-lede">{thesisData.summary}</p>
                <div className="project-detail-actions">
                  <a className="btn btn--primary" href={thesisData.sourceUrl} target="_blank" rel="noopener noreferrer">Read thesis PDF ↗</a>
                  <a className="btn btn--outline" href={thesisData.repositoryUrl} target="_blank" rel="noopener noreferrer">Inspect repository ↗</a>
                </div>
              </div>
              <div className="thesis-signal-card">
                <span className="section-eyebrow">Research shape</span>
                <strong>Evaluate → optimize → integrate</strong>
                <div className="thesis-signal-line"><span /><span /><span /></div>
                <p>From model selection to a governed delivery workflow.</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={questionsRef} className={`section section--alt thesis-questions ${questionsVisible ? "thesis-questions--visible" : ""}`}>
          <div className="section-container">
            <div className="section-header">
              <span className="section-eyebrow">01 / Research questions</span>
              <h2 className="section-title">What the work<br /><span className="accent-text">asks</span></h2>
            </div>
            <div className="thesis-question-grid">
              {thesisData.researchQuestions.map((question, index) => (
                <article key={question} className="thesis-question">
                  <span>0{index + 1}</span>
                  <p>{question}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-eyebrow">02 / Research method</span>
              <h2 className="section-title">Three phases,<br /><span className="accent-text">one loop</span></h2>
              <p className="section-sub">The thesis treats generation as an engineering loop: compare models, improve the useful candidate, then connect it to controlled delivery.</p>
            </div>
            <div className="thesis-phase-grid">{thesisData.phases.map((phase, index) => <ThesisPhaseCard key={phase.number} phase={phase} index={index} />)}</div>
          </div>
        </section>

        <section className="section section--alt">
          <div className="section-container">
            <div className="section-header">
              <span className="section-eyebrow">03 / System architecture</span>
              <h2 className="section-title">From source<br /><span className="accent-text">to signal</span></h2>
            </div>
            <div className="thesis-architecture" aria-label="Thesis evaluation architecture">
              <div className="thesis-architecture-line" />
              {thesisData.architecture.map((node, index) => (
                <div className="thesis-node" key={node.label}>
                  <span className="thesis-node-index">0{index + 1}</span>
                  <strong>{node.label}</strong>
                  <small>{node.detail}</small>
                </div>
              ))}
            </div>
            <p className="thesis-caption">The feedback loop makes generated code measurable: it must compile, execute, and produce useful coverage before it becomes evidence.</p>
          </div>
        </section>

        <section className="section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-eyebrow">04 / Experimental results</span>
              <h2 className="section-title">Measured<br /><span className="accent-text">signals</span></h2>
              <p className="section-sub">These values are presented as reported thesis findings, not as a claim that one metric alone proves production safety.</p>
            </div>
            <div className="thesis-results-grid">
              {thesisData.results.map((result) => <article className="thesis-result" key={result.label}><strong>{result.value}</strong><span>{result.label}</span><p>{result.detail}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section section--alt">
          <div className="section-container thesis-bottom-grid">
            <div>
              <span className="section-eyebrow">05 / Boundaries</span>
              <h2 className="section-title">What the work<br /><span className="accent-text">does not claim</span></h2>
              <ul className="thesis-limitations">{thesisData.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
            </div>
            <div className="thesis-evidence-panel">
              <span className="section-eyebrow">Evidence and tools</span>
              <div className="project-tags">{thesisData.methods.map((method) => <span className="tag" key={method}>{method}</span>)}</div>
              <p>{thesisData.confidentialityNote}</p>
              <div className="project-detail-actions"><a className="btn btn--primary" href={thesisData.sourceUrl} target="_blank" rel="noopener noreferrer">Open source document ↗</a><Link className="btn btn--outline" to="/commands">Explore commands</Link></div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Thesis;
