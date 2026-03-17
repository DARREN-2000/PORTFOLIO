import { useState, useCallback, useRef } from "react";

const COLORS = ["red", "blue", "green", "yellow"] as const;
const COLOR_MAP: Record<string, { bg: string; active: string }> = {
  red: { bg: "hsl(0, 60%, 40%)", active: "hsl(0, 70%, 55%)" },
  blue: { bg: "hsl(220, 60%, 40%)", active: "hsl(220, 70%, 55%)" },
  green: { bg: "hsl(130, 60%, 35%)", active: "hsl(130, 70%, 50%)" },
  yellow: { bg: "hsl(45, 70%, 45%)", active: "hsl(45, 80%, 60%)" },
};

const SimonGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const timeoutRef = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const playSequence = useCallback((seq: number[]) => {
    setIsPlaying(true);
    clearTimeouts();
    seq.forEach((color, i) => {
      const t1 = window.setTimeout(() => setActiveColor(color), i * 600);
      const t2 = window.setTimeout(() => setActiveColor(null), i * 600 + 400);
      timeoutRef.current.push(t1, t2);
    });
    const t3 = window.setTimeout(() => {
      setIsPlaying(false);
      setPlayerIdx(0);
    }, seq.length * 600 + 200);
    timeoutRef.current.push(t3);
  }, []);

  const startGame = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setScore(0);
    setGameOver(false);
    playSequence(first);
  };

  const handlePress = (colorIdx: number) => {
    if (isPlaying || gameOver) return;
    setActiveColor(colorIdx);
    setTimeout(() => setActiveColor(null), 200);

    if (sequence[playerIdx] !== colorIdx) {
      setGameOver(true);
      if (score > highScore) setHighScore(score);
      return;
    }

    if (playerIdx + 1 === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next);
      setTimeout(() => playSequence(next), 800);
    } else {
      setPlayerIdx(playerIdx + 1);
    }
  };

  return (
    <div className="game-widget">
      <h3 className="widget-title">🎵 Simon Says</h3>
      <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-secondary)", marginBottom: 8 }}>
        Score: {score} | Best: {highScore}
      </div>
      {gameOver && <div className="game-win" style={{ color: "var(--primary)" }}>Game Over! Score: {score}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxWidth: 180, margin: "0 auto" }}>
        {COLORS.map((color, i) => (
          <button
            key={color}
            onClick={() => handlePress(i)}
            style={{
              aspectRatio: "1",
              borderRadius: 12,
              border: "2px solid var(--border)",
              background: activeColor === i ? COLOR_MAP[color].active : COLOR_MAP[color].bg,
              opacity: activeColor === i ? 1 : 0.7,
              cursor: isPlaying ? "default" : "pointer",
              transition: "all 0.15s",
              transform: activeColor === i ? "scale(1.05)" : "scale(1)",
            }}
          />
        ))}
      </div>
      <button className="btn btn--primary btn--sm" onClick={startGame} style={{ marginTop: 12, display: "block", marginLeft: "auto", marginRight: "auto" }}>
        {sequence.length === 0 ? "Start" : "Restart"}
      </button>
    </div>
  );
};

export default SimonGame;
