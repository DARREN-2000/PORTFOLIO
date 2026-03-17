import { useState, useEffect, lazy, Suspense } from "react";
import Layout from "../components/portfolio/Layout";
import "./Index.css";

// Games
const SnakeGame = lazy(() => import("../components/portfolio/SnakeGame"));
const TypingTest = lazy(() => import("../components/portfolio/TypingTest"));
const MemoryGame = lazy(() => import("../components/portfolio/MemoryGame"));
const ChessGame = lazy(() => import("../components/portfolio/ChessGame"));
const WordleGame = lazy(() => import("../components/portfolio/WordleGame"));
const SudokuGame = lazy(() => import("../components/portfolio/SudokuGame"));
const MinesweeperGame = lazy(() => import("../components/portfolio/MinesweeperGame"));
const Game2048 = lazy(() => import("../components/portfolio/Game2048"));
const TicTacToe = lazy(() => import("../components/portfolio/TicTacToe"));
const ConnectFourGame = lazy(() => import("../components/portfolio/ConnectFourGame"));
const HangmanGame = lazy(() => import("../components/portfolio/HangmanGame"));
const SimonGame = lazy(() => import("../components/portfolio/SimonGame"));
const CodePlayground = lazy(() => import("../components/portfolio/CodePlayground"));
const GitHubHeatmap = lazy(() => import("../components/portfolio/GitHubHeatmap"));

// Tools
import { JsonFormatter, Base64Tool, PomodoroTimer, ColorConverter, LoremGenerator, PasswordGenerator } from "../components/portfolio/MiniTools";
import { RegexTester, MarkdownPreviewer, UUIDGenerator, HashGenerator, UnitConverter, EpochConverter, GradientGenerator, TextStats } from "../components/portfolio/MoreTools";
import { CharWordCounter, JWTDecoder, URLEncoderDecoder, CSSMinifier, DiffChecker, BaseConverter, CronParser, HTMLEntityEncoder } from "../components/portfolio/ExtraTools";
import { ColorPicker, JsonPathFinder, TimestampConverter, AspectRatioCalc, CaseConverter, ChmodCalc } from "../components/portfolio/AdvancedTools";
import TerminalWidget from "../components/portfolio/Terminal";

const LazyFallback = () => (
  <div className="lazy-skeleton">
    <div className="skeleton-bar skeleton-bar--wide" />
    <div className="skeleton-bar skeleton-bar--medium" />
    <div className="skeleton-bar skeleton-bar--narrow" />
    <div className="skeleton-grid"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>
  </div>
);

const TABS = [
  { id: "games", label: "🎮 Games" },
  { id: "tools", label: "🔧 Dev Tools" },
  { id: "code", label: "💻 Code Playground" },
  { id: "terminal", label: "⌨️ Terminal" },
];

const Playground = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('portfolio-theme') as 'light' | 'dark') || 'light';
    return 'light';
  });
  const [activeTab, setActiveTab] = useState("games");

  useEffect(() => {
    localStorage.setItem('portfolio-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Interactive</span>
            <h2 className="section-title">Code<br /><span className="accent-text">Playground</span></h2>
            <p className="section-sub">Games, developer tools, code experiments, and an interactive terminal</p>
          </div>

          <div className="page-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`page-tab ${activeTab === tab.id ? 'page-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Suspense fallback={<LazyFallback />}>
            {activeTab === "games" && (
              <div className="playground-grid">
                <ChessGame /><WordleGame /><Game2048 /><TicTacToe /><SudokuGame /><MinesweeperGame />
                <SnakeGame /><TypingTest /><MemoryGame /><ConnectFourGame /><HangmanGame /><SimonGame />
              </div>
            )}
            {activeTab === "tools" && (
              <div className="tools-grid">
                <CharWordCounter /><JsonFormatter /><Base64Tool /><ColorConverter /><PasswordGenerator />
                <PomodoroTimer /><LoremGenerator /><RegexTester /><MarkdownPreviewer /><UUIDGenerator />
                <HashGenerator /><UnitConverter /><EpochConverter /><GradientGenerator /><TextStats />
                <JWTDecoder /><URLEncoderDecoder /><CSSMinifier /><DiffChecker /><BaseConverter />
                <CronParser /><HTMLEntityEncoder /><ColorPicker /><JsonPathFinder /><TimestampConverter />
                <AspectRatioCalc /><CaseConverter /><ChmodCalc />
              </div>
            )}
            {activeTab === "code" && <CodePlayground />}
            {activeTab === "terminal" && <TerminalWidget />}
          </Suspense>

          {activeTab === "games" && (
            <Suspense fallback={<LazyFallback />}>
              <div style={{ marginTop: 40 }}>
                <GitHubHeatmap />
              </div>
            </Suspense>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Playground;
