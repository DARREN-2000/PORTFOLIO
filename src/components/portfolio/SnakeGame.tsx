import { useState, useEffect, useCallback, useRef } from "react";

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID = 20;
const CELL = 16;
const SPEED = 120;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const s = localStorage.getItem("snake-best");
    return s ? parseInt(s) : 0;
  });
  const [gameOver, setGameOver] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const loopRef = useRef<number>(0);

  const spawnFood = useCallback(() => {
    let p: Point;
    do {
      p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snakeRef.current.some(s => s.x === p.x && s.y === p.y));
    foodRef.current = p;
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    spawnFood();
    setRunning(true);
  }, [spawnFood]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const w = GRID * CELL;

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, w);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, w);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(w, i * CELL);
      ctx.stroke();
    }

    // Food
    const f = foodRef.current;
    ctx.fillStyle = "#ff6b6b";
    ctx.shadowColor = "#ff6b6b";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snakeRef.current.forEach((s, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#4ecdc4" : `hsl(${170 - i * 3}, 70%, ${55 - i}%)`;
      ctx.shadowColor = isHead ? "#4ecdc4" : "transparent";
      ctx.shadowBlur = isHead ? 6 : 0;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  const tick = useCallback(() => {
    const snake = [...snakeRef.current];
    const head = { ...snake[0] };

    switch (dirRef.current) {
      case "UP": head.y--; break;
      case "DOWN": head.y++; break;
      case "LEFT": head.x--; break;
      case "RIGHT": head.x++; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      setRunning(false);
      setGameOver(true);
      return;
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      setRunning(false);
      setGameOver(true);
      return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => {
        const n = prev + 1;
        setBest(b => {
          const nb = Math.max(b, n);
          localStorage.setItem("snake-best", String(nb));
          return nb;
        });
        return n;
      });
      spawnFood();
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  }, [draw, spawnFood]);

  useEffect(() => {
    if (running) {
      loopRef.current = window.setInterval(tick, SPEED);
    }
    return () => clearInterval(loopRef.current);
  }, [running, tick]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      const opp: Record<Direction, Direction> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (dir !== opp[dirRef.current]) dirRef.current = dir;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { draw(); }, [draw]);

  const size = GRID * CELL;

  return (
    <div className="game-widget">
      <div className="game-header">
        <span className="game-title">🐍 Snake</span>
        <span className="game-score">Score: {score} | Best: {best}</span>
      </div>
      <canvas ref={canvasRef} width={size} height={size} className="game-canvas" />
      <div className="game-controls">
        {!running && !gameOver && <button className="btn btn--primary btn--sm" onClick={reset}>Start Game</button>}
        {gameOver && (
          <div className="game-over-row">
            <span className="game-over-text">Game Over! Score: {score}</span>
            <button className="btn btn--primary btn--sm" onClick={reset}>Play Again</button>
          </div>
        )}
        {running && <span className="game-hint">Use arrow keys or WASD</span>}
      </div>
      {/* Mobile touch controls */}
      {running && (
        <div className="touch-controls">
          <button className="touch-btn" onClick={() => { dirRef.current !== "DOWN" && (dirRef.current = "UP"); }}>↑</button>
          <div className="touch-row">
            <button className="touch-btn" onClick={() => { dirRef.current !== "RIGHT" && (dirRef.current = "LEFT"); }}>←</button>
            <button className="touch-btn" onClick={() => { dirRef.current !== "LEFT" && (dirRef.current = "RIGHT"); }}>→</button>
          </div>
          <button className="touch-btn" onClick={() => { dirRef.current !== "UP" && (dirRef.current = "DOWN"); }}>↓</button>
        </div>
      )}
    </div>
  );
}
