import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useTypingEffect,
  useMouseParallax,
  useInView,
  useCounter,
  useCardTilt,
} from "../hooks/useAnimations";
import { portfolioData } from "../data/portfolioData";
import { flagshipProjectTitles, projectSlug } from "../data/projectUtils";
import { portfolioCommands } from "../data/commands";
import profileImg from "../assets/profile-github.jpg";
import Layout from "../components/portfolio/Layout";
import { CinematicMotionField, FloatingCodeSnippets } from "../components/portfolio/Visualizations";
import PublicSignals from "../components/portfolio/PublicSignals";
import "./Index.css";

// ========== STAT COUNTER ==========
const StatCounter = ({ value, label, icon, suffix = "+" }: { value: number; label: string; icon: string; suffix?: string }) => {
  const { ref, isInView } = useInView();
  const count = useCounter(value, 2200, 0, isInView);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-number">{count}<span className="stat-plus">{suffix}</span></span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const HomeExperienceEntry = ({ exp, index }: { exp: typeof portfolioData.experiences[0]; index: number }) => {
  const { ref, isInView } = useInView();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      ref={ref}
      className={`tl-item ${isInView ? "tl-item--visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="tl-dot"><span>{exp.icon}</span></div>
      <div className="tl-card" onClick={() => setExpanded((value) => !value)}>
        <div className="tl-top">
          <span className="tl-period">{exp.period}</span>
          <span className="tl-loc">{exp.location}</span>
        </div>
        <h3 className="tl-role">{exp.role}</h3>
        <div className="tl-company-row">
          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tl-company-link"
            onClick={(event) => event.stopPropagation()}
          >
            {exp.company} <span className="tl-ext">↗</span>
          </a>
        </div>
        <span className="tl-desc-line">{exp.description}</span>
        <div className="tl-metrics">
          {exp.metrics.map((metric) => <span key={metric} className="metric-badge">{metric}</span>)}
        </div>
        <div className={`tl-expand ${expanded ? "tl-expand--open" : ""}`}>
          <ul className="tl-bullets">{exp.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          <div className="tl-tech-row">{exp.tech.map((tech) => <span key={tech} className="tag">{tech}</span>)}</div>
        </div>
        <button
          type="button"
          className="tl-toggle"
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
        >
          <span className={`tl-chevron ${expanded ? "tl-chevron--up" : ""}`}>↓</span>
          <span>{expanded ? "Less" : "More details"}</span>
        </button>
      </div>
    </div>
  );
};

// ========== TILT PROJECT CARD ==========
const TiltProjectCard = ({ project, index }: { project: typeof portfolioData.projects[0]; index: number }) => {
  const { ref: tiltRef, handleMove, handleLeave } = useCardTilt(6);
  const { ref: viewRef, isInView } = useInView();

  return (
    <div ref={viewRef} className={`reveal-item ${isInView ? 'revealed' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div ref={tiltRef} className={`project-card ${index === 0 ? 'project-card--lead' : ''}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <div className="project-card-shine" />
        <span className="project-num">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="project-title">{project.title}</h3>
        <span className="project-subtitle">{project.subtitle}</span>
        <p className="project-desc">{project.desc}</p>
        <div className="project-impact-row">
          <span className="impact-dot" /><span className="impact-text">{project.impact}</span>
        </div>
        <div className="project-tags">{project.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        <Link className="project-link project-link--record" to={`/projects/${projectSlug(project.title)}`} onClick={e => e.stopPropagation()}>
          Read project record <span>→</span>
        </Link>
        {"demo" in project && project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link" onClick={e => e.stopPropagation()}>
            Live demo <span className="link-arrow">↗</span>
          </a>
        )}
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

const flagshipArchitecture: Record<string, { nodes: string[]; caption: string }> = {
  FlowBoard: {
    nodes: ["React / TS", "Symfony API", "AI planner", "Postgres + Redis"],
    caption: "Collaborate → decompose → execute",
  },
  ZyntriQ: {
    nodes: ["Blazor UI", "Roslyn compiler", "WASM runtime", "Diagnostics"],
    caption: "Write → compile → inspect",
  },
  ReconKit: {
    nodes: ["Scope gates", "25 modules", "Assessment", "Reports + CI"],
    caption: "Authorize → assess → report",
  },
};

const engineeringPrinciples = [
  {
    index: "01",
    title: "Make the system legible",
    body: "I turn ambiguous requirements into explicit boundaries, contracts, diagrams, and decisions that a team can inspect before implementation grows expensive.",
    signal: "Architecture before abstraction",
  },
  {
    index: "02",
    title: "Measure the failure modes",
    body: "Evaluation, replay, tracing, and regression gates belong beside the feature so reliability is part of delivery rather than a final promise.",
    signal: "Evidence beside output",
  },
  {
    index: "03",
    title: "Ship useful slices",
    body: "I prefer a small end-to-end path that users can exercise, then deepen the system with stronger controls, performance, and observability.",
    signal: "Feedback over ceremony",
  },
  {
    index: "04",
    title: "Keep power governable",
    body: "AI systems need scope controls, authorization, privacy boundaries, and human review paths that remain understandable under pressure.",
    signal: "Safety is a product feature",
  },
];

const EngineeringPrinciple = ({ principle, index }: { principle: typeof engineeringPrinciples[number]; index: number }) => {
  const { ref, isInView } = useInView();

  return (
    <article
      ref={ref}
      className={`principle-card ${isInView ? "principle-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="principle-card-top">
        <span className="principle-index">{principle.index}</span>
        <span className="principle-signal">{principle.signal}</span>
      </div>
      <h3>{principle.title}</h3>
      <p>{principle.body}</p>
      <span className="principle-marker" aria-hidden="true">↗</span>
    </article>
  );
};

const FlagshipProjectCard = ({ project, index }: { project: typeof portfolioData.projects[number]; index: number }) => {
  const { ref, isInView } = useInView();
  const architecture = flagshipArchitecture[project.title];

  return (
    <article
      ref={ref}
      className={`flagship-card flagship-card--${index + 1} ${isInView ? "flagship-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flagship-card-topline">
        <span>0{index + 1} / Flagship</span>
        <span>{project.tags[0]}</span>
      </div>
      <div className="flagship-visual" aria-label={`${project.title} system flow`}>
        <div className="flagship-visual-grid" />
        <svg className="flagship-flow" viewBox="0 0 460 128" role="img">
          {architecture.nodes.slice(0, -1).map((_, nodeIndex) => (
            <line
              key={`line-${nodeIndex}`}
              x1={82 + nodeIndex * 98}
              y1="64"
              x2={130 + nodeIndex * 98}
              y2="64"
              className="flagship-flow-line"
            />
          ))}
          {architecture.nodes.map((node, nodeIndex) => (
            <g key={node}>
              <circle cx={58 + nodeIndex * 98} cy="64" r="18" className="flagship-flow-node" />
              <text x={58 + nodeIndex * 98} y="68" textAnchor="middle" className="flagship-flow-index">
                {String(nodeIndex + 1).padStart(2, "0")}
              </text>
              <text x={58 + nodeIndex * 98} y="108" textAnchor="middle" className="flagship-flow-label">
                {node}
              </text>
            </g>
          ))}
        </svg>
        <span className="flagship-flow-caption">{architecture.caption}</span>
      </div>
      <div className="flagship-card-copy">
        <span className="project-subtitle">{project.subtitle}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>
        <div className="project-impact-row"><span className="impact-dot" /><span className="impact-text">{project.impact}</span></div>
        <div className="project-tags">{project.tags.slice(0, 4).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </div>
      <div className="flagship-actions">
        <Link className="project-link project-link--record" to={`/projects/${projectSlug(project.title)}`}>Read case study <span>→</span></Link>
        {"demo" in project && project.demo && <a className="project-link project-link--demo" href={project.demo} target="_blank" rel="noopener noreferrer">Live demo <span>↗</span></a>}
        {project.github && <a className="project-link" href={project.github} target="_blank" rel="noopener noreferrer">Repository <span>↗</span></a>}
      </div>
    </article>
  );
};

// ========== SKILL ORBIT ==========
const SkillOrbit = () => {
  const orbitSkills = ["Python", "PyTorch", "AWS", "Docker", "K8s", "RAG", "vLLM", "Azure"];
  return (
    <div className="orbit-wrap">
      <div className="orbit-center">AI</div>
      <div className="orbit-ring orbit-ring--1">
        {orbitSkills.slice(0, 4).map((s, i) => (
          <span key={s} className="orbit-node" style={{ '--i': i, '--total': 4 } as React.CSSProperties}>{s}</span>
        ))}
      </div>
      <div className="orbit-ring orbit-ring--2">
        {orbitSkills.slice(4).map((s, i) => (
          <span key={s} className="orbit-node" style={{ '--i': i, '--total': 4 } as React.CSSProperties}>{s}</span>
        ))}
      </div>
    </div>
  );
};

// ========== MAIN HOME PAGE ==========
const Home = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('portfolio-theme') as 'light' | 'dark') || 'light';
    return 'light';
  });
  const navigate = useNavigate();
  const typedText = useTypingEffect(portfolioData.titles, 55, 30, 2800);
  const mouse = useMouseParallax(0.012);
  const { ref: contactRef, isInView: contactVis } = useInView();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const flagshipProjects = portfolioData.projects.filter((project) => flagshipProjectTitles.has(project.title));
  const visibleCommands = portfolioCommands.slice(0, 4);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      {/* Hero */}
      <section id="hero" className="hero">
        <FloatingCodeSnippets />
        <CinematicMotionField />
        <div className="hero-scanline" aria-hidden="true" />
        <div className="hero-energy-ring hero-energy-ring--one" aria-hidden="true" />
        <div className="hero-energy-ring hero-energy-ring--two" aria-hidden="true" />
        <div className="hero-bg-pattern" />
        <div className="hero-gradient-mesh" />
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-orb hero-orb--3" />
        <div className="hero-grid-lines" />

        <div className="hero-geo-shapes">
          <div className="geo-shape geo-hex" style={{ top: '8%', left: '5%', animationDelay: '0s' }} />
          <div className="geo-shape geo-triangle" style={{ top: '15%', right: '8%', animationDelay: '2s' }} />
          <div className="geo-shape geo-circle" style={{ bottom: '20%', left: '10%', animationDelay: '4s' }} />
          <div className="geo-shape geo-diamond" style={{ top: '40%', right: '3%', animationDelay: '1s' }} />
        </div>

        <svg className="hero-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path fill="url(#blobGrad)" className="blob-path">
            <animate attributeName="d" dur="12s" repeatCount="indefinite"
              values="M300,520C180,520,60,400,60,300C60,200,180,80,300,80C420,80,540,200,540,300C540,400,420,520,300,520Z;M300,540C160,540,40,420,40,300C40,160,180,60,300,60C440,60,560,180,560,300C560,440,440,540,300,540Z;M300,530C200,550,50,410,50,300C50,170,170,50,300,70C430,50,550,190,550,300C550,420,400,510,300,530Z;M300,520C180,520,60,400,60,300C60,200,180,80,300,80C420,80,540,200,540,300C540,400,420,520,300,520Z" />
          </path>
        </svg>

        <div className="hero-content" style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
          <div className="hero-left">
            <div className="hero-avatar-wrap">
              <div className="avatar-ring" />
              <div className="avatar-ring avatar-ring--2" />
              <img src={profileImg} alt="Morris Darren Babu" className="hero-avatar" />
              <span className="avatar-status" />
              <div className="avatar-label">
                <span className="avatar-label-dot" /> Open to work
              </div>
            </div>
            <SkillOrbit />
          </div>
          <div className="hero-right">
            <div className="hero-badge hero-stagger" style={{ animationDelay: '0.2s' }}>
              <span className="hero-badge-dot" />
              <span>Developer Tools · AI Systems · Infrastructure</span>
            </div>
            <div className="hero-command-dock" aria-label="Featured engineering commands">
              <div className="hero-command-dock__top">
                <span className="hero-command-dock__label">Live command shelf</span>
                <Link to="/commands" className="hero-command-dock__link">Open all commands <span aria-hidden="true">→</span></Link>
              </div>
              <div className="hero-command-dock__list">
                {visibleCommands.map((item) => (
                  <Link className="hero-command-chip" to="/commands" key={item.title}>
                    <span className="hero-command-chip__category">{item.category}</span>
                    <code>{item.command.split("\n")[0]}</code>
                  </Link>
                ))}
              </div>
            </div>
            <span className="hero-eyebrow hero-stagger" style={{ animationDelay: '0.35s' }}>Hello, I'm</span>
            <h1 className="hero-name hero-stagger" style={{ animationDelay: '0.5s' }}>
              <span className="hero-name-text" data-text="Morris">Morris</span>
              <span className="hero-name-accent" data-text=" Darren"> Darren</span>
              <span className="hero-name-line" data-text=" Babu"> Babu</span>
            </h1>
            <div className="hero-terminal hero-stagger" style={{ animationDelay: '0.65s' }}>
              <div className="terminal-header">
                <div className="terminal-dots"><span /><span /><span /></div>
                <span className="terminal-title">~/career</span>
              </div>
              <div className="terminal-body">
                <span className="terminal-prompt">$</span>
                <span className="terminal-text">{typedText}</span>
                <span className="terminal-cursor" />
              </div>
            </div>
            <p className="hero-tagline hero-stagger" style={{ animationDelay: '0.8s' }}>
              I turn ambiguous AI and infrastructure problems into systems that are understandable, testable, and useful — from model routing and agent safety to data products and developer tools.
            </p>
            <div className="hero-stats-row hero-stagger" style={{ animationDelay: '0.95s' }}>
              {portfolioData.stats.slice(0, 3).map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="hero-stat-divider" />}
                  <div className="hero-stat">
                    <span className="hero-stat-val">{s.value}+</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="hero-actions hero-stagger" style={{ animationDelay: '1.1s' }}>
              <button className="btn btn--primary btn--glow" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>View My Work</span><span className="btn-arrow">→</span>
              </button>
              <button className="btn btn--outline" onClick={() => navigate('/about')}>
                <span>About Me</span>
              </button>
              <a className="btn btn--ghost" href={portfolioData.resume} target="_blank" rel="noopener noreferrer">
                <span>Interim Resume</span><span className="btn-arrow">↗</span>
              </a>
            </div>
            <div className="hero-links hero-stagger" style={{ animationDelay: '1.25s' }}>
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="GitHub">
                <svg viewBox="0 0 16 16" fill="currentColor" width="18" height="18"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                <span>GitHub</span>
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span>LinkedIn</span>
              </a>
              <a href={`mailto:${portfolioData.email}`} className="hero-link" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <span>Email</span>
              </a>
            </div>
            <div className="hero-proof hero-stagger" style={{ animationDelay: '1.4s' }}>
              <div className="hero-proof-heading">
                <span>Current practice</span>
                <span className="hero-proof-rule" />
                <span>01—04</span>
              </div>
              <div className="hero-proof-list">
                <span><b>01</b> Model routing & evaluation</span>
                <span><b>02</b> Governed agent workflows</span>
                <span><b>03</b> AI infrastructure & runtimes</span>
                <span><b>04</b> Applied data products</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-marquee">
          <div className="marquee-track">
            {["Python", "PyTorch", "TensorFlow", "AWS", "Azure", "Docker", "K8s", "MLflow", "RAG", "LangChain", "vLLM", "Grafana",
              "Python", "PyTorch", "TensorFlow", "AWS", "Azure", "Docker", "K8s", "MLflow", "RAG", "LangChain", "vLLM", "Grafana"
            ].map((t, i) => <span key={i} className="marquee-item">{t}</span>)}
          </div>
        </div>

        <div className="hero-scroll"><span>Scroll</span><div className="scroll-bar"><div className="scroll-bar-fill" /></div></div>
      </section>

      {/* Experience snapshot */}
      <section id="experience" className="stats-section">
        <div className="stats-inner">
          {portfolioData.stats.slice(0, 4).map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              suffix={stat.label === "Companies Worked" ? "" : "+"}
            />
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Five years, six companies</span>
            <h2 className="section-title">Experience<br /><span className="accent-text">In Practice</span></h2>
            <p className="section-sub">
              A chronological view of the teams, products, and systems I have worked on across AI platforms, automotive software, data, and infrastructure.
            </p>
          </div>
          <div className="timeline">
            <div className="timeline-track" />
            {portfolioData.experiences.map((experience, index) => (
              <HomeExperienceEntry key={`${experience.company}-${experience.period}`} exp={experience} index={index} />
            ))}
          </div>
          <div className="experience-more">
            <Link className="btn btn--outline" to="/about">View full profile →</Link>
          </div>
        </div>
      </section>

      <section className="section principles-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Engineering point of view</span>
            <h2 className="section-title">How I<br /><span className="accent-text">Work</span></h2>
            <p className="section-sub">
              The patterns behind the projects: make complex systems easier to reason about, easier to test, and safer to operate.
            </p>
          </div>
          <div className="principles-grid">
            {engineeringPrinciples.map((principle, index) => (
              <EngineeringPrinciple key={principle.index} principle={principle} index={index} />
            ))}
          </div>
          <div className="principles-footer">
            <span className="principles-footer-rule" />
            <span>Systems thinking · measurable delivery · responsible automation</span>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Flagship case studies</span>
            <h2 className="section-title">Featured<br /><span className="accent-text">Projects</span></h2>
            <p className="section-sub">Three personal systems presented as visual records: what they solve, how they are structured, and where to inspect the work.</p>
          </div>
          <div className="flagship-grid">
            {flagshipProjects.map((p, i) => <FlagshipProjectCard key={p.title} project={p} index={i} />)}
          </div>
          <div className="project-collection-actions">
            <button className="btn btn--primary" onClick={() => navigate('/projects?scope=selected')}>
              Explore 9 selected projects <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn--outline" onClick={() => navigate('/projects?scope=all')}>
              Browse all projects <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/thesis')}>
              Read the thesis <span className="btn-arrow">↗</span>
            </button>
          </div>
        </div>
      </section>

      <PublicSignals />

      {/* Testimonials */}
      <section id="testimonials" className="section section--alt">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Social Proof</span>
            <h2 className="section-title">What People<br /><span className="accent-text">Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {portfolioData.testimonials.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="testimonial-quote-mark">"</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-author">
                  <span className="testimonial-icon">{t.icon}</span>
                  <div className="testimonial-info">
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="section-container">
          <div ref={contactRef} className={`contact-wrap ${contactVis ? 'contact-wrap--visible' : ''}`}>
            <div className="section-header">
              <span className="section-eyebrow">Connect</span>
              <h2 className="section-title">Let's Build<br /><span className="accent-text">Something</span></h2>
              <p className="section-sub">Open to opportunities in MLOps, AI Engineering, and Data Science</p>
            </div>
            <div className="contact-grid">
              {[
                { icon: '✉️', label: 'Email', value: portfolioData.email, href: `mailto:${portfolioData.email}` },
                { icon: '📱', label: 'Phone', value: portfolioData.phone, href: `tel:${portfolioData.phone}` },
                { icon: '💼', label: 'LinkedIn', value: 'morrisdarrenbabu', href: portfolioData.linkedin },
                { icon: '🖥️', label: 'GitHub', value: 'DARREN-2000', href: portfolioData.github },
              ].map((c) => (
                <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="contact-card">
                  <span className="contact-icon">{c.icon}</span>
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                  <span className="contact-arrow">→</span>
                </a>
              ))}
            </div>
            <form className="contact-form" onSubmit={(e) => {
              e.preventDefault();
              const subject = encodeURIComponent(`Portfolio Contact from ${contactForm.name}`);
              const body = encodeURIComponent(`${contactForm.message}\n\nFrom: ${contactForm.email}`);
              window.open(`mailto:${portfolioData.email}?subject=${subject}&body=${body}`);
              setFormSent(true);
              setTimeout(() => setFormSent(false), 3000);
            }}>
              <h3 className="form-title">Send a Message</h3>
              <div className="form-row">
                <label className="form-field">
                  <span className="form-label">Your Name</span>
                  <input className="form-input" placeholder="Your Name" required value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
                </label>
                <label className="form-field">
                  <span className="form-label">Your Email</span>
                  <input className="form-input" placeholder="Your Email" type="email" required value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
                </label>
              </div>
              <label className="form-field">
                <span className="form-label">Your message</span>
                <textarea className="form-textarea" placeholder="Your message..." rows={4} required value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} />
              </label>
              <button type="submit" className="btn btn--primary form-submit">
                {formSent ? '✓ Opening Mail Client...' : 'Send Message →'}
              </button>
            </form>
            <p className="contact-loc">📍 {portfolioData.location}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
