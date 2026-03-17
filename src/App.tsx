import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import './App.css';

const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Learn = lazy(() => import("./pages/Learn"));
const Playground = lazy(() => import("./pages/Playground"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
    <div className="loader-content">
      <span className="loader-name" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--primary)' }}>Darren.dev</span>
      <div style={{ width: 80, height: 3, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 4, animation: 'loaderProgress 1s ease-out forwards' }} />
      </div>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
