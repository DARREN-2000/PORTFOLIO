import { useEffect, useRef, useState } from "react";
import { useInView, useCounter } from "../../hooks/useAnimations";

// ========== Animated Skill Bars ==========
export const AnimatedSkillBars = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const skills = [
    { name: "Python", level: 95, color: "hsl(200, 60%, 48%)" },
    { name: "PyTorch / TensorFlow", level: 88, color: "hsl(16, 65%, 50%)" },
    { name: "Docker / Kubernetes", level: 85, color: "hsl(200, 70%, 55%)" },
    { name: "AWS / Azure", level: 82, color: "hsl(35, 80%, 55%)" },
    { name: "MLflow / MLOps", level: 90, color: "hsl(150, 60%, 45%)" },
    { name: "RAG / LangChain", level: 87, color: "hsl(270, 50%, 55%)" },
    { name: "SQL / NoSQL", level: 85, color: "hsl(10, 70%, 55%)" },
    { name: "React / TypeScript", level: 78, color: "hsl(200, 80%, 50%)" },
  ];

  return (
    <div ref={ref} className="skill-bars-widget">
      <h3 className="skill-bars-title">Proficiency Levels</h3>
      <div className="skill-bars-list">
        {skills.map((s, i) => (
          <div key={s.name} className="skill-bar-item" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="skill-bar-header">
              <span className="skill-bar-name">{s.name}</span>
              <span className="skill-bar-pct">{isInView ? s.level : 0}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                style={{
                  width: isInView ? `${s.level}%` : '0%',
                  background: s.color,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== Contribution Activity Chart ==========
export const ActivityChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || animated) return;
    setAnimated(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [12, 19, 28, 35, 42, 38, 55, 62, 48, 71, 65, 80];
    const maxVal = Math.max(...data);
    const barWidth = (w - 80) / data.length;
    const chartH = h - 50;

    let progress = 0;
    const animate = () => {
      progress = Math.min(progress + 0.03, 1);
      ctx.clearRect(0, 0, w, h);

      const theme = document.documentElement.getAttribute("data-theme");
      const textColor = theme === "dark" ? "hsl(40, 15%, 60%)" : "hsl(220, 10%, 46%)";
      const gridColor = theme === "dark" ? "hsla(220, 15%, 30%, 0.5)" : "hsla(220, 10%, 85%, 0.5)";

      // Grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = 10 + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(w - 10, y);
        ctx.stroke();
      }

      // Bars
      const eased = 1 - Math.pow(1 - progress, 3);
      data.forEach((val, i) => {
        const barH = (val / maxVal) * chartH * eased;
        const x = 50 + i * barWidth;
        const y = 10 + chartH - barH;

        const gradient = ctx.createLinearGradient(x, y, x, 10 + chartH);
        gradient.addColorStop(0, "hsl(16, 65%, 50%)");
        gradient.addColorStop(1, "hsla(16, 65%, 50%, 0.2)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 8, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Month labels
        ctx.fillStyle = textColor;
        ctx.font = "11px 'Source Sans 3', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(months[i], x + (barWidth - 8) / 2, h - 8);

        // Value on top
        if (eased > 0.8) {
          ctx.fillStyle = textColor;
          ctx.font = "bold 11px 'Source Sans 3', sans-serif";
          ctx.fillText(String(val), x + (barWidth - 8) / 2, y - 6);
        }
      });

      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isInView, animated]);

  return (
    <div ref={ref} className="activity-chart-widget">
      <h3 className="activity-chart-title">Monthly Contributions</h3>
      <canvas ref={canvasRef} className="activity-chart-canvas" />
    </div>
  );
};

// ========== Tech Stack Radar ==========
export const TechStackWheel = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const categories = [
    { name: "AI/ML", items: ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face"], color: "hsl(16, 65%, 50%)" },
    { name: "Cloud", items: ["AWS", "Azure", "GCP", "Docker"], color: "hsl(200, 60%, 48%)" },
    { name: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Spark"], color: "hsl(150, 60%, 45%)" },
    { name: "DevOps", items: ["K8s", "Terraform", "CI/CD", "Grafana"], color: "hsl(270, 50%, 55%)" },
  ];

  return (
    <div ref={ref} className={`tech-wheel ${isInView ? 'tech-wheel--visible' : ''}`}>
      <h3 className="tech-wheel-title">Tech Ecosystem</h3>
      <div className="tech-wheel-grid">
        {categories.map((cat, i) => (
          <div key={cat.name} className="tech-wheel-cat" style={{ animationDelay: `${i * 150}ms`, borderColor: cat.color }}>
            <span className="tech-wheel-cat-name" style={{ color: cat.color }}>{cat.name}</span>
            <div className="tech-wheel-items">
              {cat.items.map((item, j) => (
                <span key={item} className="tech-wheel-item" style={{ animationDelay: `${(i * 4 + j) * 60}ms` }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== Floating Code Snippets ==========
export const FloatingCodeSnippets = () => {
  const snippets = [
    { code: "git diff --check", lang: "Git" },
    { code: "pytest -q", lang: "Python" },
    { code: "vllm serve <model>", lang: "LLM" },
    { code: "docker compose up", lang: "Docker" },
    { code: "kubectl get pods", lang: "K8s" },
    { code: "cargo test", lang: "Rust" },
    { code: "ruff check .", lang: "Quality" },
    { code: "trivy fs .", lang: "Security" },
    { code: "npm run build", lang: "Frontend" },
    { code: "curl /metrics", lang: "Observe" },
  ];

  const positions = [
    { left: '2%', top: '10%' },
    { right: '3%', top: '12%' },
    { left: '1%', top: '35%' },
    { right: '2%', top: '38%' },
    { left: '3%', bottom: '30%' },
    { right: '1%', bottom: '32%' },
    { left: '2%', bottom: '12%' },
    { right: '3%', bottom: '15%' },
    { left: '18%', top: '8%' },
    { right: '18%', bottom: '8%' },
  ];

  return (
    <div className="floating-snippets">
      {snippets.map((s, i) => (
        <div key={i} className="floating-snippet" style={{
          animationDelay: `${i * 3}s`,
          ...positions[i],
        }}>
          <span className="snippet-lang">{s.lang}</span>
          <code className="snippet-code">{s.code}</code>
        </div>
      ))}
    </div>
  );
};

export const CinematicMotionField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const host = canvas.parentElement;
    if (!host) return;
    const pointer = { x: -1000, y: -1000 };
    const particles = Array.from({ length: 68 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
      radius: 1 + (index % 3) * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const points = particles.map((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        const x = particle.x * width;
        const y = particle.y * height;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance < 180) {
          particle.x -= (dx / Math.max(distance, 1)) * 0.00018;
          particle.y -= (dy / Math.max(distance, 1)) * 0.00018;
        }
        return { x, y, particle };
      });

      points.forEach(({ x, y, particle }, index) => {
        points.slice(index + 1).forEach(({ x: nextX, y: nextY }) => {
          const distance = Math.hypot(nextX - x, nextY - y);
          if (distance > 150) return;
          context.strokeStyle = `hsla(200, 70%, 60%, ${0.12 * (1 - distance / 150)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(nextX, nextY);
          context.stroke();
        });
        const pulse = 0.5 + Math.sin(time * 0.0015 + particle.phase) * 0.25;
        context.fillStyle = `hsla(16, 75%, 62%, ${pulse})`;
        context.beginPath();
        context.arc(x, y, particle.radius + pulse, 0, Math.PI * 2);
        context.fill();
      });

      if (pointer.x > 0) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 130);
        glow.addColorStop(0, "hsla(16, 75%, 62%, 0.18)");
        glow.addColorStop(1, "hsla(16, 75%, 62%, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 130, 0, Math.PI * 2);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={canvasRef} className="cinematic-motion-field" aria-hidden="true" />;
};

// ========== Stats Dashboard ==========
export const MiniDashboard = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const commits = useCounter(847, 2000, 0, isInView);
  const prs = useCounter(124, 2000, 0, isInView);
  const stars = useCounter(56, 2000, 0, isInView);
  const repos = useCounter(32, 2000, 0, isInView);

  return (
    <div ref={ref} className="mini-dashboard">
      <div className="mini-dash-item">
        <span className="mini-dash-icon">📊</span>
        <span className="mini-dash-val">{commits}</span>
        <span className="mini-dash-label">Commits</span>
      </div>
      <div className="mini-dash-item">
        <span className="mini-dash-icon">🔀</span>
        <span className="mini-dash-val">{prs}</span>
        <span className="mini-dash-label">PRs Merged</span>
      </div>
      <div className="mini-dash-item">
        <span className="mini-dash-icon">⭐</span>
        <span className="mini-dash-val">{stars}</span>
        <span className="mini-dash-label">Stars</span>
      </div>
      <div className="mini-dash-item">
        <span className="mini-dash-icon">📁</span>
        <span className="mini-dash-val">{repos}</span>
        <span className="mini-dash-label">Repos</span>
      </div>
    </div>
  );
};
