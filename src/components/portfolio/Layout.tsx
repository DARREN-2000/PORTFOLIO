import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { portfolioData } from "../../data/portfolioData";
import { useScrollProgress, useCursorGlow } from "../../hooks/useAnimations";
import Chatbot from "./Chatbot";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/blog", label: "Blog" },
  { path: "/learn", label: "Learn" },
  { path: "/playground", label: "Play" },
];

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollProgress = useScrollProgress();
  const cursor = useCursorGlow();
  const [showBackTop, setShowBackTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePortfolioResume = useCallback(() => {
    window.print();
  }, []);

  const handlePortfolioSlides = useCallback(() => {
    const d = portfolioData;
    const slideHTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.name} — Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-snap-type:y mandatory;overflow-y:scroll}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#1a1a2e;color:#f0ece4}
.slide{width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:48px 64px;scroll-snap-align:start;position:relative;overflow:hidden}
.slide:nth-child(even){background:#16213e}
.slide:nth-child(odd){background:#1a1a2e}
h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:700;letter-spacing:-0.02em;color:#e8c4a0}
h2{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:600;color:#e8c4a0;margin-bottom:20px}
p{font-size:clamp(0.95rem,1.5vw,1.2rem);line-height:1.7;color:#bbb;max-width:800px;text-align:center}
.stats{display:flex;gap:48px;margin-top:32px;flex-wrap:wrap;justify-content:center}
.stat{text-align:center}
.stat-val{font-size:2.5rem;font-weight:800;color:#e8c4a0;display:block}
.stat-label{font-size:0.85rem;color:#888;margin-top:4px}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;justify-content:center}
.tag{background:rgba(232,196,160,0.1);color:#e8c4a0;padding:5px 14px;border-radius:20px;font-size:0.8rem;border:1px solid rgba(232,196,160,0.15)}
ul{list-style:none;text-align:left;font-size:0.95rem;line-height:2;color:#ccc;max-width:700px}
ul li::before{content:'› ';color:#e8c4a0;font-weight:600}
.period{font-size:0.85rem;color:#888;margin-bottom:4px}
.slide-num{position:absolute;bottom:24px;right:32px;font-size:0.75rem;color:#555}
.nav-hint{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);color:#555;font-size:0.75rem;z-index:10}
.divider{width:60px;height:2px;background:rgba(232,196,160,0.3);margin:16px auto}
</style></head><body>
<div class="slide">
  <h1>${d.name}</h1>
  <div class="divider"></div>
  <p>${d.tagline}</p>
  <div class="stats">${d.stats.map(s => `<div class="stat"><span class="stat-val">${s.value}+</span><span class="stat-label">${s.label}</span></div>`).join('')}</div>
  <span class="slide-num">1</span>
</div>
${d.experiences.slice(0, 4).map((e, i) => `<div class="slide">
  <span class="period">${e.period} · ${e.location}</span>
  <h2>${e.role}</h2>
  <p>${e.company}</p>
  <ul>${e.bullets.slice(0, 3).map(b => `<li>${b}</li>`).join('')}</ul>
  <div class="tags">${e.tech.slice(0, 8).map(t => `<span class="tag">${t}</span>`).join('')}</div>
  <span class="slide-num">${i + 2}</span>
</div>`).join('')}
<div class="slide">
  <h2>Technical Skills</h2>
  <div class="divider"></div>
  <div class="tags">${d.skillCategories.flatMap(c => c.skills).slice(0, 24).map(s => `<span class="tag">${s}</span>`).join('')}</div>
  <span class="slide-num">${d.experiences.slice(0, 4).length + 2}</span>
</div>
${d.projects.slice(0, 4).map((p, i) => `<div class="slide">
  <h2>${p.title}</h2>
  <p>${p.desc}</p>
  ${p.impact ? `<p style="color:#e8c4a0;margin-top:12px;font-size:0.95rem">${p.impact}</p>` : ''}
  <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
  <span class="slide-num">${d.experiences.slice(0, 4).length + 3 + i}</span>
</div>`).join('')}
<div class="slide">
  <h2>Let's Connect</h2>
  <div class="divider"></div>
  <p style="line-height:2.2">${d.email}<br>${d.phone}<br>LinkedIn: morrisdarrenbabu<br>GitHub: DARREN-2000</p>
  <span class="slide-num">${d.experiences.slice(0, 4).length + 3 + Math.min(4, d.projects.length)}</span>
</div>
<span class="nav-hint">↓ Scroll or use arrow keys</span>
</body></html>`;
    const blob = new Blob([slideHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${d.name.replace(/\s+/g, '_')}_Portfolio_Slides.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`portfolio ${theme}`} data-theme={theme}>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      <div className="cursor-glow" style={{ left: cursor.pos.x, top: cursor.pos.y, opacity: cursor.visible ? 1 : 0 }} />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo" onClick={() => navigate('/')}>
            Darren<span className="nav-logo-dot">.dev</span>
          </span>
          <div className={`nav-links ${mobileMenuOpen ? 'nav-links--open' : ''}`}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
            <button className="nav-link" onClick={scrollToContact}>
              Get in Touch
            </button>

            {/* Download dropdown */}
            <div className="nav-download-wrapper" ref={downloadRef}>
              <button
                className="nav-link nav-download-trigger"
                onClick={() => setDownloadOpen(o => !o)}
              >
                📥 Download ▾
              </button>
              {downloadOpen && (
                <div className="nav-download-menu">
                  <a
                    href={portfolioData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-download-item"
                    onClick={() => setDownloadOpen(false)}
                  >
                    📄 Resume from GitHub
                  </a>
                  <button
                    className="nav-download-item"
                    onClick={() => { handlePortfolioSlides(); setDownloadOpen(false); }}
                  >
                    📊 Portfolio Slides
                  </button>
                  <button
                    className="nav-download-item"
                    onClick={() => { handlePortfolioResume(); setDownloadOpen(false); }}
                  >
                    🖨️ Portfolio Resume (PDF)
                  </button>
                </div>
              )}
            </div>

            {/* Mobile-only social links */}
            <div className="nav-mobile-social">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
            </div>
          </div>

          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Menu">
            <span className={`hamburger-line ${mobileMenuOpen ? 'hamburger-line--open' : ''}`} />
          </button>
        </div>
      </nav>

      <main id="main-content">
        {children}
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">Darren<span className="nav-logo-dot">.dev</span></span>
              <p className="footer-tagline">MLOps Engineer & AI Specialist — building intelligent systems at scale.</p>
            </div>
            <div className="footer-nav">
              <div className="footer-col">
                <h4 className="footer-col-title">Pages</h4>
                {NAV_ITEMS.map(item => (
                  <button key={item.path} className="footer-nav-link" onClick={() => navigate(item.path)}>{item.label}</button>
                ))}
              </div>
              <div className="footer-col">
                <h4 className="footer-col-title">Connect</h4>
                <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="footer-nav-link">GitHub</a>
                <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="footer-nav-link">LinkedIn</a>
                <a href={`mailto:${portfolioData.email}`} className="footer-nav-link">Email</a>
              </div>
              <div className="footer-col">
                <h4 className="footer-col-title">Download</h4>
                <a href={portfolioData.resume} target="_blank" rel="noopener noreferrer" className="footer-nav-link">Resume from GitHub</a>
                <button className="footer-nav-link" onClick={handlePortfolioSlides}>Portfolio Slides</button>
                <button className="footer-nav-link" onClick={handlePortfolioResume}>Portfolio Resume</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</span>
            <span className="footer-built">Built with React, TypeScript & ❤️</span>
          </div>
        </div>
      </footer>

      <button
        className={`back-top ${showBackTop ? 'back-top--visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >↑</button>

      <Chatbot />
    </div>
  );
};

export default Layout;
