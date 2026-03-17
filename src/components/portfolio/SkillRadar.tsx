import { useRef, useEffect, useState } from "react";
import { useInView } from "../../hooks/useAnimations";

interface SkillAxis {
  label: string;
  value: number; // 0-100
}

const SKILLS: SkillAxis[] = [
  { label: "AI/ML", value: 92 },
  { label: "LLMOps", value: 88 },
  { label: "Cloud", value: 78 },
  { label: "DevOps", value: 72 },
  { label: "Data Eng", value: 80 },
  { label: "Research", value: 70 },
  { label: "Web Dev", value: 55 },
  { label: "Soft Skills", value: 85 },
];

export default function SkillRadar() {
  const { ref: viewRef, isInView } = useInView({ threshold: 0.3 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isInView) return;
    let start: number;
    let frame: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimProgress(eased);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 360;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 130;
    const levels = 5;
    const n = SKILLS.length;
    const angleStep = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, size, size);

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(200,160,120,0.12)" : "rgba(180,100,60,0.1)";
    const fillColor = isDark ? "rgba(200,130,80,0.2)" : "rgba(190,90,40,0.15)";
    const strokeColor = isDark ? "hsl(16,65%,55%)" : "hsl(16,65%,50%)";
    const dotColor = strokeColor;
    const labelColor = isDark ? "hsl(40,15%,70%)" : "hsl(220,10%,46%)";

    // Grid rings
    for (let l = 1; l <= levels; l++) {
      const r = (maxR / levels) * l;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Level labels (percentage)
      if (l < levels) {
        const pct = Math.round((l / levels) * 100);
        ctx.fillStyle = isDark ? "rgba(200,160,120,0.3)" : "rgba(180,100,60,0.25)";
        ctx.font = "9px 'Source Sans 3', sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText(`${pct}%`, cx + 4, cy - r + 12);
      }
    }

    // Axes
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = idx * angleStep - Math.PI / 2;
      const r = (SKILLS[idx].value / 100) * maxR * animProgress;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots and labels
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = (SKILLS[i].value / 100) * maxR * animProgress;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, hoveredIdx === i ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      // Label
      const labelR = maxR + 24;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;
      ctx.fillStyle = hoveredIdx === i ? strokeColor : labelColor;
      ctx.font = hoveredIdx === i ? "bold 13px 'Source Sans 3', sans-serif" : "12px 'Source Sans 3', sans-serif";
      ctx.fillText(SKILLS[i].label, lx, ly);

      if (hoveredIdx === i) {
        ctx.fillStyle = strokeColor;
        ctx.font = "bold 11px 'Source Sans 3', sans-serif";
        ctx.fillText(`${SKILLS[i].value}%`, x, y - 14);
      }
    }
  }, [animProgress, hoveredIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = 180, cy = 180, maxR = 130;
    const n = SKILLS.length;
    const angleStep = (Math.PI * 2) / n;

    let closest = -1;
    let closestDist = 30;
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const r = (SKILLS[i].value / 100) * maxR * animProgress;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const d = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
      if (d < closestDist) { closestDist = d; closest = i; }
    }
    setHoveredIdx(closest >= 0 ? closest : null);
  };

  return (
    <div ref={viewRef} className="radar-wrap">
      <canvas
        ref={canvasRef}
        className="radar-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      />
    </div>
  );
}
