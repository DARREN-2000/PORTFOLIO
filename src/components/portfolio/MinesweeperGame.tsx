import { useState, useCallback } from "react";

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };
const ROWS = 8, COLS = 8, MINES = 10;

const createBoard = (): Cell[][] => {
  const b: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!b[r][c].mine) { b[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!b[r][c].mine)
        b[r][c].adjacent = [-1,0,1].flatMap(dr => [-1,0,1].map(dc => [r+dr, c+dc]))
          .filter(([nr, nc]) => nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine).length;
  return b;
};

const MinesweeperGame = () => {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const reveal = useCallback((b: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (b[r][c].revealed || b[r][c].flagged) return;
    b[r][c].revealed = true;
    if (b[r][c].adjacent === 0 && !b[r][c].mine)
      [-1,0,1].forEach(dr => [-1,0,1].forEach(dc => { if (dr || dc) reveal(b, r+dr, c+dc); }));
  }, []);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won || board[r][c].flagged) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (nb[r][c].mine) {
      nb.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(nb);
      setGameOver(true);
      return;
    }
    reveal(nb, r, c);
    setBoard(nb);
    const unrevealed = nb.flat().filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) setWon(true);
  };

  const handleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
  };

  const reset = () => { setBoard(createBoard()); setGameOver(false); setWon(false); };

  const flags = board.flat().filter(c => c.flagged).length;

  return (
    <div className="game-widget minesweeper-widget">
      <h3 className="widget-title">💣 Minesweeper</h3>
      <div className="mine-info">
        <span>💣 {MINES - flags}</span>
        {(gameOver || won) && <button className="mine-reset" onClick={reset}>New Game</button>}
      </div>
      {gameOver && <div className="game-over-text">💥 Game Over!</div>}
      {won && <div className="game-win">🎉 You Win!</div>}
      <div className="mine-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className={`mine-cell ${cell.revealed ? 'mine-revealed' : ''} ${cell.revealed && cell.mine ? 'mine-boom' : ''}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleFlag(e, r, c)}
            >
              {cell.flagged && !cell.revealed ? "🚩" :
               cell.revealed && cell.mine ? "💣" :
               cell.revealed && cell.adjacent > 0 ? cell.adjacent : ""}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MinesweeperGame;
