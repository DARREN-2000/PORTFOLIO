import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { portfolioData } from "../data/portfolioData";
import { useInView, useCardTilt } from "../hooks/useAnimations";
import Layout from "../components/portfolio/Layout";
import SkillRadar from "../components/portfolio/SkillRadar";
import "./Index.css";

const CaseStudies = lazy(() => import("../components/portfolio/CaseStudies"));

const LazyFallback = () => (
  <div className="lazy-skeleton">
    <div className="skeleton-bar skeleton-bar--wide" />
    <div className="skeleton-bar skeleton-bar--medium" />
    <div className="skeleton-bar skeleton-bar--narrow" />
    <div className="skeleton-grid">
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
    </div>
  </div>
);

// ========== TIMELINE ENTRY ==========
const TimelineEntry = ({ exp, index }: { exp: typeof portfolioData.experiences[0]; index: number }) => {
  const { ref, isInView } = useInView();
  const [expanded, setExpanded] = useState(false);

  return (
    <div ref={ref} className={`tl-item ${isInView ? 'tl-item--visible' : ''}`} style={{ transitionDelay: `${index * 120}ms` }}>
      <div className="tl-dot"><span>{exp.icon}</span></div>
      <div className="tl-card" onClick={() => setExpanded(!expanded)}>
        <div className="tl-top">
          <span className="tl-period">{exp.period}</span>
          <span className="tl-loc">{exp.location}</span>
        </div>
        <h3 className="tl-role">{exp.role}</h3>
        <div className="tl-company-row">
          <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="tl-company-link" onClick={(e) => e.stopPropagation()}>
            {exp.company} <span className="tl-ext">↗</span>
          </a>
        </div>
        <span className="tl-desc-line">{exp.description}</span>
        {exp.metrics && exp.metrics.length > 0 && (
          <div className="tl-metrics">{exp.metrics.map((m, i) => <span key={i} className="metric-badge">{m}</span>)}</div>
        )}
        <div className={`tl-expand ${expanded ? 'tl-expand--open' : ''}`}>
          <ul className="tl-bullets">{exp.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          <div className="tl-tech-row">{exp.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        </div>
        <button className="tl-toggle" aria-label={expanded ? 'Collapse' : 'Expand'}>
          <span className={`tl-chevron ${expanded ? 'tl-chevron--up' : ''}`}>↓</span>
          <span className="tl-toggle-text">{expanded ? 'Less' : 'More details'}</span>
        </button>
      </div>
    </div>
  );
};

// ========== SKILL CATEGORY ==========
const SkillCat = ({ cat, index }: { cat: typeof portfolioData.skillCategories[0]; index: number }) => {
  const { ref, isInView } = useInView();
  const { ref: tiltRef, handleMove, handleLeave } = useCardTilt(5);

  return (
    <div ref={ref} className={`reveal-item ${isInView ? 'revealed' : ''}`} style={{ transitionDelay: `${index * 90}ms` }}>
      <div ref={tiltRef} className="skill-card" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <div className="skill-card-shine" />
        <span className="skill-emoji">{cat.icon}</span>
        <h3 className="skill-card-title">{cat.title}</h3>
        <div className="skill-pills">{cat.skills.map((s) => <span key={s} className="skill-pill">{s}</span>)}</div>
      </div>
    </div>
  );
};

// ========== CERT CARD ==========
const CertCard = ({ cert, index }: { cert: typeof portfolioData.certifications[0]; index: number }) => {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`reveal-item ${isInView ? 'revealed' : ''}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="cert-card">
        <span className="cert-badge-icon">🏅</span>
        <div className="cert-card-body">
          <span className="cert-card-name">{cert.name}</span>
          <span className="cert-card-issuer">{cert.issuer}</span>
        </div>
        <span className="cert-card-arrow">↗</span>
      </a>
    </div>
  );
};

// ========== TILT PROJECT CARD ==========
const TiltProjectCard = ({ project, index }: { project: typeof portfolioData.projects[0]; index: number }) => {
  const { ref: tiltRef, handleMove, handleLeave } = useCardTilt(6);
  const { ref: viewRef, isInView } = useInView();

  return (
    <div ref={viewRef} className={`reveal-item ${isInView ? 'revealed' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div ref={tiltRef} className="project-card" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <div className="project-card-shine" />
        <span className="project-num">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="project-title">{project.title}</h3>
        <span className="project-subtitle">{project.subtitle}</span>
        <p className="project-desc">{project.desc}</p>
        <div className="project-impact-row">
          <span className="impact-dot" /><span className="impact-text">{project.impact}</span>
        </div>
        <div className="project-tags">{project.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        {project.github && (
          <div className="project-links">
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" onClick={e => e.stopPropagation()}>
              <svg className="link-icon" viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              <span>View on GitHub</span><span className="link-arrow">↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== ABOUT PAGE ==========
const About = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('portfolio-theme') as 'light' | 'dark') || 'light';
    return 'light';
  });
  const { ref: eduRef, isInView: eduVis } = useInView();
  const [projectFilter, setProjectFilter] = useState("All");

  const aboutParagraphs = useMemo(() => {
    const data = portfolioData as unknown as Record<string, unknown>;
    const candidates = [data.aboutParagraphs, data.about, data.whoIAm, data.aboutMe];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        const normalized = candidate.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
        if (normalized.length > 0) return normalized;
      }
      if (typeof candidate === "string" && candidate.trim().length > 0) return [candidate];
    }
    return [portfolioData.tagline];
  }, []);

  const aboutQuote = useMemo(() => {
    const data = portfolioData as unknown as Record<string, unknown>;
    if (typeof data.aboutQuote === "string" && data.aboutQuote.trim().length > 0) return data.aboutQuote;
    return `Based in ${portfolioData.location} — open to impactful AI and MLOps collaborations.`;
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      {/* Bio */}
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">About</span>
            <h2 className="section-title">Who<br /><span className="accent-text">I Am</span></h2>
          </div>
          <div className="about-body about-body--visible">
            {aboutParagraphs.map((p, i) => <p key={i} className="about-p" dangerouslySetInnerHTML={{ __html: p }} />)}
            <blockquote className="about-quote">"{aboutQuote}"</blockquote>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Career</span>
            <h2 className="section-title">Professional<br /><span className="accent-text">Experience</span></h2>
            <p className="section-sub">From data engineering to MLOps — building AI systems at industry leaders</p>
          </div>
          <div className="timeline">
            <div className="timeline-track" />
            {portfolioData.experiences.map((exp, i) => <TimelineEntry key={i} exp={exp} index={i} />)}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Expertise</span>
            <h2 className="section-title">Technical<br /><span className="accent-text">Arsenal</span></h2>
          </div>
          <div className="skills-radar-row">
            <div className="skills-grid">
              {portfolioData.skillCategories.map((cat, i) => <SkillCat key={cat.title} cat={cat} index={i} />)}
            </div>
            <SkillRadar />
          </div>
          <div className="subsection" style={{ marginTop: 48 }}>
            <div className="soft-skills-row">
              <h3 className="soft-skills-title">Soft Skills</h3>
              <div className="soft-skills-tags">
                {portfolioData.softSkills.map(s => <span key={s} className="soft-skill-tag">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Education</span>
            <h2 className="section-title">Academic<br /><span className="accent-text">Background</span></h2>
          </div>
          <div ref={eduRef} className={`edu-grid ${eduVis ? 'revealed-parent' : ''}`}>
            {portfolioData.education.map((edu, i) => (
              <div key={i} className="edu-card reveal-child" style={{ transitionDelay: `${i * 150}ms` }}>
                <h3 className="edu-degree">{edu.degree}</h3>
                <a href={edu.schoolUrl} target="_blank" rel="noopener noreferrer" className="edu-school-link">
                  {edu.school} <span className="tl-ext">↗</span>
                </a>
                <span className="edu-period">{edu.period}</span>
                {edu.subjects.length > 0 && (
                  <div className="edu-tags">{edu.subjects.map((s) => <span key={s} className="tag">{s}</span>)}</div>
                )}
              </div>
            ))}
          </div>
          <div className="subsection">
            <h3 className="subsection-title">Languages</h3>
            <div className="lang-list">
              {portfolioData.languages.map((l) => (
                <div key={l.lang} className="lang-row">
                  <div className="lang-info">
                    <span className="lang-name">{l.lang}</span>
                    <span className="lang-level">{l.level}</span>
                  </div>
                  <div className="lang-track"><div className="lang-fill" style={{ width: `${l.percent}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Credentials</span>
            <h2 className="section-title">Professional<br /><span className="accent-text">Certifications</span></h2>
          </div>
          <div className="certs-grid">
            {portfolioData.certifications.map((c, i) => <CertCard key={c.name} cert={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section id="projects" className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="section-title">All<br /><span className="accent-text">Projects</span></h2>
            <p className="section-sub">Complete collection of work across AI, ML, and data engineering</p>
          </div>
          <div className="project-filters">
            {["All", ...Array.from(new Set(portfolioData.projects.flatMap(p => p.tags)))].slice(0, 8).map(tag => (
              <button key={tag} className={`filter-chip ${projectFilter === tag ? 'filter-chip--active' : ''}`}
                onClick={() => setProjectFilter(tag)}>{tag}</button>
            ))}
          </div>
          <div className="projects-grid">
            {portfolioData.projects.filter(p => projectFilter === "All" || p.tags.includes(projectFilter))
              .map((p, i) => <TiltProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Deep Dives</span>
            <h2 className="section-title">Case<br /><span className="accent-text">Studies</span></h2>
          </div>
          <Suspense fallback={<LazyFallback />}><CaseStudies /></Suspense>
        </div>
      </section>

      {/* Publications */}
      <section className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Research</span>
            <h2 className="section-title">Publications &<br /><span className="accent-text">Research</span></h2>
          </div>
          <div className="publications-grid">
            <a href={portfolioData.masterThesis} target="_blank" rel="noopener noreferrer" className="publication-card">
              <span className="pub-icon">📑</span>
              <div className="pub-body">
                <h3 className="pub-title">Master Thesis — AI in Automotive Systems</h3>
                <p className="pub-meta">CARIAD (Volkswagen Group) • Friedrich Alexander University • 2025</p>
                <p className="pub-desc">Integrating LLMs in CI/CD/CT Pipelines for AI-driven black-box fuzzing</p>
                <div className="pub-tags"><span className="tag">LLM</span><span className="tag">Fuzzing</span><span className="tag">Azure AI</span></div>
              </div>
              <span className="pub-arrow">↗</span>
            </a>
            <a href="https://github.com/DARREN-2000/Hybrid-Movie-Recommendation-System" target="_blank" rel="noopener noreferrer" className="publication-card">
              <span className="pub-icon">📄</span>
              <div className="pub-body">
                <h3 className="pub-title">Hybrid Movie Recommendation System</h3>
                <p className="pub-meta">Published Research Paper • 2022</p>
                <p className="pub-desc">Hybrid recommendation using collaborative and content filtering — 92% Top-K Hit Rate</p>
                <div className="pub-tags"><span className="tag">RecSys</span><span className="tag">ML</span></div>
              </div>
              <span className="pub-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
