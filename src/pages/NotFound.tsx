import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./Index.css";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="portfolio light" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, background: 'var(--bg)' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <p style={{ color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>Page not found</p>
      <button className="btn btn--primary" onClick={() => navigate('/')}>
        <span>Go Home →</span>
      </button>
    </div>
  );
};

export default NotFound;
