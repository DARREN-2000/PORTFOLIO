import { useState, useEffect, useRef, useCallback } from "react";

const WORD_SETS = {
  ai: ["neural", "network", "transformer", "attention", "embedding", "gradient", "backprop", "tensor", "epoch", "batch", "loss", "optimizer", "dropout", "convolution", "recurrent", "generative", "discriminator", "latent", "encoder", "decoder", "inference", "training", "validation", "accuracy", "precision", "recall", "f1", "overfitting", "regularization", "activation"],
  devops: ["kubernetes", "docker", "pipeline", "container", "deployment", "cluster", "ingress", "service", "namespace", "helm", "grafana", "prometheus", "jenkins", "terraform", "ansible", "vault", "registry", "scaling", "replica", "rollback", "canary", "loadbalancer", "proxy", "firewall", "monitoring"],
  python: ["import", "lambda", "decorator", "generator", "iterator", "comprehension", "exception", "inheritance", "polymorphism", "encapsulation", "abstract", "metaclass", "coroutine", "asyncio", "threading", "multiprocessing", "virtualenv", "pytest", "dataclass", "protocol", "typing", "pydantic", "fastapi", "pandas", "numpy"],
};

const DURATION = 30;

export default function TypingTest() {
  const [category, setCategory] = useState<keyof typeof WORD_SETS>("ai");
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(0);

  const generateWords = useCallback((cat: keyof typeof WORD_SETS) => {
    const pool = WORD_SETS[cat];
    const w: string[] = [];
    for (let i = 0; i < 60; i++) w.push(pool[Math.floor(Math.random() * pool.length)]);
    return w;
  }, []);

  const start = useCallback(() => {
    const w = generateWords(category);
    setWords(w);
    setTyped("");
    setWordIdx(0);
    setCorrect(0);
    setWrong(0);
    setTimeLeft(DURATION);
    setFinished(false);
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [category, generateWords]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (started && timeLeft === 0) {
      setFinished(true);
      setStarted(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [started, timeLeft]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const trimmed = typed.trim();
      if (trimmed === words[wordIdx]) setCorrect(c => c + 1);
      else setWrong(w => w + 1);
      setWordIdx(i => i + 1);
      setTyped("");
    }
  };

  const wpm = Math.round((correct / (DURATION / 60)));
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  return (
    <div className="game-widget">
      <div className="game-header">
        <span className="game-title">⌨️ Typing Speed Test</span>
        {started && <span className="game-score">{timeLeft}s</span>}
      </div>
      
      {!started && !finished && (
        <div className="typing-setup">
          <div className="typing-cats">
            {(Object.keys(WORD_SETS) as (keyof typeof WORD_SETS)[]).map(cat => (
              <button
                key={cat}
                className={`filter-chip ${category === cat ? "filter-chip--active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "ai" ? "🧠 AI/ML" : cat === "devops" ? "☁️ DevOps" : "🐍 Python"}
              </button>
            ))}
          </div>
          <button className="btn btn--primary btn--sm" onClick={start}>Start Test (30s)</button>
        </div>
      )}

      {started && (
        <div className="typing-area">
          <div className="typing-words">
            {words.slice(Math.max(0, wordIdx - 3), wordIdx + 12).map((w, i) => {
              const actualIdx = Math.max(0, wordIdx - 3) + i;
              return (
                <span
                  key={actualIdx}
                  className={`typing-word ${actualIdx === wordIdx ? "typing-word--active" : ""} ${actualIdx < wordIdx ? "typing-word--done" : ""}`}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            className="typing-input"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder="Type the highlighted word..."
          />
          <div className="typing-stats-live">
            <span>✅ {correct}</span>
            <span>❌ {wrong}</span>
          </div>
        </div>
      )}

      {finished && (
        <div className="typing-results">
          <div className="typing-result-grid">
            <div className="typing-result-card">
              <span className="typing-result-val">{wpm}</span>
              <span className="typing-result-label">WPM</span>
            </div>
            <div className="typing-result-card">
              <span className="typing-result-val">{accuracy}%</span>
              <span className="typing-result-label">Accuracy</span>
            </div>
            <div className="typing-result-card">
              <span className="typing-result-val">{correct}</span>
              <span className="typing-result-label">Correct</span>
            </div>
            <div className="typing-result-card">
              <span className="typing-result-val">{wrong}</span>
              <span className="typing-result-label">Errors</span>
            </div>
          </div>
          <button className="btn btn--primary btn--sm" onClick={start}>Try Again</button>
        </div>
      )}
    </div>
  );
}
