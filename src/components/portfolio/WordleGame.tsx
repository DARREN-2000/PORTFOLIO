import { useState, useCallback, useEffect } from "react";

const WORDS = [
  "REACT", "TORCH", "MODEL", "TRAIN", "LEARN", "CLOUD", "STACK", "NODES",
  "QUERY", "TOKEN", "AGENT", "LAYER", "FLOAT", "GRAPH", "SCALE", "BATCH",
  "EPOCH", "DEPTH", "PARSE", "FETCH", "ARRAY", "CLASS", "ASYNC", "BUILD",
  "DEBUG", "FLASK", "NAIVE", "BOOST", "DRIFT", "CHUNK", "EMBED", "INDEX",
  "AZURE", "SPARK", "ROUTE", "YIELD", "MERGE", "STATE", "HOOKS", "CACHE",
];

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export default function WordleGame() {
  const [target, setTarget] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const getStatus = (guess: string): LetterStatus[] => {
    const result: LetterStatus[] = Array(5).fill('absent');
    const targetArr = target.split('');
    const used = Array(5).fill(false);

    // First pass: correct positions
    for (let i = 0; i < 5; i++) {
      if (guess[i] === targetArr[i]) {
        result[i] = 'correct';
        used[i] = true;
      }
    }
    // Second pass: present but wrong position
    for (let i = 0; i < 5; i++) {
      if (result[i] === 'correct') continue;
      for (let j = 0; j < 5; j++) {
        if (!used[j] && guess[i] === targetArr[j]) {
          result[i] = 'present';
          used[j] = true;
          break;
        }
      }
    }
    return result;
  };

  const keyboardStatus = useCallback(() => {
    const map: Record<string, LetterStatus> = {};
    for (const guess of guesses) {
      const statuses = getStatus(guess);
      for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        const status: LetterStatus = statuses[i];
        const current: LetterStatus | undefined = map[letter];
        if (current === 'correct') continue;
        if (status === 'correct' || status === 'present') {
          map[letter] = status;
        } else if (!current) {
          map[letter] = status;
        }
      }
    }
    return map;
  }, [guesses, target]);

  const submit = () => {
    if (current.length !== 5 || gameOver) return;
    const upper = current.toUpperCase();
    const newGuesses = [...guesses, upper];
    setGuesses(newGuesses);
    setCurrent("");

    if (upper === target) {
      setGameOver(true);
      setWon(true);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
    }
  };

  const handleKey = (key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') { submit(); return; }
    if (key === '⌫' || key === 'BACKSPACE') { setCurrent(c => c.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent(c => c + key);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const reset = () => {
    setTarget(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setWon(false);
  };

  const kbRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
  ];
  const kbMap = keyboardStatus();

  return (
    <div className="game-widget wordle-widget">
      <div className="game-header">
        <span className="game-title">🟩 Tech Wordle</span>
        <span className="game-score">{guesses.length}/6</span>
      </div>

      <div className="wordle-board">
        {Array(6).fill(null).map((_, row) => {
          const guess = guesses[row];
          const isCurrent = row === guesses.length && !gameOver;
          const statuses = guess ? getStatus(guess) : [];
          return (
            <div key={row} className={`wordle-row ${shake && isCurrent ? 'wordle-row--shake' : ''}`}>
              {Array(5).fill(null).map((_, col) => {
                const letter = guess ? guess[col] : (isCurrent ? current[col] || '' : '');
                const status = guess ? statuses[col] : 'empty';
                return (
                  <div key={col} className={`wordle-cell wordle-cell--${status} ${letter ? 'wordle-cell--filled' : ''}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="wordle-result">
          <span className={won ? "wordle-win" : "wordle-lose"}>
            {won ? `🎉 Got it in ${guesses.length}!` : `The word was: ${target}`}
          </span>
          <button className="btn btn--primary btn--sm" onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="wordle-keyboard">
        {kbRows.map((row, ri) => (
          <div key={ri} className="wordle-kb-row">
            {row.map(key => (
              <button
                key={key}
                className={`wordle-key ${kbMap[key] ? `wordle-key--${kbMap[key]}` : ''} ${key.length > 1 ? 'wordle-key--wide' : ''}`}
                onClick={() => handleKey(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
