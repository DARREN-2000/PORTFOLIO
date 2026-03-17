import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTypingEffect,
  useMouseParallax,
  useInView,
  useCounter,
  useCardTilt,
} from "../hooks/useAnimations";
import { portfolioData } from "../data/portfolioData";
import profileImg from "../assets/profile-github.jpg";
import Layout from "../components/portfolio/Layout";
import { FloatingCodeSnippets } from "../components/portfolio/Visualizations";
import "./Index.css";

// ========== PARTICLE CANVAS ==========
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5, o: Math.random() * 0.5 + 0.1,
      });
    }

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const theme = document.documentElement.getAttribute("data-theme");
      const dotColor = theme === "dark" ? "200, 160, 120" : "180, 100, 60";
      const lineColor = theme === "dark" ? "200, 160, 120" : "180, 100, 60";

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.x += dx * 0.02; p.y += dy * 0.02; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${p.o})`; ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.06 * (1 - d / 140)})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// ========== STAT COUNTER ==========
const StatCounter = ({ value, label, icon }: { value: number; label: string; icon: string }) => {
  const { ref, isInView } = useInView();
  const count = useCounter(value, 2200, 0, isInView);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-number">{count}<span className="stat-plus">+</span></span>
      <span className="stat-label">{label}</span>
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

  // Show only top 4 featured projects on Home
  const featuredProjects = portfolioData.projects.slice(0, 4);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <ParticleCanvas />

      {/* Hero */}
      <section id="hero" className="hero">
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

        <FloatingCodeSnippets />

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
              <span>AI Engineer · MLOps · Data Science</span>
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
            <p className="hero-tagline hero-stagger" style={{ animationDelay: '0.8s' }}>{portfolioData.tagline}</p>
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

      {/* Featured Projects */}
      <section id="projects" className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="section-title">Featured<br /><span className="accent-text">Projects</span></h2>
            <p className="section-sub">Real-world solutions with measurable impact</p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((p, i) => <TiltProjectCard key={p.title} project={p} index={i} />)}
          </div>
          {portfolioData.projects.length > 4 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn--outline" onClick={() => navigate('/about#projects')}>
                View All Projects →
              </button>
            </div>
          )}
        </div>
      </section>

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
              window.open(`mailto:${portfolioData.email}?subject=Portfolio Contact from ${contactForm.name}&body=${encodeURIComponent(contactForm.message)}%0A%0AFrom: ${contactForm.email}`);
              setFormSent(true);
              setTimeout(() => setFormSent(false), 3000);
            }}>
              <h3 className="form-title">Send a Message</h3>
              <div className="form-row">
                <input className="form-input" placeholder="Your Name" required value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
                <input className="form-input" placeholder="Your Email" type="email" required value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <textarea className="form-textarea" placeholder="Your message..." rows={4} required value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} />
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
