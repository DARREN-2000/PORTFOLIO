import { useState, useEffect, useRef, useCallback } from "react";

// ========== GITHUB LIVE STATS ==========
export const GitHubLiveStats = ({ username = "DARREN-2000" }: { username?: string }) => {
  const [stats, setStats] = useState<{
    repos: number; followers: number; following: number; stars: number;
    topLangs: { name: string; pct: number; color: string }[];
    recentRepos: { name: string; description: string; stars: number; language: string; url: string }[];
    loading: boolean; error: string | null;
  }>({ repos: 0, followers: 0, following: 0, stars: 0, topLangs: [], recentRepos: [], loading: true, error: null });

  useEffect(() => {
    const fetchGH = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API rate limited");
        const user = await userRes.json();
        const repos: any[] = await reposRes.json();

        const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);

        // Language breakdown
        const langMap: Record<string, number> = {};
        repos.forEach((r: any) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const total = Object.values(langMap).reduce((a, b) => a + b, 0);
        const langColors: Record<string, string> = {
          Python: "hsl(200, 60%, 48%)", JavaScript: "hsl(45, 80%, 50%)", TypeScript: "hsl(210, 60%, 50%)",
          Jupyter: "hsl(16, 65%, 50%)", HTML: "hsl(12, 70%, 50%)", CSS: "hsl(260, 50%, 55%)",
          Shell: "hsl(120, 40%, 45%)", Dockerfile: "hsl(200, 70%, 55%)", Rust: "hsl(25, 60%, 45%)",
          Java: "hsl(15, 65%, 50%)", Go: "hsl(190, 60%, 48%)", "Jupyter Notebook": "hsl(16, 65%, 50%)",
        };
        const topLangs = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100), color: langColors[name] || "hsl(0, 0%, 50%)" }));

        const recentRepos = repos.slice(0, 5).map((r: any) => ({
          name: r.name, description: r.description || "", stars: r.stargazers_count, language: r.language || "—", url: r.html_url,
        }));

        setStats({ repos: user.public_repos, followers: user.followers, following: user.following, stars: totalStars, topLangs, recentRepos, loading: false, error: null });
      } catch (e: any) {
        setStats(s => ({ ...s, loading: false, error: e.message }));
      }
    };
    fetchGH();
  }, [username]);

  if (stats.loading) return <div className="analytics-widget"><h3 className="widget-title">📊 GitHub Live Stats</h3><p className="analytics-loading">Loading GitHub data...</p></div>;
  if (stats.error) return <div className="analytics-widget"><h3 className="widget-title">📊 GitHub Live Stats</h3><p className="analytics-error">⚠️ {stats.error} — showing cached data</p></div>;

  return (
    <div className="analytics-widget gh-live">
      <h3 className="widget-title">📊 GitHub Live Stats</h3>
      <div className="gh-stats-row">
        <div className="gh-stat"><span className="gh-stat-val">{stats.repos}</span><span className="gh-stat-label">Repos</span></div>
        <div className="gh-stat"><span className="gh-stat-val">{stats.stars}</span><span className="gh-stat-label">Stars</span></div>
        <div className="gh-stat"><span className="gh-stat-val">{stats.followers}</span><span className="gh-stat-label">Followers</span></div>
        <div className="gh-stat"><span className="gh-stat-val">{stats.following}</span><span className="gh-stat-label">Following</span></div>
      </div>

      <div className="gh-langs-section">
        <h4 className="gh-sub-title">Languages</h4>
        <div className="gh-lang-bar">
          {stats.topLangs.map(l => (
            <div key={l.name} className="gh-lang-seg" style={{ width: `${l.pct}%`, background: l.color }} title={`${l.name}: ${l.pct}%`} />
          ))}
        </div>
        <div className="gh-lang-legend">
          {stats.topLangs.map(l => (
            <span key={l.name} className="gh-lang-item"><span className="gh-lang-dot" style={{ background: l.color }} />{l.name} {l.pct}%</span>
          ))}
        </div>
      </div>

      <div className="gh-repos-section">
        <h4 className="gh-sub-title">Recent Repositories</h4>
        {stats.recentRepos.map(r => (
          <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="gh-repo-item">
            <span className="gh-repo-name">{r.name}</span>
            <span className="gh-repo-meta">{r.language} • ⭐ {r.stars}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// ========== WEB VITALS MONITOR ==========
export const WebVitalsMonitor = () => {
  const [vitals, setVitals] = useState({ lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 });
  const measured = useRef(false);

  useEffect(() => {
    if (measured.current) return;
    measured.current = true;

    // Performance observer for paint metrics
    try {
      const entries = performance.getEntriesByType("paint");
      const fcp = entries.find(e => e.name === "first-contentful-paint");
      if (fcp) setVitals(v => ({ ...v, fcp: Math.round(fcp.startTime) }));

      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (nav) setVitals(v => ({ ...v, ttfb: Math.round(nav.responseStart - nav.requestStart) }));

      // LCP observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        setVitals(v => ({ ...v, lcp: Math.round(last.startTime) }));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // CLS observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) clsValue += (entry as any).value;
        }
        setVitals(v => ({ ...v, cls: Math.round(clsValue * 1000) / 1000 }));
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      return () => { lcpObserver.disconnect(); clsObserver.disconnect(); };
    } catch {
      // Performance APIs not available
    }
  }, []);

  const getScore = (metric: string, val: number) => {
    if (metric === "lcp") return val < 2500 ? "good" : val < 4000 ? "needs-improvement" : "poor";
    if (metric === "fcp") return val < 1800 ? "good" : val < 3000 ? "needs-improvement" : "poor";
    if (metric === "cls") return val < 0.1 ? "good" : val < 0.25 ? "needs-improvement" : "poor";
    if (metric === "ttfb") return val < 800 ? "good" : val < 1800 ? "needs-improvement" : "poor";
    return "good";
  };

  const metrics = [
    { key: "lcp", label: "LCP", value: `${vitals.lcp}ms`, desc: "Largest Contentful Paint" },
    { key: "fcp", label: "FCP", value: `${vitals.fcp}ms`, desc: "First Contentful Paint" },
    { key: "cls", label: "CLS", value: String(vitals.cls), desc: "Cumulative Layout Shift" },
    { key: "ttfb", label: "TTFB", value: `${vitals.ttfb}ms`, desc: "Time to First Byte" },
  ];

  return (
    <div className="analytics-widget vitals-widget">
      <h3 className="widget-title">⚡ Web Vitals (Live)</h3>
      <div className="vitals-grid">
        {metrics.map(m => (
          <div key={m.key} className={`vital-card vital-${getScore(m.key, parseFloat(m.value))}`}>
            <span className="vital-label">{m.label}</span>
            <span className="vital-value">{m.value}</span>
            <span className="vital-desc">{m.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== SITE ANALYTICS (client-side) ==========
export const SiteAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0, sessionDuration: 0, scrollDepth: 0, sectionsViewed: new Set<string>(),
    deviceType: "", browserName: "", screenRes: "", referrer: "",
  });
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Device info
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);
    const deviceType = isMobile ? "📱 Mobile" : isTablet ? "📱 Tablet" : "🖥️ Desktop";
    const browserName = ua.includes("Firefox") ? "Firefox" : ua.includes("Chrome") ? "Chrome" : ua.includes("Safari") ? "Safari" : "Other";
    const screenRes = `${screen.width}×${screen.height}`;
    const referrer = document.referrer || "Direct";

    // Load page views from session
    const views = parseInt(sessionStorage.getItem("pv") || "0") + 1;
    sessionStorage.setItem("pv", String(views));

    setAnalytics(a => ({ ...a, pageViews: views, deviceType, browserName, screenRes, referrer }));

    // Track scroll depth and sections
    const handleScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      const sections = document.querySelectorAll("section[id]");
      const viewed = new Set<string>();
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) viewed.add(s.id);
      });
      setAnalytics(a => ({
        ...a, scrollDepth,
        sectionsViewed: new Set([...a.sectionsViewed, ...viewed]),
        sessionDuration: Math.round((Date.now() - startTime.current) / 1000),
      }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const timer = setInterval(() => {
      setAnalytics(a => ({ ...a, sessionDuration: Math.round((Date.now() - startTime.current) / 1000) }));
    }, 1000);

    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(timer); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="analytics-widget site-analytics">
      <h3 className="widget-title">📈 Live Site Analytics</h3>
      <div className="sa-grid">
        <div className="sa-item"><span className="sa-val">{analytics.pageViews}</span><span className="sa-label">Page Views</span></div>
        <div className="sa-item"><span className="sa-val">{formatTime(analytics.sessionDuration)}</span><span className="sa-label">Session Time</span></div>
        <div className="sa-item"><span className="sa-val">{analytics.scrollDepth}%</span><span className="sa-label">Scroll Depth</span></div>
        <div className="sa-item"><span className="sa-val">{analytics.sectionsViewed.size}</span><span className="sa-label">Sections Seen</span></div>
      </div>
      <div className="sa-details">
        <div className="sa-detail"><span className="sa-detail-label">Device</span><span>{analytics.deviceType}</span></div>
        <div className="sa-detail"><span className="sa-detail-label">Browser</span><span>🌐 {analytics.browserName}</span></div>
        <div className="sa-detail"><span className="sa-detail-label">Screen</span><span>🖥️ {analytics.screenRes}</span></div>
        <div className="sa-detail"><span className="sa-detail-label">Referrer</span><span>🔗 {analytics.referrer}</span></div>
      </div>
      <div className="sa-scroll-bar">
        <div className="sa-scroll-fill" style={{ width: `${analytics.scrollDepth}%` }} />
      </div>
      <span className="sa-scroll-label">Page explored: {analytics.scrollDepth}%</span>
    </div>
  );
};

// ========== IP & LOCATION INFO (free, no key) ==========
export const VisitorInfo = () => {
  const [info, setInfo] = useState<{ ip: string; city: string; country: string; timezone: string; isp: string; loading: boolean }>({
    ip: "—", city: "—", country: "—", timezone: "—", isp: "—", loading: true
  });

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => setInfo({ ip: d.ip || "—", city: d.city || "—", country: d.country_name || "—", timezone: d.timezone || "—", isp: d.org || "—", loading: false }))
      .catch(() => setInfo(i => ({ ...i, loading: false })));
  }, []);

  return (
    <div className="analytics-widget visitor-info">
      <h3 className="widget-title">🌍 Visitor Info</h3>
      {info.loading ? <p className="analytics-loading">Detecting location...</p> : (
        <div className="sa-details">
          <div className="sa-detail"><span className="sa-detail-label">IP</span><span>{info.ip}</span></div>
          <div className="sa-detail"><span className="sa-detail-label">City</span><span>📍 {info.city}</span></div>
          <div className="sa-detail"><span className="sa-detail-label">Country</span><span>🌐 {info.country}</span></div>
          <div className="sa-detail"><span className="sa-detail-label">Timezone</span><span>🕐 {info.timezone}</span></div>
          <div className="sa-detail"><span className="sa-detail-label">ISP</span><span>📡 {info.isp}</span></div>
        </div>
      )}
    </div>
  );
};

