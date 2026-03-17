import { useState } from "react";

type Cell = 'X' | 'O' | null;

const WINNING = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWinner = (board: Cell[]): Cell => {
  for (const [a,b,c] of WINNING) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
};

const minimax = (board: Cell[], isMax: boolean): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (board.every(c => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'O';
      best = Math.max(best, minimax(board, false));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'X';
      best = Math.min(best, minimax(board, true));
      board[i] = null;
    }
    return best;
  }
};

const getBestMove = (board: Cell[]): number => {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = 'O';
    const val = minimax(board, false);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
};

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [winLine, setWinLine] = useState<number[] | null>(null);

  const handleClick = (idx: number) => {
    if (board[idx] || gameOver) return;
    const next = [...board];
    next[idx] = 'X';

    const winner = checkWinner(next);
    if (winner) {
      setBoard(next);
      setGameOver(true);
      setResult("You win! 🎉");
      setScores(s => ({ ...s, x: s.x + 1 }));
      const line = WINNING.find(([a,b,c]) => next[a] === winner && next[b] === winner && next[c] === winner);
      setWinLine(line || null);
      return;
    }
    if (next.every(c => c !== null)) {
      setBoard(next);
      setGameOver(true);
      setResult("Draw! 🤝");
      setScores(s => ({ ...s, draw: s.draw + 1 }));
      return;
    }

    // AI move
    const aiMove = getBestMove([...next]);
    if (aiMove >= 0) next[aiMove] = 'O';

    const aiWin = checkWinner(next);
    if (aiWin) {
      setBoard(next);
      setGameOver(true);
      setResult("AI wins! 🤖");
      setScores(s => ({ ...s, o: s.o + 1 }));
      const line = WINNING.find(([a,b,c]) => next[a] === aiWin && next[b] === aiWin && next[c] === aiWin);
      setWinLine(line || null);
      return;
    }
    if (next.every(c => c !== null)) {
      setBoard(next);
      setGameOver(true);
      setResult("Draw! 🤝");
      setScores(s => ({ ...s, draw: s.draw + 1 }));
      return;
    }

    setBoard(next);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setResult("");
    setWinLine(null);
  };

  return (
    <div className="game-widget ttt-widget">
      <div className="game-header">
        <span className="game-title">❌ Tic-Tac-Toe AI</span>
        <span className="game-score">W:{scores.x} L:{scores.o} D:{scores.draw}</span>
      </div>

      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`ttt-cell ${cell ? `ttt-cell--${cell.toLowerCase()}` : ''} ${winLine?.includes(i) ? 'ttt-cell--win' : ''}`}
            onClick={() => handleClick(i)}
            disabled={!!cell || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="game-over-row">
          <span className="game-over-text">{result}</span>
          <button className="btn btn--primary btn--sm" onClick={reset}>Play Again</button>
        </div>
      )}
      {!gameOver && <span className="game-hint">You are X — try to beat the AI!</span>}
    </div>
  );
}
