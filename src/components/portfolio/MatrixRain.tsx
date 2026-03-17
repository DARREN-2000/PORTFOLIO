import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 200;
    };
    resize();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
    const fontSize = 12;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient effect: brighter at the bottom of each column
        ctx.fillStyle = `hsl(150, 100%, ${40 + Math.random() * 20}%)`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const id = setInterval(draw, 40);
    window.addEventListener("resize", resize);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="matrix-widget">
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="matrix-overlay">
        <span className="matrix-text">Wake up, Neo...</span>
      </div>
    </div>
  );
}