// ========== TECH STACK DETECTOR ==========
export const TechStackDetector = () => {
  const [stack, setStack] = useState<string[]>([]);

  useEffect(() => {
    const detected: string[] = [];
    detected.push("React " + (window as any).React?.version || "18+");
    detected.push("TypeScript");
    if (document.querySelector("[data-theme]")) detected.push("CSS Custom Properties");
    if (performance.getEntriesByType("resource").some(r => r.name.includes("vite"))) detected.push("Vite");
    if (navigator.serviceWorker) detected.push("Service Worker Ready");
    if (window.CSS?.supports?.("backdrop-filter", "blur(1px)")) detected.push("Backdrop Filter");
    if (window.CSS?.supports?.("container-type", "inline-size")) detected.push("Container Queries");
    if ("IntersectionObserver" in window) detected.push("Intersection Observer");
    if ("ResizeObserver" in window) detected.push("Resize Observer");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) detected.push("Dark Mode Preferred");
    detected.push(`Pixel Ratio: ${window.devicePixelRatio}x`);
    detected.push(`Viewport: ${window.innerWidth}×${window.innerHeight}`);
    detected.push(`Cores: ${navigator.hardwareConcurrency || "?"}`);
    detected.push(`Memory: ${(navigator as any).deviceMemory || "?"}GB`);
    setStack(detected);
  }, []);

  return (
    <div className="analytics-widget tech-detect">
      <h3 className="widget-title">🔍 Browser Capabilities</h3>
      <div className="tech-detect-list">
        {stack.map((t, i) => (
          <span key={i} className="tech-detect-tag">{t}</span>
        ))}
      </div>
    </div>
  );
};
