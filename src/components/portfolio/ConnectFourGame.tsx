import { useState, useCallback } from "react";

const ROWS = 6;
const COLS = 7;
type Cell = 0 | 1 | 2;

const ConnectFourGame = () => {
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<0 | 1 | 2>(0);
  const [winCells, setWinCells] = useState<Set<string>>(new Set());

  const checkWin = useCallback((b: Cell[][], r: number, c: number, p: Cell): boolean => {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of dirs) {
      const cells: string[] = [`${r}-${c}`];
      for (let d = 1; d < 4; d++) {
        const nr = r + dr * d, nc = c + dc * d;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== p) break;
        cells.push(`${nr}-${nc}`);
      }
      for (let d = 1; d < 4; d++) {
        const nr = r - dr * d, nc = c - dc * d;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== p) break;
        cells.push(`${nr}-${nc}`);
      }
      if (cells.length >= 4) {
        setWinCells(new Set(cells));
        return true;
      }
    }
    return false;
  }, []);

  const drop = (col: number) => {
    if (winner) return;
    const nb = board.map(r => [...r]) as Cell[][];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (nb[r][col] === 0) {
        nb[r][col] = currentPlayer;
        setBoard(nb);
        if (checkWin(nb, r, col, currentPlayer)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        return;
      }
    }
  };

  const reset = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrentPlayer(1);
    setWinner(0);
    setWinCells(new Set());
  };

  return (
    <div className="game-widget">
      <h3 className="widget-title">🔴 Connect Four</h3>
      {winner ? (
        <div className="game-win">🎉 Player {winner} wins!</div>
      ) : (
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-secondary)", marginBottom: 8 }}>
          Player {currentPlayer}'s turn ({currentPlayer === 1 ? "🔴" : "🟡"})
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 3, maxWidth: 280, margin: "0 auto", background: "var(--accent-dim)", borderRadius: 8, padding: 6 }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => drop(c)}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                border: winCells.has(`${r}-${c}`) ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: cell === 1 ? "hsl(0, 70%, 50%)" : cell === 2 ? "hsl(45, 90%, 50%)" : "var(--bg-card)",
                cursor: winner ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            />
          ))
        )}
      </div>
      <button className="btn btn--ghost btn--sm" onClick={reset} style={{ marginTop: 10, display: "block", marginLeft: "auto", marginRight: "auto" }}>
        Reset
      </button>
    </div>
  );
};

export default ConnectFourGame;
