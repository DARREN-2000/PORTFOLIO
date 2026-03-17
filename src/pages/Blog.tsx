import { useState, useEffect, lazy, Suspense } from "react";
import Layout from "../components/portfolio/Layout";
import "./Index.css";

const BlogSection = lazy(() => import("../components/portfolio/BlogSection"));

const LazyFallback = () => (
  <div className="lazy-skeleton">
    <div className="skeleton-bar skeleton-bar--wide" />
    <div className="skeleton-bar skeleton-bar--medium" />
    <div className="skeleton-bar skeleton-bar--narrow" />
    <div className="skeleton-grid"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
  </div>
);

const Blog = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('portfolio-theme') as 'light' | 'dark') || 'light';
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Writing</span>
            <h2 className="section-title">Blog &<br /><span className="accent-text">Articles</span></h2>
            <p className="section-sub">Technical tutorials, project breakdowns, and industry insights — with real code examples</p>
          </div>
          <Suspense fallback={<LazyFallback />}><BlogSection /></Suspense>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
