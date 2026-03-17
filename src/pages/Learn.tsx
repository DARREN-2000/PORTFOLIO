import { useState, useEffect, lazy, Suspense } from "react";
import Layout from "../components/portfolio/Layout";
import "./Index.css";

const LearnAI = lazy(() => import("../components/portfolio/LearnAI"));
const Courses = lazy(() => import("../components/portfolio/Courses"));
const Roadmaps = lazy(() => import("../components/portfolio/Roadmaps"));
const Cheatsheets = lazy(() => import("../components/portfolio/Cheatsheets"));
const Books = lazy(() => import("../components/portfolio/Books"));

const LazyFallback = () => (
  <div className="lazy-skeleton">
    <div className="skeleton-bar skeleton-bar--wide" />
    <div className="skeleton-bar skeleton-bar--medium" />
    <div className="skeleton-bar skeleton-bar--narrow" />
    <div className="skeleton-grid"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
  </div>
);

const TABS = [
  { id: "concepts", label: "🧠 AI Concepts" },
  { id: "courses", label: "📚 Courses" },
  { id: "books", label: "📕 Books" },
  { id: "roadmaps", label: "🗺️ Roadmaps" },
  { id: "cheatsheets", label: "📋 Cheatsheets" },
];

const Learn = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('portfolio-theme') as 'light' | 'dark') || 'light';
    return 'light';
  });
  const [activeTab, setActiveTab] = useState("concepts");

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Knowledge</span>
            <h2 className="section-title">Learn<br /><span className="accent-text">AI & ML</span></h2>
            <p className="section-sub">Interactive learning resources — concepts, courses, books, roadmaps, and cheatsheets</p>
          </div>

          <div className="page-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`page-tab ${activeTab === tab.id ? 'page-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Suspense fallback={<LazyFallback />}>
            {activeTab === "concepts" && <LearnAI />}
            {activeTab === "courses" && <Courses />}
            {activeTab === "books" && <Books />}
            {activeTab === "roadmaps" && <Roadmaps />}
            {activeTab === "cheatsheets" && <Cheatsheets />}
          </Suspense>
        </div>
      </section>
    </Layout>
  );
};

export default Learn;