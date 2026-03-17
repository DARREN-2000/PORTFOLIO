import { useState, useMemo } from "react";

const WORDS = [
  "PYTORCH", "TENSORFLOW", "KUBERNETES", "DOCKER", "PYTHON",
  "NEURAL", "GRADIENT", "TRANSFORMER", "ATTENTION", "EMBEDDING",
  "PIPELINE", "INFERENCE", "DEPLOYMENT", "ALGORITHM", "DATASET",
  "MLOPS", "VECTOR", "TRAINING", "BACKPROP", "ACTIVATION",
];

const HangmanGame = () => {
  const [wordIdx, setWordIdx] = useState(() => Math.floor(Math.random() * WORDS.length));
  const word = WORDS[wordIdx];
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const wrong = useMemo(() => [...guessed].filter(l => !word.includes(l)).length, [guessed, word]);
  const maxWrong = 6;
  const won = word.split("").every(l => guessed.has(l));
  const lost = wrong >= maxWrong;

  const guess = (letter: string) => {
    if (won || lost) return;
    setGuessed(new Set([...guessed, letter]));
  };

  const reset = () => {
    setWordIdx(Math.floor(Math.random() * WORDS.length));
    setGuessed(new Set());
  };

  const hangmanParts = [
    <circle key="h" cx="50" cy="25" r="10" stroke="var(--fg)" fill="none" strokeWidth="2" />,
    <line key="b" x1="50" y1="35" x2="50" y2="60" stroke="var(--fg)" strokeWidth="2" />,
    <line key="la" x1="50" y1="42" x2="35" y2="52" stroke="var(--fg)" strokeWidth="2" />,
    <line key="ra" x1="50" y1="42" x2="65" y2="52" stroke="var(--fg)" strokeWidth="2" />,
    <line key="ll" x1="50" y1="60" x2="38" y2="75" stroke="var(--fg)" strokeWidth="2" />,
    <line key="rl" x1="50" y1="60" x2="62" y2="75" stroke="var(--fg)" strokeWidth="2" />,
  ];

  return (
    <div className="game-widget">
      <h3 className="widget-title">🪢 Hangman (Tech)</h3>
      {won && <div className="game-win">🎉 You got it!</div>}
      {lost && <div className="game-win" style={{ color: "var(--primary)" }}>💀 It was: {word}</div>}
      <svg viewBox="0 0 100 85" style={{ width: 120, height: 100, display: "block", margin: "0 auto 8px" }}>
        <line x1="10" y1="80" x2="90" y2="80" stroke="var(--fg-muted)" strokeWidth="2" />
        <line x1="30" y1="80" x2="30" y2="10" stroke="var(--fg-muted)" strokeWidth="2" />
        <line x1="30" y1="10" x2="50" y2="10" stroke="var(--fg-muted)" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="15" stroke="var(--fg-muted)" strokeWidth="2" />
        {hangmanParts.slice(0, wrong)}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {word.split("").map((l, i) => (
          <span key={i} style={{
            width: 24, height: 30, borderBottom: "2px solid var(--primary)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700,
            color: guessed.has(l) || lost ? "var(--fg)" : "transparent",
          }}>
            {guessed.has(l) || lost ? l : "_"}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", maxWidth: 280, margin: "0 auto" }}>
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
          <button
            key={l}
            onClick={() => guess(l)}
            disabled={guessed.has(l) || won || lost}
            style={{
              width: 26, height: 28, fontSize: 11, fontWeight: 600,
              border: "1px solid var(--border)", borderRadius: 4,
              background: guessed.has(l) ? (word.includes(l) ? "var(--primary-dim)" : "var(--bg-alt)") : "var(--bg-card)",
              color: guessed.has(l) ? "var(--fg-muted)" : "var(--fg)",
              cursor: guessed.has(l) ? "default" : "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <button className="btn btn--ghost btn--sm" onClick={reset} style={{ marginTop: 10, display: "block", marginLeft: "auto", marginRight: "auto" }}>
        New Word
      </button>
    </div>
  );
};

export default HangmanGame;
