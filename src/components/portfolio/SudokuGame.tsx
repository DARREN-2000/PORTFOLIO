import { useState, useCallback } from "react";

const generatePuzzle = (): { puzzle: number[][]; solution: number[][] } => {
  const base = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9],
  ];
  const solution = base.map(r => [...r]);
  const puzzle = base.map(r => [...r]);
  // Remove ~40 cells
  let removed = 0;
  while (removed < 40) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; removed++; }
  }
  return { puzzle, solution };
};

const SudokuGame = () => {
  const [{ puzzle, solution }] = useState(generatePuzzle);
  const [board, setBoard] = useState(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const handleCell = (r: number, c: number) => {
    if (puzzle[r][c] !== 0) return;
    setSelected([r, c]);
  };

  const handleNum = useCallback((n: number) => {
    if (!selected || won) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const nb = board.map(row => [...row]);
    nb[r][c] = n;
    setBoard(nb);

    const key = `${r}-${c}`;
    const newErrors = new Set(errors);
    if (n !== solution[r][c] && n !== 0) newErrors.add(key);
    else newErrors.delete(key);
    setErrors(newErrors);

    // Check win
    if (nb.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
      setWon(true);
    }
  }, [selected, board, puzzle, solution, errors, won]);

  const getBoxClass = (r: number, c: number) => {
    const classes: string[] = ["sudoku-cell"];
    if (puzzle[r][c] !== 0) classes.push("sudoku-given");
    if (selected && selected[0] === r && selected[1] === c) classes.push("sudoku-selected");
    if (errors.has(`${r}-${c}`)) classes.push("sudoku-error");
    if (c % 3 === 0 && c > 0) classes.push("sudoku-box-left");
    if (r % 3 === 0 && r > 0) classes.push("sudoku-box-top");
    return classes.join(" ");
  };

  return (
    <div className="game-widget sudoku-widget">
      <h3 className="widget-title">🧩 Sudoku</h3>
      {won && <div className="game-win">🎉 Solved!</div>}
      <div className="sudoku-grid">
        {board.map((row, r) =>
          row.map((val, c) => (
            <button key={`${r}-${c}`} className={getBoxClass(r, c)} onClick={() => handleCell(r, c)}>
              {val || ""}
            </button>
          ))
        )}
      </div>
      <div className="sudoku-nums">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} className="sudoku-num-btn" onClick={() => handleNum(n)}>{n}</button>
        ))}
        <button className="sudoku-num-btn" onClick={() => handleNum(0)}>✕</button>
      </div>
    </div>
  );
};

export default SudokuGame;
