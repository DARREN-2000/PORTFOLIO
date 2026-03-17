import { useState, useCallback } from "react";

type Grid = number[][];

const SIZE = 4;

const emptyGrid = (): Grid => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

const addRandom = (grid: Grid): Grid => {
  const g = grid.map(r => [...r]);
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (g[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return g;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
};

const initGrid = (): Grid => addRandom(addRandom(emptyGrid()));

const slideRow = (row: number[]): { newRow: number[]; score: number } => {
  let score = 0;
  const filtered = row.filter(x => x !== 0);
  const result: number[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      result.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while (result.length < SIZE) result.push(0);
  return { newRow: result, score };
};

const move = (grid: Grid, dir: 'left' | 'right' | 'up' | 'down'): { grid: Grid; score: number; moved: boolean } => {
  let totalScore = 0;
  let g = grid.map(r => [...r]);

  const process = (rows: number[][]): number[][] => {
    return rows.map(row => {
      const { newRow, score } = slideRow(row);
      totalScore += score;
      return newRow;
    });
  };

  let rows: number[][];
  switch (dir) {
    case 'left':
      rows = process(g);
      break;
    case 'right':
      rows = process(g.map(r => [...r].reverse())).map(r => r.reverse());
      break;
    case 'up':
      const cols = Array(SIZE).fill(null).map((_, c) => g.map(r => r[c]));
      const processedCols = process(cols);
      rows = g.map((_, r) => processedCols.map(col => col[r]));
      break;
    case 'down':
      const colsD = Array(SIZE).fill(null).map((_, c) => g.map(r => r[c]).reverse());
      const processedD = process(colsD).map(c => c.reverse());
      rows = g.map((_, r) => processedD.map(col => col[r]));
      break;
    default:
      rows = g;
  }

  const moved = JSON.stringify(rows) !== JSON.stringify(grid);
  return { grid: rows, score: totalScore, moved };
};

const canMove = (grid: Grid): boolean => {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
};

const TILE_COLORS: Record<number, string> = {
  0: 'var(--bg-alt)',
  2: 'hsl(40, 20%, 92%)',
  4: 'hsl(40, 25%, 87%)',
  8: 'hsl(25, 65%, 65%)',
  16: 'hsl(16, 70%, 60%)',
  32: 'hsl(10, 75%, 58%)',
  64: 'hsl(5, 80%, 52%)',
  128: 'hsl(45, 80%, 60%)',
  256: 'hsl(45, 85%, 55%)',
  512: 'hsl(45, 90%, 50%)',
  1024: 'hsl(45, 95%, 45%)',
  2048: 'hsl(45, 100%, 42%)',
};

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const handleMove = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    const result = move(grid, dir);
    if (!result.moved) return;
    const newGrid = addRandom(result.grid);
    const newScore = score + result.score;
    setGrid(newGrid);
    setScore(newScore);
    if (newScore > best) setBest(newScore);

    // Check for 2048
    for (const row of newGrid)
      for (const cell of row)
        if (cell === 2048 && !won) setWon(true);

    if (!canMove(newGrid)) setGameOver(true);
  }, [grid, score, best, gameOver, won]);

  // Keyboard
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      a: 'left', d: 'right', w: 'up', s: 'down',
    };
    if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
  }, [handleMove]);

  useState(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const reset = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="game-widget game-2048-widget">
      <div className="game-header">
        <span className="game-title">🔢 2048</span>
        <div className="game-2048-scores">
          <span className="game-score">Score: {score}</span>
          <span className="game-score">Best: {best}</span>
        </div>
      </div>

      <div className="game-2048-board">
        {grid.map((row, r) => row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            className={`game-2048-tile ${val > 0 ? 'game-2048-tile--filled' : ''} ${val >= 128 ? 'game-2048-tile--large' : ''}`}
            style={{ background: TILE_COLORS[val] || 'hsl(45, 100%, 38%)' }}
          >
            {val > 0 ? val : ''}
          </div>
        )))}
      </div>

      {(gameOver || won) && (
        <div className="game-over-row">
          <span className="game-over-text">{won ? '🎉 You reached 2048!' : '💀 Game Over!'}</span>
          <button className="btn btn--primary btn--sm" onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="touch-controls">
        <button className="touch-btn" onClick={() => handleMove('up')}>↑</button>
        <div className="touch-row">
          <button className="touch-btn" onClick={() => handleMove('left')}>←</button>
          <button className="touch-btn" onClick={() => handleMove('down')}>↓</button>
          <button className="touch-btn" onClick={() => handleMove('right')}>→</button>
        </div>
      </div>
    </div>
  );
}
