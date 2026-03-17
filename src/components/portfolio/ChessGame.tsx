import { useState, useCallback, useMemo } from "react";

// ========== CHESS PIECE TYPES ==========
type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type PieceColor = 'w' | 'b';
interface Piece { type: PieceType; color: PieceColor; }
type Board = (Piece | null)[][];

const PIECE_SYMBOLS: Record<string, string> = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
};

const initBoard = (): Board => {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const back: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: back[c], color: 'b' };
    b[1][c] = { type: 'P', color: 'b' };
    b[6][c] = { type: 'P', color: 'w' };
    b[7][c] = { type: back[c], color: 'w' };
  }
  return b;
};

const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

const getMoves = (board: Board, r: number, c: number): [number, number][] => {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const { type, color } = piece;
  const enemy = color === 'w' ? 'b' : 'w';

  const addIfValid = (nr: number, nc: number) => {
    if (!inBounds(nr, nc)) return false;
    if (board[nr][nc]?.color === color) return false;
    moves.push([nr, nc]);
    return !board[nr][nc];
  };

  const slide = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        if (!addIfValid(r + dr * i, c + dc * i)) break;
      }
    }
  };

  switch (type) {
    case 'P': {
      const dir = color === 'w' ? -1 : 1;
      const start = color === 'w' ? 6 : 1;
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === start && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
      }
      for (const dc of [-1, 1]) {
        if (inBounds(r + dir, c + dc) && board[r + dir][c + dc]?.color === enemy)
          moves.push([r + dir, c + dc]);
      }
      break;
    }
    case 'N':
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
        addIfValid(r + dr, c + dc);
      break;
    case 'B': slide([[-1,-1],[-1,1],[1,-1],[1,1]]); break;
    case 'R': slide([[-1,0],[1,0],[0,-1],[0,1]]); break;
    case 'Q': slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); break;
    case 'K':
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])
        addIfValid(r + dr, c + dc);
      break;
  }
  return moves;
};

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(initBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [moves, setMoves] = useState<[number, number][]>([]);
  const [captured, setCaptured] = useState<{ w: string[]; b: string[] }>({ w: [], b: [] });
  const [status, setStatus] = useState("White's turn");
  const [moveCount, setMoveCount] = useState(0);

  const isMoveTo = (r: number, c: number) => moves.some(([mr, mc]) => mr === r && mc === c);

  const makeAIMove = useCallback((newBoard: Board) => {
    // Simple AI: collect all possible moves, prioritize captures, then random
    const allMoves: { from: [number, number]; to: [number, number]; score: number }[] = [];
    const pieceValues: Record<PieceType, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = newBoard[r][c];
        if (!p || p.color !== 'b') continue;
        const pMoves = getMoves(newBoard, r, c);
        for (const [tr, tc] of pMoves) {
          let score = Math.random() * 0.5;
          const target = newBoard[tr][tc];
          if (target) score += pieceValues[target.type] * 10;
          // Center control bonus
          if (tr >= 3 && tr <= 4 && tc >= 3 && tc <= 4) score += 0.5;
          allMoves.push({ from: [r, c], to: [tr, tc], score });
        }
      }
    }

    if (allMoves.length === 0) {
      setStatus("Checkmate! White wins! 🎉");
      return;
    }

    allMoves.sort((a, b) => b.score - a.score);
    const best = allMoves[0];
    const next = newBoard.map(row => [...row]);
    const capturedPiece = next[best.to[0]][best.to[1]];
    next[best.to[0]][best.to[1]] = next[best.from[0]][best.from[1]];
    next[best.from[0]][best.from[1]] = null;

    // Pawn promotion
    if (next[best.to[0]][best.to[1]]?.type === 'P' && best.to[0] === 7) {
      next[best.to[0]][best.to[1]] = { type: 'Q', color: 'b' };
    }

    if (capturedPiece) {
      setCaptured(prev => ({ ...prev, b: [...prev.b, PIECE_SYMBOLS[`${capturedPiece.color}${capturedPiece.type}`]] }));
    }

    setBoard(next);
    setTurn('w');
    setStatus("White's turn");
    setMoveCount(mc => mc + 1);
  }, []);

  const handleClick = (r: number, c: number) => {
    if (turn !== 'w') return;

    if (selected && isMoveTo(r, c)) {
      const next = board.map(row => [...row]);
      const capturedPiece = next[r][c];
      next[r][c] = next[selected[0]][selected[1]];
      next[selected[0]][selected[1]] = null;

      // Pawn promotion
      if (next[r][c]?.type === 'P' && r === 0) {
        next[r][c] = { type: 'Q', color: 'w' };
      }

      if (capturedPiece) {
        setCaptured(prev => ({ ...prev, w: [...prev.w, PIECE_SYMBOLS[`${capturedPiece.color}${capturedPiece.type}`]] }));
        if (capturedPiece.type === 'K') {
          setBoard(next);
          setStatus("Checkmate! White wins! 🎉");
          setSelected(null);
          setMoves([]);
          return;
        }
      }

      setBoard(next);
      setSelected(null);
      setMoves([]);
      setTurn('b');
      setStatus("Black is thinking...");
      setMoveCount(mc => mc + 1);

      setTimeout(() => makeAIMove(next), 400);
      return;
    }

    const piece = board[r][c];
    if (piece && piece.color === turn) {
      setSelected([r, c]);
      setMoves(getMoves(board, r, c));
    } else {
      setSelected(null);
      setMoves([]);
    }
  };

  const reset = () => {
    setBoard(initBoard());
    setSelected(null);
    setMoves([]);
    setTurn('w');
    setCaptured({ w: [], b: [] });
    setStatus("White's turn");
    setMoveCount(0);
  };

  return (
    <div className="game-widget chess-widget">
      <div className="game-header">
        <span className="game-title">♟️ Chess vs AI</span>
        <span className="game-score">Moves: {moveCount}</span>
      </div>
      <div className="chess-status">{status}</div>
      <div className="chess-captured">
        {captured.w.length > 0 && <span className="chess-captured-row">⬜ {captured.w.join(' ')}</span>}
        {captured.b.length > 0 && <span className="chess-captured-row">⬛ {captured.b.join(' ')}</span>}
      </div>
      <div className="chess-board">
        {board.map((row, r) => row.map((piece, c) => {
          const isLight = (r + c) % 2 === 0;
          const isSel = selected && selected[0] === r && selected[1] === c;
          const isTarget = isMoveTo(r, c);
          return (
            <div
              key={`${r}-${c}`}
              className={`chess-cell ${isLight ? 'chess-cell--light' : 'chess-cell--dark'} ${isSel ? 'chess-cell--selected' : ''} ${isTarget ? 'chess-cell--target' : ''}`}
              onClick={() => handleClick(r, c)}
            >
              {piece && <span className={`chess-piece ${piece.color === 'w' ? 'chess-piece--white' : 'chess-piece--black'}`}>
                {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
              </span>}
              {isTarget && !piece && <span className="chess-dot" />}
            </div>
          );
        }))}
      </div>
      <div className="game-controls">
        <button className="btn btn--outline btn--sm" onClick={reset}>New Game</button>
        <span className="game-hint">Click piece → click target</span>
      </div>
    </div>
  );
}
