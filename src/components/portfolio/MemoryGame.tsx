import { useState, useEffect, useCallback } from "react";

const ICONS = ["🐍", "🧠", "☁️", "🐳", "⚛️", "🔥", "📊", "🤖", "🎯", "💻", "🗄️", "🔐"];

interface Card { id: number; icon: string; flipped: boolean; matched: boolean; }

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairs, setPairs] = useState(6);
  const [matched, setMatched] = useState(0);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(() => {
    const s = localStorage.getItem("memory-best");
    return s ? parseInt(s) : 999;
  });

  const init = useCallback((numPairs: number) => {
    const icons = ICONS.slice(0, numPairs);
    const deck = [...icons, ...icons]
      .map((icon, id) => ({ id, icon, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setMatched(0);
    setTime(0);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (started && matched < pairs) {
      const t = setInterval(() => setTime(s => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [started, matched, pairs]);

  useEffect(() => {
    if (matched === pairs && pairs > 0 && started) {
      if (moves < best) {
        setBest(moves);
        localStorage.setItem("memory-best", String(moves));
      }
    }
  }, [matched, pairs, moves, best, started]);

  const flip = (idx: number) => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].icon === newCards[b].icon) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setMatched(m => m + 1);
        setFlipped([]);
      } else {
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, 800);
      }
    }
  };

  const won = matched === pairs && pairs > 0 && started;

  return (
    <div className="game-widget">
      <div className="game-header">
        <span className="game-title">🃏 Memory Match</span>
        <span className="game-score">Moves: {moves} | ⏱ {time}s{best < 999 ? ` | Best: ${best}` : ""}</span>
      </div>

      {!started && (
        <div className="typing-setup">
          <div className="typing-cats">
            {[4, 6, 8].map(n => (
              <button key={n} className={`filter-chip ${pairs === n ? "filter-chip--active" : ""}`} onClick={() => setPairs(n)}>
                {n} Pairs
              </button>
            ))}
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => init(pairs)}>Start Game</button>
        </div>
      )}

      {started && (
        <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(pairs * 2))}, 1fr)` }}>
          {cards.map((card, idx) => (
            <button
              key={card.id}
              className={`memory-card ${card.flipped || card.matched ? "memory-card--flipped" : ""} ${card.matched ? "memory-card--matched" : ""}`}
              onClick={() => flip(idx)}
            >
              <span className="memory-card-front">?</span>
              <span className="memory-card-back">{card.icon}</span>
            </button>
          ))}
        </div>
      )}

      {won && (
        <div className="game-over-row">
          <span className="game-over-text">🎉 You won in {moves} moves ({time}s)!</span>
          <button className="btn btn--primary btn--sm" onClick={() => init(pairs)}>Play Again</button>
        </div>
      )}
    </div>
  );
}
